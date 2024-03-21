---
outline: 3
---

# Core API

## Classes

### 结构

已编译class的总体结构非常简单。实际上，与原生编译应用程序不同，已编译class中保留了来自源代码的结构信息和几乎所有符号。事实上，已编译class中包含如下各部分：

- 专门一部分，描述类的修饰符（比如public和private）、名字、超类、接口和注释。
- 类中声明的每个字段各有一部分。每一部分描述一个字段的修饰符、名字、类型和注释。
- 类中声明的每个方法及构造器各有一部分。每一部分描述一个方法的修饰符、名字、返回类型与参数类型、注释。它还以 Java 字节代码指令的形式，包含了该方法的已编译代码。

但在源文件类和已编译类之间还是有一些差异：

- 一个已编译类仅描述一个类，而一个源文件中可以包含几个类。比如，一个源文件描述了一个类，这个类又有一个内部类，那这个源文件会被编译为两个类文件：主类和内部类各一个文件。但是，主类文件中包含对其内部类的引用，定义了内部方法的内层类会包含引用，引向其封装的方法。
- 已编译类中当然不包含注释（comment），但可以包含类、字段、方法和代码属性，可以利用这些属性为相应元素关联更多信息。Java 5 中引入可用于同一目的的注释（annotaion）以后，属性已经变得没有什么用处了。
- 编译类中不包含 package 和 import 部分，因此，所有类型名字都必须是完全限定的。

另一个非常重要的结构性差异是已编译类中包含常量池（constant pool）部分。这个池是一个数组，其中包含了在类中出现的所有数值、字符串和类型常量。这些常量仅在这个常量池部分中定义一次，然后可以利用其索引，在类文件中的所有其他各部分进行引用。幸好，ASM 隐藏了与常量池有关的所有细节，所以我们不用再为它操心了。

**已编译类的结构**

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240312094518.png)

### 内部名
在许多情况下，一种类型只能是类或接口类型。例如，一个类的超类、由一个类实现的接口，或者由一个方法抛出的异常就不能是基元类型或数组类型，必须是类或接口类型。这些类型在已编译类中用内部名字表示。一个类的内部名就是这个类的完全限定名，其中的点号用斜线代替。例如，String 的内部名为 java/lang/String。

### 类型描述符

内部名只能用于类或接口类型。所有其他 Java 类型，比如字段类型，在已编译类中都是用类型描述符表示的
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240312094854.png)

基元类型的描述符是单个字符：Z 表示 boolean，C 表示 char，B 表示 byte，S 表示 short，I 表示 int，F 表示 float，J 表示 long，D 表示 double。一个类类型的描述符是这个类的内部名，前面加上字符 L ，后面跟有一个分号。例如， String 的类型描述符为Ljava/lang/String;。而一个数组类型的描述符是一个方括号后面跟有该数组元素类型的描述符。

### 方法描述符

方法描述符是一个类型描述符列表，它用一个字符串描述一个方法的参数类型和返回类型。方法描述符以左括号开头，然后是每个形参的类型描述符，然后是一个右括号，接下来是返回类型的类型描述符，如果该方法返回 void，则是 V（方法描述符中不包含方法的名字或参数名）。

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240312095421.png)

一旦知道了类型描述符如何工作，方法描述符的理解就容易了。例如，(I)I 描述一个方法，它接受一个 int 类型的参数，返回一个 int。

## 接口和组件
用于生成和变转已编译类的 ASM API 是基于 ClassVisitor 抽象类的。这个类中的每个方法都对应于同名的类文件结构部分。简单的部分只需一个方法调用就能访问，这个调用返回 void，其参数描述了这些部分的内容。有些部分的内容可以达到任意长度、
任意复杂度，这样的部分可以用一个初始方法调用来访问，返回一个辅助的访问者类。visitAnnotation、visitField 和 visitMethod 方法就是这种情况，它们分别返回
AnnotationVisitor、FieldVisitor 和 MethodVisitor.
``` java
public abstract class ClassVisitor { 
 public ClassVisitor(int api); 
 public ClassVisitor(int api, ClassVisitor cv); 
 public void visit(int version, int access, String name, 
 String signature, String superName, String[] interfaces); 
 public void visitSource(String source, String debug); 
 public void visitOuterClass(String owner, String name, String desc); 
 AnnotationVisitor visitAnnotation(String desc, boolean visible); 
 public void visitAttribute(Attribute attr); 
 public void visitInnerClass(String name, String outerName, 
 String innerName, int access); 
 public FieldVisitor visitField(int access, String name, String desc, 
 String signature, Object value); 
 public MethodVisitor visitMethod(int access, String name, String 
desc, 
 String signature, String[] exceptions); 
 void visitEnd(); 
}
```
针对这些辅助类递归适用同样的原则。例如，FieldVisitor 抽象类中的每个方法对应于同名的类文件子结构，visitAnnotation 返回一个辅助的 AnnotationVisitor，
和在 ClassVisitor 中一样。

ClassVisitor 类的方法必须按以下顺序调用（在这个类的 Javadoc 中规定）：
```
visit visitSource? visitOuterClass? ( visitAnnotation | 
visitAttribute )* 
( visitInnerClass | visitField | visitMethod )* 
visitEnd
```
这意味着必须首先调用 visit，然后是对 visitSource 的最多一个调用，接下来是对
visitOuterClass 的最多一个调用，然后是可按任意顺序对 visitAnnotation 和
visitAttribute 的任意多个访问，接下来是可按任意顺序对 visitInnerClass、
visitField 和 visitMethod 的任意多个调用，最后以一个 visitEnd 调用结束。

ASM 提供了三个基于 ClassVisitor API 的核心组件，用于生成和变化类：
- ClassReader 类分析以字节数组形式给出的已编译类，并针对在其 accept 方法参数中传送的 ClassVisitor 实例，调用相应的 visitXxx 方法。这个类可以看作一个事件产生器。
- ClassWriter 类是 ClassVisitor 抽象类的一个子类，它直接以二进制形式生成编译后的类。它会生成一个字节数组形式的输出，其中包含了已编译类，可以用toByteArray 方法来提取。这个类可以看作一个事件使用器。
- ClassVisitor 类将它收到的所有方法调用都委托给另一个 ClassVisitor 类。这个类可以看作一个事件筛选器。

### 分析类

在分析一个已经存在的类时，惟一必需的组件是 ClassReader 组件。假设希望打印一个类的内容，其方式类似于 javap 工具。第一步是编写 ClassVisitor类的一个子类，打印它所访问的类的相关信息。下面是一种可能的实现方式，它有些过于简化了：
``` java
public class ClassPrinter extends ClassVisitor {
 public ClassPrinter() { 
 super(ASM4); 
} 
public void visit(int version, int access, String name, 
 String signature, String superName, String[] interfaces) { 
 System.out.println(name + " extends " + superName + " {"); 
} 
public void visitSource(String source, String debug) { 
} 
public void visitOuterClass(String owner, String name, String desc) 
{ 
} 
public AnnotationVisitor visitAnnotation(String desc, 
 boolean visible) { 
 return null; 
 } 
 public void visitAttribute(Attribute attr) { 
 } 
 public void visitInnerClass(String name, String outerName, 
 String innerName, int access) { 
 } 
 public FieldVisitor visitField(int access, String name, String 
desc, 
 String signature, Object value) { 
 System.out.println(" " + desc + " " + name); 
 return null; 
 } 
 public MethodVisitor visitMethod(int access, String name, 
 String desc, String signature, String[] exceptions) { 
 System.out.println(" " + name + desc); 
 return null; 
 } 
 public void visitEnd() { 
 System.out.println("}"); 
 } 
 }
```
第二步是将这个ClassPrinter与一个ClassReader组件合并在一起，使ClassReader产生的事件由我们的 ClassPrinter 使用：
```java
ClassPrinter cp = new ClassPrinter(); 
ClassReader cr = new ClassReader("java.lang.Runnable"); 
cr.accept(cp, 0);
```
第二行创建了一个 ClassReader，以分析 Runnable 类。在最后一行调用的 accept 方法分析 Runnable 类字节代码，并对 cp 调用相应的 ClassVisitor 方法。结果为以下输出：
```java
java/lang/Runnable extends java/lang/Object { 
run()V 
}
```
注意,构建 ClassReader 实例的方式有若干种。必须读取的类可以像上面一样用名字指定，也可以像字母数组或 InputStream 一样用值来指定。利用 ClassLoader 的getResourceAsStream 方法，可以获得一个读取类内容的输入流，如下：
``` java
cl.getResourceAsStream(classname.replace(’.’, ’/’) + ".class");
```

## 生成类

为生成一个类，惟一必需的组件是 ClassWriter 组件。让我们用一个例子来进行说明。考虑以下接口：
```java
package pkg; 
public interface Comparable extends Mesurable { 
 int LESS = -1; 
 int EQUAL = 0; 
 int GREATER = 1; 
 int compareTo(Object o); 
}
```
可以对 ClassVisitor 进行六次方法调用来生成它：
```java
ClassWriter cw = new ClassWriter(0);
cw.visit(V1_5, ACC_PUBLIC + ACC_ABSTRACT + ACC_INTERFACE, 
 "pkg/Comparable", null, "java/lang/Object", 
 new String[] { "pkg/Mesurable" }); 
cw.visitField(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, "LESS", "I", 
 null, new Integer(-1)).visitEnd(); 
cw.visitField(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, "EQUAL", "I", 
 null, new Integer(0)).visitEnd(); 
cw.visitField(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, "GREATER", "I", 
 null, new Integer(1)).visitEnd(); 
cw.visitMethod(ACC_PUBLIC + ACC_ABSTRACT, "compareTo", 
 "(Ljava/lang/Object;)I", null, null).visitEnd(); 
cw.visitEnd(); 
byte[] b = cw.toByteArray();
```
第一行创建了一个 ClassWriter 实例，它实际上将创建类的字节数组表示。

对 visit 方法的调用定义了类的标头。V1_5 参数是一个常数，与所有其他 ASM 常量一样，在 ASM Opcodes 接口中定义。它指明了类的版本——Java 1.5。ACC_XXX 常量是与 Java 修饰
符对应的标志。这里规定这个类是一个接口，而且它是 public 和 abstract 的（因为它不能被实例化）。下一个参数以内部形式规定了类的名字。回忆一下，已编译类不包含Package 和 Import 部分，因此，所有类名都必须是完全限定的。下一个参数对应于泛型。在我们的例子中，这个参数是 null，因为这个接口并没有由类型变量进行参数化。第五个参数是内部形式的超类（接口类隐式继承自 Object）。最后一个参数是一个数组，其中是
被扩展的接口，这些接口由其内部名指定。

接下来对 visitField 的三次调用是类似的，用于定义三个接口字段。第一个参数是一组标志，对应于 Java 修饰符。这里规定这些字段是 public、final 和 static 的。第二个参数
是字段的名字，与它在源代码中的显示相同。第三个参数是字段的类型，采用类型描述符形式。这里，这些字段是 int 字段，它们的描述符是 I。第四个参数对应于泛型。在我们的例子中，
它是 null，因为这些字段类型没有使用泛型。最后一个参数是字段的常量值：这个参数必须仅用于真正的常量字段，也就是 final static 字段。对于其他字段，它必须为 null。由于此处没有注释，所以立即调用所返回的 FieldVisitor 的 visitEnd 方法，即对其visitAnnotation 或 visitAttribute 方法没有任何调用。

visitMethod 调用用于定义 compareTo 方法，同样，第一个参数是一组对应于 Java 修饰符的标志。第二个参数是方法名，与其在源代码中的显示一样。第三个参数是方法的描述符。第
四个参数对应于泛型。在我们的例子中，它是 null，因为这个方法没有使用泛型。最后一个参数是一个数组，其中包括可由该方法抛出的异常，这些异常由其内部名指明。它在这里为 null，
因为这个方法没有声明任何异常。visitMethod 方法返回 MethodVisitor，可用于定义该方法的注释和属性，最重要的是这个方法的代码。这里，由于没有注释，而且这个方法是抽象的，所以我们立即调用所返回的 MethodVisitor 的 visitEnd 方法。

对 visitEnd 的最后一个调用是为了通知 cw：这个类已经结束，对 toByteArray 的调用用于以字节数组的形式提取它。

**1. 使用生成的类**

前面的字节数组可以存储在一个 Comparable.class 文件中，供以后使用。或者，也可以用ClassLoader动态加载它。一种方法是定义一个ClassLoader子类，它的defineClass方法是公有的：
```java
class MyClassLoader extends ClassLoader { 
 public Class defineClass(String name, byte[] b) { 
 return defineClass(name, b, 0, b.length); 
 } 
} 
```
然后，可以用下面的代码直接调用所生成的类：
```java
Class c = myClassLoader.defineClass("pkg.Comparable", b);
```
另一种加载已生成类的方法可能更清晰一些，那就是定义一个 ClassLoader 子类，它的findClass 方法被重写，以在运行过程中生成所请求的类：
``` java
class StubClassLoader extends ClassLoader { 
 @Override 
 protected Class findClass(String name) 
 throws ClassNotFoundException { 
 if (name.endsWith("_Stub")) { 
 ClassWriter cw = new ClassWriter(0); 
 ... 
 byte[] b = cw.toByteArray(); 
 return defineClass(name, b, 0, b.length); 
 } 
 return super.findClass(name); 
 } 
}
```
事实上，所生成类的使用方式取决于上下文，这已经超出了 ASM API 的范围。如果你正在编写编译器，那类生成过程将由一个抽象语法树驱动，这个语法树代表将要编译的程序，而生成的类将被存储在磁盘上。如果你正在编写动态代理类生成器或方面编织器，那将会以这种或那种方式使用一个 ClassLoader。

