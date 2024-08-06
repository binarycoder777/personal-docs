---

title: AOP国家的公民
author: John Doe
tags:
  - AOP
categories:
  - Spring
date: 2022-03-07 18:33:00
---

Joinpoint：在系统运行前，AOP的功能模块都需要编织入OOP的功能模块中。所以，要进行这种编织，我们需要在哪些执行点进行。这些将要在其上执行编织操作的系统执行点即称之为Joinpoint。

Pointcut：Pointcut是Joinpoint的表达方式。将横切逻辑编织入当前系统的过程中，需要参考Pointcut规定的Joinpoint信息，才可以指定应该往系统的哪些Joinpoint上编织横切逻辑。即声明了一个Pointcut就指定了系统中符合条件的一组Joinpoint。

advice：advice是单一横切关注点逻辑的载体，它代表将会编织到Joinpoint的横切逻辑。如果将Aspect比作OOP中的class，那么advice就相当于class中的method。（常见的如before advice、after advice、after returning advice、after throwing advice，after advice、around advice等）

Aspect：Aspect是对系统中横切关注点进行模块化封装的AOP概念实体。通常情况下，Aspect可以含有多个Pointcut以及相关Advice定义。

织入和织入器：织入过程就是“飞架”AOP和OOP的那座桥，只有经过织入过程后，以Aspect模块化的横切关注点才会集成到OOP的现存系统中。而完成织入过程的那个人就是织入器。AspectJ有专门的编译器来完成织入操作，即ajc，所有ajc就是AspectJ完成织入的织入器；JBossAOP采用自定义的类加载器完成最终织入，那么这个类加载器就是他的织入器。SpringAOP使用一组自定义的类来完成最终的织入操作，proxyFactory类则是SpringAOP中最通用的织入器。

目标对象：符合Pointcut所指定的条件，将在织入过程中被织入横切逻辑的对象，称为目标对象。

当把所有这些概念组织到一个场景后，就有如下一副场景图：

   ![upload successful](../images/pasted-127.png)


