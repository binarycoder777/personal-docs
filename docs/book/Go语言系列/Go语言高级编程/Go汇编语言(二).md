---

---

# Go汇编语言(二)

## 再论函数

### 函数调用规范

在Go汇编语言中CALL指令用于调用函数，RET指令用于从调用函数返回。但是CALL和RET指令并没有处理函数调用时输入参数和返回值的问题。CALL指令类似 PUSH IP 和 JMP somefunc 两个指令的组合，首先将当前的IP指令寄存器的值压入栈中，然后通过JMP指令将要调用函数的地址写入到IP寄存器实现跳转。而RET指令则是和CALL相反的操作，基本和 POP IP 指令等价，也就是将执行CALL指令时保存在SP中的返回地址重新载入到IP寄存器，实现函数的返回。和C语言函数不同，Go语言函数的参数和返回值完全通过栈传递。

下面是Go函数调用时栈的布局图：
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240321144322.png)

首先是调用函数前准备的输入参数和返回值空间。然后CALL指令将首先触发返回地址入栈操作。在进入到被调用函数内之后，汇编器自动插入了BP寄存器相关的指令，因此BP寄存器和返回地址是紧挨着的。再下面就是当前函数的局部变量的空间，包含再次调用其它函数需要准备的调用参数空间。被调用的函数执行RET返回指令时，先从栈恢复BP和SP寄存器，接着取出的返回地址跳转到对应的指令执行。

### 高级汇编语言

Go汇编语言其实是一种高级的汇编语言。在这里高级一词并没有任何褒义或贬义的色彩，而是要强调Go汇编代码和最终真实执行的代码并不完全等价。Go汇编语言中一个指令在最终的目标代码中可能会被编译为其它等价的机器指令。Go汇编实现的函数或调用函数的指令在最终代码中也会被插入额外的指令。要彻底理解Go汇编语言就需要彻底了解汇编器到底插入了哪些指令。

为了便于分析，我们先构造一个禁止栈分裂的printnl函数。printnl函数内部都通过调用runtime.printnl函数输出换行：
```go
TEXT ·printnl_nosplit(SB), NOSPLIT, $8
CALL runtime·printnl(SB)
RET
```
然后通过 go tool asm -S main_amd64.s 指令查看编译后的目标代码：
```bash
"".printnl_nosplit STEXT nosplit size=29 args=0xffffffff80000000
locals=0x10
0x0000 00000 (main_amd64.s:5) TEXT "".printnl_nosplit(SB), NOSPL
IT $16
0x0000 00000 (main_amd64.s:5) SUBQ $16, SP
0x0004 00004 (main_amd64.s:5) MOVQ BP, 8(SP)
0x0009 00009 (main_amd64.s:5) LEAQ 8(SP), BP
0x000e 00014 (main_amd64.s:6) CALL runtime.printnl(SB)
0x0013 00019 (main_amd64.s:7) MOVQ 8(SP), BP
0x0018 00024 (main_amd64.s:7) ADDQ $16, SP
0x001c 00028 (main_amd64.s:7) RET
```
输出代码中我们删除了非指令的部分。为了便于讲述，我们将上述代码重新排版，并根据缩进表示相关的功能：
```bash
TEXT "".printnl(SB), NOSPLIT, $16
SUBQ $16, SP
MOVQ BP, 8(SP)
LEAQ 8(SP), BP
CALL runtime.printnl(SB)
MOVQ 8(SP), BP
ADDQ $16, SP
RET
```

第一层是TEXT指令表示函数开始，到RET指令表示函数返回。第二层是 SUBQ
$16, SP 指令为当前函数帧分配16字节的空间，在函数返回前通过 ADDQ $16,
SP 指令回收16字节的栈空间。我们谨慎猜测在第二层是为函数多分配了8个字节的
空间。那么为何要多分配8个字节的空间呢？再继续查看第三层的指令：开始部分
有两个指令 MOVQ BP, 8(SP) 和 LEAQ 8(SP), BP ，首先是将BP寄存器保持到多
分配的8字节栈空间，然后将 8(SP) 地址重新保持到了BP寄存器中；结束部分
是 MOVQ 8(SP), BP 指令则是从栈中恢复之前备份的前BP寄存器的值。最里面第
四次层才是我们写的代码，调用runtime.printnl函数输出换行。

如果去掉NOSPILT标志，再重新查看生成的目标代码，会发现在函数的开头和结尾
的地方又增加了新的指令。下面是经过缩进格式化的结果：
```bash
TEXT "".printnl_nosplit(SB), $16
L_BEGIN:
MOVQ (TLS), CX
CMPQ SP, 16(CX)
JLS L_MORE_STK
SUBQ $16, SP
MOVQ BP, 8(SP)
LEAQ 8(SP), BP
CALL runtime.printnl(SB)
MOVQ 8(SP), BP
ADDQ $16, SP
L_MORE_STK:
CALL runtime.morestack_noctxt(SB)
JMP L_BEGIN
RET
```
其中开头有三个新指令， MOVQ (TLS), CX 用于加载g结构体指针，然后第二个指
令 CMPQ SP, 16(CX) SP栈指针和g结构体中stackguard0成员比较，如果比较的
结果小于0则跳转到结尾的L_MORE_STK部分。当获取到更多栈空间之后，通
过 JMP L_BEGIN 指令跳转到函数的开始位置重新进行栈空间的检测。

g结构体在 $GOROOT/src/runtime/runtime2.go 文件定义，开头的结构成员如下：
``` go
type g struct {
// Stack parameters.
stack stack // offset known to runtime/cgo
stackguard0 uintptr // offset known to liblink
stackguard1 uintptr // offset known to liblink
...
}
```
第一个成员是stack类型，表示当前栈的开始和结束地址。stack的定义如下：
```go
// Stack describes a Go execution stack.
// The bounds of the stack are exactly [lo, hi),
// with no implicit data structures on either side.
type stack struct {
lo uintptr
hi uintptr
}
```
在g结构体中的stackguard0成员是出现爆栈前的警戒线。stackguard0的偏移量是
16个字节，因此上述代码中的 CMPQ SP, 16(AX) 表示将当前的真实SP和爆栈警
戒线比较，如果超出警戒线则表示需要进行栈扩容，也就是跳转到
L_MORE_STK。在L_MORE_STK标号处，先调用runtime·morestack_noctxt进行
栈扩容，然后又跳回到函数的开始位置，此时此刻函数的栈已经调整了。然后再进
行一次栈大小的检测，如果依然不足则继续扩容，直到栈足够大为止。

以上是栈的扩容，但是栈的收缩是在何时处理的呢？我们知道Go运行时会定期进行
垃圾回收操作，这其中包含栈的回收工作。如果栈使用到比例小于一定到阈值，则
分配一个较小到栈空间，然后将栈上面到数据移动到新的栈中，栈移动的过程和栈
扩容的过程类似。

###  PCDATA和FUNCDATA

Go语言中有个runtime.Caller函数可以获取当前函数的调用者列表。我们可以非常容易在运行时定位每个函数的调用位置，以及函数的调用链。因此在panic异常或用log输出信息时，可以精确定位代码的位置。

```go
func main() {
for skip := 0; ; skip++ {
pc, file, line, ok := runtime.Caller(skip)
if !ok {
break
}
p := runtime.FuncForPC(pc)
fnfile, fnline := p.FileLine(0)
fmt.Printf("skip = %d, pc = 0x%08X\n", skip, pc)
fmt.Printf(" func: file = %s, line = L%03d, name = %s,
entry = 0x%08X\n", fnfile, fnline, p.Name(), p.Entry())
fmt.Printf(" call: file = %s, line = L%03d\n", file, li
ne)
}
}
```

