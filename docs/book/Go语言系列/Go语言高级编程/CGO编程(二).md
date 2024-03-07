---

--- 

## CGO 内存模型

> CGO是架接Go语言和C语言的桥梁，它使二者在二进制接口层面实现了互通，但是我们要注意因两种语言的内存模型的差异而可能引起的问题。如果在CGO处理的跨语言函数调用时涉及到了指针的传递，则可能会出现Go语言和C语言共享某一段内存的场景。我们知道C语言的内存在分配之后就是稳定的，但是Go语言因为函数栈的动态伸缩可能导致栈中内存地址的移动(这是Go和C内存模型的最大差异)。如果C语言持有的是移动之前的Go指针，那么以旧指针访问Go对象时会导致程序崩溃。

### Go访问C内存

C语言空间的内存是稳定的，只要不是被人为提前释放，那么在Go语言空间可以放心大胆地使用。

因为Go语言实现的限制，我们无法在Go语言中创建大于2GB内存的切片（具体请参考makeslice实现代码）。不过借助cgo技术，我们可以在C语言环境创建大于
2GB的内存，然后转为Go语言的切片使用：

``` go
package main
/*
#include <stdlib.h>
void* makeslice(size_t memsize) {
return malloc(memsize);
}
*/
import "C"
import "unsafe"
func makeByteSlize(n int) []byte {
p := C.makeslice(C.size_t(n))
return ((*[1 << 31]byte)(p))[0:n:n]
}
func freeByteSlice(p []byte) {
C.free(unsafe.Pointer(&p[0]))
}
func main() {
s := makeByteSlize(1<<32+1)
s[len(s)-1] = 255
print(s[len(s)-1])
freeByteSlice(s)
}
```
我们通过makeByteSlize来创建大于4G内存大小的切片，从而绕过了Go语言
实现的限制（需要代码验证）。而freeByteSlice辅助函数则用于释放从C语言函数
创建的切片。

因为C语言内存空间是稳定的，基于C语言内存构造的切片也是绝对稳定的，不会
因为Go语言栈的变化而被移动。

###  C临时访问传入的Go内存

cgo之所以存在的一大因素是为了方便在Go语言中接纳吸收过去几十年来使用
C/C++语言软件构建的大量的软件资源。C/C++很多库都是需要通过指针直接处理
传入的内存数据的，因此cgo中也有很多需要将Go内存传入C语言函数的应用场
景。

假设一个极端场景：我们将一块位于某goroutinue的栈上的Go语言内存传入了C语
言函数后，在此C语言函数执行期间，此goroutinue的栈因为空间不足的原因发生
了扩展，也就是导致了原来的Go语言内存被移动到了新的位置。但是此时此刻C语
言函数并不知道该Go语言内存已经移动了位置，仍然用之前的地址来操作该内存
——这将将导致内存越界。以上是一个推论（真实情况有些差异），也就是说C访
问传入的Go内存可能是不安全的！

当然有RPC远程过程调用的经验的用户可能会考虑通过完全传值的方式处理：借助
C语言内存稳定的特性，在C语言空间先开辟同样大小的内存，然后将Go的内存填
充到C的内存空间；返回的内存也是如此处理。下面的例子是这种思路的具体实
现：
``` go
package main
/*
void printString(const char* s) {
printf("%s", s);
}
*/
import "C"
func printString(s string) {
cs := C.CString(s)
defer C.free(unsafe.Pointer(cs))
C.printString(cs)
}
func main() {
s := "hello"
printString(s)
}
```

在需要将Go的字符串传入C语言时，先通过 C.CString 将Go语言字符串对应的内
存数据复制到新创建的C语言内存空间上。上面例子的处理思路虽然是安全的，但
是效率极其低下（因为要多次分配内存并逐个复制元素），同时也极其繁琐。

为了简化并高效处理此种向C语言传入Go语言内存的问题，cgo针对该场景定义了
专门的规则：在CGO调用的C语言函数返回前，cgo保证传入的Go语言内存在此期
间不会发生移动，C语言函数可以大胆地使用Go语言的内存！

根据新的规则我们可以直接传入Go字符串的内存：
``` go
package main
/*
#include<stdio.h>
void printString(const char* s, int n) {
int i;
for(i = 0; i < n; i++) {
putchar(s[i]);
}
putchar('\n');
}
*/
import "C"
func printString(s string) {
p := (*reflect.StringHeader)(unsafe.Pointer(&s))
C.printString((*C.char)(unsafe.Pointer(p.Data)), C.int(len(s
)))
}
func main() {
s := "hello"
printString(s)
}
```
任何完美的技术都有被滥用的时候，CGO的这种看似完美的规则也是存在隐患的。
我们假设调用的C语言函数需要长时间运行，那么将会导致被他引用的Go语言内存
在C语言返回前不能被移动，从而可能间接地导致这个Go内存栈对应的goroutine不
能动态伸缩栈内存，也就是可能导致这个goroutine被阻塞。因此，在需要长时间运
行的C语言函数（特别是在纯CPU运算之外，还可能因为需要等待其它的资源而需
要不确定时间才能完成的函数），需要谨慎处理传入的Go语言内存。

任何完美的技术都有被滥用的时候，CGO的这种看似完美的规则也是存在隐患的。
我们假设调用的C语言函数需要长时间运行，那么将会导致被他引用的Go语言内存
在C语言返回前不能被移动，从而可能间接地导致这个Go内存栈对应的goroutine不
能动态伸缩栈内存，也就是可能导致这个goroutine被阻塞。因此，在需要长时间运
行的C语言函数（特别是在纯CPU运算之外，还可能因为需要等待其它的资源而需
要不确定时间才能完成的函数），需要谨慎处理传入的Go语言内存。

