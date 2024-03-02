


# 关于ResolvableTypeProvider

> 书读百遍，其义自现。每个阶段重新回过去看以前的知识点，总是有着不同的体会。最开始学习Java的时候，对于泛型，是怎么去使用，后面看书Java核心技术卷1，对泛型有了进一步了解，但更多的还是停留在表面。而今天在使用Spring的事件机制的时候，了解到了Spring对泛型擦除的优雅解决方案：ResolvableTypeProvider，经过一番折腾，又重新拾起了对泛型的一些遗落的知识点...


## 概述

在开始ResolvableTypeProvider之前，还是希望回顾一下【[Java的泛型机制](/docs\book\Java语言系列\Java核心技术卷Ⅰ\泛型程序设计.md)】，因为ResolvableTypeProvider就是Spring中优雅解决泛型擦除问题的。

在目前主流的编程语言中，编译器主要有以下两种处理泛型的方法：
1.Code specialization：使用这种方法，每当实例化一个泛型类的时候都会产生一份新的字节代码，例如，对于泛型 ArrayList，当使用 ArrayList`<String>`、ArrayList`<Integer>`初始化两个实例的时候，就会针对 String 与 Integer 生成两份单独的代码。
C++ 语言中的模板正是采用这种方式实现的，显然这种方法会导致代码膨胀（code bloat），从而浪费空间。

2) Code sharing
使用这种方式，会对每个泛型类只生成唯一的一份目标代码，所有泛型的实例会被映射到这份目标代码上，在需要的时候执行特定的类型检查或类型转换。

Code specialization 的一个弊端是在引用类型系统中，浪费空间，因为引用类型集合中元素本质上都是一个指针，没必要为每个类型都产生一份执行代码。而这也是 Java 编译器中采用 Code sharing 方式处理泛型的主要原因。这种方式显然比较省空间，而 Java 就是采用这种方式来实现的。

如何将多种泛型类型实例映射到唯一的字节码中呢？Java 是通过类型擦除来实现的。

Java 泛型擦除（类型擦除）是指在编译器处理带泛型定义的类、接口或方法时，会在字节码指令集里抹去全部泛型类型信息，泛型被擦除后在字节码里只保留泛型的原始类型（raw type）。

类型擦除的关键在于从泛型类型中清除类型参数的相关信息，然后在必要的时候添加类型检查和类型转换的方法。

原始类型是指抹去泛型信息后的类型，在 Java 语言中，它必须是一个引用类型（非基本数据类型），一般而言，它对应的是泛型的定义上界。

> 示例：`<T>`中的 T 对应的原始泛型是 Object，`<T extends String>` 对应的原始类型就是 String。

具体就不在这里过多叙述关于java泛型的内容了【想详细了解可以移步[Java的泛型机制](/docs\book\Java语言系列\Java核心技术卷Ⅰ\泛型程序设计.md)】，下面开始进入正题Spring是如何解决泛型擦除，没错，就是标题提到的ResolvableTypeProvider。

## Spring的事件机制

第一次看ResolvableTypeProvider这个词是在Spring的事件机制中，相信熟悉Spring的同学都知道，ApplicationEvent类和ApplicationListener接口提供了ApplicationContext中的事件处理。如果一个bean实现了ApplicationListener接口，然后它被部署到上下问中，那么每次ApplicationEvent发布到ApplicationContext中时，bean都会收到通知。本质上，这是观察者模型。

> 从Spring 4.2开始，事件的基础得到了重要的提升，并提供了基于注解模型及任意事件发布的能力，这个对象不一定非要继承ApplicationEvent。当这个对象被发布时，我们把他包装在事件中。

Spring也提供了如ContextRefreshedEvent	、ContextStartedEvent、ContextClosedEvent等的标准事件。用于开发人员介入容器的整个生命周期，去做灵活的配置更改等。我们也可以自己去实现自己的业务事件。

``` java
public class BlackListEvent extends ApplicationEvent {

    private final String address;
    private final String test;

    public BlackListEvent(Object source, String address, String test) {
        super(source);
        this.address = address;
        this.test = test;
    }

    // accessor and other methods...

}
```
然后通过实现ApplicationEventPublisherAware接口并把它注册为一个Spring bean的时候它就完成事件发布

