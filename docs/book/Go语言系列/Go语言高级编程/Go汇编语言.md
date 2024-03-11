---

---

# Go汇编语言

## 快速入门

Go汇编语言并不是一个独立的语言，因为Go汇编程序无法独立使用。Go汇编代码
必须以Go包的方式组织，同时包中至少要有一个Go语言文件用于指明当前包名等
基本包信息。如果Go汇编代码中定义的变量和函数要被其它Go语言代码引用，还
需要通过Go语言代码将汇编中定义的符号声明出来。用于变量的定义和函数的定义
Go汇编文件类似于C语言中的.c文件，而用于导出汇编中定义符号的Go源文件类似
于C语言的.h文件

### 定义整数变量

``` go
package pkg
var Id = 9527
```
代码中只定义了一个int类型的包级变量，并进行了初始化。然后用以下命令查看的
Go语言程序对应的伪汇编代码：
``` go
$ go tool compile -S pkg.go
"".Id SNOPTRDATA size=8
0x0000 37 25 00 00 00 00 00 00 .....
```

其中 go tool compile 命令用于调用Go语言提供的底层命令工具，其中 -S 参
数表示输出汇编格式。输出的汇编比较简单，其中 "".Id 对应Id变量符号，变量
的内存大小为8个字节。变量的初始化内容为 37 25 00 00 00 00 00 00 ，对应
十六进制格式的0x2537，对应十进制为9527。SNOPTRDATA是相关的标志，其中
NOPTR表示数据中不包含指针数据。

以上的内容只是目标文件对应的汇编，和Go汇编语言虽然相似当并不完全等价。
Go语言官网自带了一个Go汇编语言的入门教程，地址
在：https://golang.org/doc/asm 。

Go汇编语言提供了DATA命令用于初始化包变量，DATA命令的语法如下：
``` bash
DATA symbol+offset(SB)/width, value
```
其中symbol为变量在汇编语言中对应的标识符，offset是符号开始地址的偏移量，
width是要初始化内存的宽度大小，value是要初始化的值。其中当前包中Go语言定
义的符号symbol，在汇编代码中对应 ·symbol ，其中“·”中点符号为一个特殊的
unicode符号。

我们采用以下命令可以给Id变量初始化为十六进制的0x2537，对应十进制的
9527（常量需要以美元符号$开头表示）：
``` bash
DATA ·Id+0(SB)/1,$0x37
DATA ·Id+1(SB)/1,$0x25
```
变量定义好之后需要导出以供其它代码引用。Go汇编语言提供了GLOBL命令用于
将符号导出：
``` bash
GLOBL symbol(SB), width
```
其中symbol对应汇编中符号的名字，width为符号对应内存的大小。用以下命令将
汇编中的·Id变量导出：
``` bash
GLOBL ·Id, $8
```
为了便于其它包使用该Id变量，我们还需要在Go代码中声明该变量，同时也给变量
指定一个合适的类型。修改pkg.go的内容如下：
``` go
package pkg
var Id int
```
现状Go语言的代码不再是定义一个变量，语义变成了声明一个变量（声明一个变量
时不能再进行初始化操作）。而Id变量的定义工作已经在汇编语言中完成了。

我们将完整的汇编代码放到pkg_amd64.s文件中：
``` bash
GLOBL ·Id(SB),$8
DATA ·Id+0(SB)/1,$0x37
DATA ·Id+1(SB)/1,$0x25
DATA ·Id+2(SB)/1,$0x00
DATA ·Id+3(SB)/1,$0x00
DATA ·Id+4(SB)/1,$0x00
DATA ·Id+5(SB)/1,$0x00
DATA ·Id+6(SB)/1,$0x00
DATA ·Id+7(SB)/1,$0x00
```

文件名pkg_amd64.s的后缀名表示AMD64环境下的汇编代码文件。
虽然pkg包是用汇编实现，但是用法和之前的Go语言版本完全一样：
``` go
package main
import pkg "pkg包的路径"
func main() {
println(pkg.Id)
}
```

### 定义字符串变量
虽然从Go语言角度看，定义字符串和整数变量的写法基本相同，但是字符串底层却有着比单个整数更复杂的数据结构。

``` go
package pkg
var Name = "gopher"
```
然后用以下命令查看的Go语言程序对应的伪汇编代码：
``` bash
$ go tool compile -S pkg.go
go.string."gopher" SRODATA dupok size=6
0x0000 67 6f 70 68 65 72 gopher
"".Name SDATA size=16
0x0000 00 00 00 00 00 00 00 00 06 00 00 00 00 00 00 00 ......
..........
rel 0+8 t=1 go.string."gopher"+0
```

