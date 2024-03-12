---


---

# Instrument-字节码插桩

> **java.lang.instrument**包是Java编程语言的一部分，提供了强大的机制来修改已经加载的类的字节码。这个包是在Java 5中引入的，主要用于支持Java平台的instrumentation（检测和测量工具）功能。它使得开发者和工具能够在运行时监控和修改应用程序的行为，而无需修改应用程序的源代码。这对于性能监控、分析、调试、甚至是实现某些高级框架功能（如热部署、AOP等）来说非常有用。

想象一下，如果 10 个应用程序团队正在开发 10 个不同的微服务，并且如果他们需要从这些微服务中提取精确的简单指标而不使用监控工具，那么他们可以编写简单的代理来单独提取这些指标。如果它变得复杂，那么使用监控工具比编写特定的代理代码更容易。尽管大多数时候，我们可能都不会使用到instrument，但是
对我来说了解工具如何工作、自己开发一些工具总是很有趣的！

## 简介

java.lang.instrument包的具体实现，依赖于 JVMTI（Java Virtual Machine Tool Interface）这是一套由 Java 虚拟机提供的，为 JVM 相关工具提供的本地编程接口集合。JVMTI 是从 Java SE 5 开始引入，JVMTI 提供了一套“代理”程序机制，可以支持第三方工具程序以代理的方式连接和访问 JVM，并利用 JVMTI 提供的编程接口，完成很多跟 JVM 相关的功能。事实上，java.lang.instrument 包的实现，也就是基于这种机制的。