其中runtime.Caller先获取当时的PC寄存器值，以及文件和行号。然后根据PC寄存
器表示的指令位置，通过runtime.FuncForPC函数获取函数的基本信息。Go语言是
如何实现这种特性的呢？

Go语言作为一门静态编译型语言，在执行时每个函数的地址都是固定的，函数的每
条指令也是固定的。如果针对每个函数和函数的每个指令生成一个地址表格（也叫
PC表格），那么在运行时我们就可以根据PC寄存器的值轻松查询到指令当时对应
的函数和位置信息。而Go语言也是采用类似的策略，只不过地址表格经过裁剪，舍
弃了不必要的信息。因为要在运行时获取任意一个地址的位置，必然是要有一个函
数调用，因此我们只需要为函数的开始和结束位置，以及每个函数调用位置生成地
址表格就可以了。同时地址是有大小顺序的，在排序后可以通过只记录增量来减少
数据的大小；在查询时可以通过二分法加快查找的速度。

在汇编中有个PCDATA用于生成PC表格，PCDATA的指令用法为： PCDATA
tableid, tableoffset 。PCDATA有个两个参数，第一个参数为表格的类型，第
二个是表格的地址。在目前的实现中，有PCDATA_StackMapIndex和
PCDATA_InlTreeIndex两种表格类型。两种表格的数据是类似的，应该包含了代码
所在的文件路径、行号和函数的信息，只不过PCDATA_InlTreeIndex用于内联函数
的表格。

此外对于汇编函数中返回值包含指针的类型，在返回值指针被初始化之后需要执行
一个GO_RESULTS_INITIALIZED指令：
```bash
#define GO_RESULTS_INITIALIZED PCDATA $PCDATA_StackMapIndex,
$1
```
GO_RESULTS_INITIALIZED记录的也是PC表格的信息，表示PC指针越过某个地
址之后返回值才完成被初始化的状态。

Go语言二进制文件中除了有PC表格，还有FUNC表格用于记录函数的参数、局部
变量的指针信息。FUNCDATA指令和PCDATA的格式类似： FUNCDATA tableid,
tableoffset ，第一个参数为表格的类型，第二个是表格的地址。目前的实现中
定义了三种FUNC表格类型：FUNCDATA_ArgsPointerMaps表示函数参数的指针信
息表，FUNCDATA_LocalsPointerMaps表示局部指针信息表，FUNCDATA_InlTree
表示被内联展开的指针信息表。通过FUNC表格，Go语言的垃圾回收器可以跟踪全
部指针的生命周期，同时根据指针指向的地址是否在被移动的栈范围来确定是否要
进行指针移动。

在前面递归函数的例子中，我们遇到一个NO_LOCAL_POINTERS宏。它的定义如下：
```bash
#define FUNCDATA_ArgsPointerMaps 0 /* garbage collector blocks */
#define FUNCDATA_LocalsPointerMaps 1
#define FUNCDATA_InlTree 2
#define NO_LOCAL_POINTERS FUNCDATA $FUNCDATA_LocalsPointerMaps,
runtime·no_pointers_stackmap(SB)
```
因此NO_LOCAL_POINTERS宏表示的是FUNCDATA_LocalsPointerMaps对应的局
部指针表格，而runtime·no_pointers_stackmap是一个空的指针表格，也就是表示
函数没有指针类型的局部变量。

PCDATA和FUNCDATA的数据一般是由编译器自动生成的，手工编写并不现实。如
果函数已经有Go语言声明，那么编译器可以自动输出参数和返回值的指针表格。同
时所有的函数调用一般是对应CALL指令，编译器也是可以辅助生成PCDATA表格的。编译器唯一无法自动生成是函数局部变量的表格，因此我们一般要在汇编函数
的局部变量中谨慎使用指针类型。

对于PCDATA和FUNCDATA细节感兴趣的可以尝试从debug/gosym包入手，参
考包的实现和测试代码。

### 方法函数
Go语言中方法函数和全局函数非常相似，比如有以下的方法：
``` go
package main
type MyInt int
func (v MyInt) Twice() int {
return int(v)*2
}
func MyInt_Twice(v MyInt) int {
return int(v)*2
}
```
其中MyInt类型的Twice方法和MyInt_Twice函数的类型是完全一样的，只不过Twice
在目标文件中被修饰为 main.MyInt.Twice 名称。我们可以用汇编实现该方法函数：
```bash
// func (v MyInt) Twice() int
TEXT ·MyInt·Twice(SB), NOSPLIT, $0-16
MOVQ a+0(FP), AX // v
ADDQ AX, AX // AX *= 2
MOVQ AX, ret+8(FP) // return v
RET
```
不过这只是接收非指针类型的方法函数。现在增加一个接收参数是指针类型的Ptr方法，函数返回传入的指针：
```go
func (p *MyInt) Ptr() *MyInt {
return p
}
```
在目标文件中，Ptr方法名被修饰为 main.(*MyInt).Ptr ，也就是对应汇编中
的 ·(*MyInt)·Ptr 。不过在Go汇编语言中，星号和小括弧都无法用作函数名字，
也就是无法用汇编直接实现接收参数是指针类型的方法

在最终的目标文件中的标识符名字中还有很多Go汇编语言不支持的特殊符号（比
如 type.string."hello" 中的双引号），这导致了无法通过手写的汇编代码实现
全部的特性。或许是Go语言官方故意限制了汇编语言的特性。

### 递归函数: 1到n求和
递归函数是比较特殊的函数，递归函数通过调用自身并且在栈上保存状态，这可以简化很多问题的处理。Go语言中递归函数的强大之处是不用担心爆栈问题，因为栈可以根据需要进行扩容和收缩。

首先通过Go递归函数实现一个1到n的求和函数：
```go
// sum = 1+2+...+n
// sum(100) = 5050
func sum(n int) int {
if n > 0 { return n+sum(n-1) } else { return 0 }
}
```
然后通过if/goto重构上面的递归函数，以便于转义为汇编版本：
``` bash
func sum(n int) (result int) {
var AX = n
var BX int
if n > 0 { goto L_STEP_TO_END }
goto L_END
L_STEP_TO_END:
AX -= 1
BX = sum(AX)
AX = n // 调用函数后, AX重新恢复为n
BX += AX
return BX
L_END:
return 0
}
```
在改写之后，递归调用的参数需要引入局部变量，保存中间结果也需要引入局部变量。而通过栈来保存中间的调用状态正是递归函数的核心。因为输入参数也在栈上，所以我们可以通过输入参数来保存少量的状态。同时我们模拟定义了AX和BX寄存器，寄存器在使用前需要初始化，并且在函数调用后也需要重新初始化。

下面继续改造为汇编语言版本：
```bash
// func sum(n int) (result int)
TEXT ·sum(SB), NOSPLIT, $16-16
MOVQ n+0(FP), AX // n
MOVQ result+8(FP), BX // result
CMPQ AX, $0 // test n - 0
JG L_STEP_TO_END // if > 0: goto L_STEP_TO_END
JMP L_END // goto L_STEP_TO_END
L_STEP_TO_END:
SUBQ $1, AX // AX -= 1
MOVQ AX, 0(SP) // arg: n-1
CALL ·sum(SB) // call sum(n-1)
MOVQ 8(SP), BX // BX = sum(n-1)
MOVQ n+0(FP), AX // AX = n
ADDQ AX, BX // BX += AX
MOVQ BX, result+8(FP) // return BX
RET
L_END:
MOVQ $0, result+8(FP) // return 0
RET
```
在汇编版本函数中并没有定义局部变量，只有用于调用自身的临时栈空间。因为函数本身的参数和返回值有16个字节，因此栈帧的大小也为16字节。L_STEP_TO_END标号部分用于处理递归调用，是函数比较复杂的部分。L_END用于处理递归终结的部分。