### 转换类

到目前为止，ClassReader 和 ClassWriter 组件都是单独使用的。这些事件是“人工”产生，并且由 ClassWriter 直接使用，或者与之对称地，它们由 ClassReader 产生，然后“人工”使用，也就是由自定义的 ClassVisitor 实现使用。当这些组件一同使用时，事情开始变得真正有意义起来。第一步是将 ClassReader 产生的事件转给 ClassWriter。其结果是，类编写器重新构建了由类读取器分析的类：
``` java
byte[] b1 = ...; 
ClassWriter cw = new ClassWriter(0); 
ClassReader cr = new ClassReader(b1); 
cr.accept(cw, 0); 
byte[] b2 = cw.toByteArray(); // b2 和 b1 表示同一个类
```
这本身并没有什么真正的意义（还有其他更简单的方法可以用来复制一个字节数组！），但等一等。下一步是在类读取器和类写入器之间引入一个 ClassVisitor：
```java
byte[] b1 = ...; 
ClassWriter cw = new ClassWriter(0); 
// cv 将所有事件转发给 cw 
ClassVisitor cv = new ClassVisitor(ASM4, cw) { }; 
ClassReader cr = new ClassReader(b1); 
cr.accept(cv, 0); 
byte[] b2 = cw.toByteArray(); // b2 与 b1 表示同一个类
```

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240312102948.png)

但结果并没有改变，因为 ClassVisitor 事件筛选器没有筛选任何东西。但现在，为了能够转换一个类，只需重写一些方法，筛选一些事件就足够了。例如，考虑下面的 ClassVisitor子类：
```java
public class ChangeVersionAdapter extends ClassVisitor { 
 public ChangeVersionAdapter(ClassVisitor cv) { 
 super(ASM4, cv); 
 } 
 @Override 
 public void visit(int version, int access, String name, 
 String signature, String superName, String[] interfaces) { 
 cv.visit(V1_5, access, name, signature, superName, interfaces); 
 } 
}
```
这个类仅重写了 ClassVisitor 类的一个方法。结果，所有调用都被不加改变地转发到传送给构造器的类访问器 cv，只有对 visit 方法的调用除外，在转发它时，对类版本号进行了修改。
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240312103225.png)

通过修改 visit 方法的其他参数，可以实现其他转换，而不仅仅是修改类的版本。例如，可以向实现接口的列表中添加一个接口。还可以改变类的名字，但进行这种改变所需要做的工作要多得多，不只是改变 visit 方法的 name 参数了。实际上，类的名字可以出现在一个已编译类的许多不同地方，要真正实现类的重命名，必须修改类中出现的所有这些类名字。

**优化**

前面的转换只修改了原类的四个字节。但是，在使用上面的代码时，整个 b1 均被分析，并利用相应的事件从头从头构建了 b2，这种做法的效率不是很高。如果将 b1 中不被转换的部分直接复制到 b2 中，不对其分析，也不生成相应的事件，其效率就会高得多。ASM 自动为方法执行这一优化：

- 在 ClassReader 组件的 accept 方法参数中传送了 ClassVisitor，如果ClassReader 检测到这个 ClassVisitor 返回的 MethodVisitor 来自一个
ClassWriter，这意味着这个方法的内容将不会被转换，事实上，应用程序甚至不会看到其内容。
- 在这种情况下，ClassReader 组件不会分析这个方法的内容，不会生成相应事件，只是复制 ClassWriter 中表示这个方法的字节数组。

如果 ClassReader 和 ClassWriter 组件拥有对对方的引用，则由它们进行这种优化，可设置如下：
```java
byte[] b1 = ... 
ClassReader cr = new ClassReader(b1); 
ClassWriter cw = new ClassWriter(cr, 0); 
ChangeVersionAdapter ca = new ChangeVersionAdapter(cw); 
cr.accept(ca, 0);
byte[] b2 = cw.toByteArray();
```

执行这一优化后，由于 ChangeVersionAdapter 没有转换任何方法，所以以上代码的速度可以达到之前代码的两倍。对于转换部分或全部方法的常见转换，这一速度提升幅度可能要小一些，但仍然是很可观的：实际上在 10%到 20%的量级。遗憾的是，这一优化需要将原类中定义的所有常量都复制到转换后的类中。对于那些增加字段、方法或指令的转换来说，这一点不成问题，但对于那些要移除或重命名许多类成员的转换来说，这一优化将导致类文件大于未优化时的情况。因此，建议仅对“增加性”转换应用这一优化。

**使用转换后的类**
转换后的类 b2 可以存储在磁盘上，或者用 ClassLoader 加载。但在ClassLoader 中执行的类转换只能转换由这个类加载器加载的类。如果希望转换所有类，则必须将转换放在 ClassFileTransformer 内部，见 java.lang.instrument 包中的定义（更多细节，请参阅这个软件包的文档）：
``` java
public static void premain(String agentArgs, Instrumentation inst) { 
 inst.addTransformer(new ClassFileTransformer() { 
 public byte[] transform(ClassLoader l, String name, Class c, 
 ProtectionDomain d, byte[] b) 
 throws IllegalClassFormatException { 
 ClassReader cr = new ClassReader(b); 
 ClassWriter cw = new ClassWriter(cr, 0); 
 ClassVisitor cv = new ChangeVersionAdapter(cw); 
 cr.accept(cv, 0); 
 return cw.toByteArray(); 
 } 
 }); 
}
```

### 移除类成员

用于转换类版本的方法当然也可用于 ClassVisitor 类的其他方法。例如，通过改变 visitField 和 visitMethod 方法的 access 或 name 参数，可以改变一个字段或一个方
法的修饰字段或名字。另外，除了在转发的方法调用中使用经过修改的参数之外，还可以选择根本不转发该调用。其效果就是相应的类元素被移除。

例如，下面的类适配器移除了有关外部类及内部类的信息，还删除了一个源文件的名字，也就是由其编译这个类的源文件（所得到的类仍然具有全部功能，因为删除的这些元素仅用于调试目的）。这一移除操作是通过在适当的访问方法中不转发任何内容而实现的：
```java
public class RemoveDebugAdapter extends ClassVisitor { 
 public RemoveDebugAdapter(ClassVisitor cv) { 
 super(ASM4, cv); 
 } 
 @Override 
 public void visitSource(String source, String debug) { 
 } 
 @Override 
 public void visitOuterClass(String owner, String name, String desc) { 
 } 
 @Override
public void visitInnerClass(String name, String outerName, 
 String innerName, int access) { 
 } 
} 
```
这一策略对于字段和方法是无效的，因为 visitField 和 visitMethod 方法必须返回一个结果。要移除字段或方法，不得转发方法调用，并向调用者返回 null。例如，下面的类适配器移除了一个方法，该方法由其名字及描述符指明（仅使用名字不足以标识一个方法，因为一个
类中可能包含若干个具有不同参数的同名方法）：

``` java
public class RemoveMethodAdapter extends ClassVisitor { 
 private String mName; 
 private String mDesc; 
 public RemoveMethodAdapter( 
 ClassVisitor cv, String mName, String mDesc) { 
 super(ASM4, cv); 
 this.mName = mName; 
 this.mDesc = mDesc; 
 } 
 @Override 
 public MethodVisitor visitMethod(int access, String name, 
 String desc, String signature, String[] exceptions) { 
 if (name.equals(mName) && desc.equals(mDesc)) { 
 // 不要委托至下一个访问器 -> 这样将移除该方法
 return null; 
 } 
 return cv.visitMethod(access, name, desc, signature, exceptions); 
 } 
}
```

### 增加类成员
上述讨论的是少转发一些收到的调用，我们还可以多“转发”一些调用，也就是发出的调用数多于收到的调用，其效果就是增加了类成员。新的调用可以插在原方法调用之间的若干位置，只要遵守各个 visitXxx 必须遵循的调用顺序即可。

例如，如果要向一个类中添加一个字段，必须在原方法调用之间添加对 visitField 的一个新调用，而且必须将这个新调用放在类适配器的一个访问方法中。比如，不能在 visit 方法中这样做，因为这样可能会导致对 visitField 的调用之后跟有 visitSource 、visitOuterClass、visitAnnotation 或 visitAttribute，这是无效的。出于同样的原因，不能将这个新调用放在 visitSource、visitOuterClass、visitAnnotation 或visitAttribute 方法中 . 仅有的可能位置是 visitInnerClass 、 visitField、visitMethod 或 visitEnd 方法。

如果将这个新调用放在 visitEnd 方法中，那这个字段将总会被添加（除非增加显式条件），因为这个方法总会被调用。如果将它放在 visitField 或 visitMethod 中，将会添加几个字
段：原类中的每个字段和方法各有一个相应的字段。这两种解决方案都可能发挥应有的作用；具体取决于你的需求。例如，可以仅添加一个计数器字段，用于计算对一个对象的调用次数，也可以为每个方法添加一个计数器，用于分别计算对每个方法的调用次数。

> 注意：事实上，惟一真正正确的解决方案是在 visitEnd 方法中添加更多调用，以添加新成员。实际上，一个类中不得包含重复成员，要确保一个新成员没有重复成员，惟一方法就是将它与所有已有成员进行对比，只有在 visitEnd 方法中访问了所有这些成员后才能完成这一工作。这种做法是相当受限制的。在实践中，使用程序员不大可能使用的生成名，比如_counter$或_4B7F_ i 就足以避免重复成员了，并不需要将它们添加到 visitEnd 中。

下面给出一个类适配器，它会向类中添加一个字段，除非这个字段
已经存在：
```java
public class AddFieldAdapter extends ClassVisitor { 
 private int fAcc; 
 private String fName; 
 private String fDesc; 
 private boolean isFieldPresent; 
 public AddFieldAdapter(ClassVisitor cv, int fAcc, String fName, 
 String fDesc) { 
 super(ASM4, cv); 
 this.fAcc = fAcc; 
 this.fName = fName; 
 this.fDesc = fDesc; 
 } 
 @Override 
 public FieldVisitor visitField(int access, String name, String desc, 
 String signature, Object value) { 
 if (name.equals(fName)) { 
 isFieldPresent = true; 
 } 
 return cv.visitField(access, name, desc, signature, value); 
 } 
 @Override 
 public void visitEnd() { 
 if (!isFieldPresent) { 
 FieldVisitor fv = cv.visitField(fAcc, fName, fDesc, null, null); 
 if (fv != null) { 
 fv.visitEnd(); 
 } 
 } 
 cv.visitEnd(); 
 } 
} 
```
这个字段被添加在 visitEnd 方法中。visitField 方法未被重写为修改已有字段或删除一个字段，只是检测一下我们希望添加的字段是否已经存在。注意 visitEnd 方法中在调用
fv.visitEnd()之前的 fv != null 检测：这是因为一个类访问器可以在 visitField 中返回 null.

### 转换链
将几个适配器链接在一起，就可以组成几个独立的类转换，以完成复杂转换。还要注意，转换链不一定是线性的。我们可以编写一个 ClassVisitor，将接收到的所有方法调用同时转发给几个 ClassVisitor：
```java
public class MultiClassAdapter extends ClassVisitor { 
 protected ClassVisitor[] cvs; 
 public MultiClassAdapter(ClassVisitor[] cvs) { 
 super(ASM4); 
 this.cvs = cvs; 
 } 
 @Override public void visit(int version, int access, String name, 
 String signature, String superName, String[] interfaces) { 
 for (ClassVisitor cv : cvs) { 
 cv.visit(version, access, name, signature, superName, interfaces); 
 } 
 } 
 ... 
}
```
反过来，几个类适配器可以委托至同一 ClassVisitor（这需要采取一些预防措施，确保比如 visit 和 visitEnd 针对这个 ClassVisitor 恰好仅被调用一次）。因此，诸如图所示的这样一个转换链是完全可行的。

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240312110224.png)


## 工具

除了 ClassVisitor 类和相关的 ClassReader、ClassWriter 组件之外，ASM 还在org.objectweb.asm.util 包中提供了几个工具，这些工具在开发类生成器或适配器时可能非常有用，但在运行时不需要它们。ASM 还提供了一个实用类，用于在运行时处理内部名、类型描述符和方法描述符。

### Type
ASM API 公开 Java 类型的形式就是它们在已编译类中的存储形式，也就是说，作为内部特性或类型描述符。也可以按照它们在源代码中的形式来公开它们，使代码更便于阅读。但这样就需要在 ClassReader 和 ClassWriter 中的两种表示形式之间进行系统转换，从而使性能降低。这就是为什么 ASM 没有透明地将内部名和类型描述符转换为它们等价的源代码形式。但它提供了 Type 类，可以在必要时进行手动转换。

一个 Type 对象表示一种 Java 类型，既可以由类型描述符构造，也可以由 Class 对象构建。Type 类还包含表示基元类型的静态变量。例如，Type.INT_TYPE 是表示 int 类型的 Type 对象。

getInternalName 方法返回一个 Type 的内部名。例如，Type.getType(String.class). getInternalName()给出 String 类的内部名，即"java/lang/String"。这一方法只能对类或接口类型使用。

getDescriptor 方法返回一个 Type 的描述符。比如，在代码中可以不使用"Ljava/lang/String;" ，而是使用 Type.getType(String.class). getDescriptor()。或者，可以不使用 I，而是使用 Type.INT_TYPE.getDescriptor()。

