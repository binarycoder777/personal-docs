---

---

# CRDT（无冲突复制数据类型）

> CRDT，全称为 Conflict-Free Replicated Data Type（无冲突复制数据类型），是一种用于分布式系统的数据结构，允许多个副本在不同节点上独立地进行修改，并保证最终的一致性而不需要复杂的同步协议。CRDT 的设计使得即使在网络分区或节点故障的情况下，也能确保数据的一致性和正确性。因此这使得 CRDT 非常适合构建丰富的协作应用程序，例如 Google Docs 和 Figma — 而无需中央服务器来同步更改。


## CRDT 的分类

广义上，CRDT 有两种类型：基于状态的和基于操作的。基于状态的 CRDT 在对等体之间传输其完整状态，并通过将所有状态合并在一起来获得新状态。基于操作的 CRDT 仅传输用户采取的操作，这些操作可用于计算新状态。

**State-based CRDT (或 Convergent Replicated Data Type, CvRDT)：**
- 每个副本定期将其本地状态发送给其他副本。
- 每个副本接收到其他副本的状态时，会将这些状态与本地状态进行合并，形成一个新的状态。
- 合并操作必须是幂等的、交换的和结合的，以确保最终一致性。

**Operation-based CRDT (或 Commutative Replicated Data Type, CmRDT)：**
- 每个副本将其本地操作发送给其他副本。
- 每个副本接收到其他副本的操作时，会将这些操作应用到本地状态。
- 操作必须是可交换的，以确保最终一致性。

这可能会让基于操作的 CRDT 听起来更好。例如，如果用户更新列表中的一项，则基于操作的 CRDT 可以仅发送该更新的描述，而基于状态的 CRDT 必须发送整个列表！缺点是基于操作的 CRDT 对通信渠道施加了限制：消息必须按因果顺序准确地传递给每个对等点一次。

## CRDT 的优势

**最终一致性：**
- CRDT 允许各个副本独立进行更新，并保证在所有更新传播完成后，各个副本最终会达到一致的状态。

**高可用性：**
由于不需要中央协调，CRDT 能够在网络分区或部分节点失效的情况下继续进行操作。

**无冲突：**
通过设计无冲突的数据类型，CRDT 避免了数据冲突问题，无需使用锁或复杂的冲突解决机制。


## CRDT 的应用场景

CRDT 广泛应用于需要高可用性和最终一致性的大规模分布式系统中，包括：

**分布式数据库：**
- 如 Riak 和 Redis 的某些版本使用了 CRDT 来实现高可用的数据存储。

**协作编辑工具：**
- 多人同时编辑文档或表格，如 Google Docs 的实时协作功能。

**分布式缓存：**
- 分布式缓存系统中，多个节点需要对相同的数据进行并行更新，如 Akka 的分布式数据模块。

**社交网络：**
- 用户的状态更新、点赞、评论等需要在不同的节点之间进行同步，并保持最终一致性。


## CRDT 的常见类型

- G-Counter (Grow-only Counter)：只能增加的计数器。
- PN-Counter (Positive-Negative Counter)：支持增加和减少的计数器。
- G-Set (Grow-only Set)：只能增加元素的集合。
- 2P-Set (Two-Phase Set)：支持增加和删除元素，但元素删除后不能再被添加。
- LWW-Element-Set (Last-Writer-Wins Element Set)：使用时间戳解决冲突的集合。
- OR-Set (Observed-Remove Set)：允许元素重复添加和删除的集合。

## 基于状态的CRDT

下面将以基于状态的 CRDT为例进行讲解。在开始前，可以具象化CRDT：
``` java
// 实现了该接口的数据都可以看做是CRDT
public interface CRDT<T,S> {
    T value;
    S state;
    void merge(S state);
}
```

- 一个值，T。这是我们程序其余部分关心的部分。CRDT 的全部要点是在对等点之间可靠地同步该值。
- 状态，S。这是对等体同意同一值所需的元数据。为了更新其他对等体，整个状态将被序列化并发送给它们。
- 合并函数。该函数接收一些状态（可能是从另一个对等点接收的）并将其与本地状态合并。

合并函数必须满足三个属性，以确保所有对等点都得出相同的结果（我将使用符号A ∨ B来表示将状态合并A到状态中B）：

