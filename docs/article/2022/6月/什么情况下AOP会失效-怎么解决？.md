---

title: '什么情况下AOP会失效,怎么解决？'
author: John Doe
tags:
  - AOP
  - 面试题
categories:
  - Spring
date: 2022-03-10 08:37:00
---

1、方法是private

2、目标类没有配置为Bean

3、切点表达式没有写正确

4、jdk动态代理下内部调用不会触发AOP（

原因：

内部进行自调用，是走的实例对象，而不是代理对象。

解决：

1、在本类中自动注入当前的bean

2、@EnableAspectJAutoProxy(exposProxy = true)

设置暴露当前代理对象到本地线程，可以通过AopContent.currentProxy()拿到当前的动态代理对象。
）

