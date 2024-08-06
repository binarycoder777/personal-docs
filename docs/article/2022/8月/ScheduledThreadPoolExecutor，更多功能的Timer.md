---

title: ScheduledThreadPoolExecutor，更多功能的Timer
author: John Doe
tags:
  - ScheduledThreadPoolExecutor
categories:
  - Java
date: 2022-03-13 13:02:00
---



jdk1.5 引入了 ScheduledThreadPoolExecutor，它是一个具有更多功能的 Timer 的替代品，允许多个服务线程。如果设置一个服务线程和 Timer 没啥差别。


从注释看出相对于 Timer ，可能就是单线程跑任务和多线程跑任务的区别。但ScheduledThreadPoolExecutor继承了 ThreadPoolExecutor，实现了 ScheduledExecutorService。可以定性操作就是正常线程池差不
多了。

区别就在于两点，一个是 ScheduledFutureTask ，一个是 DelayedWorkQueue。
其实 DelayedWorkQueue 就是优先队列，也是利用数组实现的小顶堆。而 ScheduledFutureTask 继
承自 FutureTask 重写了 run 方法，实现了周期性任务的需求。

ScheduledThreadPoolExecutor 大致的流程和 Timer 差不多，也是维护一个优先队列，然后通过重写
task 的 run 方法来实现周期性任务，主要差别在于能多线程运行任务，不会单线程阻塞。
并且 Java 线程池的设定是 task 出错会把错误吃了，无声无息的。因此一个任务出错也不会影响之后的
任务。