调用sum函数的参数在 0(SP) 位置，调用结束后的返回值在 8(SP) 位置。在函数调用之后要需要重新为需要的寄存器注入值，因为被调用的函数内部很可能会破坏了寄存器的状态。同时调用函数的参数值也是不可信任的，输入参数值也可能在被调用函数内部被修改了。

总得来说用汇编实现递归函数和普通函数并没有什么区别，当然是在没有考虑爆栈
的前提下。我们的函数应该可以对较小的n进行求和，但是当n大到一定程度，也就
是栈达到一定的深度，必然会出现爆栈的问题。爆栈是C语言的特性，不应该在哪
怕是Go汇编语言中出现。


Go语言的编译器在生成函数的机器代码时，会在开头插入一小段代码。因为sum函
数也需要深度递归调用，因此我们删除了NOSPLIT标志，让汇编器为我们自动生成
一个栈扩容的代码：

```bash
// func sum(n int) int
TEXT ·sum(SB), $16-16
NO_LOCAL_POINTERS
// 原来的代码
```

除了去掉了NOSPLIT标志，我们还在函数开头增加了一个NO_LOCAL_POINTERS
语句，该语句表示函数没有局部指针变量。栈的扩容必然要涉及函数参数和局部编
指针的调整，如果缺少局部指针信息将导致扩容工作无法进行。不仅仅是栈的扩容
需要函数的参数和局部指针标记表格，在GC进行垃圾回收时也将需要。函数的参
数和返回值的指针状态可以通过在Go语言中的函数声明中获取，函数的局部变量则
需要手工指定。因为手工指定指针表格是一个非常繁琐的工作，因此一般要避免在
手写汇编中出现局部指针。

如果进行垃圾回收或栈调整时，寄存器中的指
针是如何维护的？前文说过，Go语言的函数调用是通过栈进行传递参数的，并没有
使用寄存器传递参数。同时函数调用之后所有的寄存器视为失效。因此在调整和维
护指针时，只需要扫描内存中的指针数据，寄存器中的数据在垃圾回收器函数返回
后都需要重新加载，因此寄存器是不需要扫描的。

###  闭包函数
闭包函数是最强大的函数，因为闭包函数可以捕获外层局部作用域的局部变量，因此闭包函数本身就具有了状态。从理论上来说，全局的函数也是闭包函数的子集，只不过全局函数并没有捕获外层变量而已。
``` go
package main
func NewTwiceFunClosure(x int) func() int {
return func() int {
x *= 2
return x
}
}
func main() {
fnTwice := NewTwiceFunClosure(1)
println(fnTwice()) // 1*2 => 2
println(fnTwice()) // 2*2 => 4
println(fnTwice()) // 4*2 => 8
}
```
其中 NewTwiceFunClosure 函数返回一个闭包函数对象，返回的闭包函数对象捕获了外层的 x 参数。返回的闭包函数对象在执行时，每次将捕获的外层变量乘以2
之后再返回。在 main 函数中，首先以1作为参数调用 NewTwiceFunClosure 函
数构造一个闭包函数，返回的闭包函数保存在 fnTwice 闭包函数类型的变量中。
然后每次调用 fnTwice 闭包函数将返回翻倍后的结果，也就是：2，4，8。

上述的代码，从Go语言层面是非常容易理解的。但是闭包函数在汇编语言层面是如
何工作的呢？下面我们尝试手工构造闭包函数来展示闭包的工作原理。首先是构
造 FunTwiceClosure 结构体类型，用来表示闭包对象：
```go
type FunTwiceClosure struct {
F uintptr
X int
}
func NewTwiceFunClosure(x int) func() int {
var p = &FunTwiceClosure{
F: asmFunTwiceClosureAddr(),
X: x,
}
return ptrToFunc(unsafe.Pointer(p))
}
```

FunTwiceClosure 结构体包含两个成员，第一个成员 F 表示闭包函数的函数指
令的地址，第二个成员 X 表示闭包捕获的外部变量。如果闭包函数捕获了多个外
部变量，那么 FunTwiceClosure 结构体也要做相应的调整。然后构
造 FunTwiceClosure 结构体对象，其实也就是闭包函数对象。其
中 asmFunTwiceClosureAddr 函数用于辅助获取闭包函数的函数指令的地址，采
用汇编语言实现。最后通过 ptrToFunc 辅助函数将结构体指针转为闭包函数对象
返回，该函数也是通过汇编语言实现。

汇编语言实现了以下三个辅助函数：
```go
func ptrToFunc(p unsafe.Pointer) func() int
func asmFunTwiceClosureAddr() uintptr
func asmFunTwiceClosureBody() int
```
其中 ptrToFunc 用于将指针转化为 func() int 类型的闭包函数， asmFunTwiceClosureAddr 用于返回闭包函数机器指令的开始地址（类似全局函数的地址）， asmFunTwiceClosureBody 是闭包函数对应的全局函数的实现。

然后用Go汇编语言实现以上三个辅助函数
```bash
#include "textflag.h"
TEXT ·ptrToFunc(SB), NOSPLIT, $0-16
MOVQ ptr+0(FP), AX // AX = ptr
MOVQ AX, ret+8(FP) // return AX
RET
TEXT ·asmFunTwiceClosureAddr(SB), NOSPLIT, $0-8
LEAQ ·asmFunTwiceClosureBody(SB), AX // AX = ·asmFunTwiceClo
sureBody(SB)
MOVQ AX, ret+0(FP) // return AX
RET
TEXT ·asmFunTwiceClosureBody(SB), NOSPLIT|NEEDCTXT, $0-8
MOVQ 8(DX), AX
ADDQ AX , AX // AX *= 2
MOVQ AX , 8(DX) // ctx.X = AX
MOVQ AX , ret+0(FP) // return AX
RET
```
其中 ·ptrToFunc 和 ·asmFunTwiceClosureAddr 函数的实现比较简单，我们不
再详细描述。最重要的是 ·asmFunTwiceClosureBody 函数的实现：它有一个 NEEDCTXT 标志。采用 NEEDCTXT 标志定义的汇编函数表示需要一个上下文环境，在AMD64环境下是通过 DX 寄存器来传递这个上下文环境指针，也就是对应 FunTwiceClosure 结构体的指针。函数首先从 FunTwiceClosure 结构体对象
取出之前捕获的 X ，将 X 乘以2之后写回内存，最后返回修改之后的 X 的值。

如果是在汇编语言中调用闭包函数，也需要遵循同样的流程：首先为构造闭包对
象，其中保存捕获的外层变量；在调用闭包函数时首先要拿到闭包对象，用闭包对
象初始化 DX ，然后从闭包对象中取出函数地址并用通过 CALL 指令调用。

## 汇编语言的威力
汇编语言的真正威力来自两个维度：一是突破框架限制，实现看似不可能的任务；二是突破指令限制，通过高级指令挖掘极致的性能。

### 系统调用
系统调用是操作系统为外提供的公共接口。因为操作系统彻底接管了各种底层硬件设备，因此操作系统提供的系统调用成了实现某些操作的唯一方法。从另一个角度看，系统调用更像是一个RPC远程过程调用，不过信道是寄存器和内存。在系统调用时，我们向操作系统发送调用的编号和对应的参数，然后阻塞等待系统调用地返
回。因为涉及到阻塞等待，因此系统调用期间的CPU利用率一般是可以忽略的。另一个和RPC地远程调用类似的地方是，操作系统内核处理系统调用时不会依赖用户的栈空间，一般不会导致爆栈发生。因此系统调用是最简单安全的一种调用了。

