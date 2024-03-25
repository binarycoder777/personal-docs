---

---

# [epoll](https://man7.org/linux/man-pages/man7/epoll.7.html):驱动现代互联网的API

> 本文译自:https://darkcoding.net/software/epoll-the-api-that-powers-the-modern-internet/

对于几乎所有您在互联网上做的事情，其对应的服务器大多都运行在Linux服务器上，它使用epoll来及时接收和回答您的请求。

- epoll使Go成为编写服务器软件的优秀语言。这是Go的netpoll中的[epoll](https://github.com/golang/go/blob/f229e7031a6efb2f23241b5da000c3b3203081d6/src/runtime/netpoll_epoll.go#L101-L126)。

- Epoll使nginx成为世界上最受欢迎的web服务器。这是nginx对[epoll](https://github.com/nginx/nginx/blob/a64190933e06758d50eea926e6a55974645096fd/src/event/modules/ngx_epoll_module.c#L784-L800)的使用。

- 在大多数编程语言中，当我们说“异步”时，这通常是我们的意思。例如，在Rust的两个主要异步框架中，async-std使用轮询，而tokio使用io。

> 上述所有功能都适用于许多操作系统，并支持除epoll以外的API, epoll是特定于Linux的。Linux在现代互联网中占有重要比重，因此epoll是重要的API。

## 运行网络服务的核心问题
epoll解决的问题是，你的网络非常快，而你的处理非常慢。处理请求的服务器通常是这样的:
```
读取用户的请求(例如浏览器的HTTP GET)
做他们要求的事情(例如，从数据库加载一些信息)
编写响应(例如浏览器将显示的HTML)
```
在上面的“读”和“写”部分期间，服务器处于空闲状态，等待数据或对该数据的确认在网络中移动。

## 在epoll之前
在epoll之前，克服这个问题的标准方法是运行一个进程池，每个进程处理一个不同的用户请求，通常使用Apache mod_prefork。当一个进程等待用户确认数据包时，另一个进程可以使用CPU。一种新出现的替代方案是使用线程池，它比进程池更轻，可以处理几百个并发用户。多线程是有风险的，因为许多库不是线程安全的。Steven 2004年的参考UNIX网络编程有一章讨论了预分叉和预线程设计，因为这是你的选择。

但是对于每个人，甚至数百个并发用户都不够仍是是不够的。1999年，一篇很有影响力的文章[《C10K问题》](http://www.kegel.com/c10k.html)开始了这一讨论。

## 解决方法
在2000年，Jonathan Lemon通过设计和构建[kqueue/kevent](https://people.freebsd.org/~jlemon/papers/kqueue.pdf)为FreeBSD 4.3解决了这个问题，使BSD成为高性能网络的早期选择。

2001年7月，Davide Libenzi独立地为Linux解决了这个问题，epoll的[初稿](http://www.xmailserver.org/linux-patches/nio-improve.html)在2002年10月被合并到Linux内核2.5.44(一个开发版本)中，并在2003年12月随着稳定内核2.6的发布而广泛使用。

Jim Blandy在这里对线程和基于poll的异步做了一个[奇妙的比较](https://github.com/jimblandy/context-switch)。

## 如何工作
Epoll允许单个线程或进程在一长串网络套接字中注册感兴趣的事件(它支持管道和终端等网络套接字以外的东西，但很少有数千个)。然后epoll_wait调用将阻塞，直到其中一个准备好读取或写入。使用epoll的单个线程可以处理数以万计的并发(大多数是空闲)请求。

epoll的缺点是它改变了应用程序的体系结构。而不是处理每个连接直接{读取请求，处理，写响应}，你现在有一个主循环更类似于一个游戏引擎。代码变成:
```bash
loop
 epoll_wait on all the connections
 for each of the ready connections:
   continue from where you left off
```
您可能已经完成了在一个就绪套接字上读取请求的部分工作，也完成了在另一个套接字上编写响应的部分工作。您必须记住您的状态，只执行套接字在不阻塞的情况下可以接受的I/O，然后再次执行epoll_wait。Go以及c#、Javascript和Rust等语言中的“async/await”模型之所以受欢迎，很大程度上是因为它们隐藏了事件循环，允许你编写直线代码，就好像你仍然在做每连接一个线程。

## 最后

如果没有epoll，要么今天的互联网经济看起来会完全不同(每台机器的请求更少，所以更多的机器，花费更多的钱)，要么我们将在BSD上运行我们的服务器。如果没有BSD的kqueue(比epoll早两年)，我们真的会陷入麻烦，因为唯一的替代方案是专有的(Solaris 8中的/dev/poll和Windows NT 3.5中的I/O Completion Ports)。

epoll自最初发布以来已经得到了改进，特别是epollonshot和EPOLLEXCLUSIVE标志，但核心API保持不变。epoll解决了Linux上的C10K问题，它为互联网提供了动力，使我们能够建立快速而廉价的互联网服务。

## 附录：
- 在epoll之前，Linux有poll和select。它们被设计用来处理少量的文件描述符，它们在这个计数上缩放为0 (n)。epoll的尺度为0(1)。Kerrisk的性能数据显示，poll和select在超过数百个文件描述符时就无法使用，而epoll在超过数万个文件描述符时仍然保持快速运行。

- 在epoll之前，Linux也有信号驱动的I/O。引用UNIX网络编程:不幸的是，信号驱动的I/O对于TCP套接字几乎是无用的





























