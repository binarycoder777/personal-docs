---

---

# Java中常见的IO任务

> 作为一名后端开发人员，Java算是我目前用得最多的语言了。今天想聊聊Java中常见的IO任务，尤其是在Web应用程序中，例如：读取和写入文件 | 从Web读取文本、图像、JSON | 访问目录中的文件等等。


## Java 8 以来关于IO的改进

关于Java IO 相关知识和API用法这里就不在详细介绍，详情可参与Java官方文档。下面的内容都是基于Java 8 及更高的版本，特别的：

- UTF-8 是自 Java 18 以来 I/O 的默认值（自 JEP 400 起：默认为 UTF-8）
- java.nio.file.Files 类首次出现在 Java 7 中，在 Java 8、11 和 12 中添加了的方法
- java.io.InputStream 在 Java 9、11 和 12 中获得了的方法
- java.io.File 和 java.io.BufferedReader 类现在已经完全过时了，尽管它们经常出现在 Web 搜索和 AI 聊天中。

## 读取文本

您可以将文本文件读入字符串，如下所示：

```java
String content = Files.readString(path);
```

这里是 java.nio.Path 的一个实例，获取方式如下：path

```java
var path = Path.of("/usr/share/dict/words");
```

在 Java 18 之前，一般需要在读取或写入字符串的任何文件操作中指定字符编码。如今，到目前为止，最常见的字符编码已经默认是 UTF-8，但为了向后兼容，Java 使用了“平台编码”，这可能是 Windows 上的传统编码。为了保证可移植性，文本 I/O 操作需要StandardCharsets.UTF_8参数，当然这不再是必需的了。

如果您希望文件作为行序列，请调用

```java
List<String> lines = Files.readAllLines(path);
```

如果文件很大，请延迟地将行处理为 Stream< String >：

```java
try (Stream<String> lines = Files.lines(path)) {
    . . .
}
```

如果可以自然地使用流操作（例如映射、过滤器）处理行，也可以使用 Files.lines。请注意，需要关闭 Files.lines 返回的流。为确保发生这种情况，请使用 try-with-resources 语句，如前面的代码片段所示。

要将输入拆分为行以外的其他内容，请使用 java.util.Scanner。例如，以下是如何阅读由非字母分隔的单词：

```java
Stream<String> tokens = new Scanner(path).useDelimiter("\\PL+").tokens();
```

Scanner 类也有读取数字的方法，但通常更简单的做法是将输入读取为每行一个字符串，或者单个字符串，然后对其进行分析。

从文本文件中解析数字时要小心，因为它们的格式可能与区域设置相关。例如，在美国区域设置中输入为 100.0，在德语区域设置中输入为 100000.0。使用 java.text.NumberFormat 进行特定于区域设置的解析。或者，您可以使用 Integer.parseInt/Double.parseDouble。100.000

## 编写文本文件

您可以通过一次调用将字符串写入文本文件：

```java
String content = . . .;
Files.writeString(path, content);
```

如果您有行列表而不是单个字符串，请使用：

```java
List<String> lines = . . .;
Files.write(path, lines);
```

对于更常规的输出，如果要使用 printf 方法，请使用 PrintWriter：

```java
var writer = new PrintWriter(path.toFile());
writer.printf(locale, "Hello, %s, next year you'll be %d years old!%n", name, age + 1);
```

请注意，printf 是特定于区域设置的。写数字时，请务必以适当的格式书写。请考虑使用 java.text.NumberFormat 或 Integer.toString/Double.toString，而不是使用 printf。

奇怪的是，从 Java 21 开始，没有带有 Path 参数的 PrintWriter 构造函数。

如果不使用 printf，则可以使用 BufferedWriter 类并使用 write 方法编写字符串。

```java
var writer = Files.newBufferedWriter(path);
writer.write(line); // Does not write a line separator
writer.newLine(); 
```

请记住在完成后关闭writer

## 从输入流中读取

也许使用流的最常见原因是从网站读取某些内容。

如果需要设置请求头或读取响应头，请使用 HttpClient：

```java
HttpClient client = HttpClient.newBuilder().build();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://horstmann.com/index.html"))
    .GET()
    .build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
String result = response.body();

```