系统调用虽然简单，但是它是操作系统对外的接口，因此不同的操作系统调用规范可能有很大地差异。我们先看看Linux在AMD64架构上的系统调用规范，在 syscall/asm_linux_amd64.s 文件中有注释说明：
```bash
//
// System calls for AMD64, Linux
//
// func Syscall(trap int64, a1, a2, a3 uintptr) (r1, r2, err uin
tptr);
// Trap # in AX, args in DI SI DX R10 R8 R9, return in AX DX
// Note that this differs from "standard" ABI convention, which
// would pass 4th arg in CX, not R10.
```
这是 syscall.Syscall 函数的内部注释，简要说明了Linux系统调用的规范。系
统调用的前6个参数直接由DI、SI、DX、R10、R8和R9寄存器传输，结果由AX和
DX寄存器返回。macOS等类UINX系统调用的参数传输大多数都采用类似的规则。

macOS的系统调用编号在 /usr/include/sys/syscall.h 头文件，Linux的系统
调用号在 /usr/include/asm/unistd.h 头文件。虽然在UNIX家族中是系统调用
的参数和返回值的传输规则类似，但是不同操作系统提供的系统调用却不是完全相
同的，因此系统调用编号也有很大的差异。以UNIX系统中著名的write系统调用为
例，在macOS的系统调用编号为4，而在Linux的系统调用编号却是1。

我们将基于write系统调用包装一个字符串输出函数。下面的代码是macOS版本：
```bash
// func SyscallWrite_Darwin(fd int, msg string) int
TEXT ·SyscallWrite_Darwin(SB), NOSPLIT, $0
MOVQ $(0x2000000+4), AX // #define SYS_write 4
MOVQ fd+0(FP), DI
MOVQ msg_data+8(FP), SI
MOVQ msg_len+16(FP), DX
SYSCALL
MOVQ AX, ret+0(FP)
RET
```
其中第一个参数是输出文件的文件描述符编号，第二个参数是字符串的头部。字符
串头部是由reflect.StringHeader结构定义，第一成员是8字节的数据指针，第二个
成员是8字节的数据长度。在macOS系统中，执行系统调用时还需要将系统调用的
编号加上0x2000000后再行传入AX。然后再将fd、数据地址和长度作为write系统调
用的三个参数输入，分别对应DI、SI和DX三个寄存器。最后通过SYSCALL指令执
行系统调用，系统调用返回后从AX获取返回值。

这样我们就基于系统调用包装了一个定制的输出函数。在UNIX系统中，标准输入
stdout的文件描述符编号是1，因此我们可以用1作为参数实现字符串的输出：
```go
func SyscallWrite_Darwin(fd int, msg string) int
func main() {
if runtime.GOOS == "darwin" {
SyscallWrite_Darwin(1, "hello syscall!\n")
}
}
```

如果是Linux系统，只需要将编号改为write系统调用对应的1即可。而Windows的系
统调用则有另外的参数传输规则。在X64环境Windows的系统调用参数传输规则和
默认的C语言规则非常相似，在后续的直接调用C函数部分再行讨论。

### 直接调用C函数
在计算机的发展的过程中，C语言和UNIX操作系统有着不可替代的作用。因此操作
系统的系统调用、汇编语言和C语言函数调用规则几个技术是密切相关的。

在X86的32位系统时代，C语言一般默认的是用栈传递参数并用AX寄存器返回结果，称为cdecl调用约定。Go语言函数和cdecl调用约定非常相似，它们都是以栈来
传递参数并且返回地址和BP寄存器的布局都是类似的。但是Go语言函数将返回值
也通过栈返回，因此Go语言函数可以支持多个返回值。我们可以将Go语言函数看
作是没有返回值的C语言函数，同时将Go语言函数中的返回值挪到C语言函数参数
的尾部，这样栈不仅仅用于传入参数也用于返回多个结果。

在X64时代，AMD架构增加了8个通用寄存器，为了提高效率C语言也默认改用寄存
器来传递参数。在X64系统，默认有System V AMD64 ABI和Microsoft x64两种C语
言函数调用规范。其中System V的规范适用于Linux、FreeBSD、macOS等诸多类
UNIX系统，而Windows则是用自己特有的调用规范。

在理解了C语言函数的调用规范之后，汇编代码就可以绕过CGO技术直接调用C语言函数。
```c
#include <stdint.h>
int64_t myadd(int64_t a, int64_t b) {
return a+b;
}
```
然后我们需要实现一个asmCallCAdd函数：
``` go
func asmCallCAdd(cfun uintptr, a, b int64) int64
```
因为Go汇编语言和CGO特性不能同时在一个包中使用（因为CGO会调用gcc，而
gcc会将Go汇编语言当做普通的汇编程序处理，从而导致错误），我们通过一个参
数传入C语言myadd函数的地址。asmCallCAdd函数的其余参数和C语言myadd函数的参数保持一致。

我们只实现System V AMD64 ABI规范的版本。在System V版本中，寄存器可以最
多传递六个参数，分别对应DI、SI、DX、CX、R8和R9六个寄存器（如果是浮点数
则需要通过XMM寄存器传送），返回值依然通过AX返回。通过对比系统调用的规
范可以发现，系统调用的第四个参数是用R10寄存器传递，而C语言函数的第四个
参数是用CX传递。
```bash
// System V AMD64 ABI
// func asmCallCAdd(cfun uintptr, a, b int64) int64
TEXT ·asmCallCAdd(SB), NOSPLIT, $0
MOVQ cfun+0(FP), AX // cfun
MOVQ a+8(FP), DI // a
MOVQ b+16(FP), SI // b
CALL AX
MOVQ AX, ret+24(FP)
RET
```
首先是将第一个参数表示的C函数地址保存到AX寄存器便于后续调用。然后分别将
第二和第三个参数加载到DI和SI寄存器。然后CALL指令通过AX中保持的C语言函
数地址调用C函数。最后从AX寄存器获取C函数的返回值，并通过asmCallCAdd函
数返回。

Win64环境的C语言调用规范类似。不过Win64规范中只有CX、DX、R8和R9四个
寄存器传递参数（如果是浮点数则需要通过XMM寄存器传送），返回值依然通过
AX返回。虽然是可以通过寄存器传输参数，但是调用这依然要为前四个参数准备栈
空间。需要注意的是，Windows x64的系统调用和C语言函数可能是采用相同的调
用规则。因为没有Windows测试环境，我们这里就不提供了Windows版本的代码实

现了，Windows用户可以自己尝试实现类似功能。
然后我们就可以使用asmCallCAdd函数直接调用C函数了：
```go
/*
#include <stdint.h>
int64_t myadd(int64_t a, int64_t b) {
return a+b;
}
*/
import "C"
import (
asmpkg "path/to/asm"
)
func main() {
if runtime.GOOS != "windows" {
println(asmpkg.asmCallCAdd(
uintptr(unsafe.Pointer(C.myadd)),
123, 456,
))
}
}
```
在上面的代码中，通过 C.myadd 获取C函数的地址，然后转换为合适的类型再传
人asmCallCAdd函数。在这个例子中，汇编函数假设调用的C语言函数需要的栈很
小，可以直接复用Go函数中多余的空间。如果C语言函数可能需要较大的栈，可以
尝试像CGO那样切换到系统线程的栈上运行。


###  AVX指令
从Go1.11开始，Go汇编语言引入了AVX512指令的支持。AVX指令集是属于Intel家 的SIMD指令集中的一部分。AVX512的最大特点是数据有512位宽度，可以一次计 算8个64位数或者是等大小的数据。因此AVX指令可以用于优化矩阵或图像等并行 度很高的算法。不过并不是每个X86体系的CPU都支持了AVX指令，因此首要的任 务是如何判断CPU支持了哪些高级指令。


