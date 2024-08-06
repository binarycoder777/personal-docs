---

title: 一个Redis实例能存放多少key？
author: John Doe
tags: []
categories:
  - Redis
date: 2022-02-08 17:27:00
---

理论上 Redis 可以处理多达 2^32 的 keys，并且在实际中进行了测试，每个实例至少存放了 2 亿 5 千万的 keys。我们正在测试一些较大的
值。任何 list、set、和 sorted set 都可以放 2^32 个元素。换句话说，Redis 的存储极限是系统中的可用内存值。