---

title: bean的scope
author: John Doe
tags:
  - scope
  - ''
categories:
  - Spring
  - 'Spring '
date: 2022-03-03 22:23:00
---


BeanFactory除了拥有作为IoC Service Provider的职责，作为一个轻量级容器，它还有着其他一些
职责，其中就包括对象的生命周期管理。


Spring容器最初提供了两种bean的scope类型：singleton和prototype，但发布2.0之后，又引入了另外三种scope类型，即request、session和global session类型。不过这三种类型有所限制，只能在Web应
用中使用。也就是说，只有在支持Web应用的ApplicationContext中使用这三个scope才是合理的。

1、singleton：标记为拥有singleton scope的对象定义，在Spring的IoC容器中只存在一个实例，所有对该对象的引用将共享这个实例。该实例从容器启动，并因为第一次被请求而初始化之后，将一直存活到容器退出，也就是说，它与IoC容器“几乎”拥有相同的“寿命”。

（注意：需要注意的一点是，不要因为名字的原因而与GoF所提出的Singleton模式相混淆，二者的语意是
不同的：标记为singleton的bean是由容器来保证这种类型的bean在同一个容器中只存在一个共享实例；
而Singleton模式则是保证在同一个Classloader中只存在一个这种类型的实例。）

2、 prototype：针对声明为拥有prototype scope的bean定义，容器在接到该类型对象的请求的时候，会每次都重新
生成一个新的对象实例给请求方。虽然这种类型的对象的实例化以及属性设置等工作都是由容器负责
的，但是只要准备完毕，并且对象实例返回给请求方之后，容器就不再拥有当前返回对象的引用，请
求方需要自己负责当前返回对象的后继生命周期的管理工作，包括该对象的销毁。也就是说，容器每
次返回给请求方一个新的对象实例之后，就任由这个对象实例“自生自灭”了。

3、 request：Spring容器，即XmlWebApplicationContext会为每个HTTP请求创建一个全新的RequestProcessor对象供当前请求使用，当请求结束后，该对象实例的生命周期即告结束。当同时有10个HTTP
请求进来的时候，容器会分别针对这10个请求返回10个全新的RequestProcessor对象实例，且它们
之间互不干扰。从不是很严格的意义上说，request可以看作prototype的一种特例，除了场景更加具体
之外，语意上差不多。



4、session：对于Web应用来说，放到session中的最普遍的信息就是用户的登录信息，对于这种放到session中
的信息，我们可使用如下形式指定其scope为session

5、global session：global session只有应用在基于portlet的Web应用程序中才有意义，它映射到portlet的global范围的 3 
session。如果在普通的基于servlet的Web应用中使用了这个类型的scope，容器会将其作为普通的session
类型的scope对待。





