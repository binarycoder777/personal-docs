---

title: IoC Service Provider 的职责
author: John Doe
tags:
  - IoC Service Provider
categories:
  - Spring
date: 2022-03-03 18:27:00
---


IoC Service Provider的职责相对来说比较简单，主要有两个：业务对象的构建管理和业务对象间
的依赖绑定。

 业务对象的构建管理。在IoC场景中，业务对象无需关心所依赖的对象如何构建如何取得，但这部分工作始终需要有人来做。所以，IoC Service Provider需要将对象的构建逻辑从客户端对象那里剥离出来，以免这部分逻辑污染业务对象的实现。

 业务对象间的依赖绑定。对于IoC Service Provider来说，这个职责是最艰巨也是最重要的，这是它的最终使命之所在。如果不能完成这个职责，那么，无论业务对象如何的“呼喊”，也不
会得到依赖对象的任何响应（最常见的倒是会收到一个NullPointerException）。IoC Service Provider通过结合之前构建和管理的所有业务对象，以及各个业务对象间可以识别的依赖关系，将这些对象所依赖的对象注入绑定，从而保证每个业务对象在使用的时候，可以处于就绪状
态。