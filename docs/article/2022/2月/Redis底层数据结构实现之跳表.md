---

title: Redis底层数据结构之跳表
author: John Doe
tags:
  - 跳表
categories:
  - Redis
date: 2022-02-06 21:13:00
---

跳表支持平均o（logN）、最坏O（n）复杂度的节点查找，还可以通过顺序性操作来批量处理节点。


 ![upload successful](../images/pasted-33.png)
 
 
 
 ![upload successful](../images/pasted-34.png)
 
 
 ![upload successful](../images/pasted-35.png)
 
 
 
 ![upload successful](../images/pasted-36.png)
 