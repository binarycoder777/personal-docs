---

title: Leader 和 Follower 故障处理细节
author: John Doe
tags:
  - Leader和Follower故障
  - ''
  - ''
  - Kafka
categories:
  - Kafka
date: 2022-03-12 11:06:00
---


LEO（Log End Offset）：每个副本的最后一个offset，LEO其实就是最新的offset + 1。

HW（High Watermark）：所有副本中最小的LEO 。



1）Follower故障：

（1） Follower发生故障后会被临时踢出ISR

（2） 这个期间Leader和Follower继续接收数据

（3）待该Follower恢复后，Follower会读取本地磁盘记录的
上次的HW，并将log文件高于HW的部分截取掉，从HW开始向Leader进行同步。

（4）等该Follower的LEO大于等于该Partition的HW，即
Follower追上Leader之后，就可以重新加入ISR了。

2）Leader故障：

（1） Leader发生故障之后，会从ISR中选出一个新的Leader

（2）为保证多个副本之间的数据一致性，其余的Follower会先将各自的log文件高于HW的部分截掉，然后从新的Leader同步数据。

注意：这只能保证副本之间的数据一致性，并不能保证数据不丢失或者不重复。
