---

title: Kafka消费者分区的分配以及再平衡
author: John Doe
tags:
  - 消费者
  - 分区分配策略
categories:
  - Kafka
date: 2022-03-12 12:47:00
---

一个consumer group中有多个consumer组成，一个 topic有多个partition组成，现在的问题是，到底由哪个consumer来消费哪个partition的数据。 

2、Kafka有四种主流的分区分配策略：
 Range、RoundRobin、Sticky、CooperativeSticky。
可以通过配置参数partition.assignment.strategy，修改分区的分配策略。默认策略是Range + CooperativeSticky。Kafka可以同时使用多个分区分配策略。

1）Range 是对每个 topic 而言的。

首先对同一个 topic 里面的分区按照序号进行排序，并对消费者按照字母顺序进行排序。

假如现在有 7 个分区，3 个消费者，排序后的分区将会是0,1,2,3,4,5,6；消费者排序完之后将会是C0,C1,C2。例如，7/3 = 2 余 1 ，除不尽，那么 消费者 C0 便会多消费 1 个分区。 8/3=2余2，除不尽，那么C0和C1分别多消费一个。

通过 partitions数/consumer数 来决定每个消费者应该消费几个分区。如果除不尽，那么前面几个消费者将会多
消费 1 个分区。

注意：如果只是针对 1 个 topic 而言，C0消费者多消费1个分区影响不是很大。但是如果有 N 多个 topic，那么针对个 topic，消费者 C0都将多消费 1 个分区，topic越多，C0消 费的分区会比其他消费者明显多消费 N 个分区。容易产生数据倾斜！

（注意：说明：某个消费者挂掉后，消费者组需要按照超时时间 45s 来判断它是否退出，所以需要等待，时间到了 45s 后，判断它真的退出就会把任务分配给其他 broker 执行。）

2）RoundRobin 分区策略原理：

RoundRobin 针对集群中所有Topic而言。
RoundRobin 轮询分区策略，是把所有的 partition 和所有的
consumer 都列出来，然后按照 hashcode 进行排序，最后
通过轮询算法来分配 partition 给到各个消费者。

3） Sticky 以及再平衡：

粘性分区定义：可以理解为分配的结果带有“粘性的”。即在执行一次新的分配之前，
考虑上一次分配的结果，尽量少的调整分配的变动，可以节省大量的开销。
粘性分区是 Kafka 从 0.11.x 版本开始引入这种分配策略，首先会尽量均衡的放置分区
到消费者上面，在出现同一消费者组内消费者出现问题的时候，会尽量保持原有分配的分
区不变化。