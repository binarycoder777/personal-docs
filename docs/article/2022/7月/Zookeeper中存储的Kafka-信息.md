---

title: Zookeeper中存储的Kafka 信息
author: John Doe
tags:
  - Zookeeper
categories:
  - Kafka
  - Zookeeper
date: 2022-03-12 10:52:00
---

在zookeeper的服务端存储的Kafka相关信息：

1）/kafka/brokers/ids [0,1,2] 记录有哪些服务器

2）/kafka/brokers/topics/first/partitions/0/state
{"leader":1 ,"isr":[1,0,2] } 记录谁是Leader，有哪些服务器可用


3）/kafka/controller 
{“brokerid”:0} 
辅助选举Leader