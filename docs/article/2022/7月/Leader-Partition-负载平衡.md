---

title: Leader Partition 负载平衡
author: John Doe
tags:
  - Leader
  - Partition
categories:
  - Kafka
date: 2022-03-12 11:11:00
---

正常情况下，Kafka本身会自动把Leader Partition均匀分散在各个机器上，来保证每台机器的读写吞吐量都是均匀的。但是如果某些broker宕机，会导致Leader Partition过于集中在其他少部分几台broker上，这会导致少数几台broker的读写请求压力过高，其他宕机的broker重启之后都是follower partition，读写请求很低，造成集群负载不均衡。

策略：

1、auto.leader.rebalance.enable，默认是true。（自动Leader Partition 平衡）

2、leader.imbalance.per.broker.percentage，默认是10%。每个broker允许的不平衡的leader的比率。如果每个broker超过了这个值，控制器会触发leader的平衡。

3、leader.imbalance.check.interval.seconds，默认值300秒。检查leader负载是否平衡的间隔时间。

例如：针对broker0节点，分区2的AR优先副本是0节点，但是0节点却不是Leader节点，所以不平衡数加1，AR副本总数是4，所以broker0节点不平衡率为1/4>10%，需要再平衡。
