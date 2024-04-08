---

---

# ThreadPool模块分析

每个节点都会创建一系列的线程池来执行任务，许多线程池都有
与其相关任务队列，用来允许挂起请求，而不是丢弃它。

- generic 用于通用的操作（例如，节点发现），线程池类型为scaling。
- index 用于index/delete操作，线程池类型为fixed，大小为处理器的数
量，队列大小为200，允许设置的最大线程数为1+处理器数量。
- search 用于count/search/suggest操作。线程池类型为fixed，大小为
int（（处理器数量3）/2）+1，队列大小为1000。
- get 用于get操作。线程池类型为fixed，大小为处理器的数量，队列
大小为1000。
- bulk 用于bulk操作，线程池类型为fixed，大小为处理器的数量，队列
大小为200，该线程池允许设置的最大线程数为1+处理器数量。
- snapshot 用于snaphost/restore操作。线程池类型为scaling，线程保持
存活时间为5min，最大线程数为min（5, （处理器数量）/2）。
- warmer 用于segment warm-up操作。线程池类型为scaling，线程保持
存活时间为5min，最大线程数为min（5, （处理器数量）/2）。
- refresh 用于 refresh 操作。线程池类型为 scaling，线程空闲保持存活
时间为5min，最大线程数为min（10, （处理器数量）/2）。
- listener 主要用于Java客户端线程监听器被设置为true时执行动作。线程
池类型为scaling，最大线程数为min（10, （处理器数量）/2）。
- same 在调用者线程执行，不转移到新的线程池。
- management 管理工作的线程池，例如，Node info、Node tats、List tasks等。
- flush 用于索引数据的flush操作。
- force_merge 顾名思义，用于Lucene分段的force merge。
- fetch_shard_started 用于TransportNodesAction。
- fetch_shard_store 用于TransportNodesListShardStoreMetaData。

线程池和队列的大小可以通过配置文件进行调整，例如，为
search增加线程数和队列大小：thread_pool.search.size: 30

## 线程池类型

如同任何要并发处理任务的服务程序一样，线程池要处理的任务
类型大致可以分为两类：CPU计算密集型和I/O密集型。对于两种不同
的任务类型，需要为线程池设置不同的线程数量。

一般说来，线程池的大小可以参考如下设置，其中N为CPU的个
数：
- 对于CPU密集型任务，线程池大小设置为N+1；
- 对于I/O密集型任务，线程池大小设置为2N+1。

对于计算密集型任务，线程池的线程数量一般不应该超过N+1。
如果线程数量太多，则会导致更高的线程间上下文切换的代价。加1是
为了当计算线程出现偶尔的故障，或者偶尔的I/O、发送数据、写日志
等情况时，这个额外的线程可以保证CPU时钟周期不被浪费。

I/O密集型任务的线程数可以稍大一些，因为I/O密集型任务大部分
时间阻塞在I/O过程，适当增加线程数可以增加并发处理能力。而上下
文切换的代价相对来说已经不那么敏感。但是线程数量不一定设置为
2N+1，具体需要看I/O等待时间有多长。等待时间越长，需要越多的
线程，等待时间越少，需要越少的线程。因此也可以参考下面的公
式：
```
最佳线程数=（（线程等待时间+线程CPU时间）/线程CPU时
间）×CPU数
```

###  fixed

线程池拥有固定数量的线程来处理请求，当线程空闲时不会销
毁，当所有线程都繁忙时，请求被添加到队列中。
- size参数用来控制线程的数量。
- queue_size参数用来控制线程池相关的任务队列大小。设置为
-1表示无限制。当请求到达时，如果队列已满，则请求将被拒绝。

### scaling
scaling线程池的线程数量是动态的，介于core和max参数之间变
化。线程池的最小线程数为配置的core大小，随着请求的增加，当
core数量的线程全都繁忙时，线程数逐渐增大到max数量。max是线
程池可拥有的线程数上限。当线程空闲时，线程数从max大小逐渐降
低到core大小。
- keep_alive参数用来控制线程在线程池中的最长空闲时间。

### direct
这种线程池对用户并不可见，当某个任务不需要在独立的线程执
行，又想被线程池管理时，于是诞生了这种特殊类型的线程池：在调
用者线程中执行任务。