在Go语言标准库的 internal/cpu 包提供了CPU是否支持某些高级指令的基本信 息，但是只有标准库才能引用这个包（因为internal路径的限制）。该包底层是通过 X86提供的CPUID指令来识别处理器的详细信息。最简便的方法是直接 将 internal/cpu 包克隆一份。不过这个包为了避免复杂的依赖没有使用init函数 自动初始化，因此需要根据情况手工调整代码执行doinit函数初始化。

internal/cpu 包针对X86处理器提供了以下特性检测：

```go
package cpu var X86 x86 
// The booleans in x86 contain the correspondingly named cpuid f eature bit. 
// HasAVX and HasAVX2 are only set if the OS does support XMM an d YMM registers 
// in addition to the cpuid feature bit being set. 
// The struct is padded to avoid false sharing. 
type x86 struct { 
    HasAES bool 
    HasADX bool 
    HasAVX bool 
    HasAVX2 bool 
    HasBMI1 bool 
    HasBMI2 bool 
    HasERMS bool 
    HasFMA bool 
    HasOSXSAVE bool 
    HasPCLMULQDQ bool 
    HasPOPCNT bool 
    HasSSE2 bool 
    HasSSE3 bool 
    HasSSSE3 bool 
    HasSSE41 bool 
    HasSSE42 bool 
}
```
因此我们可以用以下的代码测试运行时的CPU是否支持AVX2指令集：
```go
import ( cpu "path/to/cpu" )func main() { if cpu.X86.HasAVX2 { 
    // support AVX2 
    } 
}
```
AVX512是比较新的指令集，只有高端的CPU才会提供支持。为了主流的CPU也能 运行代码测试，我们选择AVX2指令来构造例子。AVX2指令每次可以处理32字节的 数据，可以用来提升数据复制的工作的效率。

下面的例子是用AVX2指令复制数据，每次复制数据32字节倍数大小的数据：
```go
// func CopySlice_AVX2(dst, src []byte, len int) 
TEXT ·CopySlice_AVX2(SB), NOSPLIT, $0 
    MOVQ dst_data+0(FP), DI 
    MOVQ src_data+24(FP), SI 
    MOVQ len+32(FP), BX 
    MOVQ $0, AX 
LOOP:VMOVDQU 0(SI)(AX*1), Y0 
    VMOVDQU Y0, 0(DI)(AX*1) 
    ADDQ $32, AX 
    CMPQ AX, BX 
    JL LOOP 
    RET
```
其中VMOVDQU指令先将 0(SI)(AX*1) 地址开始的32字节数据复制到Y0寄存器 中，然后再复制到 0(DI)(AX*1) 对应的目标内存中。VMOVDQU指令操作的数据 地址可以不用对齐。

AVX2共有16个Y寄存器，每个寄存器有256bit位。如果要复制的数据很多，可以多 个寄存器同时复制，这样可以利用更高效的流水特性优化性能。

## 例子：Goroutine ID
在操作系统中，每个进程都会有一个唯一的进程编号，每个线程也有自己唯一的线 程编号。同样在Go语言中，每个Goroutine也有自己唯一的Go程编号，这个编号在 panic等场景下经常遇到。虽然Goroutine有内在的编号，但是Go语言却刻意没有提 供获取该编号的接口

### 故意设计没有goid
根据官方的相关资料显示，Go语言刻意没有提供goid的原因是为了避免被滥用。因 为大部分用户在轻松拿到goid之后，在之后的编程中会不自觉地编写出强依赖goid 的代码。强依赖goid将导致这些代码不好移植，同时也会导致并发模型复杂化。同 时，Go语言中可能同时存在海量的Goroutine，但是每个Goroutine何时被销毁并不 好实时监控，这也会导致依赖goid的资源无法很好地自动回收（需要手工回收）。 不过如果你是Go汇编语言用户，则完全可以忽略这些借口。

### 纯Go方式获取goid
为了便于理解，我们先尝试用纯Go的方式获取goid。使用纯Go的方式获取goid的 方式虽然性能较低，但是代码有着很好的移植性，同时也可以用于测试验证其它方 式获取的goid是否正确。

每个Go语言用户应该都知道panic函数。调用panic函数将导致Goroutine异常，如 果panic在传递到Goroutine的根函数还没有被recover函数处理掉，那么运行时将打 印相关的异常和栈信息并退出Goroutine。

下面我们构造一个简单的例子，通过panic来输出goid：
```go
package main func main() { panic("goid") }
```

运行后将输出以下信息：
```bash
panic: goid goroutine 1 [running]: main.main() /path/to/main.go:4 +0x40
```
我们可以猜测Panic输出信息 goroutine 1 [running] 中的1就是goid。但是如何 才能在程序中获取panic的输出信息呢？其实上述信息只是当前函数调用栈帧的文字 化描述，runtime.Stack函数提供了获取该信息的功能。

我们基于runtime.Stack函数重新构造一个例子，通过输出当前栈帧的信息来输出 goid：
```go
package main import "runtime" 
func main() { 
    var buf = make([]byte, 64) 
    var stk = buf[:runtime.Stack(buf, false)]
    print(string(stk)) 
}
```
运行后将输出以下信息： 
```bash
goroutine 1 [running]: main.main() /path/to/main.g
```
因此从runtime.Stack获取的字符串中就可以很容易解析出goid信息：
```go
func GetGoid() int64 { 
    var (
        buf [64]byte 
        n = runtime.Stack(buf[:], false) 
        stk = strings.TrimPrefix(string(buf[:n]), "goroutine ") )
        idField := strings.Fields(stk)[0] id, err := strconv.Atoi(idField) 
        if err != nil {
            panic(fmt.Errorf("can not get goroutine id: %v", err)) 
        }
        return int64(id) }
```
GetGoid函数的细节我们不再赘述。需要补充说明的是 runtime.Stack 函数不仅 仅可以获取当前Goroutine的栈信息，还可以获取全部Goroutine的栈信息（通过第 二个参数控制）。同时在Go语言内部的 net/http2.curGoroutineID 函数正是采用类 似方式获取的goid。


### 从g结构体获取goid
根据官方的Go汇编语言文档，每个运行的Goroutine结构的g指针保存在当前运行 Goroutine的系统线程的局部存储TLS中。可以先获取TLS线程局部存储，然后再从 TLS中获取g结构的指针，最后从g结构中取出goid。

下面是参考runtime包中定义的get_tls宏获取g指针：

```bash
get_tls(CX)
MOVQ g(CX), AX // Move g into AX.
```
其中get_tls是一个宏函数，在 runtime/go_tls.h 头文件中定义。 对于AMD64平台，get_tls宏函数定义如下：
```bash
#ifdef GOARCH_amd64 
#define get_tls(r) MOVQ TLS, r 
#define g(r) 0(r)(TLS*1) 
#endif
```
将get_tls宏函数展开之后，获取g指针的代码如下：
```bash
MOVQ TLS, CX 
MOVQ 0(CX)(TLS*1), AX
```
其实TLS类似线程局部存储的地址，地址对应的内存里的数据才是g指针。我们还可 以更直接一点:
```bash
MOVQ (TLS), AX
```
基于上述方法可以包装一个getg函数，用于获取g指针：
```bash
// func getg() unsafe.Pointer 
TEXT ·getg(SB), NOSPLIT, $0-8 
    MOVQ (TLS), AX 
    MOVQ AX, ret+0(FP) 
RET
```
然后在Go代码中通过goid成员在g结构体中的偏移量来获取goid的值：
```go
const g_goid_offset = 152 
// Go1.10 
func GetGroutineId() int64 { 
    g := getg() 
    p := (*int64)(unsafe.Pointer(uintptr(g) + g_goid_offset)) 
    return *p 
}
```
其中 g_goid_offset 是 goid 成员的偏移量，g 结构参考 runtime/runtime2.go

