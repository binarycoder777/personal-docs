---

title: Kafka保证生产者生产的数据不重复：幂等性+至少一次
author: John Doe
tags:
  - Kafka
  - 数据
categories:
  - Kafka
  - 消息队列
date: 2022-03-12 10:25:00
---



至少一次：ack级别设置为-1+分区副本大于等于2+ISR里面的应答最小副本大于等于2（保证数据不会丢失）

幂等性：指Producer不论向Broker发送多少次重复数据，Broker端都只会持久化一条，保证了不重复。（重复数据的判断标准：具有<PID, Partition, SeqNumber>相同主键的消息提交时，Broker只会持久化一条。其 中PID是Kafka每次重启都会分配一个新的；Partition 表示分区号；Sequence Number是单调自增的。）

因此幂等性只能保证的是在单分区单会话内不重复。

如何使用幂等性：开启参数 enable.idempotence 默认为 true，false 关闭。