### fixed_auto_queue_size
与fixed类型的线程池相似，该线程池的线程数量为固定值，但是
队列类型不一样。其队列大小根据利特尔法则（Little＇s Law）自动调 整 大 小 。该线程池有以下参数可以调整：
- size，用于指定线程数量；
- queue_size，指定初始队列大小；
- min_queue_size，最小队列大小；
- max_queue_size，最大队列大小；
- auto_queue_frame_size，调整队列之前进行测量的操作数；
- target_response_time，一个时间值设置，用来指示任务的平
均响应时间，如果任务经常高于这个时间，则线程池队列将被调小，
以便拒绝任务。

## 处理器设置
默认情况下，ES自动探测处理器数量。各个线程池的大小基于这
个数量进行初始化。在某些情况下，如果想手工指定处理器数量，则
可以通过设置processors参数实现：processors: 2

有以下几种场景是需要明确设置processors数量的：

- （1）在同一台主机上运行多个 ES 实例，但希望每个实例的线程
池只根据一部分 CPU 来设置，此时可以通过processors参数来设置
处理器数量。例如，在16核的服务器上运行2个实例，可以将processors设置为8。请注意，在单台主机上运行多个实例，除了设置processors数量，还有许多更复杂的参数需要设置。例如，修改GC
线程数，绑定进程到CPU等。
- （2）有时候自动探测出的处理器数量是错误的，在这种情况下，需要明确设置处理器数量。要检查自动探测的处理器数量，可以使用节点信息API中的os字段来查看。

## 查看线程池
ES提供了丰富的API查看线程池状态，在监控节点健康、排查问题
时非常有用。

### cat thread pool

该命令显示每个节点的线程池统计信息。默认情况下，所有线程
池都返回活动、队列和被拒绝的统计信息。我们需要特别留意被拒接
的信息，例如，bulk请求被拒绝意味着客户端写入失败。在正常情况
下客户端应该捕获这种错误（错误码429）并延迟重试，但有时客户
端不一定对这种错误做了处理，导致写入集群的数据量低于预期值。
```bash
curl -X GET ＂localhost:9200/_cat/thread_pool＂
```

### nodes info
节点信息API可以返回每个线程池的类型和配置信息，例如，线程
数量、队列大小等。下面的第一条命令返回所有节点的信息，第二条命令返回特定节
点的信息。
```bash
curl -X GET ＂localhost:9200/_nodes＂
curl -X GET ＂localhost:9200/_nodes/nodeId1,nodeId2＂
```

####  nodes stats
stats API返回集群中一个或全部节点的统计数据。
下面的第一条命令返回所有节点的统计数据，第二条命令返回特
定节点的统计数据。
```bash
curl -X GET ＂localhost:9200/_nodes/stats＂
curl -X GET ＂
localhost:9200/_nodes/nodeId1,nodeId2/stats＂
```
默认情况下，该 API 返回全部indices、os、process、jvm、
transport、http、fs、breaker 和thread_pool方面的统计数据。

### nodes hot threads
该API返回集群中一个或全部节点的热点线程。
当发现节点进程占用CPU非常高时，想知道是哪些线程导致的，
这些线程具体在执行什么操作，常规做法是通过top命令配合jstack来
定位线程，现在ES提供了更便捷的方式，通过hot threads API可以
直接返回这些信息。

下面的第一条命令返回所有节点的热点线程，第二条命令返回特
定节点的热点线程。
```bash
curl -X GET ＂localhost:9200/_nodes/hot_threads＂
curl -X GET ＂
localhost:9200/_nodes/nodeId1,nodeId2/hot_threads＂
```

### Java的线程池结构
Java内部的线程池称为Executor框架，几个基本的类概念如下：
- Runable定义一个要执行的任务。
- Executor提供了execute方法，接受一个Runable实例，用来执行一个任务。
- ExecutorService是线程池的虚基类，继承自Executor，提供
了shutdown、shutdownNow等关闭线程池接口。
- ThreadPoolExecutor 线 程 池 的 具 体 实 现 。 继 承 自
ExecutorService，维护线程创建、线程生命周期、任务队列等。
- EsThreadPoolExecutor是ESThreadPoolExecutor的扩展实现。

