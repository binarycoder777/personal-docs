---

---

# Class loader

如果事先知道需要修改哪些类，最简单的修改方法如下:
1. 通过调用ClassPool.get()获取一个CtClass对象。
2. 修改它，然后
3. 在该CtClass对象上调用writeFile()或toBytecode()来获取修改后的类文件。

如果在加载时确定是否修改类，则用户必须使Javassist与类加载器协作。Javassist可以与类装入器一起使用，这样就可以在装入时修改字节码。Javassist的用户可以定义他们自己版本的类装入器，但是他们也可以使用Javassist提供的类装入器。

## CtClass中的toClass方法
CtClass提供了一个方便的方法toClass()，它请求当前线程的上下文类加载器来加载由CtClass对象表示的类。要调用此方法，调用方必须具有适当的权限;否则，可能会抛出SecurityException。

下面的程序展示了如何使用toClass():
```java
public class Hello {
    public void say() {
        System.out.println("Hello");
    }
}

public class Test {
    public static void main(String[] args) throws Exception {
        ClassPool cp = ClassPool.getDefault();
        CtClass cc = cp.get("Hello");
        CtMethod m = cc.getDeclaredMethod("say");
        m.insertBefore("{ System.out.println(\"Hello.say():\"); }");
        Class c = cc.toClass();
        Hello h = (Hello)c.newInstance();
        h.say();
    }
}
```
Test.main()在Hello中的say()方法体中插入对println()的调用。然后，它构造修改后的Hello类的实例，并在该实例上调用say()。

注意，上面的程序依赖于这样一个事实，即在调用toClass()之前从未加载过Hello类。如果没有，JVM将在toClass()请求加载修改后的Hello类之前加载原始的Hello类。因此，加载修改后的Hello类会失败(抛出LinkageError)。例如，如果Test中的main()是这样的:
```java
public static void main(String[] args) throws Exception {
    Hello orig = new Hello();
    ClassPool cp = ClassPool.getDefault();
    CtClass cc = cp.get("Hello");
        :
}
```
然后在main的第一行加载原始的Hello类，并且调用toClass()会抛出异常，因为类加载器不能同时加载两个不同版本的Hello类。

如果程序运行在诸如JBoss和Tomcat之类的应用程序服务器上，那么toClass()使用的上下文类装入器可能不合适。在这种情况下，您将看到一个意外的ClassCastException。要避免此异常，必须显式地为toClass()提供适当的类装入器。例如，如果bean是你的session bean对象，那么下面的代码是可行的:
```java
CtClass cc = ...;
Class c = cc.toClass(bean.getClass().getClassLoader());
```
您应该为toClass()提供加载了程序的类装入器(在上面的示例中，是bean对象的类)。

提供toClass()是为了方便。如果需要更复杂的功能，应该编写自己的类装入器。

## Java中的类加载

在Java中，多个类装入器可以共存，每个类装入器创建自己的名称空间。不同的类加载器可以用相同的类名加载不同的类文件。加载的两个类被视为不同的类。这个特性使我们能够在单个JVM上运行多个应用程序，即使这些程序包含具有相同名称的不同类。

>**注意:**JVM不允许动态地重新加载类。一旦类装入器装入一个类，它就不能在运行时重新装入该类的修改版本。因此，在JVM加载一个类之后，您不能更改它的定义。然而，JPDA (Java平台调试器体系结构)提供了有限的重新加载类的能力。即[字节码插桩机制](/docs/article/2024/3月/Instrument-字节码插桩.md)。

如果同一个类文件由两个不同的类加载器加载，JVM就会生成两个具有相同名称和定义的不同类。这两个类被认为是不同的。由于这两个类不相同，一个类的实例不能赋值给另一个类的变量。两个类之间的强制转换操作失败并抛出ClassCastException。
```java
MyClassLoader myLoader = new MyClassLoader();
Class clazz = myLoader.loadClass("Box");
Object obj = clazz.newInstance();
Box b = (Box)obj;    // this always throws ClassCastException.
```
Box类由两个类加载器加载。假设类装入器CL装入包含以下代码片段的类。由于此代码片段引用了MyClassLoader、Class、Object和Box，所以CL也会加载这些类(除非它委托给另一个类加载器)。因此变量b的类型是由CL加载的Box类。另一方面，myLoader也加载Box类。对象obj是myLoader加载的Box类的一个实例。因此，最后一条语句总是抛出ClassCastException，因为obj的类是Box类的不同版本

多个类加载器形成树形结构。除了引导加载器之外，每个类加载器都有一个父类加载器，父类加载器通常加载该子类加载器的类。由于装入类的请求可以沿着类装入器的层次结构进行委托，因此类可以由您不请求装入类的类装入器装入。因此，被请求装入类C的类装入器可能与实际装入类C的装入器不同。为了区分，我们称前者装入器为C的启动器，称后者装入器为真正的装入器

