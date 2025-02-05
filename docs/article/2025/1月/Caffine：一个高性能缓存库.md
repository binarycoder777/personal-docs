---

---
 
# Caffeine：一个高性能缓存库

> 最近在浏览 Hacker News 时，我偶然发现了一篇介绍 Caffeine 缓存库的博客文章。这让我想起了以前使用 Caffeine 的场景，于是决定深入了解一下它的内部实现。

在当前的团队中，我们广泛使用着 Guava Cache、Caffeine、Redis 等缓存库。虽然以前了解过它们的内部结构，但从未真正研究过其可调优的入口和参数。因此，我想通过这篇文章记录一下最近对 Caffeine 的探索。

## 介绍

Caffeine 是一个高性能、接近最优的缓存库。它提供了许多出色的功能，例如自动加载条目、基于大小的驱逐、统计、基于时间的过期等。它被广泛应用于许多有影响力的项目中，如 Kafka、Solr、Cassandra、HBase 和 Neo4j。

由于可讨论的方面很多，我将按主题分类逐一探讨：

## 驱逐策略：Window TinyLFU

缓存的目的是最大化命中率 - 即确保最常用的数据保留在缓存中。驱逐策略是一种用于决定在缓存已满时保留哪些条目以及丢弃哪些条目的算法。

传统的最近最少使用（LRU）策略是一个很好的起点，因为它简单且在许多工作负载中表现良好。但现代缓存可以通过同时考虑时效性和访问频率来做得更好。时效性反映了最近访问的项目很快再次被访问的可能性；频率则反映了经常访问的项目将继续被频繁访问的可能性。Caffeine 使用一种称为 Window TinyLFU 的策略来结合这两个信号。此外，它提供了高命中率、O(1) 时间复杂度和较小的内存占用（详细信息请参阅 BoundedLocalCache.java）。它的工作原理如下：

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250205154930.png)

- Admission Window：新条目添加时，会先经过"Admission Window"，然后才能进入主空间。当条目呈现突发访问模式时，这种设计能够获得更高的命中率。
- Frequency Sketch：Caffeine 使用一种称为 CountMinSketch 的紧凑数据结构来跟踪缓存条目的访问频率。这使它能够高效地估计项目的访问频率。如果主空间已满且需要添加新条目，Caffeine 会检Frequency Sketch。只有当新条目的估计频率高于需要驱逐的条目时，它才会被接纳。

```java
 /**
   * 通过比较候选项与被驱逐项的频率来决定是否接纳候选项进入主空间。
   * 为了防止哈希碰撞攻击（攻击者可能会人为提高被驱逐项的频率以阻止新条目进入），
   * 这里引入了少量随机性。
   *
   * @param candidateKey 提议进入长期保留的条目的键
   * @param victimKey 被驱逐策略选中用于替换的条目的键
   * @return 是否应该接纳候选项并驱逐现有项
   */
  @GuardedBy("evictionLock")
  boolean admit(K candidateKey, K victimKey) {
    int victimFreq = frequencySketch().frequency(victimKey);
    int candidateFreq = frequencySketch().frequency(candidateKey);
    if (candidateFreq > victimFreq) {
      return true;
    } else if (candidateFreq >= ADMIT_HASHDOS_THRESHOLD) {
      // 最大频率为15，重置后减半为7以实现历史老化。
      // 攻击者可能利用热点候选项被热点受害者拒绝的特点。
      // 设置温和候选项的阈值可以减少随机接受的次数，从而最小化对命中率的影响。
      int random = ThreadLocalRandom.current().nextInt();
      return ((random & 127) == 0);
    }
    return false;
  }
```
- Aging：为了保持缓存历史记录的新鲜度，Caffeine 会定期将所有计数器减半，从而"老化"频率草图。这确保了缓存能够适应随时间变化的访问模式。
- Segmented LRU：对于主空间，Caffeine 使用分段式 LRU 策略。条目从"试用"段开始，在后续访问时会被提升到"受保护"段。当受保护段已满时，条目会被降级回试用段，最终可能被淘汰。这种设计确保了最热门的条目能够被保留，而不常用的条目则有机会被驱逐。

## Frequency Sketch