输出中出现了一个新的符号go.string."gopher"，根据其长度和内容分析可以猜测是
对应底层的"gopher"字符串数据。因为Go语言的字符串并不是值类型，Go字符串
其实是一种只读的引用类型。如果多个代码中出现了相同的"gopher"只读字符串
时，程序链接后可以引用的同一个符号go.string."gopher"。因此，该符号有一个
SRODATA标志表示这个数据在只读内存段，dupok表示出现多个相同标识符的数
据时只保留一个就可以了。

而真正的Go字符串变量Name对应的大小却只有16个字节了。其实Name变量并没
有直接对应“gopher”字符串，而是对应16字节大小的reflect.StringHeader结构体：
``` go
type reflect.StringHeader struct {
Data uintptr
Len int
}
```

从汇编角度看，Name变量其实对应的是reflect.StringHeader结构体类型。前8个字
节对应底层真实字符串数据的指针，也就是符号go.string."gopher"对应的地址。后
8个字节对应底层真实字符串数据的有效长度，这里是6个字节。

现在创建pkg_amd64.s文件，尝试通过汇编代码重新定义并初始化Name字符串：
``` bash
GLOBL ·NameData(SB),$8
DATA ·NameData(SB)/8,$"gopher"
GLOBL ·Name(SB),$16
DATA ·Name+0(SB)/8,$·NameData(SB)
DATA ·Name+8(SB)/8,$6
```
因为在Go汇编语言中，go.string."gopher"不是一个合法的符号，因此我们无法通过
手工创建（这是给编译器保留的部分特权，因为手工创建类似符号可能打破编译器
输出代码的某些规则）。因此我们新创建了一个·NameData符号表示底层的字符串
数据。然后定义·Name符号内存大小为16字节，其中前8个字节用·NameData符号
对应的地址初始化，后8个字节为常量6表示字符串长度。

当用汇编定义好字符串变量并导出之后，还需要在Go语言中声明该字符串变量。然
后就可以用Go语言代码测试Name变量了：
``` go
package main
import pkg "path/to/pkg"
func main() {
println(pkg.Name)
}
```
不幸的是这次运行产生了以下错误：
``` bash
pkgpath.NameData: missing Go type information for global symbol:
size 8
```

错误提示汇编中定义的NameData符号没有类型信息。其实Go汇编语言中定义的数
据并没有所谓的类型，每个符号只不过是对应一块内存而已，因此NameData符号
也是没有类型的。但是Go语言是再带垃圾回收器的语言，而Go汇编语言是工作在
自动垃圾回收体系框架内的。当Go语言的垃圾回收器在扫描到NameData变量的时
候，无法知晓该变量内部是否包含指针，因此就出现了这种错误。错误的根本原因
并不是NameData没有类型，而是NameData变量没有标注是否会含有指针信息。
通过给NameData变量增加一个NOPTR标志，表示其中不会包含指针数据可以修复
该错误：
``` bash
#include "textflag.h"
GLOBL ·NameData(SB),NOPTR,$8
```
通过给·NameData增加NOPTR标志的方式表示其中不含指针数据。我们也可以通
过给·NameData变量在Go语言中增加一个不含指针并且大小为8个字节的类型来修
改该错误：
``` go
package pkg
var NameData [8]byte
var Name string
```

我们将NameData声明为长度为8的字节数组。编译器可以通过类型分析出该变量会包含指针，因此汇编代码中可以省略NOPTR标志。现在垃圾回收器在遇到该量的时候就会停止内部数据的扫描。在这个实现中，Name字符串底层其实引用的是NameData内存对应的“gopher”字串数据。因此，如果NameData发生变化，Name字符串的数据也会跟着变化

``` go
func main() {
println(pkg.Name)
pkg.NameData[0] = '?'
println(pkg.Name)
}
```
当然这和字符串的只读定义是冲突的，正常的代码需要避免出现这种情况。最好的
方法是不要导出内部的NameData变量，这样可以避免内部数据被无意破坏。

在用汇编定义字符串时我们可以换一种思维：将底层的字符串数据和字符串头结构
体定义在一起，这样可以避免引入NameData符号：
``` bash
GLOBL ·Name(SB),$24
DATA ·Name+0(SB)/8,$·Name+16(SB)
DATA ·Name+8(SB)/8,$6
DATA ·Name+16(SB)/8,$"gopher"
```
在新的结构中，Name符号对应的内存从16字节变为24字节，多出的8个字节存放
底层的“gopher”字符串。·Name符号前16个字节依然对应reflect.StringHeader结构
体：Data部分对应 $·Name+16(SB) ，表示数据的地址为Name符号往后偏移16个
字节的位置；Len部分依然对应6个字节的长度。这是C语言程序员经常使用的技
巧。