Type 对象还可以表示方法类型。这种对象既可以从一个方法描述符构建，也可以由 Method对象构建。 getDescriptor 方法返回与这一类型对应的方法描述符。此外，getArgumentTypes 和 getReturnType 方法可用于获取与一个方法的参数类型和返回类型相对应的 Type 对象。例如，Type.getArgumentTypes("(I)V")返回一个仅有一个元素Type.INT_TYPE 的数组。与此类似，调用 Type.getReturnType("(I)V") 将返回Type.VOID_TYPE 对象。

### TraceClassVisitor

要确认所生成或转换后的类符合你的预期，ClassWriter 返回的字母数组并没有什么真正的用处，因为它对人类来说是不可读的。如果有文本表示形式，那使用起来就容易多了。这正是TraceClassVisitor 类提供的东西。从名字可以看出，这个类扩展了 ClassVisitor 类，并生成所访问类的文本表示。因此，我们不是用 ClassWriter 来生成类，而是使用TraceClassVisitor，以获得关于实际所生成内容的一个可读轨迹。甚至可以同时使用这两者，这样要更好一些。除了其默认行为之外，TraceClassVisitor 实际上还可以将对其方法的所有调用委托给另一个访问器，比如 ClassWriter：

``` java
ClassWriter cw = new ClassWriter(0); 
TraceClassVisitor cv = new TraceClassVisitor(cw, printWriter); 
cv.visit(...); 
... 
cv.visitEnd(); 
byte b[] = cw.toByteArray(); 
```
### CheckClassAdapter

ClassWriter 类并不会核实对其方法的调用顺序是否恰当，以及参数是否有效。因此，有可能会生成一些被 Java 虚拟机验证器拒绝的无效类。为了尽可能提前检测出部分此类错误，可
以使用 CheckClassAdapter 类。和 TraceClassVisitor 类似，这个类也扩展了ClassVisitor 类，并将对其方法的所有调用都委托到另一个 ClassVisitor，比如一个TraceClassVisitor 或一个 ClassWriter。但是，这个类并不会打印所访问类的文本表示，而是验证其对方法的调用顺序是否适当，参数是否有效，然后才会委托给下一个访问器。当发生错误时，会抛出 IllegalStateException 或 IllegalArgumentException。

为核对一个类，打印这个类的文本表示形式，最终创建一个字节数组表示形式，应当使用类似于如下代码：
```java
ClassWriter cw = new ClassWriter(0); 
TraceClassVisitor tcv = new TraceClassVisitor(cw, printWriter); 
CheckClassAdapter cv = new CheckClassAdapter(tcv); 
cv.visit(...); 
... 
cv.visitEnd(); 
byte b[] = cw.toByteArray();
```

和使用 TraceClassVisitor 时一样，也可以在一个生成链或转换链的任意位置使用CheckClassAdapter，以查看该链中这一点的类，而不一定只是恰好在 ClassWriter 之前使用。


### ASMifier

这个类为 TraceClassVisitor 工具提供了一种替代后端（该工具在默认情况下使用Textifier 后端，生成如上所示类型的输出）。这个后端使 TraceClassVisitor 类的每个方法都会打印用于调用它的 Java 代码。例如，调用 visitEnd()方法将打印 cv.visitEnd();。其结果是，当一个具有 ASMifier 后端的 TraceClassVisitor 访问器访问一个类时，它会打印用 ASM 生成这个类的源代码。如果用这个访问器来访问一个已经存在的类，那这一点是很有用的。例如，如果你不知道如何用 ASM 生成某个已编译类，可以编写相应的源代码，用 javac编译它，并用 ASMifier 来访问这个编译后的类。将会得到生成这个已编译类的 ASM 代码！

ASMifier 类也可以在命令行中使用。例如，使用以下命令，
``` bash
java -classpath asm.jar:asm-util.jar \ 
 org.objectweb.asm.util.ASMifier \ 
 java.lang.Runnable
 ```
 将会生成一些代码，经过缩进后，这些代码就是如下模样：
 ```java
package asm.java.lang; 
import org.objectweb.asm.*; 
public class RunnableDump implements Opcodes { 
 public static byte[] dump() throws Exception { 
 ClassWriter cw = new ClassWriter(0); 
 FieldVisitor fv; 
 MethodVisitor mv; 
 AnnotationVisitor av0; 
 cw.visit(V1_5, ACC_PUBLIC + ACC_ABSTRACT + ACC_INTERFACE, 
 "java/lang/Runnable", null, "java/lang/Object", null); 
 { 
 mv = cw.visitMethod(ACC_PUBLIC + ACC_ABSTRACT, "run", "()V", 
 null, null); 
 mv.visitEnd(); 
 } 
 cw.visitEnd(); 
 return cw.toByteArray(); 
 } 
}
```

## 方法
在编译类的内部，方法的代码存储为一系列的字节码指令。为生成和转换类，最根本的就是要了解这些指令，并理解它们是如何工作的。

### 结构

Java 代码是在线程内部执行的。每个线程都有自己的执行栈，栈由帧组成。每个帧表示一个方法调用：每次调用一个方法时，会将一个新帧压入当前线程的执行栈。当方法返回时，或者是正常返回，或者是因为异常返回，会将这个帧从执行栈中弹出，执行过程在发出调用的方法中继续进行（这个方法的帧现在位于栈的顶端）

每一帧包括两部分：一个局部变量部分和一个操作数栈部分。局部变量部分包含可根据索引以随机顺序访问的变量。由名字可以看出，操作数栈部分是一个栈，其中包含了供字节代码指令用作操作数的值。这意味着这个栈中的值只能按照“后入先出”顺序访问。不要将操作数栈和线程的执行栈相混淆：执行栈中的每一帧都包含自己的操作数栈。

局部变量部分与操作数栈部分的大小取决于方法的代码。这一大小是在编译时计算的，并随字节代码指令一起存储在已编译类中。因此，对于对应于某一给定方法调用的所有帧，其局部变量与操作数栈部分的大小相同，但对应于不同方法的帧，这一大小可能不同。

在创建一个帧时，会将其初始化，提供一个空栈，并用目标对象 this（对于非静态方法）及该方法的参数来初始化其局部变量。例如，调用方法 a.equals(b)将创建一帧，它有一个空栈，前两个局部变量被初始化为 a 和 b（其他局部变量未被初始化）。

局部变量部分和操作数栈部分中的每个槽（slot）可以保存除 long 和 double 变量之外的任意 Java 值。long 和 double 变量需要两个槽。这使局部变量的管理变得复杂：例如，第 i 个方法参数不一定存储在局部变量 i 中。例如，调用 Math.max(1L, 2L)创建一个帧，1L 值位于前两个局部变量槽中，值 2L 存储在第三和第四个槽中。

#### 字节代码指令
字节代码指令由一个标识该指令的操作码和固定数目的参数组成：

**操作码**

是一个无符号字节值——即字节代码名，由助记符号标识。例如，操作码 0 用助记符号 NOP 表示，对应于不做任何操作的指令。

**参数**

是静态值，确定了精确的指令行为。它们紧跟在操作码之后给出。比如 GOTO 标记指令（其操作码的值为 167）以一个指明下一条待执行指令的标记作为参数标记。不要将指令参数与指令操作数相混淆：参数值是静态已知的，存储在编译后的代码中，而操作数值来自操作数栈，只有到运行时才能知道。

字节代码指令可以分为两类：一小组指令，设计用来在局部变量和操作数栈之间传送值；其他一些指令仅用于操作数栈：它们从栈中弹出一些值，根据这些值计算一个结果，并将它压回栈中。

ILOAD, LLOAD, FLOAD, DLOAD 和 ALOAD 指令读取一个局部变量，并将它的值压到操作数栈中。它们的参数是必须读取的局部变量的索引 i。ILOAD 用于加载一个 boolean、byte、char、short或int局部变量。LLOAD、FLOAD和DLOAD分别用于加载long、float或double值。（LLOAD 和 DLOAD 实际加载两个槽 i 和 i+1）。最后，ALOAD 用于加载任意非基元值，即对象和数组引用。与之对应，ISTORE、LSTORE、FSTORE、DSTORE 和 ASTORE 指令从操作数栈中弹出一个值，并将它存储在由其索引 i 指定的局部变量中。

可以看到，xLOAD 和 xSTORE 指令被赋入了类型。它用于确保不会执行非法转换。实际上，将一个值存储在局部变量中，然后再以不同类型加载它，是非法的。例如，ISTORE 1 ALOAD 1 序列是非法的——它允许将一个任意内存位置存储在局部变量 1 中，并将这个地址转换为对象引用！但是，如果向一个局部变量中存储一个值，而这个值的类型不同于该局部变量中存储的当前值，却是完全合法的。这意味着一个局部变量的类型，即这个局部变量中所存值的类型可以在方法执行期间发生变化。

**栈** 

这些指令用于处理栈上的值：POP 弹出栈顶部的值，DUP 压入顶部栈值的一个副本，SWAP 弹出两个值，并按逆序压入它们，等等。

**常量** 

这些指令在操作数栈压入一个常量值：ACONST_NULL 压入 null，ICONST_0 压入int 值 0，FCONST_0 压入 0f，DCONST_0 压入 0d，BIPUSH b 压入字节值 b，SIPUSH s 压入 short 值 s，LDC cst 压入任意 int、float、long、double、String 或 class①常量 cst，等等。

**算术与逻辑**

这些指令从操作数栈弹出数值，合并它们，并将结果压入栈中。它们没有任何参数。xADD、xSUB、xMUL、xDIV 和 xREM 对应于+、-、*、/和%运算，其中 x 为 I、L、F 或 D 之一。类似地，还有其他对应于<<、>>、>>>、|、&和^运算的指令，用于处理 int 和 long 值。

**类型变换**
 
这些指令从栈中弹出一个值，将其转换为另一类型，并将结果压入栈中。它们对应于 Java 中的类型转换表达式。I2F, F2D, L2D 等将数值由一种数值类型转换为另一种类型。CHECKCAST t 将一个引用值转换为类型 t。对象 这些指令用于创建对象、锁定它们、检测它们的类型，等等。例如，NEW type 指令将一个 type 类型的新对象压入栈中（其中 type 是一个内部名）。


**字段**

这些指令读或写一个字段的值。GETFIELD owner name desc 弹出一个对象引用，并压和其 name 字段中的值。PUTFIELD owner name desc 弹出一个值和一个对象引用，并
将这个值存储在它的 name 字段中。在这两种情况下，该对象都必须是 owner 类型，它的字段必须为 desc 类型。GETSTATIC 和 PUTSTATIC 是类似指令，但用于静态字段。

**方法**

这些指令调用一个方法或一个构造器。它们弹出值的个数等于其方法参数个数加 1（用于目标对象），并压回方法调用的结果。INVOKEVIRTUAL owner name desc 调用在类 owner 中定义的 name 方法，其方法描述符为 desc。INVOKESTATIC 用于静态方法，INVOKESPECIAL 用于私有方法和构造器，INVOKEINTERFACE 用于接口中定义的方法。最后，对于 Java 7 中的类，INVOKEDYNAMIC 用于新动态方法调用机制。

**数组**

这些指令用于读写数组中的值。xALOAD 指令弹出一个索引和一个数组，并压入此索引处数组元素的值。xASTORE 指令弹出一个值、一个索引和一个数组，并将这个值存储在该数组的这一索引处。这里的 x 可以是 I、L、F、D 或 A，还可以是 B、C 或 S。

**跳转**

这些指令无条件地或者在某一条件为真时跳转到一条任意指令。它们用于编译 if、for、do、while、break 和 continue 指令。例如，IFEQ label 从栈中弹出一个int 值，如果这个值为 0，则跳转到由这个 label 指定的指令处（否则，正常执行下一条指令）。还有许多其他跳转指令，比如 IFNE 或 IFGE。最后，TABLESWITCH 和LOOKUPSWITCH 对应于switch Java 指令。

**返回** 

最后，xRETURN 和 RETURN 指令用于终止一个方法的执行，并将其结果返回给调用者。RETURN 用于返回 void 的方法，xRETURN 用于其他方法。

### 示例
``` java
package pkg; 
public class Bean { 
 private int f; 
 public int getF() { 
 return this.f; 
 } 
 public void setF(int f) { 
 this.f = f; 
 } 
} 
```
getter 方法的字节代码为：
``` bash
ALOAD 0 
GETFIELD pkg/Bean f I 
IRETURN
```

第一条指令读取局部变量 0（它在为这个方法调用创建帧期间被初始化为 this），并将这个值压入操作数栈中。第二个指令从栈中弹出这个值，即 this，并将这个对象的 f 字段压入栈中，即 this.f。最后一条指令从栈中弹出这个值，并将其返回给调用者。

setter 方法的字节代码：
```bash
ALOAD 0 
ILOAD 1 
PUTFIELD pkg/Bean f I 
RETURN
```
和之前一样，第一条指令将 this 压入操作数栈。第二条指令压入局部变量 1，在为这个方法调用创建帧期间，以 f 参数初始化该变量。第三条指令弹出这两个值，并将 int 值存储在被
引用对象的 f 字段中，即存储在 this.f 中。最后一条指令在源代码中是隐式的，但在编译后的代码中却是强制的，销毁当前执行帧，并返回调用者。

Bean 类还有一个默认的公有构造器，由于程序员没有定义显式的构造器，所以它是由编译器生成的。这个默认的公有构造器被生成为 Bean() { super(); }。这个构造器的字节代码
如下：
```bash
ALOAD 0 
INVOKESPECIAL java/lang/Object <init> ()V 
RETURN
```
第一条指令将 this 压入操作数栈中。第二条指令从栈中弹出这个值，并调用在 Object对象中定义的< init >方法。这对应于 super()调用，也就是对超类 Object 构造器的调用。
在这里可以看到，在已编译类和源类中对构造器的命名是不同的：在编译类中，它们总是被命名为< init >，而在源类中，它们的名字与定义它们的类同名。最后一条指令返回调用者。