``` java
public class EmailService implements ApplicationEventPublisherAware {

    private List<String> blackList;
    private ApplicationEventPublisher publisher;

    public void setBlackList(List<String> blackList) {
        this.blackList = blackList;
    }

    public void setApplicationEventPublisher(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    public void sendEmail(String address, String text) {
        if (blackList.contains(address)) {
            BlackListEvent event = new BlackListEvent(this, address, text);
            publisher.publishEvent(event);
            return;
        }
        // send email...
    }

}
```
对应的Listener则如下:
``` java
public class BlackListNotifier implements ApplicationListener<BlackListEvent> {

    private String notificationAddress;

    public void setNotificationAddress(String notificationAddress) {
        this.notificationAddress = notificationAddress;
    }

    public void onApplicationEvent(BlackListEvent event) {
        // notify appropriate parties via notificationAddress...
    }

}
```


请注意，ApplicationListener通常用你自定义的事件BlackListEvent类型参数化的。这意味着onApplicationEvent()方法可以保持类型安全，避免向下转型的需要。您可以根据需要注册许多的事件侦听器，但请注意，默认情况下，事件侦听器将同步接收事件。这意味着publishEvent()方法会阻塞直到所有的监听者都处理完。这种同步和单线程方法的一个优点是，如果事务上下文可用，它就会在发布者的事务上下文中处理。如果必须需要其他的时间发布策略，请参考javadoc的 Spring ApplicationEventMulticaster 接口。


## 基于注解的事件监听器

从Spring 4.2开始，一个事件监听器可以通过EventListener注解注册在任何managed bean的公共方法上。BlackListNotifier可以重写如下：

``` java
public class BlackListNotifier {

    private String notificationAddress;

    public void setNotificationAddress(String notificationAddress) {
        this.notificationAddress = notificationAddress;
    }

    @EventListener
    public void processBlackListEvent(BlackListEvent event) {
        // notify appropriate parties via notificationAddress...
    }

}
```

如上所示，方法签名实际上会推断出它监听的是哪一个类型的事件。这也适用于泛型嵌套，只要你在过滤的时候可以根据泛型参数解析出实际的事件。

如果你的方法需要监听好几个事件或根本没有参数定义它，事件类型也可以用注解本身指明：
``` java
@EventListener({ContextStartedEvent.class, ContextRefreshedEvent.class})
public void handleContextStart() {

}
```

对特殊的时间调用方法，根据定义的SpEL表达式来匹配实际情况，通过条件属性注解，
也可以通过condition注解来添加额外的运行过滤，它对一个特殊事件的方法实际调用是根据它是否匹配condition注解所定义的SpEL表达式。

例如，只要事件的测试属性等于foo，notifier可以被重写为只被调用：

``` java
@EventListener(condition = "#blEvent.test == 'foo'")
public void processBlackListEvent(BlackListEvent blEvent) {
    // notify appropriate parties via notificationAddress...
}
```

**异步监听器**

如果你希望一个特定的监听器去异步处理事件，只需要重新使用常规的@Async支持：
```java
@EventListener
@Async
public void processBlackListEvent(BlackListEvent event) {
    // BlackListEvent is processed in a separate thread
}
```
当使用异步事件的时候有下面两个限制：

- 如果事件监听器抛出异常，则不会将其传播给调用者，查看AsyncUncaughtExceptionHandler获取详细信息。
- 此类事件监听器无法发送回复。如果你需要将处理结果发送给另一个时间，注入ApplicationEventPublisher里面手动发送事件。

**顺序的监听器**

如果你需要一个监听器在另一个监听器调用前被调用，只需要在方法声明上添加@Order注解：
```java
@EventListener
@Order(42)
public void processBlackListEvent(BlackListEvent event) {
    // notify appropriate parties via notificationAddress...
}
```

## 泛型事件
上面讲的都是Spring中关于事件机制的一些知识，有点啰嗦了，但也算是重新去巩固了一下，温故而知新嘛。下面则是本章的重点了，Spring事件机制中使用的泛型机制，以及如何优雅解决泛型擦除。

考虑EntityCreatedEvent，T的类型就是你要创建的真实类型。你可以创建下面的监听器定义，它只接受Person类型的EntityCreatedEvent：

