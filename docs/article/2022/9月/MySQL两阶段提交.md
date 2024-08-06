---

title: MySQL两阶段提交
author: John Doe
tags:
  - 两阶段提交
  - Binlog
  - ''
categories:
  - MySQL
date: 2022-03-21 16:12:00
---

MySQL中经常说的WAL技术，WAL的全称是Write Ahead Logging，它的关键点就是先写日志，再写磁盘。即当有一条记录需要更新时，InnoDB引擎就会先把记录写到redo log里，并更新内存，这个时候更新就完成了。因为如果每一次的更新操作都需要写进磁盘，然后磁盘也要找到对应的那条记录，然后再更新，整个过程IO成本、查找成本都很高。


在执行一条update语句时候，通过连接器、分析器、优化器之后，调用操作引擎，将新行写入内存，写入redo log，状态为prepare->写binlog->redo log状态修改为commit。写入redo的过程分为了prepare和commit称为二阶段提交。


- 采用二阶段提交的原因：

- 先写redolog再写binlog：如果在一条语句redolog之后崩溃了，binlog则没有记录这条语句。系统在crash recovery时重新执行了一遍binlog便会少了这一次的修改。恢复的数据库少了这条更新。

- 先写binlog再写redolog：如果在一条语句binlog之后崩溃了，redolog则没有记录这条语句（数据库物理层面并没有执行这条语句）。系统在crash recovery时重新执行了一遍binlog便会多了这一次的修改。恢复的数据库便多了这条更新。

## Crash recovery
在做Crash recovery时，分为以下3种情况：
- binlog有记录，redolog状态commit：正常完成的事务，不需要恢复；

- binlog有记录，redolog状态prepare：在binlog写完提交事务之前的crash，恢复操作：提交事务。（因为之前没有提交）

- binlog无记录，redolog状态prepare：在binlog写完之前的crash，恢复操作：回滚事务（因为crash时并没有成功写入数据库）