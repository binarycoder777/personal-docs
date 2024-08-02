---

---

# Java 21 虚拟线程-我的锁在哪

> 国内的阿里、美团、拼多多等公司长期以来一直将 Java 作为其庞大的微服务群的主要编程语言。随着新版本的 Java 21 发版，JVM 生态系统团队会寻找可以改善系统人机工程学和性能的新语言功能。在 Java 21 中，将分代 ZGC 切换为默认垃圾收集器使我们的工作负载受益。虚拟线程是我们很高兴在此次讨论用的另一个功能。本文的内容翻译自[Netflix 技术博客](https://netflixtechblog.com/java-21-virtual-threads-dude-wheres-my-lock-3052540e231d)，仅以记录在使用 Java 21 的虚拟线程时遇到的问题，以及如何进行排查解决的思路.

## 关于虚拟线程

对于刚接触虚拟线程的人来说，它们被描述为“轻量级线程，可显著减少编写、维护和观察高吞吐量并发应用程序的工作量”。它们的强大之处在于，当发生阻塞操作时，它们能够通过延续自动暂停和恢复，从而释放底层操作系统线程，以供其他操作重用。在适当的环境中使用虚拟线程可以提高性能。具体更多描述可以参考 [Java 官方文档](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html#GUID-DC4306FC-D6C1-4BCC-AECE-48C32C1A8DAA)


## 问题

Netflix 工程师向性能工程和 JVM 生态系统团队提交了几份关于间歇性超时和挂起实例的独立报告。经过仔细检查，我们注意到了一组共同​​的特征和症状。在所有情况下，受影响的应用程序都在 Java 21 上运行，使用 SpringBoot 3 和嵌入式 Tomcat 在 REST 端点上提供流量。遇到此问题的实例只是停止提供流量，即使这些实例上的 JVM 仍在运行。表征此问题发生的一个明显症状是处于状态的套接字数量持续增加，closeWait如下图所示：

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240730142237.png)

## 收集诊断信息

套接字保持closeWait状态表示远程对等端关闭了套接字，但本地实例上从未关闭过套接字，可能是因为应用程序未能关闭。这通常表示应用程序处于异常状态，在这种情况下，应用程序线程转储可能会揭示更多内幕信息。

为了解决此问题，我们首先利用警报系统来捕获处于此状态的实例。由于我们定期收集并保存所有 JVM 工作负载的线程转储，因此我们通常可以通过检查实例中的这些线程转储来追溯行为。然而，我们惊讶地发现，我们所有的线程转储都显示 JVM 完全处于空闲状态，没有明显的活动。查看最近的更改后发现，这些受影响的服务启用了虚拟线程，并且我们知道虚拟线程调用堆栈不会显示在jstack生成的线程转储中。为了获得包含虚拟线程状态的更完整的线程转储，我们改用“ jcmd Thread.dump_to_file”命令。作为检查 JVM 状态的最后一搏，我们还从实例收集了堆转储。

## 分析

线程转储揭示了数千个“空白”虚拟线程：

```
#119821 "" 虚拟

#119820 "" 虚拟

#119823 "" 虚拟

#120847 "" 虚拟

#119822 "" 虚拟
...
```

这些是已创建线程对象但尚未开始运行的 VT（虚拟线程），因此没有堆栈跟踪。事实上，空白 VT 的数量大约与处于 closeWait 状态的套接字数量相同。要理解我们看到的内容，我们首先需要了解 VT 的运行方式。

虚拟线程并非 1:1 映射到专用的 OS 级线程。相反，我们可以将其视为调度到 fork-join 线程池的任务。当虚拟线程进入阻塞调用（如等待）时，它Future会放弃其占用的 OS 线程并仅保留在内存中，直到准备好恢复。与此同时，可以重新分配 OS 线程以执行同一个 fork-join 池中的其他 VT。这使我们能够将大量 VT 多路复用到少数底层 OS 线程。在 JVM 术语中，底层 OS 线程被称为“承载线程”，虚拟线程可以在执行时“挂载”到该线程，在等待时“卸载”。JEP 444中提供了有关虚拟线程的详细描述。

在我们的环境中，我们为 Tomcat 使用了阻塞模型，该模型实际上在请求的整个生命周期中都持有一个工作线程。通过启用虚拟线程，Tomcat 会切换到虚拟执行。每个传入请求都会创建一个新的虚拟线程，该线程只是作为虚拟线程执行器上的任务进行调度。我们可以看到 TomcatVirtualThreadExecutor 在这里创建了一个。

将此信息与我们的问题联系起来，症状对应于这样一种状态：Tomcat 不断为每个传入请求创建一个新的 Web 工作线程 VT，但没有可用的 OS 线程来安装它们。

## Tomcat 为何卡住了？

我们的操作系统线程发生了什么？它们在忙什么？如此处所述，如果 VT 在synchronized块或方法内部执行阻塞操作，它将被固定到底层操作系统线程。这正是这里发生的事情。以下是从卡住实例中获得的线程转储的相关代码片段：

```bash
#119515 “” 虚拟
      java.base/jdk.internal.misc.Unsafe.park（本机方法）
      java.base/java.lang.VirtualThread.parkOnCarrierThread（VirtualThread.java:661）
      java.base/java.lang.VirtualThread.park（VirtualThread.java:593）
      java.base/java.lang.System$2.parkVirtualThread（System.java:2643）
      java.base/jdk.internal.misc.VirtualThreads.park（VirtualThreads.java:54）
      java.base/java.util.concurrent.locks.LockSupport.park（LockSupport.java:219）
      java.base/java.util.concurrent.locks.AbstractQueuedSynchronizer.acquire（AbstractQueuedSynchronizer.java:754）
      java.base/java.util.concurrent.locks.AbstractQueuedSynchronizer.acquire（AbstractQueuedSynchronizer.java:990） java.base       /java.util.concurrent.locks.ReentrantLock 
      $Sync.lock（ReentrantLock.java:153） java.base/java.util.concurrent.locks.ReentrantLock.lock （ReentrantLock.java:322）       zipkin2.reporter.internal.CountBoundedQueue.offer（CountBoundedQueue.java:54）      zipkin2.reporter.internal.AsyncReporter$BoundedAsyncReporter.report（AsyncReporter.java:230）      zipkin2.reporter.brave.AsyncZipkinSpanHandler.end（AsyncZipkinSpanHandler.java:214）      勇敢.内部.处理程序.NoopAwareSpanHandler$CompositeSpanHandler.end(NoopAwareSpanHandler.java:98) 勇敢.内部.处理程序.NoopAwareSpanHandler.end       (NoopAwareSpanHandler.java:48) 勇敢.内部.记录器.PendingSpans.finish       (PendingSpans.java:116)      勇敢.RealSpan.finish(RealSpan.java:134) 勇敢.RealSpan.finish       (RealSpan.java:129)       io.micrometer.tracing.brave.bridge.BraveSpan.end(BraveSpan.java:117)       io.micrometer.tracing.annotation.AbstractMethodInvocationProcessor.after(AbstractMethodInvocationProcessor.java:67)       io.micrometer.tracing.annotation.ImperativeMethodInvocationProcessor.proceedUnderSynchronousSpan（ImperativeMethodInvocationProcessor.java:98）      io.micrometer.tracing.annotation.ImperativeMethodInvocationProcessor.process（ImperativeMethodInvocationProcessor.java:73）      io.micrometer.tracing.annotation.SpanAspect.newSpanMethod（SpanAspect.java:59）      java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke（DirectMethodHandleAccessor.java:103）      java.base/java.lang.reflect.Method.invoke（Method.java:580）      org.springframework.aop.aspectj.AbstractAspectJAdvice.invokeAdviceMethodWithGivenArgs(AbstractAspectJAdvice.java:637) ...
```
在此堆栈跟踪中，我们输入了 中的同步。此虚拟线程实际上已被固定 — 即使等待获取可重入锁，它也已安装到实际的 OS 线程。有 3 个 VT 处于此状态，另一个标识为“ ”的 VT 也遵循相同的代码路径。这 4 个虚拟线程在等待获取锁时被固定。由于应用程序部署在具有 4 个 vCPU 的实例上，因此支持 VT 执行的 fork-join 池也包含 4 个 OS 线程。现在我们已经用尽了所有线程，没有其他虚拟线程可以取得任何进展。这解释了为什么 Tomcat 停止处理请求以及为什么处于状态的套接字数量不断攀升。事实上，Tomcat 接受套接字上的连接，创建请求以及虚拟线程，并将此请求/线程传递给执行器进行处理。但是，无法调度新创建的 VT，因为 fork-join 池中的所有 OS 线程都已固定且从未释放。因此，这些新创建的 VT 卡在队列中，同时仍持有套接字。

## 谁有锁？

现在我们知道 VT 正在等待获取锁，下一个问题是：谁持有锁？回答这个问题是理解是什么首先触发了这种情况的关键。通常，线程转储会使用“ - locked <0x…> (at …)”或“ Locked ownable synchronizers”来指示谁持有锁，但这两者都不会出现在我们的线程转储中。事实上，jcmd生成的线程转储中不包含任何锁定/停放/等待信息。这是 Java 21 中的一个限制，将在未来的版本中解决。仔细梳理线程转储会发现，共有 6 个线程在争夺相同的ReentrantLock和相关的Condition。这六个线程中的四个在上一节中详细介绍了。这是另一个线程：

```bash
#119516 “” 虚拟
      java.base/java.lang.VirtualThread.park(VirtualThread.java:582) 
      java.base/java.lang.System$2.parkVirtualThread(System.java:2643) 
      java.base/jdk.internal.misc.VirtualThreads.park(VirtualThreads.java:54) 
      java.base/java.util.concurrent.locks.LockSupport.park(LockSupport.java:219) 
      java.base/java.util.concurrent.locks.AbstractQueuedSynchronizer.acquire(AbstractQueuedSynchronizer.java:754) 
      java.base/java.util.concurrent.locks.AbstractQueuedSynchronizer.acquire(AbstractQueuedSynchronizer.java:990) 
      java.base/java.util.concurrent.locks.ReentrantLock$Sync.lock(ReentrantLock.java:153) 
      java.base/java.util.concurrent.locks.ReentrantLock.lock（ReentrantLock.java:322）
      zipkin2.reporter.internal.CountBoundedQueue.offer（CountBoundedQueue.java:54）
      zipkin2.reporter.internal.AsyncReporter$BoundedAsyncReporter.report（AsyncReporter.java:230）
      zipkin2.reporter.brave.AsyncZipkinSpanHandler.end（AsyncZipkinSpanHandler.java:214）
      brave.internal.handler.NoopAwareSpanHandler$CompositeSpanHandler.end（NoopAwareSpanHandler.java:98）
      brave.internal.handler.NoopAwareSpanHandler.end（NoopAwareSpanHandler.java:48）
```
请注意，虽然此线程看似通过相同的代码路径来完成跨度，但它不会通过块synchronized。最后是第 6 个线程：

```bash
#107 “AsyncReporter <redacted>” 
      java.base/jdk.internal.misc.Unsafe.park（本机方法）
      java.base/java.util.concurrent.locks.LockSupport.park（LockSupport.java:221）
      java.base/java.util.concurrent.locks.AbstractQueuedSynchronizer.acquire（AbstractQueuedSynchronizer.java:754） java.base/java.util.concurrent.locks.AbstractQueuedSynchronizer 
      $ConditionObject.awaitNanos（AbstractQueuedSynchronizer.java:1761）
      zipkin2.reporter.internal.CountBoundedQueue.drainTo（CountBoundedQueue.java:81）
      zipkin2.reporter.internal.AsyncReporter$BoundedAsyncReporter.flush（AsyncReporter.java:241）
      zipkin2.reporter.internal.AsyncReporter$Flusher.run(AsyncReporter.java:352) 
      java.base/java.lang.Thread.run(Thread.java:1583)
```
这实际上是一个正常的平台线程，而不是虚拟线程。特别注意此堆栈跟踪中的行号，奇怪的是，完成等待后，acquire()线程似乎在内部方法中被阻塞。换句话说，此调用线程在进入时拥有锁。我们知道锁是在此处明确获取的。但是，到等待完成时，它无法重新获取锁。总结我们的线程转储分析： awaitNanos()

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240730142542.png)

