---

---

# Java命令行打包总结

> 一直以来习惯了使用Maven打包，依赖于IDEA一键package、一键install，今天就来讲讲怎么使用命令行进行打jar包

## 普通类文件打包

假设我们现在有下面两个java类，一个是Lion类用于打印一串字符串，一个主启动类，用于程序入口，现在我们要将其打成jar包，应该怎么做呢？
``` java
public class TestInstrumentation {
    public static void main(String args[]) throws InterruptedException {
        Lion l = new Lion();
        l.runLion();
    }
}

public class Lion {
    public void runLion() throws InterruptedException {
        System.out.println("Lion is going to run........");
        Thread.sleep(2000L);
    }
}
```

### 方法步骤

1. 编译这两个类为.class文件
``` bash
javac Lion.java TestInstrumentation.java
```
2. 将编译后的文件打成jar包
``` bash
jar -cvf app.jar DurationTransformer.class Lion.class
```
c表示要创建一个新的jar包，v表示创建的过程中在控制台输出创建过程的一些信息，f表示给生成的jar包命名
3. 然后便可以启动jar包了
```bash
java -jar app.jar
```
4. 此时你会发现报错
```bash
app.jar中没有主清单属性
```
5. 解压打开app.jar，你会发现除了对应的类外，存在一个META-INF的目录，下面存在一个清单文件MENIFEST.MF，里面现在只有如下信息：
```yaml
Manifest-Version: 1.0
Created-By: 1.8.0_111 (Oracle Corporation)
```
6. 向MENIFEST.MF中添加Main-Class属性，指导主属性清单即可
```yml
Main-Class: TestInstrumentation
```
7. 重新启动，发现运行成功
```
Lion is going to run........
```
8. 当然也可以在打jar包的时候指定MENIFEST.MF文件，使用如下指令即可
``` bash
jar -cvfm app.jar META-INF/MENIFEST.MF DurationTransformer.class Lion.class 
```
其中m参数是用于指定MENIFEST.MF，该文件需要事先准备好，放在META-INF下

**包含子目录:**
```bash
jar cf jar-file -C dir input-file(s)
```
这里，-C用于改变到指定的dir目录，然后包含input-file(s)

## 含有jar文件的jar包

1. 如果需要为当前的jar包引入另外的jar包，我们可以这样做
``` bash
javac -cp source.jar target.class 
```
这里的 -cp 表示 -classpath，指的是把source.jar加入classpath路径下

2. 将target.class打成jar包，如上所示

3. 如果直接这样运行jar包会找不到source里面的内容,　　原因很简单，引入jar包需要在MENIFEST.MF文件中配置一个新属性：Class-Path，路径指向你需要的所有jar包

4. 因此需要在清单文件加入
``` yml
Class-Path: xxx.jar
```

## 引用第三方jar

当项目中我们把所需要的第三方jar包也打进了我们自己的jar包中时，如果仍然按照上述操作方式，会报找不到Class异常。原因就是jar引用不到放在自己内部的jar包。具体原因可以参考:
http://www.cnblogs.com/adolfmc/archive/2012/10/07/2713562.html

## 查看JAR文件内容

### 查看JAR文件内容:
``` bash
jar tf jar-file
```
使用t选项查看JAR文件中的内容列表。这不会解压文件，只显示其中包含的文件和目录结构。

## 更新JAR文件

### 更新JAR文件内容:
``` bash
jar uf jar-file input-file(s)
```
u选项用于更新现有的JAR文件，将新的input-file(s)添加进去。

## 解压JAR文件

### 解压JAR文件:
``` bash
jar xf jar-file [input-file(s)]
```
使用x选项解压JAR文件。如果指定了input-file(s)，则只解压这些文件；否则解压所有文件。


## 最后

综述，java命令行打包的方式就先介绍到这里，笔者也是因为写demo的时候懒得上maven打包，才去重新回忆了一下Java的打包命令。在面对复杂的应用时，还是使用提供的插件来得更方便，不过了解这些基本的命令也有助于对这些插件的了解...