在Go1.10版本，goid的偏移量是152字节。因此上述代码只能正确运行在goid偏移 量也是152字节的Go版本中。根据汤普森大神的神谕，枚举和暴力穷举是解决一切 疑难杂症的万金油。我们也可以将goid的偏移保存到表格中，然后根据Go版本号查 询goid的偏移量。

下面是改进后的代码：
```go
var offsetDictMap = map[string]int64{ 
    "go1.10": 152, 
    "go1.9": 152, 
    "go1.8": 192, 
    }
var g_goid_offset = func() int64 { 
    goversion := runtime.Version() 
    for key, off := range offsetDictMap { 
        if goversion == key || strings.HasPrefix(goversion, key) { 
            return off 
            } 
        }
        panic("unsupport go verion:"+goversion) 
    }()
```
现在的goid偏移量已经终于可以自动适配已经发布的Go语言版本。

### 获取g结构体对应的接口对象

枚举和暴力穷举虽然够直接，但是对于正在开发中的未发布的Go版本支持并不好， 我们无法提前知晓开发中的某个版本的goid成员的偏移量。

如果是在runtime包内部，我们可以通过 unsafe.OffsetOf(g.goid) 直接获取成 员的偏移量。也可以通过反射获取g结构体的类型，然后通过类型查询某个成员的 偏移量。因为g结构体是一个内部类型，Go代码无法从外部包获取g结构体的类型 信息。但是在Go汇编语言中，我们是可以看到全部的符号的，因此理论上我们也可 以获取g结构体的类型信息。

在任意的类型被定义之后，Go语言都会为该类型生成对应的类型信息。比如g结构 体会生成一个 type·runtime·g 标识符表示g结构体的值类型信息，同时还有一 个 type·*runtime·g 标识符表示指针类型的信息。如果g结构体带有方法，那么 同时还会生成 go.itab.runtime.g 和 go.itab.*runtime.g 类型信息，用于表 示带方法的类型信息。

如果我们能够拿到表示g结构体类型的 type·runtime·g 和g指针，那么就可以构 造g对象的接口。下面是改进的getg函数，返回g指针对象的接口：
```bash
// func getg() interface{}
TEXT ·getg(SB), NOSPLIT, $32-16 
// get runtime.g 
MOVQ (TLS), AX 
// get runtime.g type 
MOVQ $type·runtime·g(SB), BX 
// convert (*g) to interface{} 
MOVQ AX, 8(SP) 
MOVQ BX, 0(SP) 
CALL runtime·convT2E(SB) 
MOVQ 16(SP), AX 
MOVQ 24(SP), BX 
// return interface{} 
MOVQ AX, ret+0(FP) 
MOVQ BX, ret+8(FP) 
RET
```
其中AX寄存器对应g指针，BX寄存器对应g结构体的类型。然后通过 runtime·convT2E函数将类型转为接口。因为我们使用的不是g结构体指针类型，因 此返回的接口表示的g结构体值类型。理论上我们也可以构造g指针类型的接口，但 是因为Go汇编语言的限制，我们无法使用 type·*runtime·g 标识符。 基于g返回的接口，就可以容易获取goid了：
```go
func GetGoid() int64 { 
    g := getg() 
    gid := reflect.ValueOf(g).FieldByName("goid").Int() 
    return goid 
}
```

上述代码通过反射直接获取goid，理论上只要反射的接口和goid成员的名字不发生 变化，代码都可以正常运行。经过实际测试，以上的代码可以在Go1.8、Go1.9和 Go1.10版本中正确运行。乐观推测，如果g结构体类型的名字不发生变化，Go语言 反射的机制也不发生变化，那么未来Go语言版本应该也是可以运行的。

反射虽然具备一定的灵活性，但是反射的性能一直是被大家诟病的地方。一个改进 的思路是通过反射获取goid的偏移量，然后通过g指针和偏移量获取goid，这样反射 只需要在初始化阶段执行一次。

```go
var g_goid_offset uintptr = func() uintptr { g := GetGroutine() 
if f, ok := reflect.TypeOf(g).FieldByName("goid"); ok { 
    return f.Offset 
}
panic("can not find g.goid field") 
}()
```
有了正确的goid偏移量之后，采用前面讲过的方式获取goid： 
```go
func GetGroutineId() int64 { 
    g := getg() 
    p := (*int64)(unsafe.Pointer(uintptr(g) + g_goid_offset)) 
    return *p 
}
```
至此我们获取goid的实现思路已经足够完善了，不过汇编的代码依然有严重的安全隐患。

虽然getg函数是用NOSPLIT标志声明的禁止栈分裂的函数类型，但是getg内部又调 用了更为复杂的runtime·convT2E函数。runtime·convT2E函数如果遇到栈空间不足，可能触发栈分裂的操作。而栈分裂时，GC将要挪动栈上所有函数的参数和返 回值和局部变量中的栈指针。但是我们的getg函数并没有提供局部变量的指针信息。

下面是改进后的getg函数的完整实现：
```bash
// func getg() interface{} 
TEXT ·getg(SB), NOSPLIT, $32-16 NO_LOCAL_POINTERS 
MOVQ $0, ret_type+0(FP) 
MOVQ $0, ret_data+8(FP) GO_RESULTS_INITIALIZED 
// get runtime.g 
MOVQ (TLS), AX 
// get runtime.g type 
MOVQ $type·runtime·g(SB), BX 
// convert (*g) to interface{} 
MOVQ AX, 8(SP) 
MOVQ BX, 0(SP) 
CALL runtime·convT2E(SB) 
MOVQ 16(SP), AX 
MOVQ 24(SP), BX 
// return interface{} 
MOVQ AX, ret_type+0(FP) 
MOVQ BX, ret_data+8(FP) 
RET
```
其中NO_LOCAL_POINTERS表示函数没有局部指针变量。同时对返回的接口进行 零值初始化，初始化完成后通过GO_RESULTS_INITIALIZED告知GC。这样可以在 保证栈分裂时，GC能够正确处理返回值和局部变量中的指针。

###  goid的应用: 局部存储

有了goid之后，构造Goroutine局部存储就非常容易了。我们可以定义一个gls包提 供goid的特性：
```go
package gls 
    var gls struct { 
    m map[int64]map[interface{}]interface{} sync.Mutex 
    }
    func init() { 
        gls.m = make(map[int64]map[interface{}]interface{}) 
    }
```
gls包变量简单包装了map，同时通过 sync.Mutex 互斥量支持并发访问。 然后定义一个getMap内部函数，用于获取每个Goroutine字节的map：
```go
func getMap() map[interface{}]interface{} { gls.Lock() 
defer gls.Unlock() 
goid := GetGoid() 
if m, _ := gls.m[goid]; m != nil { 
    return m 
}
m := make(map[interface{}]interface{}) 
gls.m[goid] = m 
return m 
}
```
获取到Goroutine私有的map之后，就是正常的增、删、改操作接口了：
```go
func Get(key interface{}) interface{} {         
    return getMap()[key] 
}
func Put(key interface{}, v interface{}) {      
    getMap()[key] = v 
}
func Delete(key interface{}) { 
    delete(getMap(), key) 
}

```
最后我们再提供一个Clean函数，用于释放Goroutine对应的map资源：
```go
func Clean() { 
    gls.Lock() 
    defer gls.Unlock() 
    delete(gls.m, GetGoid()) 
}
```
这样一个极简的Goroutine局部存储gls对象就完成了。 下面是使用局部存储简单的例子：
```go
import ( gls "path/to/gls" )
func main() { 
    var wg sync.WaitGroup 
    for i := 0; i < 5; i++ { 
        wg.Add(1) 
        go func(idx int) { 
            defer wg.Done() 
            defer gls.Clean() 
            defer func() { 
                fmt.Printf("%d: number = %d\n", idx, gls.Get("nu mber"))   
            }() 
        gls.Put("number", idx+100) }(i) 
    }
    wg.Wait() 
}
```
通过Goroutine局部存储，不同层次函数之间可以共享存储资源。同时为了避免资源 泄漏，需要在Goroutine的根函数中，通过defer语句调用gls.Clean()函数释放资源。

