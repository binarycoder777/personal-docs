---

title: AOP的常见应用案例
author: John Doe
tags:
  - 应用
  - AOP
categories:
  - Spring
date: 2022-03-08 19:26:00
---

1、异常处理：

通常将Error和RuntimeException及其子类称作非受检异常。（编译器不会对这些类型的异常进行编译期检查），而其他的则为受检异常（编写程序期间就应进行处理）。Fault Barrier即为对非受检异常的处理。

对于这些非受检异常的处理可以归并于溢出进行处理，而不是让他们散落到系统的各处。介于此，我们可以通过实现一个Aspect来处理，让其对系统中所有可能的falut情况进行统一的处理。而这个专职于处理Falut的Aspect即为Falut Barrier。

2、安全检查：

Filter是Servlet规范为我们提供的一种AOP支持。通过它我们可以为基于servlet的web应用添加相应的资源访问控制等等。但是，基于filter的web应用的资源访问控制仅仅是特定领域安全检查需求。而通过AOP，我们可以为任何类型的应用添加安全支持。（Spring Security则是基于Spring的一款强大的安全框架）

3、缓存：

AOP应用的另一个主要场景则是为系统透明地添加缓存支持。缓存可以在很大程度上提升系统性能。为了避免需要添加的缓存实现逻辑影响业务逻辑的实现，我们可以让缓存的实现独立于业务对象的实现外，将系统中的缓存需求通过AOP的Aspect进行封装，只在系统中某个点确切需要缓存的情况下才进行织入。（现在已经有许多现成的Caching产品实现，入EhCache、Redis等）

Spring Modules项目提供了对现有Caching产品的集成，这样可以通过外部声明的方式为系统中的Joinpoint加Caching支持。