### 异常处理器

不存在用于捕获异常的字节代码：而是将一个方法的字节代码与一个异常处理器列表关联在一起，这个列表规定了在某方法中一给定部分抛出异常时必须执行的代码。异常处理器类似于
try catch 块：它有一个范围，也就是与 try 代码块内容相对应的一个指令序列，还有一个处理器，对应于 catch 块中的内容。这个范围由一个起始标记和一个终止标记指定，处理器由一个起始标记指定。比如下面的源代码：
``` java
public static void sleep(long d) { 
 try { 
 Thread.sleep(d); 
 } catch (InterruptedException e) { 
 e.printStackTrace(); 
 } 
}
```
可被编译为
```bash
TRYCATCHBLOCK try catch catch java/lang/InterruptedException 
try: 
 LLOAD 0 
 INVOKESTATIC java/lang/Thread sleep (J)V 
 RETURN 
catch: 
 INVOKEVIRTUAL java/lang/InterruptedException printStackTrace ()V 
 RETURN 
 ```
Try 和 catch 标记之间的代码对应于 try 块，而 catch 标记之后的代码对应于 catch。TRYCATCHBLOCK 行指定了一个异常处理器，覆盖了 try 和 catch 标记之间的范围，有一个开始于 catch 标记的处理器，用于处理一些异常，这些异常的类是 InterruptedException的子类。这意味着，如果在 try 和 catch 之间抛出了这样一个异常，栈将被清空，异常被压入这个空栈中，执行过程在 catch 处继续。

### 帧

除了字节代码指令之外，用 Java 6 或更高版本编译的类中还包含一组栈映射帧，用于加快Java 虚拟机中类验证过程的速度。栈映射帧给出一个方法的执行帧在执行过程中某一时刻的状
态。更准确地说，它给出了在就要执行某一特定字节代码指令之前，每个局部变量槽和每个操作数栈槽中包含的值的类型。

考虑前面的 getF 方法，可以定义三个栈映射帧，给出执行帧在即将执行ALOAD、即将执行 GETFIELD 和即将执行 IRETURN 之前的状态。
```
[pkg/Bean] [] ALOAD 0
[pkg/Bean] [pkg/Bean] GETFIELD
[pkg/Bean] [I] IRETURN
```

除了 Uninitialized(label)类型之外，它与前面的方法均类似。这是一种仅在栈映射帧中使用的特殊类型，它指定了一个对象，已经为其分配了内存，但还没有调用其构造器。参数规
定了创建此对象的指令。对于这个类型的值，只能调用一种方法，那就是构造器。在调用它时，在帧中出现的所有这一类型都被代以一个实际类型，这里是 IllegalArgumentException。
栈映射帧可使用三种其他特殊类型：UNINITIALIZED_THIS 是构造器中局部变量 0 的初始类型，TOP 对应于一个未定义的值，而 NULL 对应于 null。

从 Java 6 开始，除了字节代码之外，已编译类中还包含了一组栈映射帧。为节省空间，已编译方法中并没有为每条指令包含一个帧：事实上，它仅为那些对应于跳转目标或异常处理器的指令，或者跟在无条件跳转指令之后的指令包含帧。事实上，可以轻松、快速地由这些帧推断出其他帧。

### 接口与组件
用于生成和转换已编译方法的 ASM API 是基于 MethodVisitor 抽象类的，它由 ClassVisitor 的 visitMethod 方法返回。除了一些与注释和调试信息有关的方法之外，这个类为每个字节代码指令类别定义了一个方法，其依据就是这些指令的参数个数和类型。这些方法必须按以下顺序调用（在MethodVisitor 接口的 Javadoc 中还规定了其他一些约束条件）：
``` bash
visitAnnotationDefault? 
( visitAnnotation | visitParameterAnnotation | visitAttribute )* 
( visitCode 
 ( visitTryCatchBlock | visitLabel | visitFrame | visitXxxInsn | 
 visitLocalVariable | visitLineNumber )* 
 visitMaxs )? 
visitEnd
```
这就意味着，对于非抽象方法，如果存在注释和属性的话，必须首先访问它们，然后是该方法的字节代码。对于这些方法，其代码必须按顺序访问，位于对 visitCode 的调用（有且仅有
一个调用）与对 visitMaxs 的调用（有且仅有一个调用）之间。

``` java
abstract class MethodVisitor { // public accessors ommited 
MethodVisitor(int api); 
MethodVisitor(int api, MethodVisitor mv); 
AnnotationVisitor visitAnnotationDefault(); 
AnnotationVisitor visitAnnotation(String desc, boolean visible); 
AnnotationVisitor visitParameterAnnotation(int parameter, 
String desc, boolean visible); 
void visitAttribute(Attribute attr); 
void visitCode(); 
void visitFrame(int type, int nLocal, Object[] local, int nStack, 
Object[] stack); 
void visitInsn(int opcode); 
void visitIntInsn(int opcode, int operand); 
void visitVarInsn(int opcode, int var); 
void visitTypeInsn(int opcode, String desc); 
void visitFieldInsn(int opc, String owner, String name, String desc);
void visitMethodInsn(int opc, String owner, String name, String desc); 
void visitInvokeDynamicInsn(String name, String desc, Handle bsm, 
Object... bsmArgs); 
void visitJumpInsn(int opcode, Label label); 
void visitLabel(Label label); 
void visitLdcInsn(Object cst); 
void visitIincInsn(int var, int increment); 
void visitTableSwitchInsn(int min, int max, Label dflt, Label[] labels); 
void visitLookupSwitchInsn(Label dflt, int[] keys, Label[] labels); 
void visitMultiANewArrayInsn(String desc, int dims); 
void visitTryCatchBlock(Label start, Label end, Label handler, 
String type); 
void visitLocalVariable(String name, String desc, String signature, 
Label start, Label end, int index); 
void visitLineNumber(int line, Label start); 
void visitMaxs(int maxStack, int maxLocals); 
void visitEnd(); 
}
```
于是，visitCode 和 visitMaxs 方法可用于检测该方法的字节代码在一个事件序列中的开始与结束。和类的情况一样，visitEnd 方法也必须在最后调用，用于检测一个方法在一个事
件序列中的结束。

可以将 ClassVisitor 和 MethodVisitor 类合并，生成完整的类：
``` java
ClassVisitor cv = ...; 
cv.visit(...); 
MethodVisitor mv1 = cv.visitMethod(..., "m1", ...); 
mv1.visitCode(); 
mv1.visitInsn(...); 
... 
mv1.visitMaxs(...); 
mv1.visitEnd(); 
MethodVisitor mv2 = cv.visitMethod(..., "m2", ...); 
mv2.visitCode(); 
mv2.visitInsn(...); 
... 
mv2.visitMaxs(...); 
mv2.visitEnd(); 
cv.visitEnd();
```
注意，并不一定要在完成一个方法之后才能开始访问另一个方法。事实上，MethodVisitor实例是完全独立的，可按任意顺序使用（只要还没有调用 cv.visitEnd()）：
``` java
ClassVisitor cv = ...; 
cv.visit(...); 
MethodVisitor mv1 = cv.visitMethod(..., "m1", ...); 
mv1.visitCode(); 
mv1.visitInsn(...); 
... 
MethodVisitor mv2 = cv.visitMethod(..., "m2", ...); 
mv2.visitCode(); 
mv2.visitInsn(...); 
... 
mv1.visitMaxs(...); 
mv1.visitEnd(); 
... 
mv2.visitMaxs(...); 
mv2.visitEnd();
cv.visitEnd(); 
```
ASM 提供了三个基于 MethodVisitor API 的核心组件，用于生成和转换方法：
- ClassReader 类分析已编译方法的内容，在其 accept 方法的参数中传送了
- ClassVisitor ， ClassReader 类将针对这一 ClassVisitor 返回的MethodVisitor 对象调用相应方法。
- ClassWriter 的 visitMethod 方法返回 MethodVisitor 接口的一个实现，它直接以二进制形式生成已编译方法。

MethodVisitor类将它接收到的所有方法调用委托给另一个MethodVisitor方法。可以将它看作一个事件筛选器。

为一个方法计算栈映射帧并不是非常容易：必须计算所有帧，找出与跳转目标相对应的帧，或者跳在无条件跳转之后的帧，最后压缩剩余帧。与此类似，为一个方法计算局部变量与操作数栈部分的大小要容易一些，但依然算不上非常容易。

幸好 ASM 能为我们完成这一计算。在创建 ClassWriter 时，可以指定必须自动计算哪些内容：

- 在使用 new ClassWriter(0)时，不会自动计算任何东西。必须自行计算帧、局部变量与操作数栈的大小。

- 在使用 new ClassWriter(ClassWriter.COMPUTE_MAXS)时，将为你计算局部变量与操作数栈部分的大小。还是必须调用 visitMaxs，但可以使用任何参数：它们将被忽略并重新计算。使用这一选项时，仍然必须自行计算这些帧。

- 在 new ClassWriter(ClassWriter.COMPUTE_FRAMES)时，一切都是自动计算。不再需要调用 visitFrame，但仍然必须调用 visitMaxs（参数将被忽略并重新计算）。


这些选项的使用很方便，但有一个代价：COMPUTE_MAXS 选项使 ClassWriter 的速度降低 10%，而使用 COMPUTE_FRAMES 选项则使其降低一半。这必须与我们自行计算时所耗费的时
间进行比较：在特定情况下，经常会存在一些比 ASM 所用算法更容易、更快速的计算方法，但ASM 使用的算法必须能够处理所有情况。

注意，如果选择自行计算这些帧，可以让 ClassWriter 为你执行压缩步骤。为此，只需要用 visitFrame(F_NEW, nLocals, locals, nStack, stack)访问未压缩帧，其中的
nLocals 和 nStack 是局部变量的个数和操作数栈的大小，locals 和 stack 是包含相应类型的数组

还要注意，为了自动计算帧，有时需要计算两个给定类的公共超类。默认情况下，ClassWriter 类会在 getCommonSuperClass 方法中进行这一计算，它会将两个类加载到
JVM 中，并使用反射 API。如果我们正在生成几个相互引用的类，那可能会导致问题，因为被引用的类可能尚未存在。在这种情况下，可以重写 getCommonSuperClass 方法来解决这一问题。

#### 生成方法

```java
mv.visitCode(); 
mv.visitVarInsn(ALOAD, 0); 
mv.visitFieldInsn(GETFIELD, "pkg/Bean", "f", "I"); 
mv.visitInsn(IRETURN); 
mv.visitMaxs(1, 1); 
mv.visitEnd();
```

第一个调用启动字节代码的生成过程。然后是三个调用，生成这一方法的三条指令（可以看出，字节代码与 ASM API 之间的映射非常简单）。对 visitMaxs 的调用必须在已经访问了所有
这些指令后执行。它用于为这个方法的执行帧定义局部变量和操作数栈部分的大小。

#### 转换方法
方法可以像类一样进行转换，也就是使用一个方法适配器将它收到的方法调用转发出去，并进行一些修改：改变参数可用于改变各具体指令；不转发某一收到的调用将删除一条指令；在接收到的调用之间插入调用，将增加新的指令。MethodVisitor 类提供了这样一种方法适配器的基本实现，它只是转发它接收到的所有方法，而未做任何其他事

``` java
public class RemoveNopAdapter extends MethodVisitor { 
 public RemoveNopAdapter(MethodVisitor mv) { 
 super(ASM4, mv); 
 } 
 @Override 
 public void visitInsn(int opcode) { 
 if (opcode != NOP) { 
 mv.visitInsn(opcode); 
 } 
 } 
}
```
这个适配器可以在一个类适配器内部使用，如下所示：
```java
 public RemoveNopClassAdapter(ClassVisitor cv) {
    { 
 super(ASM4, cv); 
 } 
 @Override 
 public MethodVisitor visitMethod(int access, String name, 
 String desc, String signature, String[] exceptions) { 
 MethodVisitor mv; 
 mv = cv.visitMethod(access, name, desc, signature, exceptions); 
 if (mv != null) { 
 mv = new RemoveNopAdapter(mv); 
 } 
 return mv; 
 } 
} 
```
换言之，类适配器只是构造一个方法适配器（封装链中下一个类访问器返回的方法访问器），并返回这个适配器。其效果就是构造了一个类似于类适配器链的方法适配器链

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240320164307.png)

但注意，这种相似性并非强制的：完全有可能构造一个与类适配器链不相似的方法适配器链。每种方法甚至还可以有一个不同的方法适配器链。例如，类适配器可以选择仅删除方法中的 NOP，而不移除构造器中的该指令。可以执行如下：
```java
mv = cv.visitMethod(access, name, desc, signature, exceptions); 
if (mv != null && !name.equals("<init>")) { 
 mv = new RemoveNopAdapter(mv); 
} 
...
```
在这种情况下，构造器的适配器链更短一些。与之相反，构造器的适配器链也可以更长一些，在 visitMethod 内部创建几个链接在一起的适配器。方法适配器链的拓扑结构甚至都可以不
同于类适配器。例如，类适配器可能是线性的，而方法适配器链具有分支：
```java
 String desc, String signature, String[] exceptions) { 
 MethodVisitor mv1, mv2; 
 mv1 = cv.visitMethod(access, name, desc, signature, exceptions); 
 mv2 = cv.visitMethod(access, "_" + name, desc, signature, exceptions); 
 return new MultiMethodAdapter(mv1, mv2); 
}
```

