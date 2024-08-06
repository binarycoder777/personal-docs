---

title: redis的二进制位数组
author: John Doe
tags:
  - Redis
categories:
  - Redis
date: 2022-07-27 21:40:00
---
redis提供了setbit、getbit、bitcount、bitop指令来处理二进制位数组。而实际上，redis是使用字符串对象的SDS来表示位数组的，因为SDS数据结构是二进制安全的，并且可以使用SDS的相关函数。但值得注意的是，关于其二进制数组在SDS数据结构中是逆序存放的，主要用于简化setbit命令时涉及到扩容时移动元素的问题。

### getbit命令的实现
1. 计算byte = offset / 8 :byte记录了offset值记录的偏移量保存在那个字节
2. 计算bit =  offset % 8 + 1 ：bit记录了在指定字节上的偏移量
3. 根据byte和bit定位

### setbit命令的实现
1. 计算len = offset / 8 + 1：计算保存数据的偏移量
2. 检测是否足够空间
3. 不足够，扩容
4. 足够，则加进去（根据byte和bit的偏移量）

(逆序存放作用便在此，扩容不需要移动元素)

### bitcount命令的实现
我们很容易能想到通过遍历来实现该指令，但显然遍历的效率并不高，因此我们可以创建一个表，表的键为某种排列的数组，值为相应的数组中1的数量，但查表的实际效果收到内存和缓存的影响（特别是数据量大的时候）。在redis中，使用的是variable-precision SWAR算法来实现的。感兴趣的可以去查阅资料了解一下。

### bitop命令的实现
常规的变量做比较，&，|之类，因为SDS支持这些操作。