``` go
// 错误的代码
tmp := uintptr(unsafe.Pointer(&x))
pb := (*int16)(unsafe.Pointer(tmp))
*pb = 42
```
因为tmp并不是指针类型，在它获取到Go对象地址之后x对象可能会被移动，但是
因为不是指针类型，所以不会被Go语言运行时更新成新内存的地址。在非指针类型
的tmp保持Go对象的地址，和在C语言环境保持Go对象的地址的效果是一样的：如
果原始的Go对象内存发生了移动，Go语言运行时并不会同步更新它们。

### C长期持有Go指针对象

作为一个Go程序员在使用CGO时潜意识会认为总是Go调用C函数。其实CGO中，
C语言函数也可以回调Go语言实现的函数。特别是我们可以用Go语言写一个动态
库，导出C语言规范的接口给其它用户调用。当C语言函数调用Go语言函数的时
候，C语言函数就成了程序的调用方，Go语言函数返回的Go对象内存的生命周期也
就自然超出了Go语言运行时的管理。简言之，我们不能在C语言函数中直接使用Go
语言对象的内存。

虽然Go语言禁止在C语言函数中长期持有Go指针对象，但是这种需求是切实存在
的。如果需要在C语言中访问Go语言内存对象，我们可以将Go语言内存对象在Go
语言空间映射为一个int类型的id，然后通过此id来间接访问和控制Go语言对象。

以下代码用于将Go对象映射为整数类型的ObjectId，用完之后需要手工调用free方
法释放该对象ID：

``` go
package main
import "sync"
type ObjectId int32
var refs struct {
sync.Mutex
objs map[ObjectId]interface{}
next ObjectId
}
func init() {
refs.Lock()
defer refs.Unlock()
refs.objs = make(map[ObjectId]interface{})
refs.next = 1000
}
func NewObjectId(obj interface{}) ObjectId {
refs.Lock()
defer refs.Unlock()
id := refs.next
refs.next++
refs.objs[id] = obj
return id
}
func (id ObjectId) IsNil() bool {
return id == 0
}
func (id ObjectId) Get() interface{} {
refs.Lock()
defer refs.Unlock()
return refs.objs[id]
}
func (id *ObjectId) Free() interface{} {
refs.Lock()
defer refs.Unlock()
obj := refs.objs[*id]
delete(refs.objs, *id)
*id = 0
return obj
}
```
我们通过一个map来管理Go语言对象和id对象的映射关系。其中NewObjectId用于
创建一个和对象绑定的id，而id对象的方法可用于解码出原始的Go对象，也可以用
于结束id和原始Go对象的绑定。

``` c
package main
/*
extern char* NewGoString(char* );
extern void FreeGoString(char* );
extern void PrintGoString(char* );
static void printString(const char* s) {
char* gs = NewGoString(s);
PrintGoString(gs);
FreeGoString(gs);
}
*/
import "C"
//export NewGoString
func NewGoString(s *C.char) *C.char {
gs := C.GoString(s)
id := NewObjectId(gs)
return (*C.char)(unsafe.Pointer(uintptr(id)))
}
//export FreeGoString
func FreeGoString(p *C.char) {
id := ObjectId(uintptr(unsafe.Pointer(p)))
id.Free()
}
//export PrintGoString
func PrintGoString(s *C.char) {
id := ObjectId(uintptr(unsafe.Pointer(p)))
gs := id.Get().(string)
print(gs)
}
func main() {
C.printString("hello")
}
```

在printString函数中，我们通过NewGoString创建一个对应的Go字符串对象，返回
的其实是一个id，不能直接使用。我们借助PrintGoString函数将id解析为Go语言字
符串后打印。该字符串在C语言函数中完全跨越了Go语言的内存管理，在
PrintGoString调用前即使发生了栈伸缩导致的Go字符串地址发生变化也依然可以正
常工作，因为该字符串对应的id是稳定的，在Go语言空间通过id解码得到的字符串
也就是有效的。

### 导出C函数不能返回Go内存

在Go语言中，Go是从一个固定的虚拟地址空间分配内存。而C语言分配的内存则不
能使用Go语言保留的虚拟内存空间。在CGO环境，Go语言运行时默认会检查导出
返回的内存是否是由Go语言分配的，如果是则会抛出运行时异常。
``` go
/*
extern int* getGoPtr();
static void Main() {
int* p = getGoPtr();
*p = 42;
}
*/
import "C"
func main() {
C.Main()
}
//export getGoPtr
func getGoPtr() *C.int {
return new(C.int)
}
```
其中getGoPtr返回的虽然是C语言类型的指针，但是内存本身是从Go语言的new函
数分配，也就是由Go语言运行时统一管理的内存。然后我们在C语言的Main函数中
调用了getGoPtr函数，此时默认将发送运行时异常：
``` go
$ go run main.go
panic: runtime error: cgo result has Go pointer
goroutine 1 [running]:
main._cgoexpwrap_cfb3840e3af2_getGoPtr.func1(0xc420051dc0)
command-line-arguments/_obj/_cgo_gotypes.go:60 +0x3a
main._cgoexpwrap_cfb3840e3af2_getGoPtr(0xc420016078)
command-line-arguments/_obj/_cgo_gotypes.go:62 +0x67
main._Cfunc_Main()
command-line-arguments/_obj/_cgo_gotypes.go:43 +0x41
main.main()
/Users/chai/go/src/github.com/chai2010 \
/advanced-go-programming-book/examples/ch2-xx \
/return-go-ptr/main.go:17 +0x20
exit status 2
```