### 定义main函数

我们现在将尝试用汇编实现函数，然后输出一个字符串。先创建main.go文件，创建并初始化字符串变量，同时声明main函数：
``` go
package main
var helloworld = "你好, 世界"
func main()
```
然后创建main_amd64.s文件，里面对应main函数的实现：
``` bash
TEXT ·main(SB), $16-0
MOVQ ·helloworld+0(SB), AX; MOVQ AX, 0(SP)
MOVQ ·helloworld+8(SB), BX; MOVQ BX, 8(SP)
CALL runtime·printstring(SB)
CALL runtime·printnl(SB)
RET
```
TEXT ·main(SB), $16-0 用于定义 main 函数，其中 $16-0 表示 main 函数的
帧大小是16个字节（对应string头部结构体的大小，用于
给 runtime·printstring 函数传递参数）， 0 表示 main 函数没有参数和返回
值。 main 函数内部通过调用运行时内部的 runtime·printstring(SB) 函数来
打印字符串。然后调用 runtime·printnl 打印换行符号。

Go语言函数在函数调用时，完全通过栈传递调用参数和返回值。先通过MOVQ指
令，将helloworld对应的字符串头部结构体的16个字节复制到栈指针SP对应的16字
节的空间，然后通过CALL指令调用对应函数。最后使用RET指令表示当前函数返
回。

### 特殊字符
Go语言函数或方法符号在编译为目标文件后，目标文件中的每个符号均包含对应包
的绝对导入路径。因此目标文件的符号可能非常复杂，比如“path/to/pkg.
(*SomeType).SomeMethod”或“go.string."abc"”等名字。目标文件的符号名中不仅
仅包含普通的字母，还可能包含点号、星号、小括弧和双引号等诸多特殊字符。而
Go语言的汇编器是从plan9移植过来的二把刀，并不能处理这些特殊的字符，导致
了用Go汇编语言手工实现Go诸多特性时遇到种种限制。

Go汇编语言同样遵循Go语言少即是多的哲学，它只保留了最基本的特性：定义变
量和全局函数。其中在变量和全局函数等名字中引入特殊的分隔符号支持Go语言等
包体系。为了简化Go汇编器的词法扫描程序的实现，特别引入了Unicode中的中
点 · 和大写的除法 / ，对应的Unicode码点为 U+00B7 和 U+2215 。汇编器编译
后，中点 · 会被替换为ASCII中的点“.”，大写的除法会被替换为ASCII码中的除
法“/”，比如 math/rand·Int 会被替换为 math/rand.Int 。这样可以将中点和浮
点数中的小数点、大写的除法和表达式中的除法符号分开，可以简化汇编程序词法
分析部分的实现。

即使暂时抛开Go汇编语言设计取舍的问题，在不同的操作系统不同等输入法中如何
输入中点 · 和除法 / 两个字符就是一个挑战。这两个字符在
https://golang.org/doc/asm 文档中均有描述，因此直接从该页面复制是最简单可靠
的方式。

如果是macOS系统，则有以下几种方法输入中点 · ：在不开输入法时，可直接用
option+shift+9 输入；如果是自带的简体拼音输入法，输入左上角 ~ 键对应 · ，
如果是自带的Unicode输入法，则可以输入对应的Unicode码点。其中Unicode输入
法可能是最安全可靠等输入方式。

### 没有分号
Go汇编语言中分号可以用于分隔同一行内的多个语句。下面是用分号混乱排版的汇
编代码：
``` bash
TEXT ·main(SB), $16-0; MOVQ ·helloworld+0(SB), AX; MOVQ ·hellowo
rld+8(SB), BX;
MOVQ AX, 0(SP);MOVQ BX, 8(SP);CALL runtime·printstring(SB);
CALL runtime·printnl(SB);
RET;
```
和Go语言一样，也可以省略行尾的分号。当遇到末尾时，汇编器会自动插入分号。
下面是省略分号后的代码：
``` bash
TEXT ·main(SB), $16-0
MOVQ ·helloworld+0(SB), AX; MOVQ AX, 0(SP)
MOVQ ·helloworld+8(SB), BX; MOVQ BX, 8(SP)
CALL runtime·printstring(SB)
CALL runtime·printnl(SB)
RET
```
和Go语言一样，语句之间多个连续的空白字符和一个空格是等价的。