``` java
@EventListener
public void onPersonCreated(EntityCreatedEvent<Person> event) {
...
}
```

由于触发了事件解析泛型参数导致的类型擦除，只有在触发了事件解析事件监听过器滤的泛型参数(类似于PersonCreatedEvent继承了EntityCreatedEvent { …​ })，上述监听才会生效。

即在某些情况下，如果所有的时间都遵循相同的结果(采用上述的泛型事件监听)，则可以实现ResolvableTypeProvider解决该问题：

``` java
public class EntityCreatedEvent<T>
        extends ApplicationEvent implements ResolvableTypeProvider {

    public EntityCreatedEvent(T entity) {
        super(entity);
    }

    @Override
    public ResolvableType getResolvableType() {
        return ResolvableType.forClassWithGenerics(getClass(),
                ResolvableType.forInstance(getSource()));
    }
   }
```

具体则是因为通过实现了ResolvableTypeProvider，在运行期动态的获取泛型对应的真正的对象类型，从而解决了编译阶段泛型擦除的问题。


## 使用场景

ResolvableTypeProvider接口在Spring框架中的应用可以极大地增强对泛型信息的处理能力，尤其是在运行时需要解析泛型类型时。以下是几个使用ResolvableTypeProvider的经典例子，它们展示了如何在不同场景下利用这个接口来提高代码的灵活性和类型安全性。

**Spring 事件监听：**
在Spring的事件发布/监听机制中，事件对象可以实现ResolvableTypeProvider来提供确切的泛型事件类型。这使得监听器能够更精确地区分和处理不同类型的事件。

``` java
import org.springframework.context.ApplicationEvent;
import org.springframework.core.ResolvableType;
import org.springframework.core.ResolvableTypeProvider;

public class CustomEvent<T> extends ApplicationEvent implements ResolvableTypeProvider {

    private final T eventContent;

    public CustomEvent(Object source, T eventContent) {
        super(source);
        this.eventContent = eventContent;
    }

    public T getEventContent() {
        return eventContent;
    }

    @Override
    public ResolvableType getResolvableType() {
        // 返回具体的泛型类型
        return ResolvableType.forClassWithGenerics(getClass(), ResolvableType.forInstance(eventContent));
    }
}
```
这样，当你发布一个CustomEvent`<String>`或CustomEvent`<MyCustomType>`时，监听器可以通过泛型类型来区分不同的事件。

**泛型响应封装：**
在构建REST API时，你可能会想要一个统一的响应结构来封装不同类型的数据。通过实现ResolvableTypeProvider，可以使得这个响应结构能够携带具体的泛型类型信息。

```java
import org.springframework.core.ResolvableType;
import org.springframework.core.ResolvableTypeProvider;

public class ApiResponse<T> implements ResolvableTypeProvider {

    private T data;
    private String message;

    // 构造器、getter和setter省略

    @Override
    public ResolvableType getResolvableType() {
        return ResolvableType.forClassWithGenerics(getClass(), ResolvableType.forInstance(data));
    }
}
```

**泛型容器类：**
在实现自定义的泛型容器类时，例如一个用于特定业务逻辑的泛型缓存或工厂，通过ResolvableTypeProvider可以在运行时准确地获取泛型类型信息，以便进行类型安全的操作。

```java
import org.springframework.core.ResolvableType;
import org.springframework.core.ResolvableTypeProvider;

public class GenericContainer<T> implements ResolvableTypeProvider {
    private T value;

    public GenericContainer(T value) {
        this.value = value;
    }

    // getter和setter省略

    @Override
    public ResolvableType getResolvableType() {
        // 提供泛型参数的类型信息
        return ResolvableType.forClassWithGenerics(getClass(), ResolvableType.forInstance(value));
    }
}
```


## 最后

通过这些例子，我们可以看到ResolvableTypeProvider在不同场景下的应用，它帮助Spring框架在运行时解析泛型信息，从而实现更精确的类型处理和更高的代码灵活性。这些模式可以被广泛应用于需要在运行时处理泛型信息的任何场景中。

同时也应该认识到，泛型虽然方便了我们日常的设计开发，但也应该注意到泛型擦除带来的问题，以及该如何避免和解决。