有 5 个虚拟线程和 1 个常规线程正在等待锁。在这 5 个 VT 中，有 4 个固定在 fork-join 池中的 OS 线程上。仍然没有关于谁拥有锁的信息。由于我们无法从线程转储中收集更多信息，因此我们的下一个合乎逻辑的步骤是查看堆转储并检查锁的状态。

## 检查锁
在堆转储中找到锁相对简单。使用出色的Eclipse MATAsyncReporter工具，我们检查了非虚拟线程堆栈上的对象以识别锁对象。推断锁的当前状态可能是我们调查中最棘手的部分。大多数相关代码都可以在AbstractQueuedSynchronizer.java中找到。虽然我们并不声称完全了解它的内部工作原理，但我们对其进行了足够的逆向工程，以与我们在堆转储中看到的内容相匹配。此图说明了我们的发现：

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240730142635.png)

首先，该exclusiveOwnerThread字段为null(2)，表示没有人拥有该锁。我们ExclusiveNode在列表的开头有一个“空”(3)（waiter是null和status清除），后面跟着另一个ExclusiveNode指向waiter争用该锁的虚拟线程之一 — #119516(4)。我们发现唯一清除该exclusiveOwnerThread字段的地方是在ReentrantLock.Sync.tryRelease()方法中（源链接）。我们还在那里设置了state = 0与堆转储中看到的状态相匹配的状态 (1)。

