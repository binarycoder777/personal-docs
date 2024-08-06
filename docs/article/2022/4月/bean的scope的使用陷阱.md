---

title: bean的scope的使用陷阱
author: John Doe
tags:
  - scop
categories:
  - Spring
date: 2022-03-03 23:48:00
---

我们知道，拥有prototype类型scope的bean，在请求方每次向容器请求该类型对象的时候，容器都会返回一个全新的该对象实例。但是对于在类A中定义成员变量类B，并且通过setter注入类B，并getter返回类B时，会存在每次返回的对象都是同一个对象。


原因在于：虽然A拥有prototype类型的scope，但当容器将一个B的实例注入
A之后，A就会一直持有这个FXNewsBean实例的引用。虽然每
次输出都调用了getNewsBean()方法并返回了 FXNewsBean 的实例，但实际上每次返回的都是A持有的容器第一次注入的实例。这就是问题之所在。换句话说，第一个实例注入后，A再也没有重新向容器申请新的实例。所以，容器也不会重新为其注入新的B类型的实例。


解决的方案就在于保证get方法每次
从容器中取得新的B实例，而不是每次都返回其持有的单一实例。

1、方法注入：Spring容器提出了一种叫做方法注入（Method Injection）的方式，可以帮助我们解决上述问题。
我们所要做的很简单，只要让getNewsBean方法声明符合规定的格式，并在配置文件中通知容器，当
该方法被调用的时候，每次返回指定类型的对象实例即可。也就是说，该方法必须能够被子类实现或者覆写，因为容器会为我们要进行方法注入的对象使用
Cglib动态生成一个子类实现，从而替代当前对象。

2、使用BeanFactoryAware接口：
我们知道，即使没有方法注入，只要在实现 get方法的时候，能够保证每次调用BeanFactory的getBean("newsBean")，就同样可以每次都取得新的FXNewsBean对象实例。
Spring框架提供了一个BeanFactoryAware接口，容器在实例化实现了该接口的bean定义的过程
中，会自动将容器本身注入该bean。这样，该bean就持有了它所处的BeanFactory的引用

3、 使用ObjectFactoryCreatingFactoryBean：ObjectFactoryCreatingFactoryBean是Spring提供的一个FactoryBean实现，它返回一个
ObjectFactory实例。从ObjectFactoryCreatingFactoryBean返回的这个ObjectFactory实例可以
为我们返回容器管理的相关对象。实际上， ObjectFactoryCreatingFactoryBean 实现了
BeanFactoryAware接口，它返回的ObjectFactory实例只是特定于与Spring容器进行交互的一个实现
而已。使用它的好处就是，隔离了客户端对象对BeanFactory的直接引用。

4、方法替换：与方法注入只是通过相应方法为主体对象注入依赖对象不同，方法替换更多体现在方法的实现层
面上，它可以灵活替换或者说以新的方法实现覆盖掉原来某个方法的实现逻辑。基本上可以认为，方
法替换可以帮助我们实现简单的方法拦截功能。

首先，我们需要给出org.springframework.beans.factory.support.MethodReplacer的实现
类，在这个类中实现将要替换的方法逻辑。

有了要替换的逻辑之后，我们就可以把这个逻辑通过< replaced-method>配置到FXNewsProvider的bean定义中，使其生效。

最后需要强调的是，这种方式刚引入的时候执行效率不是很高。而且，当你充分了解并应用Spring 
AOP之后，我想你也不会再回头求助这个特色功能。不过，怎么说这也是一个选择，场景合适的话，
为何不用呢？
哦，如果要替换的方法存在参数，或者对象存在多个重载的方法，可以在< replaced-method>内
部通过< arg-type>明确指定将要替换的方法参数类型。