异常说明cgo函数返回的结果中含有Go语言分配的指针。指针的检查操作发生在C
语言版的getGoPtr函数中，它是由cgo生成的桥接C语言和Go语言的函数。

## C++ 类包装 

CGO是C语言和Go语言之间的桥梁，原则上无法直接支持C++的类。CGO不支持
C++语法的根本原因是C++至今为止还没有一个二进制接口规范(ABI)。一个C++类
的构造函数在编译为目标文件时如何生成链接符号名称、方法在不同平台甚至是
C++的不同版本之间都是不一样的。但是C++是兼容C语言，所以我们可以通过增
加一组C语言函数接口作为C++类和CGO之间的桥梁，这样就可以间接地实现
C++和Go之间的互联。当然，因为CGO只支持C语言中值类型的数据类型，所以我
们是无法直接使用C++的引用参数等特性的。

###  C++ 类到 Go 语言对象

实现C++类到Go语言对象的包装需要经过以下几个步骤：首先是用纯C函数接口包
装该C++类；其次是通过CGO将纯C函数接口映射到Go函数；最后是做一个Go包
装对象，将C++类到方法用Go对象的方法实现。

####  准备一个 C++ 类
我们基于 std::string 做一个最简单的缓存类MyBuffer。除了构
造函数和析构函数之外，只有两个成员函数分别是返回底层的数据指针和缓存的大
小。因为是二进制缓存，所以我们可以在里面中放置任意数据。

``` c++
// my_buffer.h
#include <string>
struct MyBuffer {
std::string* s_;
MyBuffer(int size) {
this->s_ = new std::string(size, char('\0'));
}
~MyBuffer() {
delete this->s_;
}
int Size() const {
return this->s_->size();
}
char* Data() {
return (char*)this->s_->data();
}
};
```
我们在构造函数中指定缓存的大小并分配空间，在使用完之后通过析构函数释放内
部分配的内存空间。下面是简单的使用方式：
``` c++
int main() {
auto pBuf = new MyBuffer(1024);
auto data = pBuf->Data();
auto size = pBuf->Size();
delete pBuf;
}
```

####  用纯C函数接口封装 C++ 类
如果要将上面的C++类用C语言函数接口封装，我们可以从使用方式入手。我们可
以将new和delete映射为C语言函数，将对象的方法也映射为C语言函数。
在C语言中我们期望MyBuffer类可以这样使用：
```c++
int main() {
MyBuffer* pBuf = NewMyBuffer(1024);
char* data = MyBuffer_Data(pBuf);
auto size = MyBuffer_Size(pBuf);
DeleteMyBuffer(pBuf);
}
```
my_buffer_capi.h 头文件接口规范：
``` h
// my_buffer_capi.h
typedef struct MyBuffer_T MyBuffer_T;
MyBuffer_T* NewMyBuffer(int size);
void DeleteMyBuffer(MyBuffer_T* p);
char* MyBuffer_Data(MyBuffer_T* p);
int MyBuffer_Size(MyBuffer_T* p);
```
然后就可以基于C++的MyBuffer类定义这些C语言包装函数。我们创建对应
的 my_buffer_capi.cc 文件如下：
``` c
// my_buffer_capi.cc
#include "./my_buffer.h"
extern "C" {
#include "./my_buffer_capi.h"
}
struct MyBuffer_T: MyBuffer {
MyBuffer_T(int size): MyBuffer(size) {}
~MyBuffer_T() {}
};
MyBuffer_T* NewMyBuffer(int size) {
auto p = new MyBuffer_T(size);
return p;
}
void DeleteMyBuffer(MyBuffer_T* p) {
delete p;
}
char* MyBuffer_Data(MyBuffer_T* p) {
return p->Data();
}
int MyBuffer_Size(MyBuffer_T* p) {
return p->Size();
}
```
因为头文件 my_buffer_capi.h 是用于CGO，必须是采用C语言规范的名字修饰
规则。在C++源文件包含时需要用 extern "C" 语句说明。另外MyBuffer_T的实
现只是从MyBuffer继承的类，这样可以简化包装代码的实现。同时和CGO通信时必
须通过 MyBuffer_T 指针，我们无法将具体的实现暴露给CGO，因为实现中包含
了C++特有的语法，CGO无法识别C++特性。

将C++类包装为纯C接口之后，下一步的工作就是将C函数转为Go函数。

####  将纯C接口函数转为Go函数
将纯C函数包装为对应的Go函数的过程比较简单。需要注意的是，因为我们的包中
包含C++11的语法，因此需要通过 #cgo CXXFLAGS: -std=c++11 打开C++11的选
项。
``` go
// my_buffer_capi.go
package main
/*
#cgo CXXFLAGS: -std=c++11
#include "my_buffer_capi.h"
*/
import "C"
type cgo_MyBuffer_T C.MyBuffer_T
func cgo_NewMyBuffer(size int) *cgo_MyBuffer_T {
p := C.NewMyBuffer(C.int(size))
return (*cgo_MyBuffer_T)(p)
}
func cgo_DeleteMyBuffer(p *cgo_MyBuffer_T) {
C.DeleteMyBuffer((*C.MyBuffer_T)(p))
}
func cgo_MyBuffer_Data(p *cgo_MyBuffer_T) *C.char {
return C.MyBuffer_Data((*C.MyBuffer_T)(p))
}
func cgo_MyBuffer_Size(p *cgo_MyBuffer_T) C.int {
return C.MyBuffer_Size((*C.MyBuffer_T)(p))
}
```
为了区分，我们在Go中的每个类型和函数名称前面增加了 cgo_ 前缀，比如
cgo_MyBuffer_T是对应C中的MyBuffer_T类型。

