---

---

# CGO 编程

> C语言作为一个通用语言，很多库会选择提供一个C兼容的API，然后用其他不同的编程语言实现。Go语言通过自带的一个叫CGO的工具来支持C语言函数调用，同时我们可以用Go语言导出C动态库接口给其它语言使用。

## 快速入门

``` go
// hello.go
package main
import "C"
func main() {
println("hello cgo")
}
```

代码通过 import "C" 语句启用CGO特性，主函数只是通过Go内置的println函数
输出字符串，其中并没有任何和CGO相关的代码。虽然没有调用CGO的相关函
数，但是 go build 命令会在编译和链接阶段启动gcc编译器，这已经是一个完整
的CGO程序了。

### 基于C标准库函数输出字符串

``` go
// hello.go
package main
//#include <stdio.h>
import "C"
func main() {
C.puts(C.CString("Hello, World\n"))
}
```
我们不仅仅通过 import "C" 语句启用CGO特性，同时包含C语言的 <stdio.h> 头文件。然后通过CGO包的 C.CString 函数将Go语言字符串转为C语言字符串，最后调用CGO包的 C.puts 函数向标准输出窗口打印转换后的C字
符串。

### 使用自己的C函数

``` go
// hello.go
package main
/*
#include <stdio.h>
static void SayHello(const char* s) {
puts(s);
}
*/
import "C"
func main() {
C.SayHello(C.CString("Hello, World\n"))
}
```
我们也可以将 SayHello 函数放到当前目录下的一个C语言源文件中（后缀名必须
是 .c ）。因为是编写在独立的C文件中，为了允许外部引用，所以需要去掉函数
的 static 修饰符。

``` c
// hello.c
#include <stdio.h>
void SayHello(const char* s) {
puts(s);
}
```

然后在CGO部分先声明 SayHello 函数，其它部分不变：
``` go
// hello.go
package main
//void SayHello(const char* s);
import "C"
func main() {
C.SayHello(C.CString("Hello, World\n"))
}
```

> 注意，如果之前运行的命令是 go run hello.go 或 go build hello.go 的话，
此处须使用 go run "your/package" 或 go build "your/package" 才可以。
若本就在包路径下的话，也可以直接运行 go run . 或 go build 。

既然 SayHello 函数已经放到独立的C文件中了，我们自然可以将对应的C文件编
译打包为静态库或动态库文件供使用。如果是以静态库或动态库方式引
用 SayHello 函数的话，需要将对应的C源文件移出当前目录（CGO构建程序会自
动构建当前目录下的C源文件，从而导致C函数名冲突）。

###  C代码的模块化

> 在编程过程中，抽象和模块化是将复杂问题简化的通用手段。当代码语句变多时，
我们可以将相似的代码封装到一个个函数中；当程序中的函数变多时，我们将函数
拆分到不同的文件或模块中。而模块化编程的核心是面向程序接口编程（这里的接
口并不是Go语言的interface，而是API的概念）。

我们可以抽象一个名为hello的模块，模块的全部接口函数都在
hello.h头文件定义：
``` c
// hello.h
void SayHello(const char* s);
```

其中只有一个SayHello函数的声明。但是作为hello模块的用户来说，就可以放心地
使用SayHello函数，而无需关心函数的具体实现。而作为SayHello函数的实现者来
说，函数的实现只要满足头文件中函数的声明的规范即可。

``` c
// hello.c
#include "hello.h"
#include <stdio.h>
void SayHello(const char* s) {
puts(s);
}
```

在hello.c文件的开头，实现者通过 #include "hello.h" 语句包含SayHello函数
的声明，这样可以保证函数的实现满足模块对外公开的接口。
接口文件hello.h是hello模块的实现者和使用者共同的约定，但是该约定并没有要求
必须使用C语言来实现SayHello函数。我们也可以用C++语言来重新实现这个C语言
函数：
``` c++
// hello.cpp
#include <iostream>
extern "C" {
#include "hello.h"
}
void SayHello(const char* s) {
std::cout << s;
}
```

在C++版本的SayHello函数实现中，我们通过C++特有的 std::cout 输出流输出
字符串。不过为了保证C++语言实现的SayHello函数满足C语言头文件hello.h定义
的函数规范，我们需要通过 extern "C" 语句指示该函数的链接符号遵循C语言的
规则。

在采用面向C语言API接口编程之后，我们彻底解放了模块实现者的语言枷锁：实现
者可以用任何编程语言实现模块，只要最终满足公开的API约定即可。我们可以用C
语言实现SayHello函数，也可以使用更复杂的C++语言来实现SayHello函数，当然
我们也可以用汇编语言甚至Go语言来重新实现SayHello函数。

### 用Go重新实现C函数

> 其实CGO不仅仅用于Go语言中调用C语言函数，还可以用于导出Go语言函数给C语
言函数调用。

``` go
// hello.go
package main
import "C"
import "fmt"
//export SayHello
func SayHello(s *C.char) {
fmt.Print(C.GoString(s))
}
```