考虑到这一点，我们追踪了代码路径到release()锁。成功调用后tryRelease()，持有锁的线程尝试向列表中的下一个等待者发出信号。此时，持有锁的线程仍然位于列表的头部，即使锁的所有权已被有效释放。列表中的下一个节点指向即将获取锁的线程。

为了理解此信号如何工作，让我们看一下方法中的锁获取路径AbstractQueuedSynchronizer.acquire()。简单来说，这是一个无限循环，其中线程尝试获取锁，如果尝试失败则停止：
```java
while(true) { 
   if (tryAcquire()) { 
      return; // 已获取锁
   } 
   park(); 
}
```
当持有锁的线程释放锁并发出信号让下一个等待线程退出时，退出的线程将再次重复此循环，从而再次获得锁。实际上，我们的线程转储表明，所有等待线程都已退出754 行。退出后，成功获得锁的线程将进入此代码块，从而有效地重置列表的头部并清除对等待线程的引用。

更简洁地重述这一点，拥有锁的线程由列表的头节点引用。释放锁会通知列表中的下一个节点，而获取锁会将列表的头重置为当前节点。这意味着我们在堆转储中看到的内容反映了一个线程已经释放锁但下一个线程尚未获取锁的状态。这是一个奇怪的中间状态，应该是暂时的，但我们的 JVM 卡在这里。我们知道线程#119516已收到通知并即将获取锁，因为ExclusiveNode我们在列表头标识了状态。但是，线程转储显示该线程#119516继续等待，就像其他争用同一锁的线程一样。我们如何协调线程和堆转储之间看到的内容？