为了处理简单，在包装纯C函数到Go函数时，除了cgo_MyBuffer_T类型外，对输入
参数和返回值的基础类型，我们依然是用的C语言的类型。

#### 包装为Go对象
在将纯C接口包装为Go函数之后，我们就可以很容易地基于包装的Go函数构造出
Go对象来。因为cgo_MyBuffer_T是从C语言空间导入的类型，它无法定义自己的方
法，因此我们构造了一个新的MyBuffer类型，里面的成员持有cgo_MyBuffer_T指向
的C语言缓存对象。
``` go
// my_buffer.go
package main
import "unsafe"
type MyBuffer struct {
cptr *cgo_MyBuffer_T
}
func NewMyBuffer(size int) *MyBuffer {
return &MyBuffer{
cptr: cgo_NewMyBuffer(size),
}
}
func (p *MyBuffer) Delete() {
cgo_DeleteMyBuffer(p.cptr)
}
func (p *MyBuffer) Data() []byte {
data := cgo_MyBuffer_Data(p.cptr)
size := cgo_MyBuffer_Size(p.cptr)
return ((*[1 << 31]byte)(unsafe.Pointer(data)))[0:int(size):
int(size)]
}
```
同时，因为Go语言的切片本身含有长度信息，我们将cgo_MyBuffer_Data和
cgo_MyBuffer_Size两个函数合并为 MyBuffer.Data 方法，它返回一个对应底层C
语言缓存空间的切片。

现在我们就可以很容易在Go语言中使用包装后的缓存对象了（底层是基于
C++的 std::string 实现）：
``` go
package main
//#include <stdio.h>
import "C"
import "unsafe"
func main() {
buf := NewMyBuffer(1024)
defer buf.Delete()
copy(buf.Data(), []byte("hello\x00"))
C.puts((*C.char)(unsafe.Pointer(&(buf.Data()[0]))))
}
```
例子中，我们创建了一个1024字节大小的缓存，然后通过copy函数向缓存填充了一
个字符串。为了方便C语言字符串函数处理，我们在填充字符串的默认用'\0'表示字
符串结束。最后我们直接获取缓存的底层数据指针，用C语言的puts函数打印缓存
的内容。

###  Go 语言对象到 C++ 类

要实现Go语言对象到C++类的包装需要经过以下几个步骤：首先是将Go对象映射
为一个id；然后基于id导出对应的C接口函数；最后是基于C接口函数包装为C++对
象。

#### 构造一个Go对象
为了便于演示，我们用Go语言构建了一个Person对象，每个Person可以有名字和
年龄信息：
``` go
package main
type Person struct {
name string
age int
}
func NewPerson(name string, age int) *Person {
return &Person{
name: name,
age: age,
}
}
func (p *Person) Set(name string, age int) {
p.name = name
p.age = age
}
func (p *Person) Get() (name string, age int) {
return p.name, p.age
}
```
Person对象如果想要在C/C++中访问，需要通过cgo导出C接口来访问。
#### 导出C接口

我们前面仿照C++对象到C接口的过程，也抽象一组C接口描述Person对象。创建
一个 person_capi.h 文件，对应C接口规范文件：
``` c
// person_capi.h
#include <stdint.h>
typedef uintptr_t person_handle_t;
person_handle_t person_new(char* name, int age);
void person_delete(person_handle_t p);
void person_set(person_handle_t p, char* name, int age);
char* person_get_name(person_handle_t p, char* buf, int size);
int person_get_age(person_handle_t p);
```
然后是在Go语言中实现这一组C函数。

需要注意的是，通过CGO导出C函数时，输入参数和返回值类型都不支持const修
饰，同时也不支持可变参数的函数类型。同时如内存模式一节所述，我们无法在
C/C++中直接长期访问Go内存对象。因此我们使用前一节所讲述的技术将Go对象
映射为一个整数id。

下面是 person_capi.go 文件，对应C接口函数的实现：
``` c
// person_capi.go
package main
//#include "./person_capi.h"
import "C"
import "unsafe"
//export person_new
func person_new(name *C.char, age C.int) C.person_handle_t {
id := NewObjectId(NewPerson(C.GoString(name), int(age)))
return C.person_handle_t(id)
}
//export person_delete
func person_delete(h C.person_handle_t) {
ObjectId(h).Free()
}
```
``` c
//export person_set
func person_set(h C.person_handle_t, name *C.char, age C.int) {
p := ObjectId(h).Get().(*Person)
p.Set(C.GoString(name), int(age))
}
//export person_get_name
func person_get_name(h C.person_handle_t, buf *C.char, size C.int
) *C.char {
p := ObjectId(h).Get().(*Person)
name, _ := p.Get()
n := int(size) - 1
bufSlice := ((*[1 << 31]byte)(unsafe.Pointer(buf)))[0:n:n]
n = copy(bufSlice, []byte(name))
bufSlice[n] = 0
return buf
}
//export person_get_age
func person_get_age(h C.person_handle_t) C.int {
p := ObjectId(h).Get().(*Person)
_, age := p.Get()
return C.int(age)
}
```
在创建Go对象后，我们通过NewObjectId将Go对应映射为id。然后将id强制转义为
person_handle_t类型返回。其它的接口函数则是根据person_handle_t所表示的
id，让根据id解析出对应的Go对象。