如上所述，FrequencySketch 类是缓存驱逐策略中的关键组件，它提供了一种高效的方法来估计缓存条目的流行度（访问频率）。其实现可以在 FrequencySketch.java 文件中找到，它被实现为 4-bit CountMinSketch。CountMinSketch 的设计理念是提供一种节省空间的概率数据结构，用于估计数据流中项目的频率。它使用多个哈希函数将项目映射到固定大小的计数器数组，从而可以紧凑地表示频率信息：

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250205155541.png)

当在缓存中添加或访问一个项目时，会使用多个哈希函数对其进行哈希处理。每个哈希函数将项目映射到草图中的特定计数器，相应的计数器值会增加。为了估计某个项目的频率，会使用其对应计数器中的最小值。这种方法设计巧妙，因为它对更新和查询都具有 O(1) 的时间复杂度，而不受缓存中唯一项数量的影响。它具有良好的可扩展性和内存效率，允许使用固定内存来跟踪频率信息。

让我们看看它在 Caffeine 中实现的一些关键部分：

1. 数据结构
草图本身表示为 64 位长整型值的一维数组（table）。每个长整型值包含 16 个 4-bit 计数器，对应于 16 个不同的哈希桶。选择此布局是为了提高效率，因为它将单个条目的计数器保存在单个缓存行中。需要注意的是，数组的长度 table 设置为最接近且大于等于缓存最大大小的 2 的幂，以实现高效的位掩码操作。

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250205155715.png)

2. 散列
该sketch使用两个散列函数 spread() 和 rehash() 作为补充散列函数，应用于普通元素的散列码：

```java
    int blockHash = spread(e.hashCode());
    int counterHash = rehash(blockHash);
```

```java
 /** 应用补充散列函数以防止哈希质量不佳的情况 */
  static int spread(int x) {
    x ^= x >>> 17;
    x *= 0xed5ad4bb;
    x ^= x >>> 11;
    x *= 0xac4c1b51;
    x ^= x >>> 15;
    return x;
  }

  /** 应用另一轮散列以增加随机性 */
  static int rehash(int x) {
    x *= 0x31848bab;
    x ^= x >>> 14;
    return x;
  }
```

3. 频率检索
频率检索发生在 frequency() 方法中，它采用 4 个相关计数器中的最小值作为良好的近似值：

```java
  @NonNegative
  public int frequency(E e) {
    if (isNotInitialized()) {
      return 0;
    }

    int[] count = new int[4];
    int blockHash = spread(e.hashCode());
    int counterHash = rehash(blockHash);
    int block = (blockHash & blockMask) << 3;
    for (int i = 0; i < 4; i++) {
      int h = counterHash >>> (i << 3);
      int index = (h >>> 1) & 15;
      int offset = h & 1;
      count[i] = (int) ((table[block + offset + (i << 1)] >>> (index << 2)) & 0xfL);
    }
    return Math.min(Math.min(count[0], count[1]), Math.min(count[2], count[3]));
  }
```

此外，increment() 方法用于增加元素的流行度。让我们详细分析一下关键步骤：

- blockHash = spread(e.hashCode())：扩展输入元素 e 的哈希码以获得更好的哈希值分布。
- counterHash = rehash(blockHash)：进一步重新散列 blockHash 以获得不同的哈希值，用于索引 16 个不同的哈希桶。
- int block = (blockHash & blockMask) << 3：要理解这部分，我们需要先了解 blockMask 的计算方式。它等于 (table.length >> 3) - 1。我们将表长度右移 3 位是因为它相当于除以 8。假设数组中的每个块 table 包含 16 个计数器，且每个计数器宽度为 4 位，则每个块的总大小为 16 * 4 = 64 位（8 字节）。

因此，通过用 blockMask 掩码 blockHash，我们确保生成的块索引始终在数组 table 范围内。

然后对于每次迭代（0 到 3），我们计算 4 个计数器索引：

- int h = counterHash >>> (i << 3)：通过右移 counterHash 来提取一个 8 位值（i * 8 bits）。这为我们提供了当前 4 位计数器的哈希值。
- int index = (h >>> 1) & 15：我们首先对 h 执行逻辑右移 1（即除以 2）以取最低有效位。然后用 15（二进制 1111）进行掩码以获取 4 个最低有效位。这为我们提供了块内的计数器索引（因为有 16 个计数器）。
- int offset = h & 1：此行计算块内的偏移量（64 位），该偏移量为 0 或 1。它通过取 8 位哈希值的最低有效位来实现。
- count[i] = (int) ((table[block + offset + (i << 1)] >>> (index << 2)) & 0xfL)：通过以下方式从表中检索 4 位计数器值：