#### 无状态转换
假设我们需要测量一个程序中的每个类所花费的时间。我们需要在每个类中添加一个静态计时器字段，并需要将这个类中每个方法的执行时间添加到这个计时器字段中。换句话说，有这样一个类 C：
```java
public class C { 
 public void m() throws Exception { 
 Thread.sleep(100); 
 } 
}
```
我们希望将它转换为：
```java
public class C { 
 public static long timer; 
 public void m() throws Exception { 
 timer -= System.currentTimeMillis(); 
 Thread.sleep(100); 
 timer += System.currentTimeMillis(); 
 } 
}
```
为了了解可以如何在 ASM 中实现它，可以编译这两个类，并针对这两个版本比较TraceClassVisitor 的输出（或者是使用默认的 Textifier 后端，或者是使用 ASMifier后端）。使用默认后端时，得到下面的差异之处（以**表示）：
```
**GETSTATIC C.timer : J** 

**INVOKESTATIC java/lang/System.currentTimeMillis()J**

**LSUB**

**PUTSTATIC C.timer : J**

LDC 100 

INVOKESTATIC java/lang/Thread.sleep(J)V 

**GETSTATIC C.timer : J**

**INVOKESTATIC java/lang/System.currentTimeMillis()J**

**LADD**

**PUTSTATIC C.timer : J**

RETURN 

MAXSTACK = 4 

MAXLOCALS = 1
```

可以看到，我们必须在方法的开头增加四条指令，在返回指令之前添加四条其他指令。还需要更新操作数栈的最大尺寸。此方法代码的开头部分用 visitCode 方法访问。因此，可以通过重写方法适配器的这一方法，添加前四条指令：
```java
public void visitCode() { 
 mv.visitCode(); 
 mv.visitFieldInsn(GETSTATIC, owner, "timer", "J"); 
 mv.visitMethodInsn(INVOKESTATIC, "java/lang/System", 
 "currentTimeMillis", "()J"); 
 mv.visitInsn(LSUB); 
 mv.visitFieldInsn(PUTSTATIC, owner, "timer", "J"); 
}
```
其中的 owner 必须被设定为所转换类的名字。现在必须在任意 RETURN 之前添加其他四条指令，还要在任何 xRETURN 或 ATHROW 之前添加，它们都是终止该方法执行过程的指令。这些指令没有任何参数，因此在 visitInsn 方法中访问。于是，可以重写这一方法，以增加指令：
```java
public void visitInsn(int opcode) { 
 if ((opcode >= IRETURN && opcode <= RETURN) || opcode == ATHROW) { 
 mv.visitFieldInsn(GETSTATIC, owner, "timer", "J"); 
 mv.visitMethodInsn(INVOKESTATIC, "java/lang/System", 
 "currentTimeMillis", "()J"); 
 mv.visitInsn(LADD); 
 mv.visitFieldInsn(PUTSTATIC, owner, "timer", "J"); 
 } 
 mv.visitInsn(opcode); 
}
```

最后，必须更新操作数栈的最大大小。我们添加的指令压入两个 long 值，因此需要操作数栈中的四个槽。在此方法的开头，操作数栈初始为空，所以我们知道在开头添加的四条指令需要
一个大小为 4 的栈。还知道所插入的代码不会改变栈的状态（因为它弹出的值的数目与压入的数目相同）。因此，如果原代码需要一个大小为 s 的栈，那转换后的方法所需栈的最大大小为 max(4, s)。遗憾的是，我们还在返回指令前面添加了四条指令，我们并不知道操作数栈恰在执行这些指令之前时的大小。只知道它小于或等于 s。因此，我们只能说，在返回指令之前添加的代码可能要求操作数栈的大小达到 s+4。这种最糟情景在实际中很少发生：使用常见编译器时，RETURN之前的操作数栈仅包含返回值，即，它的大小最多为 0、1 或 2。但如果希望处理所有可能情景，那就需要考虑最糟情景。必须重写 visitMaxs 方法如下：
``` java
public void visitMaxs(int maxStack, int maxLocals) { 
 mv.visitMaxs(maxStack + 4, maxLocals); 
}
```

当然，也可以不需要为最大栈大小操心，而是依赖 COMPUTE_MAXS 选项，此外，它会计算最优值，而不是最差情景中的值。但对于这种简单的转换，以人工更新 maxStack 并不需要花
费太多精力。

现在就出现一个很有意义的问题：栈映射帧怎么样呢？原代码不包含任何帧，转换后的代码也没有包含，但这是因为我们用作示例的特定代码造成的吗？是否在某些情况下必须更新帧呢？答案是否定的，因为 1）插入的代码并没有改变操作数栈，2） 插入代码中没有包含跳转指令，3） 原代码的跳转指令（或者更正式地说，是控制流图）没有被修改。这意味着原帧没有发生变化，而且不需要为插入代码存储新帧，所以压缩后的原帧也没有发生变化。

现在可以将所有元素一起放入相关联的 ClassVisitor 和 MethodVisitor 子类中：
```java
public class AddTimerAdapter extends ClassVisitor { 
 private String owner; 
 private boolean isInterface; 
 public AddTimerAdapter(ClassVisitor cv) { 
 super(ASM4, cv); 
 } 
 @Override public void visit(int version, int access, String name, 
 String signature, String superName, String[] interfaces) { 
 cv.visit(version, access, name, signature, superName, interfaces); 
 owner = name; 
 isInterface = (access & ACC_INTERFACE) != 0; 
 } 
 @Override public MethodVisitor visitMethod(int access, String name, 
 String desc, String signature, String[] exceptions) { 
 MethodVisitor mv = cv.visitMethod(access, name, desc, signature, 
 exceptions); 
 if (!isInterface && mv != null && !name.equals("<init>")) { 
 mv = new AddTimerMethodAdapter(mv); 
 } 
 return mv; 
 } 
 @Override public void visitEnd() { 
 if (!isInterface) { 
 FieldVisitor fv = cv.visitField(ACC_PUBLIC + ACC_STATIC, "timer", 
 "J", null, null); 
 if (fv != null) {
    fv.visitEnd(); 
 } 
 } 
 cv.visitEnd(); 
 } 
 class AddTimerMethodAdapter extends MethodVisitor { 
 public AddTimerMethodAdapter(MethodVisitor mv) { 
 super(ASM4, mv); 
 } 
 @Override public void visitCode() { 
 mv.visitCode(); 
 mv.visitFieldInsn(GETSTATIC, owner, "timer", "J"); 
 mv.visitMethodInsn(INVOKESTATIC, "java/lang/System", 
 "currentTimeMillis", "()J"); 
 mv.visitInsn(LSUB); 
 mv.visitFieldInsn(PUTSTATIC, owner, "timer", "J"); 
 } 
 @Override public void visitInsn(int opcode) { 
 if ((opcode >= IRETURN && opcode <= RETURN) || opcode == ATHROW) { 
 mv.visitFieldInsn(GETSTATIC, owner, "timer", "J"); 
 mv.visitMethodInsn(INVOKESTATIC, "java/lang/System", 
 "currentTimeMillis", "()J"); 
 mv.visitInsn(LADD); 
 mv.visitFieldInsn(PUTSTATIC, owner, "timer", "J"); 
 } 
 mv.visitInsn(opcode); 
 } 
 @Override public void visitMaxs(int maxStack, int maxLocals) { 
 mv.visitMaxs(maxStack + 4, maxLocals); 
 } 
 } 
} 
```
这个类适配器用于实例化方法适配器（构造器除外），还用于添加计时器字段，并将被转换的类的名字存储在一个可以由方法适配器访问的字段中。

#### 有状态转换

更复杂的转换需要记忆在当前指令之前已访问指令的状态。例如，考虑这样一个转换，它将删除所有出现的 ICONST_0 IADD 序列，这个序列的操作就是加入 0，没有什么实际效果。显然，
在访问一条 IADD 指令时，只有当上一条被访问的指令是 ICONST_0 时，才必须删除该指令。这就要求在方法适配器中存储状态。因此，这种转换被称为有状态转换。

让我们更仔细地研究一下这个例子。在访问 ICONST_0 时，只有当下一条指令是 IADD 时才必须将其删除。问题是，下一条指令还是未知的。解决方法是将是否删除它的决定推迟到下一
条指令：如果下一指令是 IADD，则删除两条指令，否则，发出 ICONST_0 和当前指令。

要实现一些删除或替代某一指令序列的转换，比较方便的做法是引入一个 MethodVisitor子类，它的 visitXxx Insn 方法调用一个公用的 visitInsn()方法：
```java
public abstract class PatternMethodAdapter extends MethodVisitor { 
 protected final static int SEEN_NOTHING = 0; 
 protected int state; 
 public PatternMethodAdapter(int api, MethodVisitor mv) { 
 super(api, mv); 
 } 
 @Overrid public void visitInsn(int opcode) { 
 visitInsn(); 
 mv.visitInsn(opcode); 
 } 
 @Override public void visitIntInsn(int opcode, int operand) { 
 visitInsn(); 
 mv.visitIntInsn(opcode, operand); 
 } 
 ... 
 protected abstract void visitInsn(); 
}
```
然后，上述转换可实现如下：
```java
public class RemoveAddZeroAdapter extends PatternMethodAdapter { 
 private static int SEEN_ICONST_0 = 1; 
 public RemoveAddZeroAdapter(MethodVisitor mv) { 
 super(ASM4, mv); 
 } 
 @Override public void visitInsn(int opcode) { 
 if (state == SEEN_ICONST_0) { 
 if (opcode == IADD) { 
 state = SEEN_NOTHING; 
 return; 
 } 
 } 
 visitInsn(); 
 if (opcode == ICONST_0) { 
 state = SEEN_ICONST_0; 
 return; 
 } 
 mv.visitInsn(opcode); 
 } 
 @Override protected void visitInsn() { 
 if (state == SEEN_ICONST_0) { 
 mv.visitInsn(ICONST_0); 
 } 
 state = SEEN_NOTHING; 
 } 
}
```

visitInsn(int)方法首先判断是否已经检测到该序列。在这种情况下，它重新初始化state，并立即返回，其效果就是删除该序列。在其他情况下，它会调用公用的 visitInsn 方
法，如果 ICONST_0 是最后一条被访问序列，它就会发出该指令。于是，如果当前指令是ICONST_0，它会记住这个事实并返回，延迟关于这一指令的决定。在所有其他情况下，当前指
令都被转发到下一访问器。

**标记和帧**

对标记和帧的访问是恰在它们的相关指令之前进行。换句话说，尽管它们本身并不是指令，但它们是与指令同时受到访问的。这对于检测指令序列的转换会有影响，但这一影响实际上是一种优势。事实上，如果删除的指令之一是一条跳转指令的目标，会发生什么情况呢？如果某一指令可能跳转到 ICONST_0，这意味着有一个指定这一指令的标记。在删除了这两条指令后，这个标记将指向跟在被删除 IADD 之后的指令，这正是我们希望的。但如果某一指令可能跳转到 IADD，我们就不能删除这个指令序列（不能确保在这一跳转之前，已经在栈中压入了一个 0）。幸好，在这种情况下，ICONST_0 和 IADD 之间必然有一个标记，可以很轻松地检测到它。

这一推理过程对于栈映射帧是一样的：如果访问介于两条指令之间的一个栈映射帧，那就不能删除它们。要处理这两种情况，可以将标记和帧看作是模型匹配算法中的指令。这一点可以在
PatternMethodAdapter 中完成（注意，visitMaxs 也会调用公用的 visitInsn 方法；它用于处理的情景是：方法的末尾是必须被检测序列的一个前缀）：

``` java
public abstract class PatternMethodAdapter extends MethodVisitor { 
 ... 
 @Override public void visitFrame(int type, int nLocal, Object[] local, 
 int nStack, Object[] stack) { 
 visitInsn(); 
 mv.visitFrame(type, nLocal, local, nStack, stack); 
 } 
 @Override public void visitLabel(Label label) { 
 visitInsn(); 
 mv.visitLabel(label); 
 } 
 @Override public void visitMaxs(int maxStack, int maxLocals) { 
 visitInsn(); 
 mv.visitMaxs(maxStack, maxLocals); 
 } 
}
```

考虑一个转换，它会删除对字段进行自我赋值的操作，这种操作通常是因为键入错误，比如 f = f;，或者是在字节代码中，ALOAD 0 ALOAD 0 GETFIELD f PUTFIELD f。在实现这一转换之前，最好是将状态机设计为能够识别这一序列

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240320170055.png)