## 无处可逃的锁

知道该线程#119516确实已收到通知后，我们返回线程转储以重新检查线程的状态。回想一下，我们有 6 个线程在等待锁，其中 4 个虚拟线程分别固定到 OS 线程。这 4 个线程在获得锁并离开块之前不会放弃其 OS 线程synchronized。#107 “AsyncReporter < redacted >”是一个常规平台线程，因此如果它获得锁，则没有什么可以阻止它继续进行。这给我们留下了最后一个线程：#119516。它是一个 VT，但它没有固定到 OS 线程。即使通知它取消停放，它也无法继续，因为 fork-join 池中没有剩余的 OS 线程可以将其调度到其中。这正是这里发生的情况 — 尽管发出#119516信号将其自身取消停放，但它无法离开停放状态，因为 fork-join 池被其他 4 个等待获取相同锁的 VT 占用。这些固定的 VT 中没有一个可以继续，直到它们获得锁。它是经典死锁问题的一个变体，但是我们不是使用 2 个锁，而是使用一个锁和一个具有 4 个许可的信号量，以 fork-join 池为代表。

现在我们确切地知道了发生了什么，很容易想出一个可重现的测试用例。


## 结论

虚拟线程有望通过减少与线程创建和上下文切换相关的开销来提高性能。尽管 Java 21 中存在一些尖锐问题，但虚拟线程在很大程度上兑现了其承诺。在我们追求更高性能的 Java 应用程序的过程中，我们认为进一步采用虚拟线程是实现这一目标的关键。我们期待 Java 23 及更高版本，它会带来大量升级，并有望解决虚拟线程与锁定原语之间的集成问题。

此次探索仅重点介绍了 Netflix 性能工程师解决的一类问题。我们希望此次对我们解决问题方法的了解能够为其他人在未来的调查中提供参考。