## ES的线程池实现
除了个别情况，在ThreadPool类中，会
创建各个模块要使用的全部线程池。ThreadPool类创建各个线程池，要使用线程池的各个内部模块会
引用ThreadPool类对象，通过其对外提供executor方法，根据线程
池名称获取对应的线程池引用，进而执行某个任务。

### ThreadPool类结构与初始化

ThreadPool类对象在节点启动时初始化，在Node类的构造函数中初始化ThreadPool类：
```java
final ThreadPool threadPool = new ThreadPool（settings,
executorBuilders.toArray（new ExecutorBuilder[0]））；
```
线程池对象构建完毕，将这个类的引用传递给其他要使用线程池
的模块：
```java
final ResourceWatcherService resourceWatcherService =
new ResourceWatcherService（settings, threadPool）；
```
线程池的名称在内部类Names中，最好记住它们的名字，有时需
要通过jstack查看堆栈， ES的堆栈非常长，这就需要通过线程池的名
称去查找关注的内容。

这些线程池构建成功后，最终保存到一个map结构中，map列表
根据builders信息构建，将SAME线程池单独添加进去。
Map< String, ExecutorHolder> executors 当某个模块使用线
程池时，通过线程池名称从这个map中获取对应的线程池。


### fixed类型线程池构建过程
FixedExecutorBuilder 类用于 fixed 类型的线程池构建，它的
主 要 实 现 是 通 过 EsExecutors. newFixed 方 法 创 建 一 个
ExecutorService 。 由 于 是 fixed 类 型 的 线 程 池 ， 因 此
EsThreadPoolExecutor传入的corePoolSize和maximumPoolSize
的大小相同。

### scaling类型线程池构建过程
ScalingExecutorBuilder用于scaling类型线程池的构建，它的
主 要 实 现 是 通 过 EsExecutors.newScaling 方 法 创 建 一 个
ExecutorService,min 和 max 分 别 对 应 corePoolSize 和
maximumPoolSize。

### direct类型线程池构建过程
direct类型的线程池没有通过*ExecutorBuilder类创建，而是通
过EsExecutors.newDirectExecutorService方法直接创建的，该方法 中 直 接 返 回 一 个 定 义 好 的 简 单 的 线 程 池
DIRECT_EXECUTOR_SERVICE

### fixed_auto_queue_size类型线程池构建过程

该类型的线程池通过 AutoQueueAdjustingExecutorBuilder 类
构 建 ， 构 建 过 程 的 主 要 实 现 是 通 过
EsExecutors.newAutoQueueFixed 方 法 创 建 一 个
ExecutorService。该线程池的队列是一个大小可调整的队列，而
QueueResizingEsThreadPoolExecutor 继 承 自
EsThreadPoolExecutor，在它的基础上实现了动态调整队列大小的
利特尔法则（Little＇s Law）。

### 其他线程池
除了ThreadPool中封装的各种线程池，ES中还有一种支持优先级
的线程池：PrioritizedEsThreadPoolExecutor，这个线程池同样继
承自EsThreadPoolExecutor类。目前，只有主节点执行集群任务，
以及从节点应用集群状态时使用该类型的线程池。
该线程池通过EsExecutors.newSinglePrioritizing方法构建，线
程池有固定大小，线程数为1。

在PrioritizedEsThreadPoolExecutor类的构造函数中，会为线
程池创建一个支持优先级的队列：PriorityBlockingQueue，该队列
是JDK中的实现，初始大小为11，最大为Integer.MAX_VALUE - 8，
基 本 是 无 限 的 。 关 于 该 队 列 的 更 多 信 息 可 以 参 考 JDK 手 册 ：
https://docs.oracle.com/javase/10/docs/api/java/util/concurre
nt/PriorityBlockingQueue.html。

## 最后

（1）每种不同类型的线程池有各自不同的队列类型。scaling类
型的线程池动态维护线程池数量。fixed_auto_queue_size与fix类型
的线程池都有固定的线程数。

（2）ThreadPool类在节点启动时初始化，然后将类的引用传递
给其他模块，其他模块通过明确指定线程名称从ThreadPool类中获取
对应的线程池，然后执行自定义的任务。

（3）节点关闭时，对线程池模块先调用shutdown，等待10秒
后，执行shutdownNow。因此线程池中的任务有机会执行完毕，但
在超时后会尝试终止线程池中的任务。