我们通过CGO的 //export SayHello 指令将Go语言实现的函数 SayHello 导出
为C语言函数。为了适配CGO导出的C语言函数，我们禁止了在函数的声明语句中
的const修饰符。需要注意的是，这里其实有两个版本的 SayHello 函数：一个Go
语言环境的；另一个是C语言环境的。cgo生成的C语言版本SayHello函数最终会通
过桥接代码调用Go语言版本的SayHello函数。

通过面向C语言接口的编程技术，我们不仅仅解放了函数的实现者，同时也简化的
函数的使用者。现在我们可以将SayHello当作一个标准库的函数使用（和puts函数
的使用方式类似）：
``` go
package main
//#include <hello.h>
import "C"
func main() {
C.SayHello(C.CString("Hello, World\n"))
}
```

### 面向C接口的Go编程

``` go
package main
//void SayHello(char* s);
import "C"
import (
"fmt"
)
func main() {
C.SayHello(C.CString("Hello, World\n"))
}
//export SayHello
func SayHello(s *C.char) {
fmt.Print(C.GoString(s))
}
```

现在版本的CGO代码中C语言代码的比例已经很少了，但是我们依然可以进一步以
Go语言的思维来提炼我们的CGO代码。通过分析可以发现 SayHello 函数的参数
如果可以直接使用Go字符串是最直接的。在Go1.10中CGO新增加了一
个 _GoString_ 预定义的C语言类型，用来表示Go语言字符串。下面是改进后的
代码：
``` go
// +build go1.10
package main
//void SayHello(_GoString_ s);
import "C"
import (
"fmt"
)
func main() {
C.SayHello("Hello, World\n")
}
//export SayHello
func SayHello(s string) {
fmt.Print(s)
}
```

虽然看起来全部是Go语言代码，但是执行的时候是先从Go语言的 main 函数，到
CGO自动生成的C语言版本 SayHello 桥接函数，最后又回到了Go语言环境
的 SayHello 函数。


## CGO基础

### import "C" 语句

如果在Go代码中出现了 import "C" 语句则表示使用了CGO特性，紧跟在这行语
句前面的注释是一种特殊语法，里面包含的是正常的C语言代码。当确保CGO启用
的情况下，还可以在当前目录中包含C/C++对应的源文件。

``` go
package main
/*
#include <stdio.h>
void printint(int v) {
printf("printint: %d\n", v);
}
*/
import "C"
func main() {
v := 42
C.printint(C.int(v))
}
```

开头的注释中写了要调用的C函数和相关的头文件，头文件被include之后里面的所有的C语言元素都会被加入到”C”这个虚拟的包中。需要注意的是，import "C"导入语句需要单独一行，不能与其他包一同import。向C函数传递参数也很简单，就直接转化成对应C语言类型传递就可以。如上例中 C.int(v) 用于将一个Go中的int类型值强制类型转换转化为C语言中的int类型值，然后调用C语言定义的printint函数进行打印。

需要注意的是，Go是强类型语言，所以cgo中传递的参数类型必须与声明的类型完
全一致，而且传递前必须用”C”中的转化函数转换成对应的C类型，不能直接传入
Go中类型的变量。同时通过虚拟的C包导入的C语言符号并不需要是大写字母开
头，它们不受Go语言的导出规则约束。

cgo将当前包引用的C语言符号都放到了虚拟的C包中，同时当前包依赖的其它Go语
言包内部可能也通过cgo引入了相似的虚拟C包，但是不同的Go语言包引入的虚拟
的C包之间的类型是不能通用的。这个约束对于要自己构造一些cgo辅助函数时有可
能会造成一点的影响。

比如我们希望在Go中定义一个C语言字符指针对应的CChar类型，然后增加一个
GoString方法返回Go语言字符串：
``` go
package cgo_helper
//#include <stdio.h>
import "C"
type CChar C.char
func (p *CChar) GoString() string {
return C.GoString((*C.char)(p))
}
func PrintCString(cs *C.char) {
C.puts(cs)
}
```

现在我们可能会想在其它的Go语言包中也使用这个辅助函数：
``` go
package main
//static const char* cs = "hello";
import "C"
import "./cgo_helper"
func main() {
cgo_helper.PrintCString(C.cs)
}
```

这段代码是不能正常工作的，因为当前main包引入的 C.cs 变量的类型是当
前 main 包的cgo构造的虚拟的C包下的 *char 类型（具体点是 *C.char ，更具
体点是 *main.C.char ），它和cgo_helper包引入的 *C.char 类型（具体点
是 *cgo_helper.C.char ）是不同的。在Go语言中方法是依附于类型存在的，不
同Go包中引入的虚拟的C包的类型却是不同的（ main.C 不
等 cgo_helper.C ），这导致从它们延伸出来的Go类型也是不同的类型
（ *main.C.char 不等 *cgo_helper.C.char ），这最终导致了前面代码不能正
常工作。