每个转换都标有一个条件（当前指令的值）和一个操作（必须发出的指令序列，以粗体表示）。例如，如果当前指令不是 ALOAD 0，则由 S1 转换到 S0。在这种情况下，导致进入这一状态的ALOAD 0 将被发出。注意从 S2 到其自身的转换：在发现三个或三个以上的连续 ALOAD 0 时会发生这一情况。在这种情况下，将停留在已经访问两个 ALOAD 0 的状态中，并发出第三个 ALOAD 0。找到状态机之后，相应方法适配器的编写就简单了。（8 种 Switch 情景对应于图中的 8 种转换）：
```java
class RemoveGetFieldPutFieldAdapter extends PatternMethodAdapter { 
 private final static int SEEN_ALOAD_0 = 1; 
 private final static int SEEN_ALOAD_0ALOAD_0 = 2; 
 private final static int SEEN_ALOAD_0ALOAD_0GETFIELD = 3; 
 private String fieldOwner; 
 private String fieldName; 
 private String fieldDesc; 
 public RemoveGetFieldPutFieldAdapter(MethodVisitor mv) { 
 super(mv); 
 } 
 @Override 
 public void visitVarInsn(int opcode, int var) { 
 switch (state) { 
 case SEEN_NOTHING: // S0 -> S1 
 if (opcode == ALOAD && var == 0) { 
 state = SEEN_ALOAD_0; 
 return; 
 } 
 break; 
 case SEEN_ALOAD_0: // S1 -> S2 
 if (opcode == ALOAD && var == 0) { 
 state = SEEN_ALOAD_0ALOAD_0; 
 return; 
 } 
 case SEEN_ALOAD_0ALOAD_0: // S2 -> S2 
 if (opcode == ALOAD && var == 0) { 
 mv.visitVarInsn(ALOAD, 0); 
 return; 
 } 
 break; 
 } 
 visitInsn(); 
 mv.visitVarInsn(opcode, var); 
 } 
 @Override 
 public void visitFieldInsn(int opcode, String owner, String name, 
 String desc) { 
 switch (state) { 
 case SEEN_ALOAD_0ALOAD_0: // S2 -> S3 
 if (opcode == GETFIELD) { 
 state = SEEN_ALOAD_0ALOAD_0GETFIELD; 
 fieldOwner = owner; 
 fieldName = name; 
 fieldDesc = desc; 
 return; 
 } 
 break; 
 case SEEN_ALOAD_0ALOAD_0GETFIELD: // S3 -> S0 
 if (opcode == PUTFIELD && name.equals(fieldName)) { 
 state = SEEN_NOTHING; 
 return; 
 }
  
 visitInsn(); 
 mv.visitFieldInsn(opcode, owner, name, desc); 
 } 
 @Override protected void visitInsn() { 
 switch (state) { 
 case SEEN_ALOAD_0: // S1 -> S0 
 mv.visitVarInsn(ALOAD, 0); 
 break; 
 case SEEN_ALOAD_0ALOAD_0: // S2 -> S0 
 mv.visitVarInsn(ALOAD, 0); 
 mv.visitVarInsn(ALOAD, 0); 
 break; 
 case SEEN_ALOAD_0ALOAD_0GETFIELD: // S3 -> S0 
 mv.visitVarInsn(ALOAD, 0); 
 mv.visitVarInsn(ALOAD, 0); 
 mv.visitFieldInsn(GETFIELD, fieldOwner, fieldName, fieldDesc); 
 break; 
 } 
 state = SEEN_NOTHING; 
 } 
}
```

## 工具

org.objectweb.asm.commons 包中包含了一些预定义的方法适配器，可用于定义我们自己的适配器。

### 基本工具

**1. Type** 

许多字节代码指令，比如 xLOAD、xADD 或 xRETURN 依赖于将它们应用于哪种类型。Type类提供了一个 getOpcode 方法，可用于为这些指令获取与一给定类型相对应的操作码。这一方
法的参数是一个 int 类型的操作码，针对哪种类型调用该方法，则返回该哪种类型的操作码。例如 t.getOpcode(IMUL)，若 t 等于 Type.FLOAT_TYPE，则返回 FMUL。

**2. TraceClassVisitor**

可以将它用来跟踪在一个转换链中任意点处所生成或所转换方法的内容。例如：
``` bash
java -classpath asm.jar:asm-util.jar \ 
 org.objectweb.asm.util.TraceClassVisitor \ 
 java.lang.Void 
```
将输出：
```java
// class version 49.0 (49) 
// access flags 49 
public final class java/lang/Void { 
 // access flags 25 
 // signature Ljava/lang/Class<Ljava/lang/Void;>; 
 // declaration: java.lang.Class<java.lang.Void> 
 public final static Ljava/lang/Class; TYPE 
 // access flags 2 
 private <init>()V 
 ALOAD 0 
 INVOKESPECIAL java/lang/Object.<init> ()V 
 RETURN 
 MAXSTACK = 1 
 MAXLOCALS = 1 
 // access flags 8 
 static <clinit>()V 
 LDC "void" 
 INVOKESTATIC java/lang/Class.getPrimitiveClass (...)... 
 PUTSTATIC java/lang/Void.TYPE : Ljava/lang/Class; 
 RETURN 
 MAXSTACK = 1 
 MAXLOCALS = 0 
}
```
它说明如何生成一个静态块 static { ... }，也就是用 < clinit >方法（用于 CLassINITializer）。注意，如果希望跟踪某一个方法在链中某一点处的内容，而不是跟踪类的所
有内容，可以用 TraceMethodVisitor 代替 TraceClassVisitor（在这种情况下，必须显式指定后端；这里使用了一个 Textifier）：
```java
public MethodVisitor visitMethod(int access, String name, 
 String desc, String signature, String[] exceptions) { 
 MethodVisitor mv = cv.visitMethod(access, name, desc, signature, 
 exceptions); 
 if (debug && mv != null && ...) { // 如果必须跟踪此方法
 Printer p = new Textifier(ASM4) { 
 @Override public void visitMethodEnd() { 
 print(aPrintWriter); // 在其被访问后输出它
 } 
 }; 
 mv = new TraceMethodVisitor(mv, p); 
 } 
 return new MyMethodAdapter(mv); 
} 
```
这一代码输出该方法经 MyMethodAdapter 转换过后的结果。

**3. CheckClassAdapter**

它检查 ClassVisitor 方法的调用顺序是否适当，参数是否有效，所做的工作与 MethodVisitor 方法相同。因此，可用于检查 MethodVisitor API在一个转换链中任意点的使用是否正常。和 TraceMethodVisitor 类似，可以用CheckMethodAdapter 类来检查一个方法，而不是检查它的整个类：
```java
 String desc, String signature, String[] exceptions) { 
 MethodVisitor mv = cv.visitMethod(access, name, desc, signature, 
 exceptions); 
 if (debug && mv != null && ...) { // 如果必须检查这个方法
 mv = new CheckMethodAdapter(mv); 
 } 
 return new MyMethodAdapter(mv); 
} 
```
这一代码验证 MyMethodAdapter 正确地使用了 MethodVisitor API。但要注意，这一适配器并没有验证字节代码是正确的：例如，它没有检测出 ISTORE 1 ALOAD 1 是无效的。
实际上，如果使用 CheckMethodAdapter 的其他构造器（见 Javadoc），并且在 visitMaxs中提供有效的 maxStack 和 maxLocals 参数，那这种错误是可以被检测出来的。

#### AnalyzerAdapter
这个方法适配器根据 visitFrame 中访问的帧，计算每条指令之前的栈映射帧。visitFrame 仅在方法中的一些特定指令前调用，一方面是为了节省空间，另一方面也是因为“其他帧可以轻松快速地由这些帧推导得出”。这就是这个适配器所做的工作。当然，它仅对那些包含预计算栈映射帧的类有效，也就是对于用 Java 6 或更高版本编译的有效（或者用一个使用 COMPUTE_FRAMES 选项的 ASM 适配器升级到 Java 6）。

#### LocalVariablesSorter

这个方法适配器将一个方法中使用的局部变量按照它们在这个方法中的出现顺序重新进行编号。例如，在一个有两个参数的方法中，第一个被读取或写入且索引大于或等于 3 的局部变量
（前三个局部变量对应于 this 及两个方法参数，因此不会发生变化）被赋予索引 3，第二个被赋予索引 4，以此类推。在向一个方法中插入新的局部变量时，这个适配器很有用。没有这个适配器，就需要在所有已有局部变量之后添加新的局部变量，但遗憾的是，在 visitMaxs 中，要直到方法的末尾处才能知道这些局部变量的编号。

#### AdviceAdapter

这个方法适配器是一个抽象类，可用于在一个方法的开头以及恰在任意 RETURN 或 ATHROW指令之前插入代码。它的主要好处就是对于构造器也是有效的，在构造器中，不能将代码恰好插
入到构造器的开头，而是插在对超构造器的调用之后。事实上，这个适配器的大多数代码都专门用于检测对这个超构造器的调用。

## 元数据

### 泛型

诸如 List< E >之类的泛型类，以及使用它们的类，包含了有关它们所声明或使用的泛型的
信息。这一信息不是由字节代码指令在运行时使用，但可通过反射 API 访问。它还可以供编译器使用，以进行分离编译。

出于后向兼容的原因，有关泛型的信息没有存储在类型或方法描述符中（它们的定义远早于
Java 5 中对泛型的引入），而是保存在称为类型、方法和类签名的类似构造中。在涉及泛型时，
除了描述符之外，这些签名也会存储在类、字段和方法声明中（泛型不会影响方法的字节代码：
编译器用它们执行静态类型检查，但会在必要时重新引入类型转换，就像这些方法未被使用一样
进行编译）

与类型和方法描述符不同，类型签名的语法非常复杂，这也是因为泛型的递归本质造成的（一
个泛型可以将另一泛型作为参数——例如，考虑 List< List < E > >）。其语法由以下规则给出（有
关这些规则的完整描述，请参阅《Java 虚拟机规范》）：

``` bash
TypeSignature: Z | C | B | S | I | F | J | D | FieldTypeSignature 
FieldTypeSignature: ClassTypeSignature |  TypeSignature | TypeVar 
ClassTypeSignature: L Id ( / Id )* TypeArgs? ( . Id TypeArgs? )* ; 
TypeArgs: < TypeArg+ > 
TypeArg: * | ( + | - )? FieldTypeSignature 
TypeVar: T Id ;
```

第一条规则表明，类型签名或者是一个基元类型描述符，或者是一个字段类型签名。第二条
规则将一个字段类型签名定义为一个类类型签名、数组类型签名或类型变量。第三条规则定义类
类型签名：它们是类类型描述符，在主类名之后或者内部类名之后的尖括号中可能带有类型参数（以点为前缀）。其他规则定义了类型参数和类型变量。注意，一个类型参数可能是一个完整的
字段类型签名，带有它自己的类型参数：因此，类型签名可能非常复杂

Java 类型和相应的类型签名

```
List<E>
Ljava/util/List<TE;>; 
List<?>
Ljava/util/List<*>; 
List<? extends Number>
Ljava/util/List<+Ljava/lang/Number;>; 
List<? super Integer>
Ljava/util/List<-Ljava/lang/Integer;>; 
List<List<String>[]>
Ljava/util/List<Ljava/util/List<Ljava/lang/String;>;>; 
HashMap<K, V>.HashIterator<K>
Ljava/util/HashMap<TK;TV;>.HashIterator<TK;>;
```

方法签名扩展了方法描述符，就像类型签名扩展了类型描述符。方法签名描述了方法参数的
类型签名及其返回类型的签名。与方法描述符不同的是，它还包含了该方法所抛出异常的签名，前面带有^前缀，还可以在尖括号之间包含可选的形式类型参数：
``` 
MethodTypeSignature: 
 TypeParams? ( TypeSignature* ) ( TypeSignature | V ) Exception* 
Exception: ^ClassTypeSignature | ^TypeVar 
TypeParams: < TypeParam+ > 
TypeParam: Id : FieldTypeSignature? ( : FieldTypeSignature )*
```
比如以下泛型静态方法的方法签名，它以类型变量 T 为参数：
```java
static <T> Class<? extends T> m (int n) 
```
它是以下方法签名：
```bash
<T:Ljava/lang/Object;>(I)Ljava/lang/Class<+TT;>;
```
最后要说的是类签名，不要将它与类类型签名相混淆，它被定义为其超类的类型签名，后面
跟有所实现接口的类型签名，以及可选的形式类型参数：
```
ClassSignature: TypeParams? ClassTypeSignature ClassTypeSignature*
```
例如，一个被声明为 C< E > extends List< E > 的类的类签名就是
```
<E:Ljava/lang/Object;>Ljava/util/List<TE;>;。
```

#### 接口与组件
和描述符的情况一样，也出于相同的效果原因，ASM API 公开签名的形式与
它们在编译类中的存储形式相同（签名主要出现在 ClassVisitor 类的 visit、visitField
和 visitMethod 方法中，分别作为可选类、类型或方法签名参数）。幸好它还在org.objectweb.asm.signature 包中提供了一些基于 SignatureVisitor 抽象类的工
具，用于生成和转换签名
``` java
public abstract class SignatureVisitor { 
 public final static char EXTENDS = ’+’; 
 public final static char SUPER = ’-’; 
 public final static char INSTANCEOF = ’=’; 
 public SignatureVisitor(int api); 
 public void visitFormalTypeParameter(String name); 
 public SignatureVisitor visitClassBound(); 
 public SignatureVisitor visitInterfaceBound(); 
 public SignatureVisitor visitSuperclass(); 
 public SignatureVisitor visitInterface(); 
 public SignatureVisitor visitParameterType(); 
 public SignatureVisitor visitReturnType(); 
 public SignatureVisitor visitExceptionType(); 
 public void visitBaseType(char descriptor); 
 public void visitTypeVariable(String name); 
 public SignatureVisitor visitArrayType(); 
 public void visitClassType(String name); 
 public void visitInnerClassType(String name); 
 public void visitTypeArgument(); 
 public SignatureVisitor visitTypeArgument(char wildcard); 
 public void visitEnd(); 
}
```
这个抽象类用于访问类型签名、方法签名和类签名。用于类型签名的方法以粗体显示，必须
按以下顺序调用，它反映了前面的语法规则（注意，其中两个返回了 SignatureVisitor：这
是因为类型签名的递归定义导致的）：
```bash
visitBaseType | visitArrayType | visitTypeVariable | 
( visitClassType visitTypeArgument* 
 ( visitInnerClassType visitTypeArgument* )* visitEnd ) 
```
用于访问方法签名的方法如下：
```
( visitFormalTypeParameter visitClassBound? visitInterfaceBound* )* 
visitParameterType* visitReturnType visitExceptionType* 
```
最后，用于访问类签名的方法为：
```
( visitFormalTypeParameter visitClassBound? visitInterfaceBound* )* 
visitSuperClass visitInterface*
```

