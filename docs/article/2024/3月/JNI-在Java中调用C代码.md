---

---

# java中调用C代码

> 最近在学Go语言的CGo时候，尝试了一下在Go中进行C代码的一个调用，感觉很有意思。而在java中又该如何进行C代码的一个调用呢?答案是：JNI。

## 什么是JNI？

JNI是Java Native Interface的缩写，通过使用 Java本地接口书写程序，可以确保代码在不同的平台上方便移植；从Java1.1开始，JNI标准成为java平台的一部分，它允许Java代码和其他语言写的代码进行交互

本地代码与 Java 虚拟机之间是通过 JNI 函数实现相互操作的；JNI 函数通过接口指针来获得，本地方法将 JNI 接口指针当作参数来接受；虚拟机保证在从相同的 Java 线程中对本地方法进行多次调用时，传递给本地方法的接口指针是相同的，本地方法被不同的 Java 线程调用时，它接受不同的 JNI接口指针


## JNI 的应用场景

需要调用Java语言不支持的依赖于操作系统平台特性的一些功能：

● 需要调用当前UNIX系统的某个功能，而Java不支持这个功能的时候，就要用到JNI

● 在程序对时间敏感或对性能要求特别高时，有必要用到更底层的语言来提高运行效率

● 音视频开发涉及到的音视频编解码需要更快的处理速度，这就需要用到JNI

● 为了整合一些以前的非Java语言开发的系统

● 需要用到早期实现的C/C++语言开发的一些功能或者系统，将这些功能整合到当前的系统或者新的版本中

JNI是完善Java的一个重要功能，它让Java更加全面、封装了各个平台的差异性，下面让我们来看看如何通过JNI实现C调用的一个简单例子：

## 1. 创建Java类并声明native方法
首先，你需要创建一个Java类并在其中声明你想要调用的C函数作为native方法。例如：
``` java
public class HelloWorld {
    // 声明native方法
    public native void printHelloWorld();

    // 加载包含native方法实现的库
    static {
        System.loadLibrary("hello");
    }

    public static void main(String[] args) {
        new HelloWorld().printHelloWorld();
    }
}
```
这里，printHelloWorld是一个native方法，它在Java中声明但并未实现。System.loadLibrary("hello")用于加载包含这个native方法实现的本地库（在这个例子中是名为"hello"的库）。


## 2. 生成JNI头文件
使用javac编译Java类，并使用javah工具（注意：在JDK 10及以后版本中，javah已被移除，推荐使用javac -h命令）生成对应的JNI头文件。这个头文件将为你的native方法提供必要的函数签名。
``` bash
javac HelloWorld.java
javah -jni HelloWorld
```
这将生成一个HelloWorld.h的头文件。

## 3. 实现C函数
根据生成的头文件，你可以在C文件中实现相应的函数。例如，你的C实现可能看起来像这样：
``` c
#include <jni.h>
#include "HelloWorld.h"
#include <stdio.h>

// 实现native方法
JNIEXPORT void JNICALL Java_HelloWorld_printHelloWorld(JNIEnv *env, jobject obj) {
    printf("Hello, World!\n");
}
```

## 4. 编译C代码并创建动态链接库
使用适当的C编译器（如gcc）编译C代码，并创建动态链接库（.so文件Linux上，.dll文件在Windows上，或.dylib文件在macOS上）。

例如，在Linux上：
``` bash
gcc -shared -fpic -o libhello.so -I${JAVA_HOME}/include -I${JAVA_HOME}/include/linux HelloWorld.c
```

## 5. 运行Java程序
最后，确保创建的动态链接库位于Java程序的库路径中，然后运行Java程序。你可能需要设置java.library.path系统属性来指定库的位置：
``` bash
java -Djava.library.path=. HelloWorld
```

## 最后

这个例子简单展示了如何从Java调用一个C语言编写的printHelloWorld函数。实际使用时，需要根据自己的环境和需求调整编译和运行命令。JNI提供了丰富的功能，允许Java与本地代码进行复杂的互操作，但同时也要注意管理好内存和类型转换等问题，以避免常见的错误。笔者是在看[CGO](/docs/book/Go语言系列/Go语言高级编程/CGO编程(一).md)的时候联想到了Java的JNI，所以写了一篇关于Java的JNI的简单介绍使用，对于更多JNI的知识，可以参考以下资料：

**在线教程和文档**
- Oracle官方文档：Oracle提供的官方JNI文档是学习JNI的最权威资源。它详细介绍了JNI的设计理念、API和使用示例。

- [JNI教程 by NTU](https://www3.ntu.edu.sg/home/ehchua/programming/java/javanativeinterface.html)：新加坡南洋理工大学（NTU）提供的JNI教程，简洁明了地介绍了JNI的基础知识，适合初学者。

- [IBM Developer](https://developer.ibm.com/)：IBM的开发者网站上有关于JNI的文章，讲解了JNI的一些高级主题，比如性能优化和最佳实践。

**书籍**

- 《Java Native Interface: Programmer's Guide and Specification》：这本书由JNI的设计者Sheng Liang撰写，是学习JNI非常好的资源。书中不仅包含了详细的API说明，还有丰富的示例代码。

- 《Advanced Java Programming with JNI》：这本书适合那些已经对Java和JNI有一定了解，并希望深入学习高级特性的读者。

> 请注意，目前市面上缺乏专门深入介绍JNI的最新书籍，大多数相关知识和最佳实践需要通过官方文档、在线教程和社区的分享来学习。

最后的最后，实践是学习编程的关键，尝试编写一些简单的JNI示例将大有帮助。