---

title: 关于fail-safe
author: John Doe
tags:
  - fail-safe
  - Java
categories:
  - 集合
  - Java
date: 2022-04-01 22:00:00
---

Fail-Safe 迭代的出现，是为了解决fail-fast抛出异常处理不方便的情况。fail-safe是针对线程安全的集合类。


采⽤安全失败机制的集合容器，在遍历时不是直接在集合内容上访问的，⽽是先复制原有集合内容，在拷⻉的集合上进⾏遍历。所以，在遍历过程中对原集合所作的修改并不能被迭代器检测到，故不会抛ConcurrentModificationException 异常。

换句话说，并发容器的iterate方法返回的iterator对象，内部都是保存了该集合对象的一个快照副本，并且没有modCount等数值做检查。这也造成了并发容器的iterator读取的数据是某个时间点的快照版本。你可以并发读取，不会抛出异常，但是不保证你遍历读取的值和当前集合对象的状态是一致的！这就是安全失败的含义。

所以Fail-Safe 迭代的缺点是：首先是iterator不能保证返回集合更新后的数据，因为其工作在集合克隆上，而非集合本身。其次，创建集合拷贝需要相应的开销，包括时间和内存。

在java.util.concurrent 包中集合的迭代器，如 ConcurrentHashMap, CopyOnWriteArrayList等默认为都是Fail-Safe。