#### 封装C++对象
有了C接口之后封装C++对象就比较简单了。常见的做法是新建一个Person类，里
面包含一个person_handle_t类型的成员对应真实的Go对象，然后在Person类的构
造函数中通过C接口创建Go对象，在析构函数中通过C接口释放Go对象。下面是采
用这种技术的实现：
``` c++
extern "C" {
#include "./person_capi.h"
}
struct Person {
person_handle_t goobj_;
Person(const char* name, int age) {
this->goobj_ = person_new((char*)name, age);
}
~Person() {
person_delete(this->goobj_);
}
void Set(char* name, int age) {
person_set(this->goobj_, name, age);
}
char* GetName(char* buf, int size) {
return person_get_name(this->goobj_ buf, size);
}
int GetAge() {
return person_get_age(this->goobj_);
}
}
```
包装后我们就可以像普通C++类那样使用了：
``` c++
#include "person.h"
#include <stdio.h>
int main() {
auto p = new Person("gopher", 10);
char buf[64];
char* name = p->GetName(buf, sizeof(buf)-1);
int age = p->GetAge();
printf("%s, %d years old.\n", name, age);
delete p;
return 0;
}
```

#### 封装C++对象改进
在前面的封装C++对象的实现中，每次通过new创建一个Person实例需要进行两次
内存分配：一次是针对C++版本的Person，再一次是针对Go语言版本的Person。
其实C++版本的Person内部只有一个person_handle_t类型的id，用于映射Go对
象。我们完全可以将person_handle_t直接当中C++对象来使用。

下面时改进后的包装方式：
``` c++
extern "C" {
#include "./person_capi.h"
}
struct Person {
static Person* New(const char* name, int age) {
return (Person*)person_new((char*)name, age);
}
void Delete() {
person_delete(person_handle_t(this));
}
void Set(char* name, int age) {
person_set(person_handle_t(this), name, age);
}
char* GetName(char* buf, int size) {
return person_get_name(person_handle_t(this), buf, size)
;
}
int GetAge() {
return person_get_age(person_handle_t(this));
}
};
```
我们在Person类中增加了一个叫New静态成员函数，用于创建新的Person实例。在New函数中通过调用person_new来创建Person实例，返回的是 person_handle_t 类型的id，我们将其强制转型作为 Person* 类型指针返回。在其它的成员函数中，我们通过将this指针再反向转型为 person_handle_t 类型，然后通过C接口调用对应的函数。

到此，我们就达到了将Go对象导出为C接口，然后基于C接口再包装为C++对象以
便于使用的目的。

### 彻底解放C++的this指针
熟悉Go语言的用法会发现Go语言中方法是绑定到类型的。比如我们基于int定义一
个新的Int类型，就可以有自己的方法：
``` go
type Int int
func (p Int) Twice() int {
return int(p)*2
}
func main() {
var x = Int(42)
fmt.Println(int(x))
fmt.Println(x.Twice())
}
```
这样就可以在不改变原有数据底层内存结构的前提下，自由切换int和Int类型来使用
变量。

而在C++中要实现类似的特性，一般会采用以下实现：
```c++
class Int {
int v_;
Int(v int) { this.v_ = v; }
int Twice() const{ return this.v_*2; }
};
int main() {
Int v(42);
printf("%d\n", v); // error
printf("%d\n", v.Twice());
}
```
新包装后的Int类虽然增加了Twice方法，但是失去了自由转回int类型的权利。这时
候不仅连printf都无法输出Int本身的值，而且也失去了int类型运算的所有特性。这就
是C++构造函数的邪恶之处：以失去原有的一切特性的代价换取class的施舍。

造成这个问题的根源是C++中this被固定为class的指针类型了。

在Go语言中，和this有着相似功能的类型接收者参数其实只是一个普通的函数参
数，我们可以自由选择值或指针类型。

如果以C语言的角度来思考，this也只是一个普通的 void* 类型的指针，我们可以
随意自由地将this转换为其它类型。
``` c
struct Int {
int Twice() {
const int* p = (int*)(this);
return (*p) * 2;
}
};
int main() {
int x = 42;
printf("%d\n", x);
printf("%d\n", ((Int*)(&x))->Twice());
return 0;
}
```
这样我们就可以通过将int类型指针强制转为Int类型指针，代替通过默认的构造函数
后new来构造Int对象。 在Twice函数的内部，以相反的操作将this指针转回int类型的
指针，就可以解析出原有的int类型的值了。 这时候Int类型只是编译时的一个壳
子，并不会在运行时占用额外的空间。

因此C++的方法其实也可以用于普通非 class 类型，C++到普通成员函数其实也是
可以绑定到类型的。 只有纯虚方法是绑定到对象，那就是接口。

## 静态库和动态库

CGO在使用C/C++资源的时候一般有三种形式：直接使用源码；链接静态库；链接
动态库。直接使用源码就是在 import "C" 之前的注释部分包含C代码，或者在当
前包中包含C/C++源文件。链接静态库和动态库的方式比较类似，都是通过在
LDFLAGS选项指定要链接的库方式链接。本节我们主要关注在CGO中如何使用静
态库和动态库相关的问题。

### 使用C静态库

如果CGO中引入的C/C++资源有代码而且代码规模也比较小，直接使用源码是最理
想的方式，但很多时候我们并没有源代码，或者从C/C++源代码开始构建的过程异
常复杂，这种时候使用C静态库也是一个不错的选择。静态库因为是静态链接，最
终的目标程序并不会产生额外的运行时依赖，也不会出现动态库特有的跨运行时资
源管理的错误。不过静态库对链接阶段会有一定要求：静态库一般包含了全部的代
码，里面会有大量的符号，如果不同静态库之间出现了符号冲突则会导致链接的失
败。

我们先用纯C语言构造一个简单的静态库。我们要构造的静态库名叫number，库中
只有一个number_add_mod函数，用于表示数论中的模加法运算。number库的文
件都在number目录下。

