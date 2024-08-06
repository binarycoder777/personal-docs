---

title: Redis的通信协议RESP
author: John Doe
tags:
  - RESP
  - 通信协议
  - Redis
categories:
  - Redis
date: 2022-04-03 22:00:00
---
我们知道，Redis 客户端与服务端是通过命令的方式来完成交互过程的，主要分为两个部分：网络模型和序列化协议。前者讨论的是数据交互的组织方式，后者讨论的是数据如何序列化。

## 简介
Redis 的通信协议是 Redis Serialization Protocol，翻译为 Redis 序列化协议，简称 RESP。它具有如下特征：
- 在 TCP 层
- 是二进制安全的
- 基于请求 - 响应模式
- 简单、易懂（人都可以看懂）
- RESP 所描述的是 Redis 客户端 - 服务端的交互方式。

## RESP描述

Redis 协议将传输的结构数据分为 5 种类型，单元结束时统一加上回车换行符号 \r\n。

- 单行字符串，第一个字节为 +
- 错误消息，第一个字节为 -
- 整型数字，第一个字节为 :，后跟整数的字符串
- 多行字符串，第一个字节为 $，后跟字符串的长度
- 数组，第一个字节为 *，后跟跟着数组的长度

## 请求命令
Redis 对每一条请求命令都做了统一规范，格式如下：
            
            *<number of arguments> CR LF
            $<number of bytes of argument 1> CR LF
            <argument data> CR LF
            ...
            $<number of bytes of argument N> CR LF
            <argument data> CR LF
翻译如下：
- number of arguments ： 参数的数量
- CR LF：\r\n
- number of bytes of argument 1：参数 1 的字节数
- number of bytes of argument N：参数 N 的字节数
以命令 set userName chenssy 为例，如下：

        *3
        $3
        SET
        $8
        userName
        $7
        chenssy
解释：
 		
        *3 数组，表明有三个参数 SET、userName、chenssy
        $3 多行字符串，第一个参数 SET ，有 3 个字符
        $8 多行字符串，第二个参数 userName，有 8 个字符
        $7 多行字符串，第三个参数 chenssy，有 7 个字符
上面只是格式化显示的结果，真正传输的结果如下：
		
        *3\r\n$3\r\nSET\r\n$8\r\nuserName\r\n$7\r\nchenssy\r\n
## 回复命令
Redis 服务端响应要支持多种数据格式，所以回复命令一般都会显得复杂些，但是无论如何它都逃脱不了上面 5 中类型及其组合。

从上面我们可以看出 RESP 协议是非常简单直观的一种协议，我们肉眼都可以看懂，而且数据结构类型也只有少少的 5 中，所以实现起来就变得很简单了。

