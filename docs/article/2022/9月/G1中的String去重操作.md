---

title: G1中的String去重操作
author: John Doe
tags:
  - String
  - G1
categories:
  - String
date: 2022-03-19 20:04:00
---

堆中存活数据String占了很大一部分，而里面很多可能都是重复的字符串对象。在G1垃圾回收器中，会实现自动持续对重复的string对象进行去重，避免内存浪费。

实现：
- 当垃圾回收器工作时，会访问堆上存活的对象。对每一个对象的访问都会检查是否是候选的要去重的string对象
- 如果是，把这个对象的一个引用插入到队列中等待后续处理。一个去重的线程在后台运行，处理这个队列。处理一个元素意味着从队列删除这个元素，然后尝试去重它引用的string对象。
- 使用一个hashtable来记录所有被string对象使用的不重复的char数组，当去重时，会查这个hashtable，来看是否存在一个一样的char数组。
- 如果存在，string对象会被调整引用那个对象，释放对原数组的引用，原数组被垃圾回收。如果查找失败，则放入hashtable，就可以用于共享。

开启去重，默认未开启
usestringDeduplication(bool)