number/number.h 头文件只有一个纯C语言风格的函数声明：
``` h
int number_add_mod(int a, int b, int mod);
```
number/number.c 对应函数的实现：
``` c
#include "number.h"
int number_add_mod(int a, int b, int mod) {
return (a+b)%mod;
}
```
因为CGO使用的是GCC命令来编译和链接C和Go桥接的代码。因此静态库也必须
是GCC兼容的格式。
通过以下命令可以生成一个叫libnumber.a的静态库：
```
$ cd ./number
$ gcc -c -o number.o number.c
$ ar rcs libnumber.a number.o
```
生成libnumber.a静态库之后，我们就可以在CGO中使用该资源了。
创建main.go文件如下：
``` go
package main
//#cgo CFLAGS: -I./number
//#cgo LDFLAGS: -L${SRCDIR}/number -lnumber
//
//#include "number.h"
import "C"
import "fmt"
func main() {
fmt.Println(C.number_add_mod(10, 5, 12))
}
```
其中有两个#cgo命令，分别是编译和链接参数。CFLAGS通过 -I./number 将
number库对应头文件所在的目录加入头文件检索路径。LDFLAGS通过 -
L${SRCDIR}/number 将编译后number静态库所在目录加为链接库检索路径， -
lnumber 表示链接libnumber.a静态库。需要注意的是，在链接部分的检索路径不
能使用相对路径（C/C++代码的链接程序所限制），我们必须通过cgo特有
的 ${SRCDIR} 变量将源文件对应的当前目录路径展开为绝对路径（因此在
windows平台中绝对路径不能有空白符号）。

因为我们有number库的全部代码，所以我们可以用go generate工具来生成静态
库，或者是通过Makefile来构建静态库。因此发布CGO源码包时，我们并不需要提
前构建C静态库。

因为多了一个静态库的构建步骤，这种使用了自定义静态库并已经包含了静态库全
部代码的Go包无法直接用go get安装。不过我们依然可以通过go get下载，然后用
go generate触发静态库构建，最后才是go install来完成安装。

为了支持go get命令直接下载并安装，我们C语言的 #include 语法可以将number
库的源文件链接到当前的包。

创建 z_link_number_c.c 文件如下：
```
#include "./number/number.c"
```
然后在执行go get或go build之类命令的时候，CGO就是自动构建number库对应的
代码。这种技术是在不改变静态库源代码组织结构的前提下，将静态库转化为了源
代码方式引用。这种CGO包是最完美的。

如果使用的是第三方的静态库，我们需要先下载安装静态库到合适的位置。然后在
#cgo命令中通过CFLAGS和LDFLAGS来指定头文件和库的位置。对于不同的操作
系统甚至同一种操作系统的不同版本来说，这些库的安装路径可能都是不同的，那
么如何在代码中指定这些可能变化的参数呢？

在Linux环境，有一个pkg-config命令可以查询要使用某个静态库或动态库时的编译
和链接参数。我们可以在#cgo命令中直接使用pkg-config命令来生成编译和链接参
数。而且还可以通过PKG_CONFIG环境变量定制pkg-config命令。因为不同的操作
系统对pkg-config命令的支持不尽相同，通过该方式很难兼容不同的操作系统下的
构建参数。不过对于Linux等特定的系统，pkg-config命令确实可以简化构建参数的
管理。关于pkg-config的使用细节在此我们不深入展开，大家可以自行参考相关文
档。

### 使用C动态库

动态库出现的初衷是对于相同的库，多个进程可以共享同一个，以节省内存和磁盘
资源。但是在磁盘和内存已经白菜价的今天，这两个作用已经显得微不足道了，那
么除此之外动态库还有哪些存在的价值呢？从库开发角度来说，动态库可以隔离不
同动态库之间的关系，减少链接时出现符号冲突的风险。而且对于windows等平
台，动态库是跨越VC和GCC不同编译器平台的唯一的可行方式。

对于CGO来说，使用动态库和静态库是一样的，因为动态库也必须要有一个小的静
态导出库用于链接动态库（Linux下可以直接链接so文件，但是在Windows下必须
为dll创建一个 .a 文件用于链接）。我们还是以前面的number库为例来说明如何
以动态库方式使用。

对于在macOS和Linux系统下的gcc环境，我们可以用以下命令创建number库的的
动态库：
```
$ cd number
$ gcc -shared -o libnumber.so number.c
```
因为动态库和静态库的基础名称都是libnumber，只是后缀名不同而已。因此Go语
言部分的代码和静态库版本完全一样：
``` go
package main
//#cgo CFLAGS: -I./number
//#cgo LDFLAGS: -L${SRCDIR}/number -lnumber
//
//#include "number.h"
import "C"
import "fmt"
func main() {
fmt.Println(C.number_add_mod(10, 5, 12))
}
```
编译时GCC会自动找到libnumber.a或libnumber.so进行链接。

对于windows平台，我们还可以用VC工具来生成动态库（windows下有一些复杂的
C++库只能用VC构建）。我们需要先为number.dll创建一个def文件，用于控制要导
出到动态库的符号。

number.def文件的内容如下：
```
LIBRARY number.dll
EXPORTS
number_add_mod
```
其中第一行的LIBRARY指明动态库的文件名，然后的EXPORTS语句之后是要导出
的符号名列表。

现在我们可以用以下命令来创建动态库（需要进入VC对应的x64命令行环境）。
```
$ cl /c number.c
$ link /DLL /OUT:number.dll number.obj number.def
```
这时候会为dll同时生成一个number.lib的导出库。但是在CGO中我们无法使用lib格
式的链接库。

要生成 .a 格式的导出库需要通过mingw工具箱中的dlltool命令完成：
```
$ dlltool -dllname number.dll --def number.def --output-lib libn
umber.a
```
生成了libnumber.a文件之后，就可以通过 -lnumber 链接参数进行链接了。

