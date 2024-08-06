---

title: MySQL日志和索引相关问题
author: John Doe
tags:
  - MySQL
categories:
  - MySQL
date: 2022-04-10 14:50:00
---

### MySQL怎么知道binlog是完整的?

一个事务的binlog是有完整格式的：
- statement格式的binlog，最后会有COMMIT； 
- row格式的binlog，最后会有一个XID event。
另外，在MySQL 5.6.2版本以后，还引入了binlog-checksum参数，用来验证binlog内容的正确性。对于binlog日志由于磁盘原因，可能会在日志中间出错的情况，MySQL可以通过校验checksum的结果来发现。所以，MySQL还是有办法验证事务binlog的完整性的。

### redo log 和binlog是怎么关联起来的?
它们有一个共同的数据字段，叫XID。崩溃恢复的时候，会按顺序扫描redo log：
- 如果碰到既有prepare、又有commit的redo log，就直接提交； 
- 如果碰到只有parepare、而没有commit的redo log，就拿着XID去binlog找对应的事务。

### 为什么需要两阶段提交？先写redo log，崩溃恢复时，必须两个日志都完整才可以，不是一样的吗？

回答：其实，两阶段提交是经典的分布式系统问题，并不是MySQL独有的。 如果必须要举一个场景，来说明这么做的必要性的话，那就是事务的持久性问题。 对于InnoDB引擎来说，如果redo log提交完成了，事务就不能回滚（如果这还允许回滚，就可能覆盖掉别的事务的更新）。而如果redo log直接提交，然后binlog写入的时候失败，InnoDB又回滚不了，数据和binlog日志又不一致了。 两阶段提交就是为了给所有人一个机会，当每个人都说“我ok”的时候，再一起提交。

### 不引入两个日志，也就没有两阶段提交。只需要用redolog支持崩溃恢复和归档不是也可以吗？

回答：

如果只从崩溃恢复的角度来讲是可以的。你可以把binlog关掉，这样就没有两阶段提交了，但系统依然是crash-safe的。 

但是，如果你了解一下业界各个公司的使用场景的话，就会发现在正式的生产库上，binlog都是开着的。因为binlog有着redo log无法替代的功能。 

一个是归档。redo log是循环写，写到末尾是要回到开头继续写的。这样历史日志没法保留，redo log也就起不到归档的作用。 

一个就是MySQL系统依赖于binlog。binlog作为MySQL一开始就有的功能，被用在了很多地方。 

其中，MySQL系统高可用的基础，就是binlog复制。 还有很多公司有异构系统（比如一些数据分析系统），这些系统就靠消费MySQL的binlog来更新 自己的数据。关掉binlog的话，这些下游系统就没法输入了。 总之，由于现在包括MySQL高可用在内的很多系统机制都依赖于binlog，所以“鸠占鹊巢”redo log还做不到。你看，发展生态是多么重要。