计算表数组中给定元素的 4 个计数器所在的索引 block + offset + (i << 1)：
- block 是表数组中块的起始索引
- offset 是 0 或 1，取决于我们访问的是块内的两个 8 字节段中的哪一个
- (i << 1) 是包含 4 个计数器的 8 字节段内的偏移量，其中 i 是计数器索引（0 到 3）。这实际上将 i 乘以 2，从而得到 16 字节段内的 0、2、4 或 6 个字节的偏移量。

然后，它将这个 64 位值右移 index * 4 位 (>>> (index << 2))。这将我们的 4 位计数器与长值的最低有效位对齐。我们将其乘以 4，因为每个计数器都是 4 位宽。最后，它将位掩码应用于提取的计数器值 (& 0xfL)（二进制 1111），以确保它是一个 4 位无符号整数。

最后，该方法返回计数数组中存储的 4 个频率计数中的最小值。

4. Aging
周期性地，当观察到的事件数量达到某个阈值（sampleSize）时，reset() 方法被调用。此方法将所有计数器的值减半，并减去奇数计数器的数量。

## 使用访问顺序队列和分层计时器轮进行过期处理

如果我们想了解条目实际上是如何被驱逐/过期的，我们必须更深入地了解实现细节。例如，我们之前在分段 LRU 和中看到的 LRU 策略是使用访问顺序队列实现的，生存时间策略（即根据距离上次写入的时间长短进行驱逐）使用写入顺序队列，变量过期使用分层计时器轮。所有这些都以 O(1) 时间复杂度高效实现。

## 访问顺序队列

Caffeine 在缓存中使用两个主队列来确保快速驱逐策略。排队策略的理念是允许查看最旧的条目以确定它是否已过期。如果没有，那么较新的条目也一定没有过期。它们都基于 AbstractLinkedDeque.java，它提供了一个优化的双向链表。以下是其实现的一些有趣方面：

1. 没有哨兵节点

该类使用不带标记节点（列表开头和结尾处的虚拟节点）的双链表。正如我们在代码注释中看到的那样：

The first and last elements are manipulated instead of a slightly more convenient sentinel element to avoid the insertion of null checks with NullPointerException throws in the byte code. 

这样做是为了减少空检查。但是，两个元素都声明为 @Nullable：

```java
@Nullable E first;
@Nullable E last;
```

那么它究竟是如何减少空值检查的呢？在基于哨兵的实现中，您始终具有非空的头节点和尾节点。这意味着您始终可以安全地访问 head.next 和 tail.prev 而无需进行空值检查。但是，在这个没有哨兵的实现中，first 和 last 可以为空。这难道不需要更多的空值检查吗？关键在于 JVM 如何处理空值检查。当您访问可能为空的对象上的字段或方法时，JVM 会自动在字节码中插入空值检查。如果对象为空，它会抛出一个 NullPointerException。通过仔细构造代码以明确处理空值情况，此实现避免了这些自动空值检查和 NullPointerExceptions 在关键路径中的产生。

例如，考虑该 linkFirst 方法：

```java
void linkFirst(final E e) {
  final E f = first;
  first = e;

  if (f == null) {
    last = e;
  } else {
    setPrevious(f, e);
    setNext(e, f);
  }
  modCount++;
}
```

此方法分别处理列表为空 (f == null) 和不为空的情况。这样一来，JVM 就无需在访问字段或方法时插入自动空值检查。在基于哨兵的实现中，您可能会看到如下代码：

```java
void linkFirst(final E e) {
  Node newNode = new Node(e);
  newNode.next = head.next;
  newNode.prev = head;
  head.next.prev = newNode;  // 可能的自动空值检查
  head.next = newNode;       // 可能的自动空值检查
}
```

这里，JVM 可能会插入对 head.next 的自动空检查，即使我们知道它永远不会为空。

2. 结构修改跟踪

该类维护一个整数 modCount 来跟踪结构修改，用于检测迭代期间的并发修改。每次添加或删除元素时，它都会递增，其主要目的是支持迭代器中的快速失败行为：
```java
AbstractLinkedIterator(@Nullable E start) {
  expectedModCount = modCount;
  cursor = start;
}
```

每次迭代器执行操作时，它都会检查 modCount 是否已更改。如果已更改，则意味着列表在迭代器之外被修改，因此它会引发异常：
```java
void checkForComodification() {
  if (modCount != expectedModCount) {
    throw new ConcurrentModificationException();
  }
}
```