需要注意的是，在运行时需要将动态库放到系统能够找到的位置。对于windows来
说，可以将动态库和可执行程序放到同一个目录，或者将动态库所在的目录绝对路
径添加到PATH环境变量中。对于macOS来说，需要设置DYLD_LIBRARY_PATH
环境变量。而对于Linux系统来说，需要设置LD_LIBRARY_PATH环境变量。

### 导出C静态库
CGO不仅可以使用C静态库，也可以将Go实现的函数导出为C静态库。我们现在用
Go实现前面的number库的模加法函数。
创建number.go，内容如下：
``` go
package main
import "C"
func main() {}
//export number_add_mod
func number_add_mod(a, b, mod C.int) C.int {
return (a + b) % mod
}
```
根据CGO文档的要求，我们需要在main包中导出C函数。对于C静态库构建方式来
说，会忽略main包中的main函数，只是简单导出C函数。采用以下命令构建：
```
$ go build -buildmode=c-archive -o number.a
```
在生成number.a静态库的同时，cgo还会生成一个number.h文件。
number.h文件的内容如下（为了便于显示，内容做了精简）：
``` c
#ifdef __cplusplus
extern "C" {
#endif
extern int number_add_mod(int p0, int p1, int p2);
#ifdef __cplusplus
}
#endif
```
其中 extern "C" 部分的语法是为了同时适配C和C++两种语言。核心内容是声明
了要导出的number_add_mod函数。

然后我们创建一个 _test_main.c 的C文件用于测试生成的C静态库（用下划线作
为前缀名是让为了让go build构建C静态库时忽略这个文件）：
``` c
#include "number.h"
#include <stdio.h>
int main() {
int a = 10;
int b = 5;
int c = 12;
int x = number_add_mod(a, b, c);
printf("(%d+%d)%%%d = %d\n", a, b, c, x);
return 0;
}
```
通过以下命令编译并运行：
```
$ gcc -o a.out _test_main.c number.a
$ ./a.out
```
使用CGO创建静态库的过程非常简单。

### 导出C动态库
CGO导出动态库的过程和静态库类似，只是将构建模式改为 c-shared ，输出文
件名改为 number.so 而已：
```
$ go build -buildmode=c-shared -o number.so
```
_test_main.c 文件内容不变，然后用以下命令编译并运行：
```
$ gcc -o a.out _test_main.c number.so
$ ./a.out
```

### 导出非main包的函数
通过 go help buildmode 命令可以查看C静态库和C动态库的构建说明：
```
-buildmode=c-archive
Build the listed main package, plus all packages it imports,
into a C archive file. The only callable symbols will be tho
se
functions exported using a cgo //export comment. Requires
exactly one main package to be listed.
-buildmode=c-shared
Build the listed main package, plus all packages it imports,
into a C shared library. The only callable symbols will
be those functions exported using a cgo //export comment.
Requires exactly one main package to be listed.
```
文档说明导出的C函数必须是在main包导出，然后才能在生成的头文件包含声明的
语句。但是很多时候我们可能更希望将不同类型的导出函数组织到不同的Go包中，
然后统一导出为一个静态库或动态库。

要实现从是从非main包导出C函数，或者是多个包导出C函数（因为只能有一个
main包），我们需要自己提供导出C函数对应的头文件（因为CGO无法为非main包
的导出函数生成头文件）。

假设我们先创建一个number子包，用于提供模加法函数：
``` go
package number
import "C"
//export number_add_mod
func number_add_mod(a, b, mod C.int) C.int {
return (a + b) % mod
}
```
然后是当前的main包：
```go
package main
import "C"
import (
"fmt"
_ "./number"
)
func main() {
println("Done")
}
//export goPrintln
func goPrintln(s *C.char) {
fmt.Println("goPrintln:", C.GoString(s))
}
```
其中我们导入了number子包，在number子包中有导出的C函数
number_add_mod，同时我们在main包也导出了goPrintln函数。

通过以下命令创建C静态库：
``` 
$ go build -buildmode=c-archive -o main.a
```
这时候在生成main.a静态库的同时，也会生成一个main.h头文件。但是main.h头文
件中只有main包中导出的goPrintln函数的声明，并没有number子包导出函数的声
明。其实number_add_mod函数在生成的C静态库中是存在的，我们可以直接使
用。

创建 _test_main.c 测试文件如下：
``` c
#include <stdio.h>
void goPrintln(char*);
int number_add_mod(int a, int b, int mod);
int main() {
int a = 10;
int b = 5;
int c = 12;
int x = number_add_mod(a, b, c);
printf("(%d+%d)%%%d = %d\n", a, b, c, x);
goPrintln("done");
return 0;
}
```
我们并没有包含CGO自动生成的main.h头文件，而是通过手工方式声明了goPrintln
和number_add_mod两个导出函数。这样我们就实现了从多个Go包导出C函数了。

##  编译和链接参数
编译和链接参数是每一个C/C++程序员需要经常面对的问题。构建每一个C/C++应
用均需要经过编译和链接两个步骤，CGO也是如此。

### 编译参数：CFLAGS/CPPFLAGS/CXXFLAGS

编译参数主要是头文件的检索路径，预定义的宏等参数。理论上来说C和C++是完
全独立的两个编程语言，它们可以有着自己独立的编译参数。 但是因为C++语言对
C语言做了深度兼容，甚至可以将C++理解为C语言的超集，因此C和C++语言之间
又会共享很多编译参数。 因此CGO提供了CFLAGS/CPPFLAGS/CXXFLAGS三种
参数，其中CFLAGS对应C语言编译参数(以 .c 后缀名)、 CPPFLAGS对应C/C++
代码编译参数(.c,.cc,.cpp,.cxx)、CXXFLAGS对应纯C++编译参数(.cc,.cpp,*.cxx)。

