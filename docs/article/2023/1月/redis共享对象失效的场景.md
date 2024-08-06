---

title: redis共享对象失效的场景
author: John Doe
tags:
  - Redis
categories:
  - 共享对象
  - Redis
date: 2022-08-23 16:05:00
---

1. redis中设置了maxmemory现在最大内存占用大小，且启用了LRU策略：LRU策略需要记录每个键值对的访问时间，如果共享同一个整数对象，会导致更新与LRU不匹配

2. 集合类型的编码采用ziplist编码，并且集合内容是整数，也不能共享一个整数对象：因为使用了ziplist紧凑内存结构存储数据，可以不用去判断整数是否共享