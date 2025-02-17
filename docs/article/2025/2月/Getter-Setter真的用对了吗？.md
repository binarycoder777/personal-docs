---
title: Getter-Setter真的用对了吗？
date: 2025-02-17
---

# Getter-Setter你真的用对了吗

> C语言是我学的第一门语言，但是职业生涯是以Java开始的，许多面向对象开发人员（包括我自己）总是习惯写下面例子的代码（Java为例），或许是因为从接触OOP开始， getter-setter 模式似乎就好像天经地义一样了，以致于一直忽视了一个明显的问题：可变性和状态。
```java
public class Person {
  private String name;
  private int age;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getAge() {
    return age;
  }

  public void setAge(int age) {
    this.age = age;
  }
}
``` 

## 可变性和状态

可变性和状态是代码复杂且难以推理的原因。在查找错误或审查 PR 时，这通常是最难理解的。getter 和 Setter 乍一看只是访问和修改对象属性的常见方式，但它们有几个问题：

- 引入不必要的可变性：允许对象状态随时被修改，使代码难以推理（难以预测 name 或 age 何时被更改）。
- 破坏封装：传统 OOP 认为对象应该隐藏实现细节，但 Getter-Setter 让对象的内部状态暴露给外部代码，违背封装原则。
- 不适用于并发环境：在多线程环境下，如果一个对象的状态可以被随意更改，可能会导致 竞争条件（Race Condition），比如：
```java
Person p = new Person();
Thread t1 = new Thread(() -> p.setAge(30));
Thread t2 = new Thread(() -> p.setAge(40));
t1.start();
t2.start();
System.out.println(p.getAge());  // 30? 40? 难以预测
```
因此，在设计类时，我们应该问自己这个简单的问题：我可以让它不改变吗？

## 不变性

不变性是对象状态在创建后不能被修改的属性。因此，让我们将其应用到上面的代码片段。

```java
public class Person {
  private final String name;
  private final int age;

  public Person(final String name, final int age) {
    this.name = name;
    this.age = age;
  }

  public String getName() {
    return name;
  }

  public int getAge() {
    return age;
  }
}
```

这样：

- name 和 age 一旦赋值，就不会再被修改，代码更安全。
- 线程安全（多个线程访问 Person 实例不会出问题）。
- 逻辑更清晰，避免了 “某个对象的状态是否被修改” 这种难以追踪的问题。

## with 模式 vs. Builder 模式
有时候，我们仍然希望修改对象的一些属性，而又不希望改变原始对象。这时候，可以用 with 模式：

```java
public class Person {
  private final String name;
  private final int age;

  public Person(String name, int age) {
    this.name = name;
    this.age = age;
  }

  public Person withName(String newName) {
    return new Person(newName, this.age);
  }

  public Person withAge(int newAge) {
    return new Person(this.name, newAge);
  }
}
```

或者使用 Builder 模式：
```java
public class Person {
  private final String name;
  private final int age;

  private Person(Builder builder) {
    this.name = builder.name;
    this.age = builder.age;
  }

  public String name() {
    return name;
  }

  public int age() {
    return age;
  }

  public Person withName(String newName) {
    return new Person(new Builder().name(newName).age(this.age));
  }

  public Person withAge(int newAge) {
    return new Person(new Builder().name(this.name).age(newAge));
  }

  public static Builder builder() {
    return new Builder();
  }

  public static class Builder {
    private String name;
    private int age;

    public Builder name(String name) {
      this.name = name;
      return this;
    }

    public Builder age(int age) {
      this.age = age;
      return this;
    }

    public Person build() {
      return new Person(this);
    }
  }
}
```
这样，每次修改都会返回一个新的 Person 实例，而不会改变原来的数据。

## 进一步理解不可变对象
如果想更进一步理解不可变对象的设计模式：

- 可以研究 Java 记录类型（Record）
record 是 Java 14+ 提供的简洁方式来创建不可变对象：
```java
public record Person(String name, int age) {}
```
这比手写 final 变量和 with 方法更方便。

- 了解 Java Streams 和 FP 编程
不可变对象常用于 函数式编程（FP），结合 Java Streams 可以减少副作用：
```java
List<String> names = persons.stream()
    .map(Person::name)
    .collect(Collectors.toList());
```
这避免了对象状态的变化，提高了代码可预测性。

## 放下包袱

书本上学到的知识在实际场景中有着不同的表现，唯有实践才能知道是否真正合适。正如常用的 Getter-Setter 模式，很多时候不管有没有用，似乎都得写上，因为这是 OOP 的“标准”。但实际开发中，我们可能需要考虑更多的因素，比如：Getter-Setter 可能会引入 不必要的可变性、破坏封装、影响并发安全。因此，在设计类时，我们应该问自己这个简单的问题：我是否应该让它不改变？