## 计算机结构

### X86-64体系结构

X86其实是是80X86的简称（后面三个字母），包括Intel 8086、80286、80386以
及80486等指令集合，因此其架构被称为x86架构。x86-64是AMD公司于1999年设
计的x86架构的64位拓展，向后兼容于16位及32位的x86架构。X86-64目前正式名
称为AMD64，也就是Go语言中GOARCH环境变量指定的AMD64。

在使用汇编语言之前必须要了解对应的CPU体系结构。下面是X86/AMD架构图：

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240311162105.png)

左边是内存部分是常见的内存布局。其中text一般对应代码段，用于存储要执行指
令数据，代码段一般是只读的。然后是rodata和data数据段，数据段一般用于存放
全局的数据，其中rodata是只读的数据段。而heap段则用于管理动态的数据，stack
段用于管理每个函数调用时相关的数据。在汇编语言中一般重点关注text代码段和
data数据段，因此Go汇编语言中专门提供了对应TEXT和DATA命令用于定义代码和
数据。

中间是X86提供的寄存器。寄存器是CPU中最重要的资源，每个要处理的内存数据
原则上需要先放到寄存器中才能由CPU处理，同时寄存器中处理完的结果需要再存
入内存。X86中除了状态寄存器FLAGS和指令寄存器IP两个特殊的寄存器外，还有
AX、BX、CX、DX、SI、DI、BP、SP几个通用寄存器。在X86-64中又增加了八个
以R8-R15方式命名的通用寄存器。因为历史的原因R0-R7并不是通用寄存器，它们
只是X87开始引入的MMX指令专有的寄存器。在通用寄存器中BP和SP是两个比较
特殊的寄存器：其中BP用于记录当前函数帧的开始位置，和函数调用相关的指令会
隐式地影响BP的值；SP则对应当前栈指针的位置，和栈相关的指令会隐式地影响
SP的值；而某些调试工具需要BP寄存器才能正常工作。

右边是X86的指令集。CPU是由指令和寄存器组成，指令是每个CPU内置的算法，
指令处理的对象就是全部的寄存器和内存。我们可以将每个指令看作是CPU内置标
准库中提供的一个个函数，然后基于这些函数构造更复杂的程序的过程就是用汇编
语言编程的过程。

### Go汇编中的伪寄存器

Go汇编为了简化汇编代码的编写，引入了PC、FP、SP、SB四个伪寄存器。四个
伪寄存器加其它的通用寄存器就是Go汇编语言对CPU的重新抽象，该抽象的结构
也适用于其它非X86类型的体系结构。

四个伪寄存器和X86/AMD64的内存和寄存器的相互关系如下图：
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240311162525.png)

在AMD64环境，伪PC寄存器其实是IP指令计数器寄存器的别名。伪FP寄存器对应
的是函数的帧指针，一般用来访问函数的参数和返回值。伪SP栈指针对应的是当前
函数栈帧的底部（不包括参数和返回值部分），一般用于定位局部变量。伪SP是一
个比较特殊的寄存器，因为还存在一个同名的SP真寄存器。真SP寄存器对应的是
栈的顶部，一般用于定位调用其它函数的参数和返回值。

当需要区分伪寄存器和真寄存器的时候只需要记住一点：伪寄存器一般需要一个标
识符和偏移量为前缀，如果没有标识符前缀则是真寄存器。比如 (SP) 、 +8(SP) 没有标识符前缀为真SP寄存器，而 a(SP) 、 b+8(SP) 有标识符为前缀表示伪寄存器。

###  X86-64指令集
很多汇编语言的教程都会强调汇编语言是不可移植的。严格来说汇编语言是在不同
的CPU类型、或不同的操作系统环境、或不同的汇编工具链下是不可移植的，而在
同一种CPU中运行的机器指令是完全一样的。汇编语言这种不可移植性正是其普及
的一个极大的障碍。虽然CPU指令集的差异是导致不好移植的较大因素，但是汇编
语言的相关工具链对此也有不可推卸的责任。而源自Plan9的Go汇编语言对此做了
一定的改进：首先Go汇编语言在相同CPU架构上是完全一致的，也就是屏蔽了操
作系统的差异；同时Go汇编语言将一些基础并且类似的指令抽象为相同名字的伪指
令，从而减少不同CPU架构下汇编代码的差异（寄存器名字和数量的差异是一直存
在的）。