除了 Instrumentation 功能外，JVMTI 还在虚拟机内存管理，线程控制，方法和变量操作等等方面提供了大量可用的函数。关于 JVMTI 的详细信息，可以[参考官方文档](https://docs.oracle.com/javase/8/docs/platform/jvmti/jvmti.html)

## 关键组件

### ClassFileTransformer
提供该接口的代理实现，以便转换类文件

```java
byte[]	transform(ClassLoader loader, String className, Class<?> classBeingRedefined, ProtectionDomain protectionDomain, byte[] classfileBuffer)
The implementation of this method may transform the supplied class file and return a new replacement class file.
```

### instrumentation
这个类提供的服务需要插桩Java代码。即插装是将字节码添加到方法中，以收集供工具使用的数据。由于这些更改对于程序来说是附加的，所以这些工具不会修改应用程序的状态或行为。此类工具的示例包括监视代理、分析程序、覆盖率分析程序和事件记录程序等。

有两种方法可以获得Instrumentation接口的实例:

1. 当JVM以指示代理类的方式启动时。在这种情况下，Instrumentation实例被传递给**代理类**的premain方法。

2. JVM提供了在JVM启动后启动代理的机制。在这种情况下，Instrumentation实例被传递给**代理代码**的agentmain方法。

一旦代理获得了Instrumentation实例，代理就可以随时调用实例上的方法。

### ClassDefinition
这个类作为Instrumentation.redefineClasses method.的参数。用于将需要重新定义的类与新的类文件字节绑定在一起。


### llegalClassFormatException	
由ClassFileTransformer的实现抛出。当输入参数无效时进行转换。


### UnmodifiableClassException	
由Instrumentation的实现抛出。当指定的类之一无法修改时，使用redefineclass。

## 包说明
Agent作为JAR文件部署。JAR文件清单【manifest】中的属性指定将加载将要启动代理的代理类。

对于支持命令行接口的实现，通过在命令行上指定一个选项来启动Agent。

实现还可以支持在VM启动后一段时间启动代理的机制。例如，允许工具附加到正在运行的应用程序，并开始将工具的agent加载到正在运行的应用程序中。关于如何启动负载的细节很简单。

## Command-Line Interface
在从命令行界面启动代理的实现中，通过向命令行添加以下选项来启动代理:
``` bash
-javaagent:jarpath[=options]
```
jarpath是agent JAR文件的路径。Options是代理选项。这个开关可以在同一个命令行上多次使用，从而创建多个agent。多个agent可以使用相同的jarpath。agent JAR文件必须符合JAR文件规范。

Agent JAR文件的清单必须包含Premain-Class。这是代理类的名称。代理类必须实现一个原则上类似于主应用程序入口点的公共静态premain方法。

在Java虚拟机(JVM)初始化之后，将按照指定代理的顺序调用premain 方法，然后调用真正的应用程序主方法。每个premain方法必须返回，以便启动序列继续进行。

premain方法有两种可能的签名之一。JVM首先尝试在代理类上调用以下方法:
```java
public static void premain(String agentArgs, Instrumentation inst);
```
如果代理类没有实现此方法，那么JVM将尝试调用:
```java
public static void premain(String agentArgs);
```

代理类还可以有一个agentmain方法，供在VM启动后启动代理时使用。当使用命令行选项启动代理时，不会调用agentmain方法。

agent类将由system class loader加载。这是类加载器器，通常加载包含应用程序main方法的类。premain方法将在与应用程序主方法相同的安全性和类加载器规则下运行。对于代理主体方法可以做什么，没有建模限制。应用程序main可以做的任何事情，包括创建线程，在premain中都是合法的。

每个代理通过agentArgs参数传递其代理选项。代理选项作为单个字符串传递，任何额外的解析应该由代理本身执行。

如果无法解析代理(例如，因为无法加载代理类，或者因为代理类没有适当的premain方法)，JVM将中止。如果premain方法抛出未捕获的异常，JVM也将中止。

## Starting Agents After VM Startup
也可以在VM启动后的某个时间启动代理。关于如何启动的细节是特定于实现的，但通常应用程序已经启动并且它的main方法已经被调用。如果实现支持在VM启动后启动代理，则适用以下情况:
- 代理JAR的清单必须包含agent - class。此值是代理类的名称。
- 代理类必须实现公共静态agentmain方法。
- 系统类加载器(ClassLoader.getSystemClassLoader)必须支持将代理JAR文件添加到系统类路径的机制。

代理JAR被附加到系统类路径中。这是类加载器，通常装入包含应用程序主方法的类。加载代理类，并且JVM尝试调用agentmain方法时。JVM首先尝试在代理类上调用以下方法:
``` java
public static void agentmain(String agentArgs, Instrumentation inst);
```
如果代理类没有实现此方法，那么JVM将尝试调用:
``` java
public static void agentmain(String agentArgs);
```
此时的代理类也可以有一个premain方法，用于使用命令行选项启动代理时使用。当虚拟机启动后启动代理时，不会调用premain方法。

代理通过agentArgs参数传递其代理选项。代理选项作为单个字符串传递，任何额外的解析应该由代理本身执行。

agentmain方法应该执行启动代理所需的任何必要初始化。当启动完成时，该方法应该返回。如果无法启动代理(例如，因为无法加载代理类，或者因为代理类没有一致的agentmain方法)，JVM将不会中止。如果agentmain方法抛出未捕获的异常，则该异常将被忽略。

## Manifest Attributes

下面的清单属性是为代理JAR文件定义的:

### Premain-Class
当在JVM启动时指定代理时，此属性指定代理类。也就是说，包含premain方法的类。如果在JVM启动时指定代理，则需要此属性。如果该属性不存在，JVM将中止。注意:这是一个类名，而不是文件名或路径。

### Agent-Class
如果实现支持在VM启动后某个时间启动代理的机制，则此属性指定代理类。也就是说，包含agentmain方法的类。这个属性是必需的，如果没有它，代理将不会启动。注意:这是一个类名，而不是文件名或路径。

### Boot-Class-Path
引导类加载器要搜索的路径列表。路径表示目录或库(在许多平台上通常称为JAR或zip库)。在定位类的平台特定机制失败后，引导类加载器将搜索这些路径。按照列出的顺序搜索路径。列表中的路径由一个或多个空格分隔。路径采用层次URI的路径组件的语法。如果路径以斜杠字符('/')开头，则路径为绝对路径，否则为相对路径。相对路径根据绝对路径进行解析。

### Can-Redefine-Classes
Boolean(true or false, case irrelevant)。是重新定义此代理所需的类的能力。除true以外的值被认为是false。该属性是可选的，默认为false。

### Can-Retransform-Classes
Boolean(true or false, case irrelevant)。是重新转换此代理所需的类的能力。除true以外的值被认为是false。该属性是可选的，默认为false。

### Can-Set-Native-Method-Prefix
Boolean (true or false, case irrelevant)。设置此代理所需的本机方法前缀的能力。除true以外的值被认为是false。该属性是可选的，默认为false。

代理JAR文件可以同时具有清单中的Premain-Class和agent - class属性。当使用-javaagent选项在命令行上启动代理时，Premain-Class属性指定代理类的名称，并且忽略agent - class属性。类似地，如果在虚拟机启动后某个时间启动代理，则agent - class属性指定代理类的名称(Premain-Class属性的值将被忽略)。

## 案例

下面将通过一个简单的案例来演示，如何在使用插桩来更改运行时的Java类，找出一个方法执行的时间。

### 关键组件

- Agent：一个包含代理和转换器类文件的jar文件。
- Agent Class:一个java类文件，包含一个名为“premain”的方法。
- Manifest:Manifest.mf文件，包含 premain-class。
- Transformer：实现ClassFileTransformer接口的Java类文件。

### 时序流程

下图总结了Java插装中的时序流程:

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240312151708.png)