有Go语言使用经验的用户可能会建议参数转型后再传入。但是这个方法似乎也是不
可行的，因为 cgo_helper.PrintCString 的参数是它自身包引入的 *C.char 类
型，在外部是无法直接获取这个类型的。换言之，一个包如果在公开的接口中直接
使用了 *C.char 等类似的虚拟C包的类型，其它的Go包是无法直接使用这些类型
的，除非这个Go包同时也提供了 *C.char 类型的构造函数。因为这些诸多因素，
如果想在go test环境直接测试这些cgo导出的类型也会有相同的限制。

### #cgo 语句

在 import "C" 语句前的注释中可以通过 #cgo 语句设置编译阶段和链接阶段的
相关参数。编译阶段的参数主要用于定义相关宏和指定头文件检索路径。链接阶段
的参数主要是指定库文件检索路径和要链接的库文件。

``` go
// #cgo CFLAGS: -DPNG_DEBUG=1 -I./include
// #cgo LDFLAGS: -L/usr/local/lib -lpng
// #include <png.h>
import "C"
```

上面的代码中，CFLAGS部分， -D 部分定义了宏PNG_DEBUG，值为1； -I 定
义了头文件包含的检索目录。LDFLAGS部分， -L 指定了链接时库文件检索目
录， -l 指定了链接时需要链接png库。
因为C/C++遗留的问题，C头文件检索目录可以是相对目录，但是库文件检索目录
则需要绝对路径。在库文件的检索目录中可以通过 ${SRCDIR} 变量表示当前包目
录的绝对路径：

``` go
// #cgo LDFLAGS: -L${SRCDIR}/libs -lfoo
```
上面的代码在链接时将被展开为：
``` go
// #cgo LDFLAGS: -L/go/src/foo/libs -lfoo
```

#cgo 语句主要影响CFLAGS、CPPFLAGS、CXXFLAGS、FFLAGS和LDFLAGS
几个编译器环境变量。LDFLAGS用于设置链接时的参数，除此之外的几个变量用
于改变编译阶段的构建参数(CFLAGS用于针对C语言代码设置编译参数)。

对于在cgo环境混合使用C和C++的用户来说，可能有三种不同的编译选项：其中
CFLAGS对应C语言特有的编译选项、CXXFLAGS对应是C++特有的编译选项、
CPPFLAGS则对应C和C++共有的编译选项。但是在链接阶段，C和C++的链接选
项是通用的，因此这个时候已经不再有C和C++语言的区别，它们的目标文件的类
型是相同的。

#cgo 指令还支持条件选择，当满足某个操作系统或某个CPU架构类型时后面的编
译或链接选项生效。比如下面是分别针对windows和非windows下平台的编译和链
接选项：
``` go
// #cgo windows CFLAGS: -DX86=1
// #cgo !windows LDFLAGS: -lm
```

其中在windows平台下，编译前会预定义X86宏为1；在非widnows平台下，在链接
阶段会要求链接math数学库。这种用法对于在不同平台下只有少数编译选项差异的
场景比较适用。

如果在不同的系统下cgo对应着不同的c代码，我们可以先使用 #cgo 指令定义不同
的C语言的宏，然后通过宏来区分不同的代码：

``` go
package main
/*
#cgo windows CFLAGS: -DCGO_OS_WINDOWS=1
#cgo darwin CFLAGS: -DCGO_OS_DARWIN=1
#cgo linux CFLAGS: -DCGO_OS_LINUX=1
#if defined(CGO_OS_WINDOWS)
const char* os = "windows";
#elif defined(CGO_OS_DARWIN)
const char* os = "darwin";
#elif defined(CGO_OS_LINUX)
const char* os = "linux";
#else
# error(unknown os)
#endif
*/
import "C"
func main() {
print(C.GoString(C.os))
}
```

### build tag 条件编译

build tag 是在Go或cgo环境下的C/C++文件开头的一种特殊的注释。条件编译类似
于前面通过 #cgo 指令针对不同平台定义的宏，只有在对应平台的宏被定义之后才
会构建对应的代码。但是通过 #cgo 指令定义宏有个限制，它只能是基于Go语言
支持的windows、darwin和linux等已经支持的操作系统。如果我们希望定义一个
DEBUG标志的宏， #cgo 指令就无能为力了。而Go语言提供的build tag 条件编译
特性则可以简单做到。

比如下面的源文件只有在设置debug构建标志时才会被构建：
``` go
// +build debug
package main
var buildMode = "debug"
```
可以用以下命令构建：
``` go
go build -tags="debug"
go build -tags="windows debug"
```

我们可以通过 -tags 命令行参数同时指定多个build标志，它们之间用空格分隔。
当有多个build tag时，我们将多个标志通过逻辑操作的规则来组合使用。比如以下
的构建标志表示只有在”linux/386“或”darwin平台下非cgo环境“才进行构建。
``` go
// +build linux,386 darwin,!cgo
```
其中 linux,386 中linux和386用逗号链接表示AND的意思；
而 linux,386 和 darwin,!cgo 之间通过空白分割来表示OR的意思。

## 类型转换