如果你想要的只是数据，请改用：

```java
InputStream in = new URI("https://horstmann.com/index.html").toURL().openStream();
```

然后将数据读入字节数组，并选择性地将它们转换为字符串：

```java
byte[] bytes = in.readAllBytes();
String result = new String(bytes);
```

或者将数据传输到输出流：

```java
OutputStream out = Files.newOutputStream(path);
in.transferTo(out);
```

## 文件 API

java.nio.file.Files 类提供了一组全面的文件操作，例如创建、复制、移动和删除文件和目录

### 遍历目录和子目录中的条目

在大多数情况下，您可以使用以下两种方法之一。Files.list 方法访问目录的所有条目（文件、子目录、符号链接）。

```java
try (Stream<Path> entries = Files.list(pathToDirectory)) {
    . . .
}
```

使用 try-with-resources 语句可确保将关闭跟踪迭代的流对象。

如果还想访问子目录的条目，请改用 Files.walk 方法

```java
Stream<Path> entries = Files.walk(pathToDirectory);
```

然后，只需使用流方法访问您感兴趣的条目，并收集结果：

```java
try (Stream<Path> entries = Files.walk(pathToDirectory)) {
    List<Path> htmlFiles = entries.filter(p -> p.toString().endsWith("html")).toList();
    . . .
}
```

以下是遍历目录条目的其他方法：

- Files.walk 的重载版本允许您限制遍历树的深度。
- 两种 Files.walkFileTree 方法通过在第一次和最后一次访问目录时通知 FileVisitor 来更好地控制迭代过程。这有时可能很有用，特别是对于清空和删除目录树。
- Files.find 方法类似于 Files.walk，但您提供了一个筛选器，用于检查每个路径及其 BasicFileAttributes。这比单独读取每个文件的属性稍微高效一些。
- 两个 Files.newDirectoryStream（Path） 方法生成 DirectoryStream 实例，这些实例可以在增强循环中使用。与使用 Files.list 相比，没有任何优势。for
- 旧版 File.list 或 File.listFiles 方法返回文件名或 File 对象。这些现在已经过时了。

### 处理 ZIP 文件

从 Java 1.1 开始，ZipInputStream 和 ZipOutputStream 类提供了用于处理 ZIP 文件的 API。但是 API 有点笨拙。Java 8 引入了一个更好的 ZIP 文件系统：

```java
try (FileSystem fs = FileSystems.newFileSystem(pathToZipFile)) {
    . . .
}
```

然后，可以使用 Files 类的方法。在这里，我们得到了ZIP文件中所有文件的列表：

```java
try (Stream<Path> entries = Files.walk(fs.getPath("/"))) {
    List<Path> filesInZip = entries.filter(Files::isRegularFile).toList();
}
```

要读取文件内容，只需使用 Files.readString 或 Files.readAllBytes：

```java
String contents = Files.readString(fs.getPath("/LICENSE"));
```

您可以使用 Files.delete 删除文件。要添加或替换文件，只需使用 Files.writeString 或 Files.write。

### 创建临时文件和目录

很多时候，我需要收集用户输入、生成文件并运行外部进程。然后，我使用临时文件，这些文件在下次重新启动后会消失，或者在过程完成后擦除的临时目录。

为此，我使用Files.createTempFile和Files.createTempDirectory两种方法。

```java
Path filePath = Files.createTempFile("myapp", ".txt");
Path dirPath = Files.createTempDirectory("myapp");
```

## 小结

随着语言的迭代升级，引入了新的特性、语法糖等等。但万变不离其宗，API方便了作为开发者的我们的使用，但底层原理该了解的还是要了解。当然，也要学会接纳新事物，比如对于Web 搜索和 AI 聊天可以为常见的 I/O 操作提供不必要的复杂代码建议。通常有更好的选择：

- 您不需要循环来读取或写入字符串或字节数组。
- 您甚至可能不需要流、阅读器或编写器。
- 熟悉用于创建、复制、移动和删除文件和目录的 Files 方法。
- 使用 Files.list 或 Files.walk 遍历目录条目。
- 使用ZIP文件系统处理ZIP文件。
- 远离传统的 File 类。
  