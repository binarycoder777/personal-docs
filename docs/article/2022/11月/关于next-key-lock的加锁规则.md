---

title: 关于next-key lock的加锁规则
author: John Doe
tags:
  - next-key lock
  - MySQL
categories:
  - MySQL
date: 2022-04-05 16:29:00
---
# next-key lock的加锁规则

总结的加锁规则里面，包含了两个 “ “ 原则 ” ” 、两个 “ “ 优化 ” ” 和一个 “bug” 。 

1. 原则 1 ：加锁的基本单位是 next-key lock 。 next-key lock 是前开后闭区间。
2. 原则 2 ：查找过程中访问到的对象才会加锁。任何辅助索引上的锁，或者非索引列上的锁，最终都要回溯到主键上，在主键上也要加一把锁。
3. 优化 1 ：索引上的等值查询，给唯一索引加锁的时候， next-key lock 退化为行锁。也就是说如果InnoDB扫描的是一个主键、或是一个唯一索引的话，那InnoDB只会采用行锁方式来加锁
4. 优化 2 ：索引上（不一定是唯一索引）的等值查询，向右遍历时且最后一个值不满足等值条件的时候， next-keylock 退化为间隙锁。
5. 一个 bug ：唯一索引上的范围查询会访问到不满足条件的第一个值为止。