X86是一个极其复杂的系统，有人统计x86-64中指令有将近一千个之多。不仅仅如
此，X86中的很多单个指令的功能也非常强大，比如有论文证明了仅仅一个MOV指
令就可以构成一个图灵完备的系统。以上这是两种极端情况，太多的指令和太少的
指令都不利于汇编程序的编写，但是也从侧面体现了MOV指令的重要性。

通用的基础机器指令大概可以分为数据传输指令、算术运算和逻辑运算指令、控制
流指令和其它指令等几类。

因此我们先看看重要的MOV指令。其中MOV指令可以用于将字面值移动到寄存
器、字面值移到内存、寄存器之间的数据传输、寄存器和内存之间的数据传输。需
要注意的是，MOV传输指令的内存操作数只能有一个，可以通过某个临时寄存器达
到类似目的。最简单的是忽略符号位的数据传输操作，386和AMD64指令一样，不
同的1、2、4和8字节宽度有不同的指令：
``` 
Data Type 386/AMD64 Comment
[1]byte MOVB B => Byte
[2]byte MOVW W => Word
[4]byte MOVL L => Long
[8]byte MOVQ Q => Quadword
```
MOV指令它不仅仅用于在寄存器和内存之间传输数据，而且还可以用于处理数据的
扩展和截断操作。当数据宽度和寄存器的宽度不同又需要处理符号位时，386和
AMD64有各自不同的指令：
```
Data Type 386 AMD64 Comment
int8 MOVBLSX MOVBQSX sign extend
uint8 MOVBLZX MOVBQZX zero extend
int16 MOVWLSX MOVWQSX sign extend
uint16 MOVWLZX MOVWQZX zero extend
```
比如当需要将一个int64类型的数据转为bool类型时，则需要使用MOVBQZX指令处
理。

基础算术指令有ADD、SUB、MUL、DIV等指令。其中ADD、SUB、MUL、DIV用
于加、减、乘、除运算，最终结果存入目标寄存器。基础的逻辑运算指令有AND、
OR和NOT等几个指令，对应逻辑与、或和取反等几个指令。
```
名称 解释
ADD 加法
SUB 减法
MUL 乘法
DIV 除法
AND 逻辑与
OR 逻辑或
NOT 逻辑取反
```
其中算术和逻辑指令是顺序编程的基础。通过逻辑比较影响状态寄存器，再结合有
条件跳转指令就可以实现更复杂的分支或循环结构。需要注意的是MUL和DIV等乘
除法指令可能隐含使用了某些寄存器，指令细节请查阅相关手册。

控制流指令有CMP、JMP-if-x、JMP、CALL、RET等指令。CMP指令用于两个操
作数做减法，根据比较结果设置状态寄存器的符号位和零位，可以用于有条件跳转
的跳转条件。JMP-if-x是一组有条件跳转指令，常用的有JL、JLZ、JE、JNE、
JG、JGE等指令，对应小于、小于等于、等于、不等于、大于和大于等于等条件时
跳转。JMP指令则对应无条件跳转，将要跳转的地址设置到IP指令寄存器就实现了
跳转。而CALL和RET指令分别为调用函数和函数返回指令。
```
名称 解释
JMP 无条件跳转
JMP-if-x 有条件跳转，JL、JLZ、JE、JNE、JG、JGE
CALL 调用函数
RET 函数返回
```
无条件和有条件调整指令是实现分支和循环控制流的基础指令。理论上，我们也可
以通过跳转指令实现函数的调用和返回功能。不过因为目前函数已经是现代计算机
中的一个最基础的抽象，因此大部分的CPU都针对函数的调用和返回提供了专有的
指令和寄存器。

其它比较重要的指令有LEA、PUSH、POP等几个。其中LEA指令将标准参数格式
中的内存地址加载到寄存器（而不是加载内存位置的内容）。PUSH和POP分别是
压栈和出栈指令，通用寄存器中的SP为栈指针，栈是向低地址方向增长的。
```
名称 解释
LEA 取地址
PUSH 压栈
POP 出栈
```
当需要通过间接索引的方式访问数组或结构体等某些成员对应的内存时，可以用
LEA指令先对目前内存取地址，然后在操作对应内存的数据。而栈指令则可以用于
函数调整自己的栈空间大小。

最后需要说明的是，Go汇编语言可能并没有支持全部的CPU指令。如果遇到没有
支持的CPU指令，可以通过Go汇编语言提供的BYTE命令将真实的CPU指令对应的
机器码填充到对应的位置。完整的X86指令在
https://github.com/golang/arch/blob/master/x86/x86.csv 文件定义。同时Go汇编还正对一些指令定义了别名，具体可以参考这里
https://golang.org/src/cmd/internal/obj/x86/anames.go 。