### 代码实现

**程序入口**

该类是程序入口，用于调用Lion类的方法
```java
public class TestInstrumentation {
    public static void main(String args[]) throws InterruptedException {
        Lion l = new Lion();
        l.runLion();
    }
}
```

**待增强的java类**

该类打印一行字符串，后续被修改字节码，监控打印方法运行时长
``` java
public class Lion {
    public void runLion() throws InterruptedException {
        System.out.println("Lion is going to run........");
        Thread.sleep(2000L);
    }

}
```

**代理类**

字节码插桩的入口，添加类转换对象
```java
public class DurationAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Executing premain.........");
        inst.addTransformer(new DurationTransformer());
    }
}
```

**实际增强类**

监听Lion方法执行的时间并打印
```java
public class DurationTransformer implements ClassFileTransformer {
    @Override
    public byte[] transform(ClassLoader loader, String className, Class<?> classBeingRedefined, ProtectionDomain protectionDomain, byte[] classfileBuffer) throws IllegalClassFormatException {
        byte[] byteCode = classfileBuffer;
        if (className.equals("org/example/core/test/Lion")) {
            System.out.println("Instrumenting......");
            try {
                ClassPool classPool = ClassPool.getDefault();
                CtClass ctClass = classPool.makeClass(new ByteArrayInputStream(
                        classfileBuffer));
                CtMethod[] methods = ctClass.getDeclaredMethods();
                for (CtMethod method : methods) {
                    method.addLocalVariable("startTime", CtClass.longType);
                    method.insertBefore("startTime = System.nanoTime();");
                    method.insertAfter("System.out.println(\"Execution Duration "
                            + "(nano sec): \"+ (System.nanoTime() - startTime) );");
                }
                byteCode = ctClass.toBytecode();
                ctClass.detach();
                System.out.println("Instrumentation complete.");
            } catch (Throwable ex) {
                System.out.println("Exception: " + ex);
                ex.printStackTrace();
            }
        }
        return byteCode;
    }
}
```

**maven 插件配置**

``` xml
  <build>
    <plugins>
      <plugin>
        <artifactId>maven-jar-plugin</artifactId>
        <version>3.2.0</version> 
        <configuration>
          <archive>
            <manifest>
              <mainClass>org.example.core.test.TestInstrumentation</mainClass>
            </manifest>
            <manifestEntries>
              <Premain-Class>org.example.core.test.DurationAgent</Premain-Class>
              <Can-Redefine-Classes>true</Can-Redefine-Classes>
              <Can-Retransform-Classes>true</Can-Retransform-Classes>
            </manifestEntries>
          </archive>
        </configuration>
      </plugin>
    </plugins>
  </build>
  ```

  **最后执行时添加 -javaagent:[jarpath]**

结果如下：
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240312165112.png)

上面是采用在启动时运行命令行指令进行字节码插桩修改，当然也可以应用启动后添加代理代码，具体这里就不做演示。

## 最后

字节码增强技术相当于是一把打开运行时JVM的钥匙，利用它可以动态地对运行中的程序做修改，也可以跟踪JVM运行中程序的状态。此外，我们平时使用的动态代理、AOP也与字节码增强密切相关，它们实质上还是利用各种手段生成符合规范的字节码文件。综上所述，掌握字节码增强后可以高效地定位并快速修复一些棘手的问题（如线上性能问题、方法出现不可控的出入参需要紧急加日志等问题），也可以在开发中减少冗余代码，大大提高开发效率。

































