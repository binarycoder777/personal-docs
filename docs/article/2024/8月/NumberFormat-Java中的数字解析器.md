---

---

# NumberFormat-Java中的数字解析器

> 最近在帮同事修改bug，主要是通过PIO解析Excel文件的时候对百分比小数进行解析时出现了精度丢失，例如：99.1999829264649%，会被解析为99.20，通过打断点的方式定位到了类：NumberFormat，自己对这个类不熟悉，没怎么使用过，遂查阅了一下[Java DOCS](https://docs.oracle.com/javase/8/docs/api/java/text/NumberFormat.html)，特此记录一下。

## Class Format

在讲NumberFormat前，先聊聊Format这个类，这个类的原型如下:
```java
public abstract class Format extends Object implements Serializable, Cloneable
```
Format是一个抽象基类，用于格式化日期、消息和数字等地区敏感信息。Format定义了编程接口，用于将语言环境敏感的对象格式化为字符串(Format方法)和将字符串解析回对象(parseObject方法)。

通常，格式的parseObject方法必须能够解析由其format方法格式化的任何字符串。然而，在某些特殊情况下，这是不可能的。例如，format方法可能会创建两个相邻的整数，中间没有分隔符，在这种情况下，parseObject无法分辨哪个数字属于哪个数字。

### Subclassing

Java平台提供了Format的三个专用子类——DateFormat、MessageFormat和NumberFormat——分别用于格式化日期、消息和数字。具体子类必须实现三个方法:
```java
format(Object obj, StringBuffer toAppendTo, FieldPosition pos)
formatToCharacterIterator(Object obj)
parseObject(String source, ParsePosition pos)
```
这些通用方法允许对对象进行多态解析和格式化，并被MessageFormat等使用。子类通常还为特定的输入类型提供额外的格式方法，以及为特定的结果类型提供解析方法。当输入文本的开头没有所需格式的文本时，任何不接受ParsePosition参数的解析方法都应抛出ParseException。

大多数子类也将实现以下工厂方法:

```java
getInstance用于获取适合当前语言环境的有用格式对象
getInstance(Locale)，用于获取适合于指定语言环境的有用格式对象
```
此外，一些子类还可以实现其他getXxxxInstance方法来进行更专门化的控制。例如，NumberFormat类提供了getPercentInstance和getCurrencyInstance方法来获取专门的数字格式化器。
```java
 public static Locale[] getAvailableLocales()
```
最后，子类可以定义一组常量来标识格式化输出中的各种字段。这些常量用于创建FieldPosition对象，该对象标识字段中包含的信息及其在格式化结果中的位置。这些常量应该命名为item_FIELD，其中item标识字段。

### Synchronization

格式通常不同步。建议为每个线程创建单独的格式实例。如果多个线程同时访问一个格式，那么它必须在外部同步。


## Class NumberFormat

```java
public abstract class NumberFormat extends Format
```
NumberFormat是所有数字格式的抽象基类。这个类提供了格式化和解析数字的接口。NumberFormat还提供了一些方法来确定哪些地区有数字格式，以及它们的名称是什么。

NumberFormat帮助您格式化和解析任何地区的数字。您的代码可以完全独立于小数点、千位分隔符甚至所使用的特定十进制数字的区域设置约定，或者数字格式是否为偶数十进制。

要为当前区域设置格式化数字，请使用工厂类方法之一:
```java
 myString = NumberFormat.getInstance().format(myNumber);
```
如果要对多个数字进行格式化，那么获取该格式并多次使用它会更有效，这样系统就不必多次获取有关当地语言和国家惯例的信息。
```java
NumberFormat nf = NumberFormat.getInstance();
 for (int i = 0; i < myNumber.length; ++i) {
     output.println(nf.format(myNumber[i]) + "; ");
 }
 ```
要为不同的Locale格式化数字，请在对getInstance的调用中指定它。

```java
 NumberFormat nf = NumberFormat.getInstance(Locale.FRENCH);
```

你也可以使用NumberFormat来解析数字:
```java
 myNumber = nf.parse(myString);
```

使用getInstance或getNumberInstance获取正常的数字格式。使用getIntegerInstance获取整数格式。使用getCurrencyInstance获取货币数字格式。并使用getPercentInstance获取显示百分比的格式。使用这种格式，像0.53这样的分数显示为53%。

您还可以使用setMinimumFractionDigits等方法来控制数字的显示。如果您希望对格式或解析有更多的控制，或者希望给用户更多的控制，您可以尝试将从工厂方法获得的NumberFormat转换为DecimalFormat。这将适用于绝大多数地区;只要记住把它放在try块中，以防遇到不寻常的。

NumberFormat和DecimalFormat的设计使得一些控件用于格式化，另一些用于解析。以下是每种控制方法的详细说明:

- setParseIntegerOnly:只影响解析，例如，如果为真，“3456.78”→3456(并在索引6之后离开解析位置);如果为假，“3456.78”→3456.78(并在索引8之后离开解析位置)。这与格式无关。如果您希望不显示小数点后可能没有数字的小数点，请使用setdecimalseparatoralwaysdisplays。

- setdecimalseparatoralwaysshow:只影响格式，并且只在小数点后可能没有数字的地方，例如像“#，##0”这样的模式。##”，例如，如果为真，3456.00→“3456”。如果为假，3456.00→“3456”这与解析无关。如果希望解析停止在小数点处，请使用setParseIntegerOnly。

你也可以使用parse和format方法的ParsePosition和FieldPosition的形式来允许你:
- 逐步解析字符串的各个部分
- 将小数点和其他区域对齐

例如，你可以用两种方式对齐数字:
- 如果您使用的是带有间距的等宽字体，则可以在format调用中传递FieldPosition，并使用field = INTEGER_FIELD。在输出时，getEndIndex将被设置为整数的最后一个字符与小数之间的偏移量。在字符串的前面添加(desiredSpaceCount - getEndIndex)空格。
- 如果您使用的是比例字体，而不是用空格填充，那么从开始到getEndIndex测量字符串的宽度(以像素为单位)。然后在绘制文本之前移动笔(desiredPixelWidth - widthToAlignmentPoint)。它也适用于没有小数，但可能在末尾附加字符的情况，例如，在负数中加上括号:“(12)”表示-12。



## 小结

NumberFormat 是一个强大而灵活的工具，可以帮助你根据不同的区域设置和格式需求处理数字的显示和解析。它的设计允许你以多种方式格式化数字，以满足各种国际化和本地化的要求。更多API和详情内容可以参考[官方文档](https://docs.oracle.com/javase/8/docs/api/java/text/Format.html)。























