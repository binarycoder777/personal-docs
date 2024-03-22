---

---

# ClassPool

ClassPool对象是CtClass对象的容器。一旦创建了CtClass对象，它将永远记录在ClassPool中。这是因为编译器在编译引用由该CtClass表示的类的源代码时可能需要访问CtClass对象。

例如，假设一个新的方法getter()被添加到一个表示Point类的CtClass对象中。稍后，程序尝试编译源代码，包括Point中getter()的方法调用，并使用编译后的代码作为方法体，该方法体将添加到另一个类Line中。如果表示Point的CtClass对象丢失，则编译器无法编译getter()的方法调用。注意，最初的类定义不包括getter()。因此，要正确编译这样的方法调用，ClassPool必须在程序e运行的整个过程中包含CtClass的所有实例

## Avoid out of memory
如果CtClass对象的数量变得惊人地大(这种情况很少发生，因为Javassist试图以各种方式减少内存消耗)，那么ClassPool的这种规范可能会导致巨大的内存消耗。为了避免这个问题，您可以显式地从ClassPool中删除不必要的CtClass对象。如果你在一个CtClass对象上调用detach()，那么这个CtClass对象就会从ClassPool中移除。例如:
```java
CtClass cc = ... ;
cc.writeFile();
cc.detach();
```
在detach()被调用之后，你不能在CtClass对象上调用任何方法。但是，您可以在ClassPool上调用get()来创建表示相同类的CtClass的新实例。如果调用get()， ClassPool将再次读取一个类文件，并新建一个CtClass对象，该对象由get()返回。

另一个想法是偶尔用一个新的替换一个ClassPool，并丢弃旧的。如果旧的ClassPool被垃圾收集，那么包含在该ClassPool中的CtClass对象也被垃圾收集。要创建一个新的ClassPool实例，执行下面的代码片段:
```java
ClassPool cp = new ClassPool(true);
// if needed, append an extra search path by appendClassPath()
```
这将创建一个ClassPool对象，其行为与由ClassPool. getdefault()返回的默认ClassPool一样。注意，ClassPool.getDefault()是为方便而提供的单例工厂方法。它以上面所示的相同方式创建一个ClassPool对象，尽管它保留一个ClassPool实例并重用它。getDefault()返回的ClassPool对象没有特殊的角色。getDefault()是一个方便的方法。

请注意，new ClassPool(true)是一个方便的构造函数，它构造一个ClassPool对象并将系统搜索路径附加到它。调用该构造函数相当于以下代码:
```java
ClassPool cp = new ClassPool();
cp.appendSystemPath();  // or append another path by appendClassPath()
```

## 级联的ClassPools
如果一个程序在web应用服务器上运行，创建多个ClassPool实例可能是必要的;应该为每个类加载器(即容器)创建一个ClassPool实例。程序应该通过调用ClassPool的构造函数而不getDefault()来创建一个ClassPool对象。

多个ClassPool对象可以像java.lang.ClassLoader那样级联。例如：
```java
ClassPool parent = ClassPool.getDefault();
ClassPool child = new ClassPool(parent);
child.insertClassPath("./classes");
```
如果调用child.get()，子ClassPool首先委托给父ClassPool。如果父ClassPool不能找到一个类文件，那么子ClassPool会尝试在./classes目录下找到一个类文件。

如果child.childFirstLookup为true，则子ClassPool在委托给父ClassPool之前尝试查找类文件。例如,
```java
ClassPool parent = ClassPool.getDefault();
ClassPool child = new ClassPool(parent);
child.appendSystemPath();         // the same class path as the default one.
child.childFirstLookup = true;    // changes the behavior of the child.
```

## 更改类名以定义新类

新类可以定义为现有类的副本。下面的程序就是这样做的:
```java
ClassPool pool = ClassPool.getDefault();
CtClass cc = pool.get("Point");
cc.setName("Pair");
```
这个程序首先获得类Point的CtClass对象。然后它调用setName()给CtClass对象一个新的name Pair。在此调用之后，由该CtClass对象表示的类定义中出现的所有类名都从Point更改为Pair。类定义的其他部分不会改变。

注意，CtClass中的setName()改变了ClassPool对象中的一条记录。从实现的角度来看，ClassPool对象是CtClass对象的散列表。setName()改变哈希表中与CtClass对象相关联的键。key从原来的类名更改为新的类名。

因此，如果稍后在ClassPool对象上再次调用get("Point")，那么它永远不会返回变量cc所引用的CtClass对象。ClassPool对象再次读取类文件Point.class，并为类Point构造一个新的CtClass对象。这是因为与名称Point相关联的CtClass对象不再存在。请参阅以下内容:
```java
ClassPool pool = ClassPool.getDefault();
CtClass cc = pool.get("Point");
CtClass cc1 = pool.get("Point");   // cc1 is identical to cc.
cc1.setName("Pair");
CtClass cc2 = pool.get("Pair");    // cc2 is identical to cc.
CtClass cc3 = pool.get("Point");   // cc3 is not identical to cc.
```
cc1和cc2引用的是CtClass的同一个实例，而cc3没有。注意，在执行cc. setname ("Pair")之后，cc1和cc2引用的CtClass对象表示Pair类。

ClassPool对象用于维护类和CtClass对象之间的一对一映射。Javassist从不允许两个不同的CtClass对象表示同一个类，除非创建了两个独立的ClassPool。这是一致性程序转换的一个重要特性。

要创建由ClassPool. getdefault()返回的ClassPool默认实例的另一个副本，请执行以下代码片段(此代码已在上面显示):
```java
ClassPool cp = new ClassPool(true);
```
如果您有两个ClassPool对象，那么您可以从每个ClassPool中获得一个不同的CtClass对象，表示相同的类文件。您可以对这些CtClass对象进行不同的修改，以生成该类的不同版本。

## 为定义新类而重命名冻结的类

一旦CtClass对象被writeFile()或toBytecode()转换为类文件，Javassist将拒绝对该CtClass对象的进一步修改。因此，在表示Point类的CtClass对象转换为类文件之后，您不能将Pair类定义为Point的副本，因为在Point上执行setName()会被拒绝。下面的代码片段是错误的:

```java
ClassPool pool = ClassPool.getDefault();
CtClass cc = pool.get("Point");
cc.writeFile();
cc.setName("Pair");    // wrong since writeFile() has been called.
```
为了避免这个限制，你应该在ClassPool中调用getAndRename()。例如,
```java
ClassPool pool = ClassPool.getDefault();
CtClass cc = pool.get("Point");
cc.writeFile();
CtClass cc2 = pool.getAndRename("Point", "Pair");
```
如果调用getAndRename()， ClassPool首先读取Point.class以创建一个表示Point类的新CtClass对象。但是，在将CtClass对象记录在哈希表中之前，它将CtClass对象从Point重命名为Pair。因此，getAndRename()可以在代表Point类的CtClass对象上调用writeFile()或toBytecode()之后执行。