modCount 在结构上修改列表的方法中递增，例如 linkFirst()、linkLast()、unlinkFirst()、unlinkLast() 和 unlink()。

访问订单队列：AccessOrderDeque.java
访问顺序队列根据最近访问的时间跟踪哈希表中的所有条目。它是一个双向链表，根据访问频率维护缓存条目的顺序。

当访问某个条目时，它会被移动到列表的末尾，确保最近最少使用 (LRU) 条目始终位于列表的开头。这对于实施最近最少使用 (LRU) 驱逐策略至关重要。例如，如果我们有一个缓存，其中 [A <-> B <-> C] 是 A 最近访问次数最少的条目，C 是最近访问次数最多的条目，并且我们访问 B，它会将其移动到队列的末尾，如下所示：[A <-> C <-> B]

写入订单队列：WriteOrderDeque.java
与访问顺序队列类似，写入顺序队列根据条目的创建或更新时间对其进行排序。它根据条目的写入时间来跟踪条目。当我们想让条目在自上次写入以来的一定时间后过期时，这尤其有用（expireAfterWrite）。

例如，考虑按该顺序写入的场景 [A <-> B <-> C]。如果我们更新 A，它会将其移动到队列末尾：[B <-> C <-> A]。

## 分层计时器轮：TimerWheel.java

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250205161051.png)

计时器轮是一种用于高效管理基于时间的事件的数据结构。其基本思想是将计时器事件存储在循环缓冲区的存储桶中，每个存储桶代表一个特定的时间跨度（如秒或分钟）。

在 Caffeine 中，条目根据其到期时间添加到这些存储桶中，从而可以在 O(1) 时间内高效地添加、删除和到期。每个存储桶包含一个链接列表，用于添加项目。鉴于循环缓冲区大小有限，当需要在未来某个大于环大小的时刻安排事件时，我们会遇到问题。这就是为什么我们使用分层计时器轮的原因，它只是将多个具有不同分辨率的计时器轮分层。

我们来简单看一下 TimerWheel.java 代码：

1. 层次结构：桶 (Bucket) 和跨度 (Span)

数组中的每个元素 BUCKETS 代表计时器轮级别中的桶数，而 SPANS 定义每个桶覆盖的持续时间。如前所述，层次结构允许事件从更宽的时间跨度级联到更精细的时间跨度。这些是为 Caffeine 实现选择的值：

```java
static final int[] BUCKETS = { 64, 64, 32, 4, 1 };
static final long[] SPANS = {
    ceilingPowerOfTwo(TimeUnit.SECONDS.toNanos(1)), // 1.07s
    ceilingPowerOfTwo(TimeUnit.MINUTES.toNanos(1)), // 1.14m
    ceilingPowerOfTwo(TimeUnit.HOURS.toNanos(1)),   // 1.22h
    ceilingPowerOfTwo(TimeUnit.DAYS.toNanos(1)),    // 1.63d
    BUCKETS[3] * ceilingPowerOfTwo(TimeUnit.DAYS.toNanos(1)), // 6.5d
    BUCKETS[3] * ceilingPowerOfTwo(TimeUnit.DAYS.toNanos(1)), // 6.5d
};
```

2. 巧妙的位操作

实现使用位操作技术来高效地计算存储桶索引：

```java
long ticks = (time >>> SHIFT[i]);
int index = (int) (ticks & (wheel[i].length - 1));
```

这避免了执行昂贵的模运算。以下是其工作原理的详细说明：

```java
static final long[] SPANS = {
    ceilingPowerOfTwo(TimeUnit.SECONDS.toNanos(1)), // 1.07s
    ceilingPowerOfTwo(TimeUnit.MINUTES.toNanos(1)), // 1.14m
    // ...
};

static final long[] SHIFT = {
    Long.numberOfTrailingZeros(SPANS[0]),
    Long.numberOfTrailingZeros(SPANS[1]),
    // ...
};
```

每个 SPAN 值都向上舍入到最接近的 2 的幂，SHIFT 数组存储每个值的尾随零的数量 SPAN，这相当于 log2(spans[i])。它代表该轮子一个刻度的持续时间。然后，为了计算桶索引，我们可以进行一些位操作，以便快速计算事件属于哪个桶：

```java
long ticks = (time >>> SHIFT[i]);
int index = (int) (ticks & (wheel[i].length - 1));
```

