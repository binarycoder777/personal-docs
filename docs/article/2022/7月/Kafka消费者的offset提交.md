---

title: Kafka消费者的offset提交
author: John Doe
tags:
  - 消费者
  - offset
categories:
  - Kafka
date: 2022-03-12 13:00:00
---

offset偏移量表明了该消费者当前消费的数据到哪一步，其存储在系统主题_consumer_offset中（0.9版本之前是存在Zookeeper中），以key,value形式，每隔一段时间kafka都会对其Compact（即保留当前最新的数据）。

1、自动提交offset：为了能让我们专注于业务处理，Kafka提供了自动提交offset功能，通过参数

⚫ enable.auto.commit：是否开启自动提交offset功能，默认是true

⚫ auto.commit.interval.ms：自动提交offset的时间间隔，默认是5s


2、手动提交：自动提交固然遍历，但基于时间的提交，我们很难把握那个度，因此更多时候，我们可以选择手动提交。

1）同步提交：同步提交会阻塞当前线程，一直到成功为止，并且失败会自动重试

2）异步提交：异步提交则不会阻塞当前线程，且没有重试机制，可能提交失败。

两者都会将本次提交的一批数据最高偏移量提交。

指定offset消费：auto.offset.reset = earliest | latest | none 默认是 latest。

当kafka中没有初始偏移量（消费者组第一次消费）或服务器上不存在当前偏移量时（数据被删除）需要指定offset消费。

1）earliest：自动将偏移量重置为最早的偏移量，--from-beginning。

2）latest（默认值）：自动将偏移量重置为最新偏移量。

（3）none：如果未找到消费者组的先前偏移量，则向消费者抛出异常。

（4）任意指定 offset 位移开始消费

指定时间消费：在生产环境中，会遇到最近消费的几个小时数据异常，想重新按照时间消费。例如要求按照时间消费前一天的数据