### 链接参数：LDFLAGS
链接参数主要包含要链接库的检索目录和要链接库的名字。因为历史遗留问题，链
接库不支持相对路径，我们必须为链接库指定绝对路径。 cgo 中的 ${SRCDIR} 为
当前目录的绝对路径。经过编译后的C和C++目标文件格式是一样的，因此
LDFLAGS对应C/C++共同的链接参数。

###  pkg-config
为不同C/C++库提供编译和链接参数是一项非常繁琐的工作，因此cgo提供了对
应 pkg-config 工具的支持。 我们可以通过 #cgo pkg-config xxx 命令来生成
xxx库需要的编译和链接参数，其底层通过调用 pkg-config xxx --cflags 生成
编译参数，通过 pkg-config xxx --libs 命令生成链接参数。 需要注意的
是 pkg-config 工具生成的编译和链接参数是C/C++公用的，无法做更细的区分。

pkg-config 工具虽然方便，但是有很多非标准的C/C++库并没有实现对其支持。
这时候我们可以手工为 pkg-config 工具创建对应库的编译和链接参数实现支
持。

比如有一个名为xxx的C/C++库，我们可以手工创
建 /usr/local/lib/pkgconfig/xxx.bc 文件：
```
Name: xxx
Cflags:-I/usr/local/include
Libs:-L/usr/local/lib –lxxx2
```
其中Name是库的名字，Cflags和Libs行分别对应xxx使用库需要的编译和链接参
数。如果bc文件在其它目录， 可以通过PKG_CONFIG_PATH环境变量指定 pkgconfig 工具的检索目录。

而对应cgo来说，我们甚至可以通过PKG_CONFIG 环境变量可指定自定义的pkgconfig程序。 如果是自己实现CGO专用的pkg-config程序，只要处理 --
cflags 和 --libs 两个参数即可。

下面的程序是macos系统下生成Python3的编译和链接参数：
``` go
// py3-config.go
func main() {
for _, s := range os.Args {
if s == "--cflags" {
out, _ := exec.Command("python3-config", "--cflags")
.CombinedOutput()
out = bytes.Replace(out, []byte("-arch"), []byte{},
-1)
out = bytes.Replace(out, []byte("i386"), []byte{}, -1
)
out = bytes.Replace(out, []byte("x86_64"), []byte{},
-1)
fmt.Print(string(out))
return
}
if s == "--libs" {
out, _ := exec.Command("python3-config", "--ldflags"
).CombinedOutput()
fmt.Print(string(out))
return
}
}
}
```
然后通过以下命令构建并使用自定义的 pkg-config 工具：
```
$ go build -o py3-config py3-config.go
$ PKG_CONFIG=./py3-config go build -buildmode=c-shared -o gopkg.
so main.go
```

###  go get 链

在使用 go get 获取Go语言包的同时会获取包依赖的包。比如A包依赖B包，B包
依赖C包，C包依赖D包： pkgA -> pkgB -> pkgC -> pkgD -> ... 。再go get
获取A包之后会依次线获取BCD包。 如果在获取B包之后构建失败，那么将导致链
条的断裂，从而导致A包的构建失败。

链条断裂的原因有很多，其中常见的原因有：
- 不支持某些系统, 编译失败
- 依赖 cgo, 用户没有安装 gcc
- 依赖 cgo, 但是依赖的库没有安装
- 依赖 pkg-config, windows 上没有安装
- 依赖 pkg-config, 没有找到对应的 bc 文件
- 依赖 自定义的 pkg-config, 需要额外的配置
- 依赖 swig, 用户没有安装 swig, 或版本不对

仔细分析可以发现，失败的原因中和CGO相关的问题占了绝大多数。这并不是偶然
现象， 自动化构建C/C++代码一直是一个世界难题，到目前位置也没有出现一个大
家认可的统一的C/C++管理工具。

因为用了cgo，比如gcc等构建工具是必须安装的，同时尽量要做到对主流系统的支
持。 如果依赖的C/C++包比较小并且有源代码的前提下，可以优先选择从代码构
建。

比如 github.com/chai2010/webp 包通过为每个C/C++源文件在当前包建立关键
文件实现零配置依赖：
```
// z_libwebp_src_dec_alpha.c
#include "./internal/libwebp/src/dec/alpha.c"
```
因此在编译 z_libwebp_src_dec_alpha.c 文件时，会编译libweb原生的代码。
其中的依赖是相对目录，对于不同的平台支持可以保持最大的一致性。

### 多个非main包中导出C函数
官方文档说明导出的Go函数要放main包，但是真实情况是其它包的Go导出函数也
是有效的。 因为导出后的Go函数就可以当作C函数使用，所以必须有效。但是不同
包导出的Go函数将在同一个全局的名字空间，因此需要小心避免重名的问题。

从不同的包导出Go函数到C语言空间，那么cgo自动生成
的 _cgo_export.h 文件将无法包含全部到处的函数声明， 我们必须通过手写头文
件的方式什么导出的全部函数。

## 最后

为何要话费巨大的精力学习CGO是一个问题。任何技术和语言都有它自身的优点和
不足，Go语言不是银弹，它无法解决全部问题。而通过CGO可以继承C/C++将近
半个世纪的软件遗产，通过CGO可以用Go给其它系统写C接口的共享库，通过
CGO技术可以让Go语言编写的代码可以很好地融入现有的软件生态——而现在的
软件正式建立在C/C++语言之上的。因此说CGO是一个保底的后备技术，它是Go
的一个重量级的替补技术，值得任何一个严肃的Go语言开发人员学习。