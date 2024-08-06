---

title: 延迟队列 DelayQueue
author: John Doe
tags:
  - DelayQueue
  - 队列
categories:
  - Java
date: 2022-03-13 13:05:00
---


Java 中还有个延迟队列 DelayQueue，加入延迟队列的元素都必须实现 Delayed 接口。延迟队列内部是利用 PriorityQueue 实现的，所以还是利用优先队列！Delayed 接口继承了Comparable 因此优先队
列是通过 delay 来排序的。

延迟队列是利用优先队列实现的，元素通过实现 Delayed 接口来返回延迟的时间。不过延迟队列就是个容
器，需要其他线程来获取和执行任务。

对于 Timer 、ScheduledThreadPool 和 DelayQueue，总结的说下它们都是通过优先队列来获取最早需要执行的任务，因此插入和删除任务的时间复杂度都为O(logn)，并且 Timer 、
ScheduledThreadPool 的周期性任务是通过重置任务的下一次执行时间来完成的。

问题就出在时间复杂度上，插入删除时间复杂度是O(logn)，那么假设频繁插入删除次数为 m，总的时
间复杂度就是O(mlogn)，这种时间复杂度满足不了 Kafka 这类中间件对性能的要求，而时间轮算法的插入删除时间复杂度是O(1)。