## Delve调试器
目前Go语言支持GDB、LLDB和Delve几种调试器。其中GDB是最早支持的调试工 具，LLDB是macOS系统推荐的标准调试工具。但是GDB和LLDB对Go语言的专有 特性都缺乏很大支持，而只有Delve是专门为Go语言设计开发的调试工具。而且 Delve本身也是采用Go语言开发，对Windows平台也提供了一样的支持。

### Delve入门
首先根据官方的文档正确安装Delve调试器。我们会先构造一个简单的Go语言代 码，用于熟悉下Delve的简单用法。

创建main.go文件，main函数先通过循初始化一个切片，然后输出切片的内容：
```go
package main 
import ( "fmt" )
func main() { 
    nums := make([]int, 5) 
    for i := 0; i < len(nums); i++ { 
        nums[i] = i * i 
    }
    fmt.Println(nums) 
}
```
命令行进入包所在目录，然后输入 dlv debug 命令进入调试：
```bash
$ dlv debug Type 'help' for list of commands. (dlv)
```
输入help命令可以查看到Delve提供的调试命令列表：
```
(dlv) help The following commands are available: args ------------------------ Print function arguments. break (alias: b) ------------ Sets a breakpoint. breakpoints (alias: bp) ----- Print out info for active brea kpoints. clear ----------------------- Deletes breakpoint. clearall -------------------- Deletes multiple breakpoints. condition (alias: cond) ----- Set breakpoint condition. config ---------------------- Changes configuration paramete rs. continue (alias: c) --------- Run until breakpoint or progra m termination. disassemble (alias: disass) - Disassembler. down ------------------------ Move the current frame down. exit (alias: quit | q) ------ Exit the debugger. frame ----------------------- Set the current frame, or exec ute command... funcs ----------------------- Print list of functions. goroutine ------------------- Shows or changes current gorou tinegoroutines ------------------ List program goroutines. help (alias: h) ------------- Prints the help message. list (alias: ls | l) -------- Show source code. locals ---------------------- Print local variables. next (alias: n) ------------- Step over to next source line. on -------------------------- Executes a command when a brea kpoint is hit. print (alias: p) ------------ Evaluate an expression. regs ------------------------ Print contents of CPU register s. restart (alias: r) ---------- Restart process. set ------------------------- Changes the value of a variabl e. source ---------------------- Executes a file containing a l ist of delve... sources --------------------- Print list of source files. stack (alias: bt) ----------- Print stack trace.step (alias: s) ------------- Single step through program. step-instruction (alias: si) Single step a single cpu instr uction. stepout --------------------- Step out of the current functi on. thread (alias: tr) ---------- Switch to the specified thread . threads --------------------- Print out info for every trace d thread. trace (alias: t) ------------ Set tracepoint. types ----------------------- Print list of types up -------------------------- Move the current frame up. vars ------------------------ Print package variables. whatis ---------------------- Prints type of an expression. Type help followed by a command for full documentation. (dlv)
```
每个Go程序的入口是main.main函数，我们可以用break在此设置一个断点：
```bash
(dlv) break main.main 
Breakpoint 1 set at 0x10ae9b8 for main.main() ./main.go:7
```
然后通过breakpoints查看已经设置的所有断点：
```bash
(dlv) breakpoints Breakpoint 
unrecovered-panic at 0x102a380 for runtime.startpanic () /usr/local/go/src/runtime/panic.go:588 (0) print runtime.curg._panic.arg Breakpoint 1 at 0x10ae9b8 for main.main() ./main.go:7 (0)
```
我们发现除了我们自己设置的main.main函数断点外，Delve内部已经为panic异常 函数设置了一个断点。

通过vars命令可以查看全部包级的变量。因为最终的目标程序可能含有大量的全局 变量，我们可以通过一个正则参数选择想查看的全局变量：

```bash
(dlv) vars main 
main.initdone· = 2 runtime.main_init_done = chan bool 0/0 runtime.mainStarted = true (dlv)
```
然后就可以通过continue命令让程序运行到下一个断点处：
```bash
(dlv) continue > main.main() 
./main.go:7 (hits goroutine(1):1 total:1) (PC: 0x1 0ae9b8)
    2:
    3: import ( 
    4: "fmt" 
    5: ) 
    6: 
    => 7: func main() { 
    8: nums := make([]int, 5) 
    9: for i := 0; i < len(nums); i++ { 
    10: nums[i] = i * i 
    11: } 
    12: fmt.Println(nums) 
(dlv)
```
输入next命令单步执行进入main函数内部：
```bash
(dlv) next > main.main() 
./main.go:8 (PC: 0x10ae9cf) 
    3: import ( 
    4: "fmt" 
    5: ) 
    6:
    7: func main() { 
    => 8: nums := make([]int, 5) 
    9: for i := 0; i < len(nums); i++ { 
    10: nums[i] = i * i 
    11: } 
    12: fmt.Println(nums) 
    13: } 
(dlv)
```
进入函数之后可以通过args和locals命令查看函数的参数和局部变量：
```bash
(dlv) args 
(no args) 
(dlv) locals 
nums = []int len: 842350763880, cap: 17491881, nil
```
因为main函数没有参数，因此args命令没有任何输出。而locals命令则输出了局部 变量nums切片的值：此时切片还未完成初始化，切片的底层指针为nil，长度和容 量都是一个随机数值。 再次输入next命令单步执行后就可以查看到nums切片初始化之后的结果了：
```bash
(dlv) locals 
nums = []int len: 5, cap: 5, [...] i = 17601536
```
此时因为调试器已经到了for语句行，因此局部变量出现了还未初始化的循环迭代变 量i。

下面我们通过组合使用break和condition命令，在循环内部设置一个条件断点，当 循环变量i等于3时断点生效：
```bash
(dlv) break main.go:10 
Breakpoint 2 set at 0x10aea33 for main.main() ./main.go:10 
(dlv) condition 2 i==3 
(dlv)
```
然后通过continue执行到刚设置的条件断点，并且输出局部变量。我们发现当循环变量i等于3时，nums切片的前3个元素已经正确初始化。

我们还可以通过stack查看当前执行函数的栈帧信息：
```bash
(dlv) stack 
0 0x00000000010aea33 in main.main at ./main.go:10 
1 0x000000000102bd60 in runtime.main at /usr/local/go/src/runtime/proc.go:198 
2 0x0000000001053bd1 in runtime.goexit at /usr/local/go/src/runtime/asm_amd64.s:2361 (dlv)
```
或者通过goroutine和goroutines命令查看当前Goroutine相关的信息。最后完成调试工作后输入quit命令退出调试器。至此我们已经掌握了Delve调试器器 的简单用法。

### 调试汇编程序
用Delve调试Go汇编程序的过程比调试Go语言程序更加简单。调试汇编程序时，我 们需要时刻关注寄存器的状态，如果涉及函数调用或局部变量或参数还需要重点关 注栈寄存器SP的状态。

