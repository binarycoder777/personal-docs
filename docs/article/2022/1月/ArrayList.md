---

title: ArrayList
author: John Doe
tags:
  - 集合
  - List
categories:
  - java基础
date: 2022-01-17 20:13:00
---
ArrayList

1、ArrayList底层默认是用object数组实现的，因此在增删元素上需要移动元素，效率较低，但支持随机访问元素

2、ArrayList是线层不安全的，并发环境下，多个线程同时操作 ArrayList，会引发不可预知的异常或错误。

3、ArrayList的默认的大小是10。一开始是空数组，当第一次add的时候才会扩容到10，后续容器满了之后会按1.5倍进行扩容。如果一开始指定容器大小，后续则直接按1.5倍进行扩容。最大扩容不超过Integer.MAX_VALUE