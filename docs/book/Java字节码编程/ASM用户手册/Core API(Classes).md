---

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