- 交换性：状态可以按任何顺序合并；A ∨ B = B ∨ A。如果 Alice 和 Bob 交换状态，他们可以将对方的状态合并到自己的状态中并得出相同的结果。
- 结合性：当合并三个（或更多）状态时，先合并哪个状态并不重要；(A ∨ B) ∨ C = A ∨ (B ∨ C)如果 Alice 同时收到 Bob 和 Carol 的状态，她可以按任意顺序将它们合并到自己的状态中，结果都是一样的。4
- 幂等性：将一个状态与自身合并不会改变状态；A ∨ A = A。如果 Alice 将她自己的状态与自身合并，结果将与她开始时的状态相同。

从数学上证明合并函数具有所有这些属性可能听起来很难。但幸运的是，我们不必这么做！相反，我们可以结合已经存在的 CRDT，依靠有人已经为我们证明了这些事实。

## Last Write Wins Register

寄存器是保存单个值的 CRDT。有几种类型的寄存器，但最简单的是最后写入获胜寄存器（或 LWW 寄存器）。顾名思义，LWW 寄存器只是用最后写入的值覆盖其当前值。它们使用时间戳来确定最后发生的写入，这里用整数表示，每当值更新时，整数就会递增。算法如下：
- 如果收到的时间戳小于本地时间戳，则寄存器不会改变其状态。
- 如果收到的时间戳大于本地时间戳，则寄存器将用收到的值覆盖其本地值。它还会存储收到的时间戳和某种特定于最后写入该值的对等方的标识符（对等方 ID）。
- 通过将本地对等 ID 与接收状态下的对等 ID 进行比较来打破平局。

## Last Write Wins Map

大多数程序涉及多个值，这意味着我们需要一个比LWW寄存器更复杂的CRDT。MAP就是一个很好的数据结构。下面是一个只能增加的G-Counter（只能增加的计数器）

```java
import java.util.HashMap;
import java.util.Map;

public class GCounter {
    private final Map<String, Integer> counts = new HashMap<>();

    public void increment(String nodeId, int value) {
        counts.put(nodeId, counts.getOrDefault(nodeId, 0) + value);
    }

    public int getValue() {
        return counts.values().stream().mapToInt(Integer::intValue).sum();
    }

    public void merge(GCounter other) {
        other.counts.forEach((nodeId, value) -> 
            counts.put(nodeId, Math.max(counts.getOrDefault(nodeId, 0), value))
        );
    }
}
```

组合让我们将原始 CRDT 组合成更复杂的 CRDT。当需要合并时，父级所做的就是将传入状态的片段传递给相应子级的合并函数。我们可以根据需要多次嵌套此过程；每个复杂 CRDT 将越来越小的状态片段传递到下一级，直到我们最终找到执行实际合并的原始 CRDT。从这个角度来看，LWW Map 合并功能很简单：遍历每个键并将该键的传入状态交给相应的 LWW 寄存器进行合并。

在 Operation-based CRDT 中，每个节点将其本地操作发送给其他节点。每个节点接收到其他节点的操作后，将其应用到本地状态。操作必须是可交换的，以确保最终一致性,下面是一个PN-Counter（支持增加和减少的计数器）例子
```java
import java.util.HashMap;
import java.util.Map;

public class PNCounter {
    private final Map<String, Integer> pCounts = new HashMap<>();
    private final Map<String, Integer> nCounts = new HashMap<>();

    public void increment(String nodeId, int value) {
        pCounts.put(nodeId, pCounts.getOrDefault(nodeId, 0) + value);
    }

    public void decrement(String nodeId, int value) {
        nCounts.put(nodeId, nCounts.getOrDefault(nodeId, 0) + value);
    }

    public int getValue() {
        int pSum = pCounts.values().stream().mapToInt(Integer::intValue).sum();
        int nSum = nCounts.values().stream().mapToInt(Integer::intValue).sum();
        return pSum - nSum;
    }

    public void merge(PNCounter other) {
        other.pCounts.forEach((nodeId, value) -> 
            pCounts.put(nodeId, Math.max(pCounts.getOrDefault(nodeId, 0), value))
        );
        other.nCounts.forEach((nodeId, value) -> 
            nCounts.put(nodeId, Math.max(nCounts.getOrDefault(nodeId, 0), value))
        );
    }
}

```

当然，还有许多其他类型的数据结构可以建模为收敛 CRDT。您可以拥有寄存器、集合、映射和图形。在每种情况下，我们都需要从定义方法value()和merge()方法开始。
这里就不过多阐述。


## 小结

CRDT 通过定义无冲突的数据类型，使得在分布式环境下，各个节点可以独立进行数据操作，并最终达到一致性。它的无冲突特性和最终一致性使其在许多分布式系统中得到了广泛应用，为分布式数据管理提供了一种高效可靠的解决方案。












