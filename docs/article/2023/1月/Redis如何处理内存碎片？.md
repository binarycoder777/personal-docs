---

title: Redis如何处理内存碎片？
author: John Doe
tags:
  - Redis
categories:
  - 内存碎片
date: 2022-08-23 16:09:00
---

redis服务器的内存碎片过大

- 在4.0版本以下只能重启恢复，因为重启之后redis重新从日志文件读取数据，在内存进行排序，为每个数据重新选择合适的内存单元，减小内存碎片

- 在4.0以后，redis提供了自动和手动的碎片整理功能：原理就是复制算法，把数据拷贝到新的内存空间，然后把佬的空间释放掉，这期间会阻塞主进程。

手动：memory purge命令

自动：使用config set activedefrag指令或在redis.config中配置activedefrag为yes

自动清理时机：设置200m开始情况，或设置内存碎片占分配的内存多少占比开始，除此之外，可以设置清理期间清理线程所占cpu时间比，以保证有效清理以及不会影响当前任务