此外，如果一个类装入器CL被请求装入一个类C (C的启动器)委托给父类装入器PL，那么该类装入器CL永远不会被请求装入类C定义中引用的任何类。CL不是这些类的启动器。相反，父类装入器PL成为它们的启动器，并被请求装入它们。类C的定义所引用的类是由C的实际装入器装入的。

```java
public class Point {    // loaded by PL
    private int x, y;
    public int getX() { return x; }
        :
}

public class Box {      // the initiator is L but the real loader is PL
    private Point upperLeft, size;
    public int getBaseX() { return upperLeft.x; }
        :
}

public class Window {    // loaded by a class loader L
    private Box box;
    public int getBaseX() { return box.getBaseX(); }
}
```
假设一个类Window是由一个类加载器L加载的，Window的启动器和真正的加载器都是L。因为Window的定义是指Box, JVM会请求L加载Box。这里，假设L将这个任务委托给父类加载器PL, Box的启动器是L，而真正的加载器是PL。在这种情况下，Point的启动器不是L，而是PL，因为它和Box的真正加载器是一样的。因此，永远不会请求L加载Point。

接下来，让我们考虑一个稍微修改过的示例。
```java
public class Point {
    private int x, y;
    public int getX() { return x; }
        :
}

public class Box {      // the initiator is L but the real loader is PL
    private Point upperLeft, size;
    public Point getSize() { return size; }
        :
}

public class Window {    // loaded by a class loader L
    private Box box;
    public boolean widthIs(int w) {
        Point p = box.getSize();
        return w == p.getX();
    }
}
```

现在，窗口的定义也指point。在这种情况下，如果请求类加载器L加载Point，它也必须委托给PL。必须避免让两个类加载器双重加载同一个类。两个加载器中的一个必须委托给另一个。

如果加载Point时L没有委托给PL, widthIs()将抛出ClassCastException。由于Box的实际加载器是PL，因此Box中引用的Point也被PL加载。因此，getSize()的结果值是PL加载的Point实例，而widthIs()中变量p的类型是l加载的Point。JVM将它们视为不同的类型，因此由于类型不匹配而抛出异常。

这种行为有些不方便，但却是必要的。如果有以下语句:
```java
Point p = box.getSize();
```
没有抛出异常，那么windows的程序员就可以打破Point对象的封装。例如，字段x在PL加载的Point中是私有的，但是，如果L加载Point, Window类可以直接访问x的值，定义如下:
```java
public class Point {
    public int x, y;    // not private
    public int getX() { return x; }
        :
}
```
要了解Java中类加载器的更多细节，下面的文章会有所帮助:
```
Sheng Liang and Gilad Bracha, "Dynamic Class Loading in the Java Virtual Machine",
ACM OOPSLA'98, pp.36-44, 1998.
```

## Using javassist.Loader
Javassist提供了一个类加载器Javassist.loader。这个类装入器使用javassist。用于读取类文件的ClassPool对象。

例如，javassist.Loader可用于加载用Javassist修改过的特定类。

```java
import javassist.*;
import test.Rectangle;

public class Main {
  public static void main(String[] args) throws Throwable {
     ClassPool pool = ClassPool.getDefault();
     Loader cl = new Loader(pool);

     CtClass ct = pool.get("test.Rectangle");
     ct.setSuperclass(pool.get("test.Point"));

     Class c = cl.loadClass("test.Rectangle");
     Object rect = c.newInstance();
         :
  }
}
```
这个程序修改一个类test.Rectangle的超类。其被设置为test.Point。然后，该程序加载修改后的类，并创建测试的新实例。

如果用户希望在加载类时按需修改该类，则可以向javassist.Loader添加事件侦听器。当类加载器加载类时，将通知添加的事件侦听器。事件监听器类必须实现以下接口:
```java
public interface Translator {
    public void start(ClassPool pool)
        throws NotFoundException, CannotCompileException;
    public void onLoad(ClassPool pool, String classname)
        throws NotFoundException, CannotCompileException;
}
```
将事件侦听器添加到javassist时调用start()方法。在javassist.Loader中通过addTranslator()加载器对象。在javassist之前调用onLoad()方法。装入器装入一个类。onLoad()可以修改被加载类的定义。

例如，下面的事件侦听器在加载所有类之前将它们更改为公共类。

```java
public class MyTranslator implements Translator {
    void start(ClassPool pool)
        throws NotFoundException, CannotCompileException {}
    void onLoad(ClassPool pool, String classname)
        throws NotFoundException, CannotCompileException
    {
        CtClass cc = pool.get(classname);
        cc.setModifiers(Modifier.PUBLIC);
    }
}
```

注意，自javassist以来，onLoad()不必调用toBytecode()或writeFile()。Loader调用这些方法来获取类文件。

要用MyTranslator对象运行一个应用程序类MyApp，编写一个主类如下:

```java
import javassist.*;

public class Main2 {
  public static void main(String[] args) throws Throwable {
     Translator t = new MyTranslator();
     ClassPool pool = ClassPool.getDefault();
     Loader cl = new Loader();
     cl.addTranslator(pool, t);
     cl.run("MyApp", args);
  }
}
```
要运行此程序，请执行:
```bash
% java Main2 arg1 arg2...
```
注意，像MyApp这样的应用程序类不能访问像Main2、MyTranslator和ClassPool这样的加载器类，因为它们是由不同的加载器加载的。应用程序类由javassist加载。而像Main2这样的加载器类是默认的Java类加载器。

