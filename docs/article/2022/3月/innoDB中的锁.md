---

title: innoDB中的锁
author: John Doe
tags:
  - 锁
categories:
  - MySQL
date: 2022-02-10 13:38:00
---

innoDB实现了共享锁（读锁）和排他锁（写锁）两种行级锁。意向共享锁和意向排他锁两种表级别的锁。

 ![upload successful](../images/pasted-97.png)
 
 
 
 ![upload successful](../images/pasted-98.png)
 
 
 ![upload successful](../images/pasted-99.png)
 
 
 ![upload successful](../images/pasted-100.png)
 
 
 ![upload successful](../images/pasted-101.png)