这些方法大多返回一个 SignatureVisitor：它是准备用来访问类型签名的。注意，不同
于 ClassVisitor 返回的 MethodVisitors ， SignatureVisitor 返回的
SignatureVisitors 不得为 null，而且必须顺序使用：事实上，在完全访问一个嵌套签名之前，不得访问父访问器的任何方法。

和类的情况一样，ASM API 基于这个 API 提供了两个组件：SignatureReader 组件分析
一个签名，并针对一个给定的签名访问器调用适当的访问方法；SignatureWriter 组件基于它接收到的方法调用生成一个签名。

利用与类和方法相同的原理，这两个类可用于生成和转换签名。例如，假定我们希望对出现
在某些签名中的类名进行重命名。这一效果可以用以下签名适配器完成，除 visitClassType
和 visitInnerClassType 方法之外，它将自己接收到的所有其他方法调用都不加修改地加以
转发（这里假设 sv 方法总是返回 this，SignatureWriter 就属于这种情况）：
```java
public class RenameSignatureAdapter extends SignatureVisitor { 
 private SignatureVisitor sv; 
 private Map<String, String> renaming; 
 private String oldName; 
 public RenameSignatureAdapter(SignatureVisitor sv, 
 Map<String, String> renaming) { 
 super(ASM4); 
 this.sv = sv; 
 this.renaming = renaming; 
 } 
 public void visitFormalTypeParameter(String name) { 
 sv.visitFormalTypeParameter(name); 
 } 
 public SignatureVisitor visitClassBound() { 
 sv.visitClassBound(); 
 return this; 
 } 
 public SignatureVisitor visitInterfaceBound() { 
 sv.visitInterfaceBound(); 
 return this; 
 } 
 ... 
 public void visitClassType(String name) { 
 oldName = name; 
 String newName = renaming.get(oldName); 
 sv.visitClassType(newName == null ? name : newName); 
 } 
 public void visitInnerClassType(String name) { 
 oldName = oldName + "." + name; 
 String newName = renaming.get(oldName); 
 sv.visitInnerClassType(newName == null ? name : newName); 
 } 
 public void visitTypeArgument() { 
 sv.visitTypeArgument(); 
 } 
 public SignatureVisitor visitTypeArgument(char wildcard) { 
 sv.visitTypeArgument(wildcard); 
 return this; 
 } 
 public void visitEnd() { 
 sv.visitEnd(); 
 } 
}
```
因此，以下代码的结果为
``` java
"LA<TK;TV;>.B<TK;>;"：
String s = "Ljava/util/HashMap<TK;TV;>.HashIterator<TK;>;"; 
Map<String, String> renaming = new HashMap<String, String>(); 
renaming.put("java/util/HashMap", "A"); 
renaming.put("java/util/HashMap.HashIterator", "B"); 
SignatureWriter sw = new SignatureWriter(); 
SignatureVisitor sa = new RenameSignatureAdapter(sw, renaming); 
SignatureReader sr = new SignatureReader(s); 
sr.acceptType(sa); 
sw.toString();
```

#### 工具

TraceClassVisitor 和ASMifier类以内部形式打印类文件中包含的签名。
利用它们，可以通过以下方式找出与一个给定泛型相对应的签名：编写一个具有某一泛型的 Java
类，编译它，并用这些命令行工具来找出对应的签名。

### 注释

类、字段、方法和方法参数注释，比如@Deprecated 或@Override，只要它们的保留策
略不是 RetentionPolicy.SOURCE，它们就会被存储在编译后的类中。这一信息不是在运行
时供字节代码指令使用，但是，如果保留策略是 RetentionPolicy.RUNTIME，则可以通过
反射 API 访问它。它还可以供编译器使用。

#### 结构
源代码中的注释可以具有各种不同形式，比如 @Deprecated 、
@Retention(RetentionPolicy.CLASS)或@Task(desc="refactor", id=1)。但在内
部，所有注释的形式都是相同的，由一种注释类型和一组名称/值对规定，其中的取值仅限于如
下几种：

- 基元，String 或 Class 值
- 枚举值
- 注释值
- 上述值的数组

注意，一个注释中可以包含其他注释，甚至可以包含注释数组。因此，注释可能非常复杂。

#### 接口与组件
用于生成和转换注释的 ASM API 是基于 AnnotationVisitor 抽象类的

``` java
public abstract class AnnotationVisitor { 
 public AnnotationVisitor(int api); 
 public AnnotationVisitor(int api, AnnotationVisitor av); 
 public void visit(String name, Object value); 
 public void visitEnum(String name, String desc, String value); 
 public AnnotationVisitor visitAnnotation(String name, String desc); 
 public AnnotationVisitor visitArray(String name); 
 public void visitEnd(); 
}
```
这个类的方法用于访问一个注释的名称/值对（注释类型在访问这一类型的方法中访问，即visitAnnotation 方法）。第一个方法用于基元、String 和 Class 值（后者用 Type 对象表
示），其他方法用于枚举、注释和数组值。可以按任意顺序调用它们，visitEnd 除外：
```
( visit | visitEnum | visitAnnotation | visitArray )* visitEnd 
```
注意，两个方法返回 AnnotationVisitor：这是因为注释可以包含其他注释。另外，与
ClassVisitor 返回的 MethodVisitor 不同，这两个方法返回的 AnnotationVisitors
必须顺序使用：事实上，在完全访问一个嵌套注释之前，不能调用父访问器的任何方法。

还要注意，visitArray 方法返回一个 AnnotationVisitor，以访问数组的元素。但是，
由于数组的元素未被命名，因此，name 参数被 visitArray 返回的访问器的方法忽略，可以
设定为 null。

**1. 添加、删除和检测注释**

与字段和方法的情景一样，可以通过在 visitAnnotation 方法中返回 null 来删除注释：
``` java
public class RemoveAnnotationAdapter extends ClassVisitor { 
 private String annDesc; 
 public RemoveAnnotationAdapter(ClassVisitor cv, String annDesc) { 
 super(ASM4, cv); 
 this.annDesc = annDesc; 
 } 
 @Override 
 public AnnotationVisitor visitAnnotation(String desc, boolean vis) { 
 if (desc.equals(annDesc)) { 
 return null; 
 } 
 return cv.visitAnnotation(desc, vis); 
 } 
}
```
类注释的添加要更难一些，因为存在一些限制条件：必须调用 ClassVisitor 类的方法。
事实上，所有可以跟在 visitAnnotation 之后的方法都必须重写，以检测什么时候已经访问
了所有注释（因为 visitCode 方法的原因，方法注释的添加更容易一些）：
``` java
public class AddAnnotationAdapter extends ClassVisitor { 
 private String annotationDesc; 
 private boolean isAnnotationPresent; 
 public AddAnnotationAdapter(ClassVisitor cv, String annotationDesc) { 
 super(ASM4, cv); 
 this.annotationDesc = annotationDesc; 
 } 
 @Override public void visit(int version, int access, String name, 
 String signature, String superName, String[] interfaces) { 
 cv.visit(v, access, name, signature, superName, interfaces); 
 } 
 @Override public AnnotationVisitor visitAnnotation(String desc, 
 boolean visible) { 
 if (visible && desc.equals(annotationDesc)) { 
 isAnnotationPresent = true; 
 } 
 return cv.visitAnnotation(desc, visible); 
 } 
 @Override public void visitInnerClass(String name, String outerName, 
 String innerName, int access) { 
 addAnnotation(); 
 cv.visitInnerClass(name, outerName, innerName, access);
  } 
 @Override 
 public FieldVisitor visitField(int access, String name, String desc, 
 String signature, Object value) { 
 addAnnotation(); 
 return cv.visitField(access, name, desc, signature, value); 
 } 
 @Override 
 public MethodVisitor visitMethod(int access, String name, 
 String desc, String signature, String[] exceptions) { 
 addAnnotation(); 
 return cv.visitMethod(access, name, desc, signature, exceptions); 
 } 
 @Override public void visitEnd() { 
 addAnnotation(); 
 cv.visitEnd(); 
 } 
 private void addAnnotation() { 
 if (!isAnnotationPresent) { 
 AnnotationVisitor av = cv.visitAnnotation(annotationDesc, true); 
 if (av != null) { 
 av.visitEnd(); 
 } 
 isAnnotationPresent = true; 
 } 
 } 
}
```
注意，如果类版本低于 1.5，这个适配器将其更新至该版本。这是必要地，因为对于版本低
于 1.5 的类，JVM 会忽略其中的注释。

注释在类和方法适配器中的最后一种应用情景，也可能是最常见的应用情景，就是以注释实
现转换的参数化。例如，你可能仅对于那些具有@Persistent 注释的字段来转换字段的访问，
仅对于那些拥有@Log 注释的方法添加记录代码，如此等等。所有这些应用情景都可以很轻松地
实现，因为注释是必须首先访问的：必须在字段和方法之前访问类注释，必须在代码之前访问方
法和参数注释。因此，只需在检测到所需注释时设定一个标志，然后在后面的转换中使用，就像
上面的例子用 isAnnotationPresent 标志所做的事情。

#### 工具
TraceClassVisitor, CheckClassAdapter 和 ASMifier 类也支持注释
（就像对于方法一样，还可能使用 TraceAnnotationVisitor 或
CheckAnnotationAdapter，在各个注释的级别工作，而不是在类级别工作）。它们可用于查
看如何生成某个特定注释。例如，使用以下代码：
``` bash
java -classpath asm.jar:asm-util.jar \1 
 org.objectweb.asm.util.ASMifier \ 
 java.lang.Deprecated
 ```
 将输出如下代码（经过微小的重构）：
 ```java
package asm.java.lang; 
import org.objectweb.asm.*; 
public class DeprecatedDump implements Opcodes {
     public static byte[] dump() throws Exception { 
 ClassWriter cw = new ClassWriter(0); 
 AnnotationVisitor av; 
 cw.visit(V1_5, ACC_PUBLIC + ACC_ANNOTATION + ACC_ABSTRACT 
 + ACC_INTERFACE, "java/lang/Deprecated", null, 
 "java/lang/Object", 
 new String[] { "java/lang/annotation/Annotation" }); 
 { 
 av = cw.visitAnnotation("Ljava/lang/annotation/Documented;", 
 true); 
 av.visitEnd(); 
 } 
 { 
 av = cw.visitAnnotation("Ljava/lang/annotation/Retention;", true); 
 av.visitEnum("value", "Ljava/lang/annotation/RetentionPolicy;", 
 "RUNTIME"); 
 av.visitEnd(); 
 } 
 cw.visitEnd(); 
 return cw.toByteArray(); 
 } 
}
```
此代码说明如何用 ACC_ANNOTATION 标志创建一个注释类，并说明如何创建两个类注释，
一个没有值，一个具有枚举值。方法注释和参数注释可以采用 MethodVisitor 类中定义的
visitAnnotation 和 visitParameterAnnotation 方法以类似方式创建。

### 调试
以 javac -g 编译的类中包含了其源文件的名字、源代码行编号与字节代码指令之间的
映射、源代码中局部变量名与字节代码中局部变量槽之间的映射。当这一可选信息可用时，
会在调试器中和异常栈轨迹中使用它们。

#### 结构
源代码行编号与字节代码指令之间的映射存储为一个由（line number, label）对组成的列表
中，放在方法的已编译代码部分中。例如，如果 l1、l2 和 l3 是按此顺序出现的三个标记，则下面各对：
```
(n1, l1) 
(n2, l2) 
(n3, l3) 
```
意味着 l1 和 l2 之间的指令来自行 n1，l2 和 l3 之间的指令来自 n2，l3 之后的指令来自行 n3。注意，一个给定行号可以出现在几个对中。这是因为，对于出现在一个源代码行中的表达式，其在字节代码中的相应指令可能不是连续的。例如，for (init; cond; incr) statement;通常是按以下顺序编译的：
```
init statement incr cond
```
源代码中局部变量名与字节代码中局部变量槽之间的映射，以(name, type descriptor, type 
signature, start, end, index)等多元组列表的形式存储在该方法的已编译代码节中。这样一个多元组
的含义是：在两个标记 start 和 end 之间，槽 index 中的局部变量对应于源代码中的局部变量，其
名字和类型由多元组的前三个元素组出。注意，编译器可以使用相同的局部变量槽来存储具有不
同作用范围的不同源局部变量。反之，同一个源代码局部变量可能被编译为一个具有非连续作用
范围的局部变量槽。例如，有可能存在一种类似如下的情景：
```
l1: 
... // 这里的槽 1 包含局部变量 i 
l2: 
... // 这里的槽 1 包含局部变量 j 
l3: 
... // 这里的槽 1 再次包含局部变量 i 
end: 
```
相应的多元组为：
```
("i", "I", null, l1, l2, 1) 
("j", "I", null, l2, l3, 1) 
("i", "I", null, l3, end, 1)
```

#### 接口和组件
调试信息用 ClassVisitor 和 MethodVisitor 类的三个方法访问：

- 源文件名用 ClassVisitor 类的 visitSource 方法访问；
- 源代码行号与字节代码指令之间的映射用 MethodVisitor 类的 visitLineNumber
方法访问，每次访问一对；
- 源代码中局部变量名与字节代码中局部变量槽之间的映射用 MethodVisitor 类的
visitLocalVariable 方法访问，每次访问一个多元组。