javassist.Loader以与java.lang.ClassLoader不同的顺序搜索类。ClassLoader首先将装入操作委托给父类装入器，然后仅在父类装入器找不到类时才尝试装入这些类。另一方面，javassist。装入器在委托给父类装入器之前尝试装入类。它只在下列情况下委托:
- 在ClassPool对象上调用get()无法找到这些类
- 或者这些类已经通过使用delegateLoadingOf()指定由父类加载器加载

这个搜索顺序允许Javassist加载修改过的类。但是，如果由于某种原因无法找到修改过的类，它将委托给父类装入器。一旦一个类被父类装入器装入，在该类中引用的其他类也将被父类装入器装入，因此它们永远不会被修改。回想一下，类C中引用的所有类都是由C的实际加载器加载的。如果您的程序无法加载修改后的类，您应该确保使用该类的所有类是否都已被javassist.Loader加载。

## Writing a class loader

``` java
import javassist.*;

public class SampleLoader extends ClassLoader {
    /* Call MyApp.main().
     */
    public static void main(String[] args) throws Throwable {
        SampleLoader s = new SampleLoader();
        Class c = s.loadClass("MyApp");
        c.getDeclaredMethod("main", new Class[] { String[].class })
         .invoke(null, new Object[] { args });
    }

    private ClassPool pool;

    public SampleLoader() throws NotFoundException {
        pool = new ClassPool();
        pool.insertClassPath("./class"); // MyApp.class must be there.
    }

    /* Finds a specified class.
     * The bytecode for that class can be modified.
     */
    protected Class findClass(String name) throws ClassNotFoundException {
        try {
            CtClass cc = pool.get(name);
            // modify the CtClass object here
            byte[] b = cc.toBytecode();
            return defineClass(name, b, 0, b.length);
        } catch (NotFoundException e) {
            throw new ClassNotFoundException();
        } catch (IOException e) {
            throw new ClassNotFoundException();
        } catch (CannotCompileException e) {
            throw new ClassNotFoundException();
        }
    }
}
```
MyApp是一个应用程序。要执行此程序，首先将类文件放在./class目录下，该目录不能包含在类搜索路径中。否则，MyApp.class将被默认的系统类加载器加载，它是SampleLoader的父加载器。目录名./class由构造函数中的insertClassPath()指定。如果需要，可以选择不同的名称而不是。/class。然后按以下步骤做:
```bash
% java SampleLoader
```
类加载器加载MyApp (./class/MyApp.class)类，并使用命令行参数调用MyApp.main()。

这是使用Javassist最简单的方法。但是，如果编写更复杂的类装入器，则可能需要详细了解Java的类装入机制。例如，上面的程序将MyApp类放在与类SampleLoader所属的名称空间分开的名称空间中，因为这两个类是由不同的类加载器加载的。因此，MyApp类不能直接访问SampleLoader类。

## 修改系统类

像java.lang.String这样的系统类不能由系统类装入器以外的类装入器装入。因此，使用SampleLoader或javassist。上面显示的加载器不能在加载时修改系统类。

如果应用程序需要这样做，则必须静态地修改系统类。例如，下面的程序在java.lang.String中添加了一个新的字段hiddenValue:
```java
ClassPool pool = ClassPool.getDefault();
CtClass cc = pool.get("java.lang.String");
CtField f = new CtField(CtClass.intType, "hiddenValue", cc);
f.setModifiers(Modifier.PUBLIC);
cc.addField(f);
cc.writeFile(".");
```
这个程序生成一个文件"./java/lang/String.class"。

要用这个修改过的String类运行MyApp程序，请执行以下操作:

```bash
% java -Xbootclasspath/p:. MyApp arg1 arg2...
```
假设MyApp的定义如下:
```java
public class MyApp {
    public static void main(String[] args) throws Exception {
        System.out.println(String.class.getField("hiddenValue").getName());
    }
}
```
如果修改后的String类被正确加载，MyApp会打印hiddenValue。

>注意:不应该部署使用这种技术来覆盖rt.jar中的系统类的应用程序，因为这样做会违反Java 2 Runtime Environment二进制代码许可。

## 在运行时重新加载类

如果JVM启动时启用了JPDA (Java Platform Debugger Architecture, Java平台调试器体系结构)，则类是可动态重新加载的。JVM加载类之后，可以卸载旧版本的类定义，并重新加载新版本的类定义。也就是说，可以在运行时动态修改该类的定义。但是，新的类定义必须在某种程度上与旧的类定义兼容。JVM不允许在两个版本之间更改模式。它们具有相同的一组方法和字段。

Javassist提供了一个方便的类，用于在运行时重新加载类。有关更多信息，请参阅javassist.tools.HotSwapper的API文档。