为了编译演示，我们重新实现一个更简单的main函数：
```go
package main 
func main() { 
    asmSayHello() 
} 
func asmSayHello()
```
在main函数中调用汇编语言实现的asmSayHello函数输出一个字符串。 asmSayHello函数在main_amd64.s文件中实现：
```bash
#include "textflag.h" 
#include "funcdata.h" 
// "Hello World!\n" 
DATA text<>+0(SB)/8,$"Hello Wo" 
DATA text<>+8(SB)/8,$"rld!\n" 
GLOBL text<>(SB),NOPTR,$16 
// func asmSayHello() 
TEXT ·asmSayHello(SB), $16-0 NO_LOCAL_POINTERS 
MOVQ $text<>+0(SB), AX 
MOVQ AX, (SP) 
MOVQ $16, 8(SP) 
CALL runtime·printstring(SB) 
RET
```
参考前面的调试流程，在执行到main函数断点时，可以disassemble反汇编命令查 看main函数对应的汇编代码。
```bash
(dlv) break main.main Breakpoint 1 set at 0x105011f for main.main() ./main.go:3 (dlv) continue > main.main() ./main.go:3 (hits goroutine(1):1 total:1) (PC: 0x1 05011f) 1: package main 2: =>3: func main() { asmSayHello() } 4:5: func asmSayHello() (dlv) disassemble TEXT main.main(SB) /path/to/pkg/main.go main.go:3 0x1050110 65488b0c25a0080000 mov rcx, qword ptr g [0x8a0] main.go:3 0x1050119 483b6110 cmp rsp, qword ptr [r +0x10] main.go:3 0x105011d 761a jbe 0x1050139 =>main.go:3 0x105011f* 4883ec08 sub rsp, 0x8 main.go:3 0x1050123 48892c24 mov qword ptr [rsp], r bpmain.go:3 0x1050127 488d2c24 lea rbp, ptr [rsp] main.go:3 0x105012b e880000000 call $main.asmSayHello main.go:3 0x1050130 488b2c24 mov rbp, qword ptr [rs p]main.go:3 0x1050134 4883c408 add rsp, 0x8 main.go:3 0x1050138 c3 ret main.go:3 0x1050139 e87288ffff call $runtime.morestac k_noctxt main.go:3 0x105013e ebd0 jmp $main.main (dlv)
```
虽然main函数内部只有一行函数调用语句，但是却生成了很多汇编指令。在函数的 开头通过比较rsp寄存器判断栈空间是否不足，如果不足则跳转到0x1050139地址调 用runtime.morestack函数进行栈扩容，然后跳回到main函数开始位置重新进行栈空 间测试。而在asmSayHello函数调用之前，先扩展rsp空间用于临时存储rbp寄存器 的状态，在函数返回后通过栈恢复rbp的值并回收临时栈空间。通过对比Go语言代 码和对应的汇编代码，我们可以加深对Go汇编语言的理解。

从汇编语言角度深刻Go语言各种特性的工作机制对调试工作也是一个很大的帮助。 如果希望在汇编指令层面调试Go代码，Delve还提供了一个step-instruction单步执 行汇编指令的命令。

现在我们依然用break命令在asmSayHello函数设置断点，并且输入continue命令让 调试器执行到断点位置停下：
```bash
(dlv) break main.asmSayHello 
Breakpoint 2 set at 0x10501bf for main.asmSayHello() ./main_amd6 4.s:10 
(dlv) continue 
> main.asmSayHello() ./main_amd64.s:10 (hits goroutine(1):1 tota l:1) (PC: 0x10501bf) 
5: DATA text<>+0(SB)/8,$"Hello Wo" 
6: DATA text<>+8(SB)/8,$"rld!\n" 
7: GLOBL text<>(SB),NOPTR,$16 
8:
9: // func asmSayHello() 
=> 10: TEXT ·asmSayHello(SB), $16-0 
11: NO_LOCAL_POINTERS 
12: MOVQ $text<>+0(SB), AX 
13: MOVQ AX, (SP) 
14: MOVQ $16, 8(SP) 
15: CALL runtime·printstring(SB) 
(dlv)
```
此时我们可以通过regs查看全部的寄存器状态：
```bash
(dlv) regs 
rax = 0x0000000001050110 
rbx = 0x0000000000000000 
rcx = 0x000000c420000300 
rdx = 0x0000000001070be0 
rdi = 0x000000c42007c020 
rsi = 0x0000000000000001 
rbp = 0x000000c420049f78 
rsp = 0x000000c420049f70 
r8 = 0x7fffffffffffffff 
r9 = 0xffffffffffffffff 
r10 = 0x0000000000000100 
r11 = 0x0000000000000286 
r12 = 0x000000c41fffff7c 
r13 = 0x0000000000000000 
r14 = 0x0000000000000178 
r15 = 0x0000000000000004 
rip = 0x00000000010501bf 
rflags = 0x0000000000000206 ... 
(dlv)
```
因为AMD64的各种寄存器非常多，项目的信息中刻意省略了非通用的寄存器。如果 再单步执行到13行时，可以发现AX寄存器值的变化。
```bash
(dlv) regs 
rax = 0x00000000010a4060 
rbx = 0x0000000000000000 
rcx = 0x000000c420000300 ...
(dlv)
```
因此我们可以推断汇编程序内部定义的 text<> 数据的地址为 0x00000000010a4060。我们可以用过print命令来查看该内存内的数据：
```bash
(dlv) print *(*[5]byte)(uintptr(0x00000000010a4060)) 
[5]uint8 [72,101,108,108,111] 
(dlv)
```
我们可以发现输出的 [5]uint8 [72,101,108,108,111] 刚好是对应“Hello”字符 串。通过类似的方法，我们可以通过查看SP对应的栈指针位置，然后查看栈中局部 变量的值。 至此我们就掌握了Go汇编程序的简单调试技术。


## 补充说明
如果是纯粹学习汇编语言，则可以从《深入理解程序设计：使用Linux汇编语言》开 始，该书讲述了如何以C语言的思维变现汇编程序。如果是学习X86汇编，则可以 从《汇编语言：基于x86处理器》一开始，然后再结合《现代x86汇编语言程序设 计》学习AVX等高级汇编指令的使用。

Go汇编语言的官方文档非常匮乏。其中“A Quick Guide to Go's Assembler”是唯一 的一篇系统讲述Go汇编语言的官方文章，该文章中又引入了另外两篇Plan9的文 档：A Manual for the Plan 9 assembler 和 Plan 9 C Compilers。Plan9的两篇文档 分别讲述了汇编语言以及和汇编有关联的C语言编译器的细节。看过这几篇文档之 后会对Go汇编语言有了一些模糊的概念，剩下的就是在实战中通过代码学习了。

Go语言的编译器和汇编器都带了一个 -S 参数，可以查看生成的最终目标代码。 通过对比目标代码和原始的Go语言或Go汇编语言代码的差异可以加深对底层实现 的理解。同时Go语言连接器的实现代码也包含了很多相关的信息。Go汇编语言是 依托Go语言的语言，因此理解Go语言的工作原理是也是必要的。比较重要的部分 是Go语言runtime和reflect包的实现原理。如果读者了解CGO技术，那么对Go汇编 语言的学习也是一个巨大的帮助。最后是要了解syscall包是如何实现系统调用的。

得益于Go语言的设计，Go汇编语言的优势也非常明显：跨操作系统、不同CPU之 间的用法也非常相似、支持C语言预处理器、支持模块。同时Go汇编语言也存在很 多不足：它不是一个独立的语言，底层需要依赖Go语言甚至操作系统；很多高级特 性很难通过手工汇编完成。虽然Go语言官方尽量保持Go汇编语言简单，但是汇编 语言是一个比较大的话题，大到足以写一本Go汇编语言的教程。本章的目的是让大 家对Go汇编语言简单入门，在看到底层汇编代码的时候不会一头雾水，在某些遇到 性能受限制的场合能够通过Go汇编突破限制。