time >>> SHIFT[i]：此操作将当前时间轮移位适当的量，相当于除以 SPANS[i]。
wheel[i].length - 1：这是一个位掩码。由于 wheel[i].length 始终是 2 的幂，因此这会创建一个低位全为 1 的掩码。
ticks & (wheel[i].length - 1)：这会对掩码执行按位与操作，这等效于 ticks % wheel[i].length 但速度更快。

让我们看一个例子。假设我们有：

time = 1,500,000,000 纳秒（1.5 秒）
SPANS[i] = 1,073,741,824（2^30，约 1.07 秒）
SHIFT[i] = 30

二进制形式：
time = 1011001010000000000000000000000

当我们执行 time >>> SHIFT[i] 时，我们会向右移动 30 位：
1011001010000000000000000000000 >>> 30 = 1

这个结果 1 意味着这个时间轮已经过去了一个完整的刻度。假设 wheel[i].length 是 64，用二进制表示：

ticks = 00000000000000000000000000000001
wheel[i].length - 1 = 00000000000000000000000000111111

我们执行按位与运算：
```
  00000000000000000000000000000001
& 00000000000000000000000000111111
  --------------------------------
  00000000000000000000000000000001
```

结果为 1，因此我们的索引为 1。这在实践中意味着时间（1.5 秒）使时间轮滴答一次，而这次滴答将事件置于时间轮的第二个存储桶中。这种方法的巧妙之处在于它会自动回绕。如果我们有 64 个滴答，索引将再次为 0，因为 64 & 63 = 0。

## 自适应缓存策略

Caffeine 采用动态方法进行缓存管理，根据工作负载特征不断调整其接纳窗口和主空间。这种调整由爬山算法驱动，这是一种旨在最大限度提高性能的简单优化技术。

爬山法的工作原理是进行增量更改并评估其影响。在 Caffeine 的上下文中，这意味着更改缓存配置（例如，扩大窗口缓存大小）并将结果命中率与前一个命中率进行比较。如果性能有所提高，则继续沿同一方向进行更改。如果没有，则反向更改。

挑战在于确定最佳步长和频率。在短时间内测量命中率可能会产生噪声，因此很难区分配置引起的变化和随机波动。经过大量测试后，Caffeine 的开发人员选择了不频繁但相对较大的更改。

让我们看看执行窗口大小调整的代码（来自 BoundedLocalCache.java）：

```java
  /** 计算窗口调整量并相应地设置 {@link #adjustment()} */
  @GuardedBy("evictionLock")
  void determineAdjustment() {
    // 检查Frequency Sketch是否已初始化
    if (frequencySketch().isNotInitialized()) {
      setPreviousSampleHitRate(0.0);
      setMissesInSample(0);
      setHitsInSample(0);
      return;
    }

    int requestCount = hitsInSample() + missesInSample();
    if (requestCount < frequencySketch().sampleSize) {
      return;
    }

    double hitRate = (double) hitsInSample() / requestCount;
    double hitRateChange = hitRate - previousSampleHitRate();
    double amount = (hitRateChange >= 0) ? stepSize() : -stepSize();
    double nextStepSize = (Math.abs(hitRateChange) >= HILL_CLIMBER_RESTART_THRESHOLD)
        ? HILL_CLIMBER_STEP_PERCENT * maximum() * (amount >= 0 ? 1 : -1)
        : HILL_CLIMBER_STEP_DECAY_RATE * amount;
    setPreviousSampleHitRate(hitRate);
    setAdjustment((long) amount);
    setStepSize(nextStepSize);
    setMissesInSample(0);
    setHitsInSample(0);
  }
```

它根据样本的命中数和总请求数计算命中率。它将当前命中率与之前的命中率进行比较。如果命中率有所提高（或保持不变），则使用正步长；否则使用负步长。如果命中率变化很大，则根据最大可能百分比计算更大的步长。否则，它会减小当前步长，从而降低变化幅度。最后，它会更新状态。

这种自适应策略允许 Caffeine 根据每个应用程序的特定需求微调其行为，从而优化性能而无需人工干预。这证明了周到的设计，使 Caffeine 在缓存解决方案领域脱颖而出。

## 结论

虽然 Caffeine 的内部还有其他有趣的方面，例如用于读写的单独缓冲区、自动指标和模拟器，但篇幅有限，就先到这里了。