visitLineNumber 方法必须在已经访问了作为参数传送的标记之后进行调用。在实践中，
就是在访问这一标记后立即调用它，从而可以非常容易地知道一个方法访问器中当前指令的源代码行：
``` java
public class MyAdapter extends MethodVisitor { 
 int currentLine; 
 public MyAdapter(MethodVisitor mv) { 
 super(ASM4, mv); 
 } 
 @Override 
 public void visitLineNumber(int line, Label start) { 
 mv.visitLineNumber(line, start); 
 currentLine = line; 
 } 
 ... 
}
```
类似地，visitLocalVariable 方法方法必须在已经访问了作为参数传送的标记之后调
用。下面给出一些方法调用示例，它们对应于上一节给出的名称值对和多元组：
```java
visitLineNumber(n1, l1); 
visitLineNumber(n2, l2); 
visitLineNumber(n3, l3); 
visitLocalVariable("i", "I", null, l1, l2, 1); 
visitLocalVariable("j", "I", null, l2, l3, 1); 
visitLocalVariable("i", "I", null, l3, end, 1);
```

**忽略调试信息**
为了访问行号和局部变量名，ClassReader 类可能需要引入“人为”Label 对象，也就
是说，跳转指令并不需要它们，它们只是为了表示调试信息。为避免这种误判，可以在 ClassReader.accept 方法中使用 SKIP_DEBUG 选项。有了这
一选项，类读取器不会访问调试信息，不会为它创建人为标记。当然，调试信息会从类中删除，因此，只有在不会为应用程序造成问题时才能使用这一选项。

#### 工具
和泛型与注释的情景一样，可以使用 TraceClassVisitor、CheckClassAdapter 和
ASMifier 类来了解如何使用调试信息。


## 后向兼容

过去已经在类文件格式中引入了新的元素，未来还将继续添加新元素（例如，用于模块化、
Java 类型的注释，等等）。到 ASM 3.x，这样的每一次变化都会导致 ASM API 中的后向不兼容变
化，这不是件好事情。为解决这些问题，ASM 4.0 中已经引入了一种新机制。它的目的是确保未
来所有 ASM 版本都将与之前直到 ASM 4.0 的任意版本保持后向兼容，即使向类文件格式中引入
了新的功能时也能保持这种兼容性。这意味着，从 4.0 开始，为一个 ASM 版本编写的类生成器、
类分析器或类适配器，将可以在任何未来 ASM 版本中使用。但是，仅靠 ASM 自身是不能确保
这一性质的。它需要用户在编写代码时遵循一些简单的准则。

> ASM 4.0 中引入的后向兼容机制要求将 ClassVisitor 、 FieldVisitor 、
MethodVisitor 等由接口变为抽象类，具有一个以 ASM 版本为参数的构造器。如果你的代码是为 ASM 3.x 实现的，可以将其升级至 ASM 4.0：将代码分析器和适配器中的 implements 用 extends 替换，并在它们的构造器中指定一个 ASM 版本。此外，ClassAdapter 和 MethodAdapter 还被合并到ClassVisitor 和 MethodVisitor 中。要转换代码，只需用 ClassVisitor 代 替ClassAdapter，用 MethodVisitor 代替 MethodAdapter。另外，如果定义了自定义的FieldAdapter 或 AnnotationAdapter 类，现在可以用 FieldVisitor 和AnnotationVisitor 代替它们。

#### 后向兼容约定

首先，研究一下新的类文件特征如何影响代码生成器、分析器和适配器是非常重要的。也就
是说，在不受任何实现和二进制兼容问题影响时，在引入这些新特征之前设计的类生成器、分析
器或适配器在进行这些修改之后还是否有效？换言之，如果有一个在引入这些新功能之前设计的
转换链，假定这些新功功直接被忽略，原封不动地通过转换链，那这个转换链还是否依然有效？
事实上，类生成器、分析器和适配器受到的影响是不同的：

- 类生成器不受影响：它们生成具有某一固定类版本的代码，这些生成的类在未来的 JVM
版本中依然有效，因为 JVM 确定了后向二进制兼容。
- 类分析器可能受到影响，也可能不受影响。例如，有一段用于分析字节代码指令的代码，
它是为 Java 4 编写的，它也许能够正常处理 Java 5 类，尽管 Java 5 中引入了注释。但同一段代码也许不再能处理 Java 7 类，因为它不能忽略新的动态调用指令。
- 类适配器可能受到影响，也可能不受影响。死代码清除工具不会因为引入注释而受到影
响，甚至不会受到新的动态调用指令的影响。但另一方面，这两种新特性可能都会影
响到为类进行重命名的工具。

这表明，新的类文件特性可能会对已有的类分析器或适配器产生不可预测的影响。如果新的
特性直接被忽略，原封不动地通过一个分析链或转换链，这个链在某些情况下可以运行，不产生
错误，并给出有效结果，而在某些情况下，也可以运行，不产生错误，但却给出无效结果，而在
另外一些情况下，可能会在执行期间失败。第二种情景的问题尤其严重，因为它会在用户不知晓
的情况下破坏分析链或转换链的语义，从而导致难以找出 Bug。为解决这一问题，我们认为最好
不要忽略新特性，而是只要在分析链或转换链中遇到未知特性，就产生一条错误。这种错误发出
信号：这个链也许能够处理新的类格式，也许不能，链的编写者必须分析具体情景，并在必要时进行更新。

所有上述内容引出了后向兼容性约定的如下定义：

- ASM 版本 X 是为版本号低于小等于 x 的 Java 类编写的。它不能生成版本号 y>x 的类，如果在 ClassReader.accept 中，以一个版本号大于 x 的类作为输入，它必须失败。

- 对于为 ASM X 编写且遵循了以下所述规则的代码，当输入类的版本不超过 x，对于 ASM
未来任意大于 X 的版本 Y，该代码都能不加修改地正常工作。

- 对于为 ASM X 编写且遵循了以下所述规则的代码，当输入类的声明版本为 y，但仅使
用了在不晚于版本 x 中定义的功能，则在使用 ASM Y 或任意未来版本时，该代码能够
不加修改地正常工作。

- 对于为 ASM X 编写且遵循了以下所述规则的代码，当输入类使用了在版本号为 y>x 的类中定义的功能时，对于 ASM X 或任意其他未来版本，该代码都必须失败。注意，最后三点与类生成器无关，因为它没有类输入。

#### 一个例子

假定将向 Java 8 类中添加两个新的假设属性，一个用于存储类的作者，另一个用于存储它的许可。还假设这些新的属性在 ASM 5.0 中通过 ClassVisitor 的两个新方法公开，一个是：
```java
void visitLicense(String license);
```
用于访问许可，还有一个是 visitSource 的新版本，用于在访问源文件名和调试信息的同时访问作者
```java
@Deprecated void visitSource(String source, String debug);
```
作者和许可属性是可选的，即对 visitLicense 的调用并非强制的，在一个 visitSource调用中，author 可能是 null

### 规则
在使用 ASM API 时，要想确保你的代码在所有未来 ASM 版本中都有效（其意义见上述约定），就必须遵循这些规则。

首先，如果编写一个类生成器，那不需要遵循任何规则。例如，如果正在为 ASM 4.0 编写一个类生成器，它可能包含一个类似于 visitSource(mySource, myDebug)的调用，当然不包含对 visitLicense 的调用。如果不加修改地用 ASM 5.0 运行它，它将会调用过时的visitSource 方法，但 ASM 5.0 ClassWriter 将会在内部将它重定向到visitSource(null, mySource, myDebug)，生成所期望的结果（但其效率要稍低于直接将代码升级为调用这个新方法）。同理，缺少对 visitLicense 的调用也不会造成问题（所生成的类版本也没有变化，人们并不指望这个版本的类中会有一个许可属性）。

另一方面，如果编写一个类分析器或类适配器，也就是说，如果重写 ClassVisitor 类（或者任何其他类似的类，比如 FieldVisitor 或 MethodVisitor），就必须遵循一些规则，如下所述。

#### 基本规则
这里考虑一个类的简单情况：直接扩展 ClassVisitor。在这种情况下，只有一条规则：

规则 1：要为 ASM X 编写一个 ClassVisitor 子类，就以这个版本号为参数，调用ClassVisitor 构造器，在这个版本的 ClassVisitor 类中，绝对不要重写或调用弃用的方
法（或者将在之后版本引入的方法）。
``` java
class MyClassAdapter extends ClassVisitor { 
 public MyClassAdapter(ClassVisitor cv) { 
 super(ASM4, cv); 
 } 
 ... 
 public void visitSource(String source, String debug) { // optional 
 ... 
 super.visitSource(source, debug); // optional 
 } 
}
```
一旦针对 ASM5.0 升级之后，必须删除 visitSource(String, String)，这个类看起来必须类似于如下所示：
```java
class MyClassAdapter extends ClassVisitor {
     public MyClassAdapter(ClassVisitor cv) { 
 super(ASM5, cv); 
 } 
 ... 
 public void visitSource(String author, 
 String source, String debug) { // optional 
 ... 
 super.visitSource(author, source, debug); // optional 
 } 
 public void visitLicense(String license) { // optional 
 ... 
 super.visitLicense(license); // optional 
 } 
}
```
它是如何工作的呢？在 ASM 4.0 中，ClassVisitor 的内部实现如下：
```java
 int api; 
 ClassVisitor cv; 
 public ClassVisitor(int api, ClassVisitor cv) { 
 this.api = api; 
 this.cv = cv; 
 } 
 ... 
 public void visitSource(String source, String debug) { 
 if (cv != null) cv.visitSource(source, debug); 
 } 
}
```
 ASM 5.0 中，这一代码变为：
 ```java
public abstract class ClassVisitor { 
 ... 
 public void visitSource(String source, String debug) { 
 if (api < ASM5) { 
 if (cv != null) cv.visitSource(source, debug); 
 } else { 
 visitSource(null, source, debug); 
 } 
 } 
 public void visitSource(Sring author, String source, String debug) { 
 if (api < ASM5) { 
 if (author == null) { 
 visitSource(source, debug); 
 } else { 
 throw new RuntimeException(); 
 } 
 } else { 
 if (cv != null) cv.visitSource(author, source, debug); 
 } 
 } 
 public void visitLicense(String license) { 
 if (api < ASM5) throw new RuntimeException(); 
 if (cv != null) cv.visitSource(source, debug); 
 } 
}
```
如果 MyClassAdapter 4.0 扩展了 ClassVisitor 4.0，那一切都将如预期中一样正常工作。如果升级到 ASM 5.0，但没有修改代码，MyClassAdapter 4.0 现在将扩展ClassVisitor5.0。但api字段仍将是ASM4 < ASM5，容易看出，在这种情况下，在调用visitSource(String,String)时，ClassVisitor 5.0 的行为特性类似于ClassVisitor 4.0。此外，如果用一个null 作者一访问新的 visitSource 方法，该调用将被重定向至旧版本。最后，如果在输入类中找到非 null 作者或许可，执行过程将会失败，与约定中的规定一致（或者是在新的visitSource 方法中，或者是在 visitLicense 中）。

如果升级到 ASM 5.0，并同时升级代码，现在将拥有扩展了 ClassVisitor 5.0 的MyClassAdapter 5.0。api 字段现在是 ASM5，visitLicense 和新的 visitSource 方法的行为就是直接将调用委托给下一个访问者 cv。此外，旧的 visitSource 方法现在将调用重定向至新的 visitSource 方法，这样可以确保：如果在转换链中，在我们自己的类适配器之前使用了一个旧类适配器，那 MyClassAdapter 5.0 不会错过这个访问事件

ClassReader 将总是调用每个访问方法的最新版本。因此，如果随 ASM 4.0 使用MyClassAdapter 4.0，或者随 ASM 5.0 使用 MyClassAdapter 5.0，将不会产生重定向。只有在随 ASM 5.0 使用 MyClassAdapter 4.0 时，才会在 ClassVisitor 中发生重定向（在新 visitSource 方法的第 3 行）。因此，尽管旧代码在新 ASM 版本中仍能正常使用，但它的运行速度要慢一些。将其升级为使用新的 API，将恢复其性能。

#### 继承规则
上述规则对于 ClassVisitor 或任意其他类似类的直接子类都足够了。对于间接子类，也就是说，如果定义了一个扩展 ClassVisitor 的子类 A1，而它本身又由 A2 扩展，……它本身
又由 An 扩展，则必须为同一 ASM 版本编写所有这些子类。事实上，在一个继承链中混用不同版本将导致同时重写同一方法的几个版本，比如 visitSource(String,String)和
visitSource(String,String,String)，它们的行为可能不同，导致错误或不可预测的结果。如果这些类的来源不同，每个来源被独立升级、单独发布，那几乎不可能保证这一性质。这就引出第二条规则：
```
规则 2：不要使用访问器的继承，而要使用委托（即访问器链）。一种好的做法是让你的访问器类在默认情况为 final 的，以确保这一特性。
```
事实上，这一规则有两个例外：

- 如果能够完全由自己控制继承链，并同时发布层次结构中的所有类，那就可以使用访问器的继承。但必须确保层次结构中的所有类都是为同一 ASM 版本编写的。仍然要让层次结构的叶类是 final 的。

- 如果除了叶类之外，没有其他类重写任何访问方法（例如，如果只是为了引入方便的方法而在 ClassVisitor 和具体访问类之间使用了中间类），那就可以使用“访问器”的继
承。仍然要让层次结构的叶类是 final 的（除非它们也没有重写任何访问方法；在这种情况下，提供一个以 ASM 版本为参数的构造器，使子类可以指定它们是为哪个版本编写的）。
