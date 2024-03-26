---

---

# go 和 Web


## Web 开发简介

因为Go的 net/http 包提供了基础的路由函数组合与丰富的功能函数。所以在社区里流行一种用Go编写API不需要框架的观点，在我们看来，如果你的项目的路由在个位数、URI固定且不通过URI来传递参数，那么确实使用官方库也就足够。但在复杂场景下，官方的http库还是有些力有不逮。例如下面这样的路由：
```
GET /card/:id
POST /card/:id
DELTE /card/:id
GET /card/:id/name
...
GET /card/:id/relations
```
可见是否使用框架还是要具体问题具体分析的。

Go的Web框架大致可以分为这么两类：
1. Router框架
2. MVC类框架

在框架的选择上，大多数情况下都是依照个人的喜好和公司的技术栈。例如公司有
很多技术人员是PHP出身，那么他们一定会非常喜欢像beego这样的框架，但如果
公司有很多C程序员，那么他们的想法可能是越简单越好。比如很多大厂的C程序
员甚至可能都会去用C语言去写很小的CGI程序，他们可能本身并没有什么意愿去
学习MVC或者更复杂的Web框架，他们需要的只是一个非常简单的路由（甚至连路
由都不需要，只需要一个基础的HTTP协议处理库来帮他省掉没什么意思的体力劳
动）。

Go的 net/http 包提供的就是这样的基础功能，写一个简单的 http echo
server 只需要30s。
```go
//brief_intro/echo.go
package main
import (...)
func echo(wr http.ResponseWriter, r *http.Request) {
msg, err := ioutil.ReadAll(r.Body)
if err != nil {
wr.Write([]byte("echo error"))
return
}
writeLen, err := wr.Write(msg)
if err != nil || writeLen != len(msg) {
log.Println(err, "write len:", writeLen)
}
}
func main() {
http.HandleFunc("/", echo)
err := http.ListenAndServe(":8080", nil)
if err != nil {
log.Fatal(err)
}
}
```
这个例子是为了说明在Go中写一个HTTP协议的小程序有多么简
单。如果你面临的情况比较复杂，例如几十个接口的企业级应用，直接
用 net/http 库就显得不太合适了。

开源界有这么几种框架，第一种是对httpRouter进行
简单的封装，然后提供定制的中间件和一些简单的小工具集成比如gin，主打轻量，
易学，高性能。第二种是借鉴其它语言的编程风格的一些MVC类框架，例如
beego，方便从其它语言迁移过来的程序员快速上手，快速开发。还有一些框架功
能更为强大，除了数据库schema设计，大部分代码直接生成，例如goa。不管哪种
框架，适合开发者背景的就是最好的。

## router 请求路由
在常见的Web框架中，router是必备的组件。Go语言圈子里router也时常被称为 http 的multiplexer。如果开发Web系统对路径中带参数没什么兴趣的话，用 http 标准库中的 mux 就可以。

RESTful是几年前刮起的API设计风潮，在RESTful中除了GET和POST之外，还使用了HTTP协议定义的几种其它的标准化语义。具体包括：
```go
const (
MethodGet = "GET"
MethodHead = "HEAD"
MethodPost = "POST"
MethodPut = "PUT"
MethodPatch = "PATCH" // RFC 5789
MethodDelete = "DELETE"
MethodConnect = "CONNECT"
MethodOptions = "OPTIONS"
MethodTrace = "TRACE"
)
```
来看看RESTful中常见的请求路径：
``` bash
GET /repos/:owner/:repo/comments/:id/reactions
POST /projects/:project_id/columns
PUT /user/starred/:owner/:repo
DELETE /user/starred/:owner/:repo
```
相信聪明的你已经猜出来了，这是Github官方文档中挑出来的几个API设计。
RESTful风格的API重度依赖请求路径。会将很多参数放在请求URI中。除此之外还
会使用很多并不那么常见的HTTP状态码。如果我们的系统也想要这样的URI设计，使用标准库的 mux 显然就力不从心了。

### httprouter
较流行的开源go Web框架大多使用httprouter，或是基于httprouter的变种对路由进
行支持。前面提到的github的参数式路由在httprouter中都是可以支持的。

因为httprouter中使用的是显式匹配，所以在设计路由的时候需要规避一些会导致路
由冲突的情况，例如：
```bash
conflict:
GET /user/info/:name
GET /user/:id

no conflict:
GET /user/info/:name
POST /user/:id
```
简单来讲的话，如果两个路由拥有一致的http方法(指 GET/POST/PUT/DELETE)和
请求路径前缀，且在某个位置出现了A路由是wildcard（指:id这种形式）参数，B路
由则是普通字符串，那么就会发生路由冲突。路由冲突会在初始化阶段直接panic：
```bash
panic: wildcard route ':id' conflicts with existing children in
path '/user/:id'
goroutine 1 [running]:
github.com/cch123/httprouter.(*node).insertChild(0xc4200801e0, 0
xc42004fc01, 0x126b177, 0x3, 0x126b171, 0x9, 0x127b668)
/Users/caochunhui/go_work/src/github.com/cch123/httprouter/tre
e.go:256 +0x841
github.com/cch123/httprouter.(*node).addRoute(0xc4200801e0, 0x12
6b171, 0x9, 0x127b668)
/Users/caochunhui/go_work/src/github.com/cch123/httprouter/tre
e.go:221 +0x22a
github.com/cch123/httprouter.(*Router).Handle(0xc42004ff38, 0x12
6a39b, 0x3, 0x126b171, 0x9, 0x127b668)
/Users/caochunhui/go_work/src/github.com/cch123/httprouter/rou
ter.go:262 +0xc3
github.com/cch123/httprouter.(*Router).GET(0xc42004ff38, 0x126b1
71, 0x9, 0x127b668)
/Users/caochunhui/go_work/src/github.com/cch123/httprouter/rou
ter.go:193 +0x5e
main.main()
/Users/caochunhui/test/go_web/httprouter_learn2.go:18 +0xaf
exit status 2
```
还有一点需要注意，因为httprouter考虑到字典树的深度，在初始化时会对参数的数
量进行限制，所以在路由中的参数数目不能超过255，否则会导致httprouter无法识
别后续的参数。不过这一点上也不用考虑太多，毕竟URI是人设计且给人来看的，
相信没有长得夸张的URI能在一条路径中带有200个以上的参数。

除支持路径中的wildcard参数之外，httprouter还可以支持 * 号来进行通配，不
过 * 号开头的参数只能放在路由的结尾，例如下面这样：
```bash
Pattern: /src/*filepath
/src/ filepath = ""
/src/somefile.go filepath = "somefile.go"
/src/subdir/somefile.go filepath = "subdir/somefile.go"
```
这种设计在RESTful中可能不太常见，主要是为了能够使用httprouter来做简单的HTTP静态文件服务器。

除了正常情况下的路由支持，httprouter也支持对一些特殊情况下的回调函数进行定
制，例如404的时候：
```go
r := httprouter.New()
r.NotFound = http.HandlerFunc(func(w http.ResponseWriter, r *htt
p.Request) {
w.Write([]byte("oh no, not found"))
})
```
或者内部panic的时候：
```go
r.PanicHandler = func(w http.ResponseWriter, r *http.Request, c
interface{}) {
log.Printf("Recovering from panic, Reason: %#v", c.(error))
w.WriteHeader(http.StatusInternalServerError)
w.Write([]byte(c.(error).Error()))
}
```
目前开源界最为流行（star数最多）的Web框架gin使用的就是httprouter的变种。

### 原理
httprouter和众多衍生router使用的数据结构被称为压缩字典树（Radix Tree）。读者可能没有接触过压缩字典树，但对字典树（Trie Tree）应该有所耳闻。
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240326143956.png)

字典树常用来进行字符串检索，例如用给定的字符串序列建立字典树。对于目标字
符串，只要从根节点开始深度优先搜索，即可判断出该字符串是否曾经出现过，时
间复杂度为 O(n) ，n可以认为是目标字符串的长度。为什么要这样做？字符串本
身不像数值类型可以进行数值比较，两个字符串对比的时间复杂度取决于字符串长
度。如果不用字典树来完成上述功能，要对历史字符串进行排序，再利用二分查找
之类的算法去搜索，时间复杂度只高不低。可认为字典树是一种空间换时间的典型
做法。

普通的字典树有一个比较明显的缺点，就是每个字母都需要建立一个孩子节点，这
样会导致字典树的层数比较深，压缩字典树相对好地平衡了字典树的优点和缺点。下面是典型的压缩字典树结构：

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240326144312.png)

每个节点上不只存储一个字母了，这也是压缩字典树中“压缩”的主要含义。使用压
缩字典树可以减少树的层数，同时因为每个节点上数据存储也比通常的字典树要
多，所以程序的局部性较好（一个节点的path加载到cache即可进行多个字符的对
比），从而对CPU缓存友好。


### 压缩字典树创建过程
我们来跟踪一下httprouter中，一个典型的压缩字典树的创建过程，路由设定如下：
```bash
PUT /user/installations/:installation_id/repositories/:repositor
y_id
GET /marketplace_listing/plans/
GET /marketplace_listing/plans/:id/accounts
GET /search
GET /status
GET /support
补充路由：
GET /marketplace_listing/plans/ohyes
```

#### root 节点创建
httprouter的Router结构体中存储压缩字典树使用的是下述数据结构：
```go
// 略去了其它部分的 Router struct
type Router struct {
// ...
trees map[string]*node
// ...
}
```
trees 中的 key 即为HTTP 1.1的RFC中定义的各种方法，具体有：
```bash
GET
HEAD
OPTIONS
POST
PUT
PATCH
DELETE
```
每一种方法对应的都是一棵独立的压缩字典树，这些树彼此之间不共享数据。具体
到我们上面用到的路由， PUT 和 GET 是两棵树而非一棵。
简单来讲，某个方法第一次插入的路由就会导致对应字典树的根节点被创建，我们按顺序，先是一个 PUT ：
```go
r := httprouter.New()
r.PUT("/user/installations/:installation_id/repositories/:reposit", Hello)
```
这样 PUT 对应的根节点就会被创建出来。把这棵 PUT 的树画出来：
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240326144938.png)
radix的节点类型为 *httprouter.node ，为了说明方便，我们留下了目前关心的几个字段：
```
path: 当前节点对应的路径中的字符串
wildChild: 子节点是否为参数节点，即 wildcard node，或者说 :id 这种类型的节点
nType: 当前节点类型，有四个枚举值: 分别为 static/root/param/catchAll。
static // 非根节点的普通字符串节点
root // 根节点
param // 参数节点，例如 :id
catchAll // 通配符节点，例如 *anyway
indices：子节点索引，当子节点为非参数类型，即本节点的wildChild为false时，
会将每个子节点的首字母放在该索引数组。说是数组，实际上是个string。
```
当然， PUT 路由只有唯一的一条路径。接下来，我们以后续的多条GET路径为例，讲解子节点的插入过程。

#### 子节点插入
当插入 GET /marketplace_listing/plans 时，类似前面PUT的过程，GET树的结构如图
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240326145210.png)
因为第一个路由没有参数，path都被存储到根节点上了。所以只有一个节点。然后插入 GET /marketplace_listing/plans/:id/accounts ，新的路径与之前
的路径有共同的前缀，且可以直接在之前叶子节点后进行插入，那么结果也很简单
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240326145243.png)
由于 :id 这个节点只有一个字符串的普通子节点，所以indices还依然不需要处
理。上面这种情况比较简单，新的路由可以直接作为原路由的子节点进行插入。实际情况不会这么美好。

#### 边分裂
接下来我们插入 GET /search ，这时会导致树的边分裂
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240326145325.png)

原有路径和新的路径在初始的 / 位置发生分裂，这样需要把原有的root节点内容下
移，再将新路由 search 同样作为子节点挂在root节点之下。这时候因为子节点出
现多个，root节点的indices提供子节点索引，这时候该字段就需要派上用场
了。"ms"代表子节点的首字母分别为m（marketplace）和s（search）。
我们一口作气，把 GET /status 和 GET /support 也插入到树中。这时候会导致
在 search 节点上再次发生分裂
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240326145358.png)

#### 子节点冲突处理
在路由本身只有字符串的情况下，不会发生任何冲突。只有当路由中含有
wildcard（类似 :id）或者catchAll的情况下才可能冲突。这一点在前面已经提到
了。
子节点的冲突处理很简单，分几种情况：
```
1. 在插入wildcard节点时，父节点的children数组非空且wildChild被设置为false。
例如： GET /user/getAll 和 GET /user/:id/getAddr ，或者 GET
/user/*aaa 和 GET /user/:id 。
2. 在插入wildcard节点时，父节点的children数组非空且wildChild被设置为true，但该父节点的wildcard子节点要插入的wildcard名字不一样。例如： GET/user/:id/info 和 GET /user/:name/info 。
3. 在插入catchAll节点时，父节点的children非空。例如： GET
/src/abc 和 GET /src/*filename ，或者 GET /src/:id 和 GET
/src/*filename 。
4. 在插入static节点时，父节点的wildChild字段被设置为true。
5. 在插入static节点时，父节点的children非空，且子节点nType为catchAll。
```
只要发生冲突，都会在初始化的时候panic。例如，在插入我们臆想的路由 GET
/marketplace_listing/plans/ohyes 时，出现第4种冲突情况：它的父节
点 marketplace_listing/plans/ 的wildChild字段为true。

## 中间件

### 代码泥潭
```go
// middleware/hello.go
package main
func hello(wr http.ResponseWriter, r *http.Request) {
wr.Write([]byte("hello"))
}
func main() {
http.HandleFunc("/", hello)
err := http.ListenAndServe(":8080", nil)
...
}
```
这是一个典型的Web服务，挂载了一个简单的路由。我们的线上服务一般也是从这
样简单的服务开始逐渐拓展开去的。
现在突然来了一个新的需求，我们想要统计之前写的hello服务的处理耗时，需求很
简单，我们对上面的程序进行少量修改：
```go
// middleware/hello_with_time_elapse.go
var logger = log.New(os.Stdout, "", 0)
func hello(wr http.ResponseWriter, r *http.Request) {
timeStart := time.Now()
wr.Write([]byte("hello"))
timeElapsed := time.Since(timeStart)
logger.Println(timeElapsed)
}
```
这样便可以在每次接收到http请求时，打印出当前请求所消耗的时间。
完成了这个需求之后，我们继续进行业务开发，提供的API逐渐增加，现在我们的
路由看起来是这个样子：

```go
// middleware/hello_with_more_routes.go
// 省略了一些相同的代码
package main
func helloHandler(wr http.ResponseWriter, r *http.Request) {
// ...
}
func showInfoHandler(wr http.ResponseWriter, r *http.Request) {
// ...
}
func showEmailHandler(wr http.ResponseWriter, r *http.Request) {
// ...
}
func showFriendsHandler(wr http.ResponseWriter, r *http.Request)
{
timeStart := time.Now()
wr.Write([]byte("your friends is tom and alex"))
timeElapsed := time.Since(timeStart)
logger.Println(timeElapsed)
}
func main() {
http.HandleFunc("/", helloHandler)
http.HandleFunc("/info/show", showInfoHandler)
http.HandleFunc("/email/show", showEmailHandler)
http.HandleFunc("/friends/show", showFriendsHandler)
// ...
}
```
每一个handler里都有之前提到的记录运行时间的代码，每次增加新的路由我们也同
样需要把这些看起来长得差不多的代码拷贝到我们需要的地方去。因为代码不太
多，所以实施起来也没有遇到什么大问题。
渐渐的我们的系统增加到了30个路由和 handler 函数，每次增加新的handler，我
们的第一件工作就是把之前写的所有和业务逻辑无关的周边代码先拷贝过来。

接下来系统安稳地运行了一段时间，突然有一天，老板找到你，我们最近找人新开
发了监控系统，为了系统运行可以更加可控，需要把每个接口运行的耗时数据主动
上报到我们的监控系统里。给监控系统起个名字吧，叫metrics。现在你需要修改代
码并把耗时通过HTTP Post的方式发给metrics系统了。我们来修改一
下 helloHandler() ：
```go
func helloHandler(wr http.ResponseWriter, r *http.Request) {
timeStart := time.Now()
wr.Write([]byte("hello"))
timeElapsed := time.Since(timeStart)
logger.Println(timeElapsed)
// 新增耗时上报
metrics.Upload("timeHandler", timeElapsed)
}
```
修改到这里，本能地发现我们的开发工作开始陷入了泥潭。无论未来对我们的这个
Web系统有任何其它的非功能或统计需求，我们的修改必然牵一发而动全身。只要
增加一个非常简单的非业务统计，我们就需要去几十个handler里增加这些业务无关
的代码。虽然一开始我们似乎并没有做错，但是显然随着业务的发展，我们的行事
方式让我们陷入了代码的泥潭。

### 使用中间件剥离非业务逻辑
我们犯的最大的错误，是把业务代码和非业务代码揉在了一起。对于大多数的场景来讲，非业务的需求都是在http请求处理前做一些事情，并且在响应完成之后做一些事情。我们有没有办法使用一些重构思路把这些公共的非业务功能代码剥离出去呢？回到刚开头的例子，我们需要给我们的 helloHandler() 增加超时时间统计，我们可以使用一种叫 function adapter 的方法来对 helloHandler() 进行包装：
```go
func hello(wr http.ResponseWriter, r *http.Request) {
wr.Write([]byte("hello"))
}
func timeMiddleware(next http.Handler) http.Handler {
return http.HandlerFunc(func(wr http.ResponseWriter, r *http
.Request) {
timeStart := time.Now()
// next handler
next.ServeHTTP(wr, r)
timeElapsed := time.Since(timeStart)
logger.Println(timeElapsed)
})
}
func main() {
http.Handle("/", timeMiddleware(http.HandlerFunc(hello)))
err := http.ListenAndServe(":8080", nil)
...
}
```
这样就非常轻松地实现了业务与非业务之间的剥离，魔法就在于这
个 timeMiddleware 。可以从代码中看到，我们的 timeMiddleware() 也是一个
函数，其参数为 http.Handler ， http.Handler 的定义在 net/http 包中：
```go
type Handler interface {
ServeHTTP(ResponseWriter, *Request)
}
```
任何方法实现了 ServeHTTP ，即是一个合法的 http.Handler ，读到这里你可能会有一些混乱，我们先来梳理一下http库的 Handler ， HandlerFunc 和 ServeHTTP 的关系：
```go
type Handler interface {
ServeHTTP(ResponseWriter, *Request)
}
type HandlerFunc func(ResponseWriter, *Request)
func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
f(w, r)
}
```
只要你的handler函数签名是：
```go
func (ResponseWriter, *Request)
```
那么这个 handler 和 http.HandlerFunc() 就有了一致的函数签名，可以将
该 handler() 函数进行类型转换，转为 http.HandlerFunc 。
而 http.HandlerFunc 实现了 http.Handler 这个接口。在 http 库需要调用你
的handler函数来处理http请求时，会调用 HandlerFunc() 的 ServeHTTP() 函
数，可见一个请求的基本调用链是这样的：
```
h = getHandler() => h.ServeHTTP(w, r) => h(w, r)
```
上面提到的把自定义 handler 转换为 http.HandlerFunc() 这个过程是必须
的，因为我们的 handler 没有直接实现 ServeHTTP 这个接口。上面的代码中我
们看到的HandleFunc(注意HandlerFunc和HandleFunc的区别)里也可以看到这个强制转换过程：
```go
func HandleFunc(pattern string, handler func(ResponseWriter, *Re
quest)) {
DefaultServeMux.HandleFunc(pattern, handler)
}
// 调用
func (mux *ServeMux) HandleFunc(pattern string, handler func(Res
ponseWriter, *Request)) {
mux.Handle(pattern, HandlerFunc(handler))
}
```
知道handler是怎么一回事，我们的中间件通过包装handler，再返回一个新的handler就好理解了。

总结一下，我们的中间件要做的事情就是通过一个或多个函数对handler进行包装，
返回一个包括了各个中间件逻辑的函数链。我们把上面的包装再做得复杂一些：
```go
customizedHandler = logger(timeout(ratelimit(helloHandler)))
```
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240326150741.png)
再直白一些，这个流程在进行请求处理的时候就是不断地进行函数压栈再出栈，有
一些类似于递归的执行流：
```
[exec of logger logic] 函数栈: []
[exec of timeout logic] 函数栈: [logger]
[exec of ratelimit logic] 函数栈: [timeout/logger]
[exec of helloHandler logic] 函数栈: [ratelimit/timeout/logge
r]
[exec of ratelimit logic part2] 函数栈: [timeout/logger]
[exec of timeout logic part2] 函数栈: [logger]
[exec of logger logic part2] 函数栈: []
```
功能实现了，但在上面的使用过程中我们也看到了，这种函数套函数的用法不是很
美观，同时也不具备什么可读性。

### 更优雅的中间件写法
看一个例子：
```go
r = NewRouter()
r.Use(logger)
r.Use(timeout)
r.Use(ratelimit)
r.Add("/", helloHandler)
```
通过多步设置，我们拥有了和上一节差不多的执行函数链。胜在直观易懂，如果我
们要增加或者删除中间件，只要简单地增加删除对应的 Use() 调用就可以了。非
常方便。
从框架的角度来讲，怎么实现这样的功能呢？也不复杂：
```go
type middleware func(http.Handler) http.Handler
type Router struct {
middlewareChain [] middleware
mux map[string] http.Handler
}
func NewRouter() *Router{
return &Router{}
}
func (r *Router) Use(m middleware) {
r.middlewareChain = append(r.middlewareChain, m)
}
func (r *Router) Add(route string, h http.Handler) {
var mergedHandler = h
for i := len(r.middlewareChain) - 1; i >= 0; i-- {
mergedHandler = r.middlewareChain[i](mergedHandler)
}
r.mux[route] = mergedHandler
}
```
注意代码中的 middleware 数组遍历顺序，和用户希望的调用顺序应该是"相
反"的。应该不难理解。

###  哪些事情适合在中间件中做

以较流行的开源Go语言框架chi为例：
```
compress.go
=> 对http的响应体进行压缩处理
heartbeat.go
=> 设置一个特殊的路由，例如/ping，/healthcheck，用来给负载均衡一类的前置服务进行探活
logger.go
=> 打印请求处理处理日志，例如请求处理时间，请求路由
profiler.go
=> 挂载pprof需要的路由，如`/pprof`、`/pprof/trace`到系统中
realip.go
=> 从请求头中读取X-Forwarded-For和X-Real-IP，将http.Request中的RemoteAddr修改为得到的
RealIPrequestid.go
=> 为本次请求生成单独的requestid，可一路透传，用来生成分布式调用链路，也可用于在日志中串连单次请求的所有逻辑
timeout.go
=> 用context.Timeout设置超时时间，并将其通过http.Request一路透传下去
throttler.go
=> 通过定长大小的channel存储token，并通过这些token对接口进行限流
```
每一个Web框架都会有对应的中间件组件，如果你有兴趣，也可以向这些项目贡献
有用的中间件，只要合理一般项目的维护人也愿意合并你的Pull Request。
比如开源界很火的gin这个框架，就专门为用户贡献的中间件开了一个仓库

## validator请求校验

### 重构请求校验函数
假设我们的数据已经通过某个开源绑定库绑定到了具体的结构体上。
```go
type RegisterReq struct {
Username string `json:"username"`
PasswordNew string `json:"password_new"`
PasswordRepeat string `json:"password_repeat"`
Email string `json:"email"`
}
func register(req RegisterReq) error{
if len(req.Username) > 0 {
if len(req.PasswordNew) > 0 && len(req.PasswordRepeat) >
0 {
if req.PasswordNew == req.PasswordRepeat {
if emailFormatValid(req.Email) {
createUser()
return nil
} else {
return errors.New("invalid email")
}
} else {
return errors.New("password and reinput must be
the same")
}
} else {
return errors.New("password and password reinput mus
t be longer than 0")
}
} else {
return errors.New("length of username cannot be 0")
}
}
```
我们用Go里成功写出了波动拳开路的箭头型代码。。这种代码一般怎么进行优化呢？
```go
func register(req RegisterReq) error{
if len(req.Username) == 0 {
return errors.New("length of username cannot be 0")
}
if len(req.PasswordNew) == 0 || len(req.PasswordRepeat) == 0
{
return errors.New("password and password reinput must be
longer than 0")
}
if req.PasswordNew != req.PasswordRepeat {
return errors.New("password and reinput must be the same"
)
}
if emailFormatValid(req.Email) {
return errors.New("invalid email")
}
createUser()
return nil
}
```
代码更清爽，看起来也不那么别扭了。这是比较通用的重构理念。虽然使用了重构
方法使我们的校验过程代码看起来优雅了，但我们还是得为每一个 http 请求都去
写这么一套差不多的 validate() 函数，有没有更好的办法来帮助我们解除这项
体力劳动？答案就是validator。

### 用validator解放体力劳动
从设计的角度讲，我们一定会为每个请求都声明一个结构体。前文中提到的校验场
景我们都可以通过validator完成工作。还以前文中的结构体为例。为了美观起见，
我们先把json tag省略掉。
这里我们引入一个新的validator库：
```go
import "gopkg.in/go-playground/validator.v9"
type RegisterReq struct {
// 字符串的 gt=0 表示长度必须 > 0，gt = greater than
Username string `validate:"gt=0"`
// 同上
PasswordNew string `validate:"gt=0"`
// eqfield 跨字段相等校验
PasswordRepeat string `validate:"eqfield=PasswordNew"`
// 合法 email 格式校验
Email string `validate:"email"`
}
validate := validator.New()
func validate(req RegisterReq) error {
err := validate.Struct(req)
if err != nil {
doSomething()
return err
}
...
}
```
这样就不需要在每个请求进入业务逻辑之前都写重复的 validate() 函数了。本
例中只列出了这个校验器非常简单的几个功能。
我们试着跑一下这个程序，输入参数设置为：
```go
//...
var req = RegisterReq {
Username : "Xargin",
PasswordNew : "ohno",
PasswordRepeat : "ohn",
Email : "alex@abc.com",
}
err := validate(req)
fmt.Println(err)
// Key: 'RegisterReq.PasswordRepeat' Error:Field validation for
// 'PasswordRepeat' failed on the 'eqfield' tag
```
如果觉得这个 validator 提供的错误信息不够人性化，例如要把错误信息返回给
用户，那就不应该直接显示英文了。可以针对每种tag进行错误信息定制，读者可以
自行探索。

###  原理
从结构上来看，每一个结构体都可以看成是一棵树。假如我们有如下定义的结构体：
```go
type Nested struct {
Email string `validate:"email"`
}
type T struct {
Age int `validate:"eq=10"`
Nested Nested
}
```
![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240326152243.png)
从字段校验的需求来讲，无论我们采用深度优先搜索还是广度优先搜索来对这棵结构体树来进行遍历，都是可以的。
```go
package main
import (
"fmt"
"reflect"
"regexp"
"strconv"
"strings"
)
type Nested struct {
Email string `validate:"email"`
}
type T struct {
Age int `validate:"eq=10"`
Nested Nested
}
func validateEmail(input string) bool {
if pass, _ := regexp.MatchString(
`^([\w\.\_]{2,10})@(\w{1,}).([a-z]{2,4})$`, input,
); pass {
return true
}
return false
}

func validate(v interface{}) (bool, string) {
validateResult := true
errmsg := "success"
vt := reflect.TypeOf(v)
vv := reflect.ValueOf(v)
for i := 0; i < vv.NumField(); i++ {
fieldVal := vv.Field(i)
tagContent := vt.Field(i).Tag.Get("validate")
k := fieldVal.Kind()
switch k {
case reflect.Int:
val := fieldVal.Int()
tagValStr := strings.Split(tagContent, "=")
tagVal, _ := strconv.ParseInt(tagValStr[1], 10, 64)
if val != tagVal {
errmsg = "validate int failed, tag is: "+ strcon
v.FormatInt(
tagVal, 10,
)
validateResult = false
}
case reflect.String:
val := fieldVal.String()
tagValStr := tagContent
switch tagValStr {
case "email":
nestedResult := validateEmail(val)
if nestedResult == false {
errmsg = "validate mail failed, field val is
: "+ val
validateResult = false
}
}
case reflect.Struct:
// 如果有内嵌的 struct，那么深度优先遍历
// 就是一个递归过程
valInter := fieldVal.Interface()
nestedResult, msg := validate(valInter)
if nestedResult == false {
validateResult = false
errmsg = msg
}
}
}
return validateResult, errmsg
}

func main() {
var a = T{Age: 10, Nested: Nested{Email: "abc@abc.com"}}
validateResult, errmsg := validate(a)
fmt.Println(validateResult, errmsg)
}
```
这里我们简单地对 eq=x 和 email 这两个tag进行了支持，读者可以对这个程序进
行简单的修改以查看具体的validate效果。为了演示精简掉了错误处理和复杂情况
的处理，例如 reflect.Int8/16/32/64 ， reflect.Ptr 等类型的处理，如果给
生产环境编写校验库的话，请务必做好功能的完善和容错

原
理很简单，就是用反射对结构体进行树形遍历。有心的读者这时候可能会产生一个
问题，我们对结构体进行校验时大量使用了反射，而Go的反射在性能上不太出众，
有时甚至会影响到我们程序的性能。这样的考虑确实有一些道理，但需要对结构体
进行大量校验的场景往往出现在Web服务，这里并不一定是程序的性能瓶颈所在，
实际的效果还是要从pprof中做更精确的判断。

如果基于反射的校验真的成为了你服务的性能瓶颈怎么办？现在也有一种思路可以
避免反射：使用Go内置的Parser对源代码进行扫描，然后根据结构体的定义生成校
验代码。我们可以将所有需要校验的结构体放在单独的包内。这就交给读者自己去
探索了。


##  Database 和数据库打交道

### 从 database/sql 讲起
Go官方提供了 database/sql 包来给用户进行和数据库打交道的工
作， database/sql 库实际只提供了一套操作数据库的接口和规范，例如抽象好的SQL预处理（prepare），连接池管理，数据绑定，事务，错误处理等等。官方并没有提供具体某种数据库实现的协议支持。

和具体的数据库，例如MySQL打交道，还需要再引入MySQL的驱动，像下面这
样：
```go
import "database/sql"
import _ "github.com/go-sql-driver/mysql"
db, err := sql.Open("mysql", "user:password@/dbname")
```
```go
import _ "github.com/go-sql-driver/mysql"
```
这条import语句会调用了 mysql 包的 init 函数，做的事情也很简单：
```go
func init() {
sql.Register("mysql", &MySQLDriver{})
}
```
在 sql 包的全局 map 里把 mysql 这个名字的 driver 注册
上。 Driver 在 sql 包中是一个接口：
```go
type Driver interface {
Open(name string) (Conn, error)
}
```
调用 sql.Open() 返回的 db 对象就是这里的 Conn 。
```go
type Conn interface {
Prepare(query string) (Stmt, error)
Close() error
Begin() (Tx, error)
}
```
也是一个接口。如果你仔细地查看 database/sql/driver/driver.go 的代码会
发现，这个文件里所有的成员全都是接口，对这些类型进行操作，还是会调用具体
的 driver 里的方法。

从用户的角度来讲，在使用 database/sql 包的过程中，你能够使用的也就是这
些接口里提供的函数。来看一个使用 database/sql 和 go-sql-driver/mysql 的完整的例子：
```go
package main
import (
"database/sql"
_ "github.com/go-sql-driver/mysql"
)
func main() {
// db 是一个 sql.DB 类型的对象
// 该对象线程安全，且内部已包含了一个连接池
// 连接池的选项可以在 sql.DB 的方法中设置，这里为了简单省略了
db, err := sql.Open("mysql",
"user:password@tcp(127.0.0.1:3306)/hello")
if err != nil {
log.Fatal(err)
}
defer db.Close()

var (
id int
name string
)
rows, err := db.Query("select id, name from users where id =
?", 1)
if err != nil {
log.Fatal(err)
}
defer rows.Close()
// 必须要把 rows 里的内容读完，或者显式调用 Close() 方法，
// 否则在 defer 的 rows.Close() 执行之前，连接永远不会释放
for rows.Next() {
err := rows.Scan(&id, &name)
if err != nil {
log.Fatal(err)
}
log.Println(id, name)
}
err = rows.Err()
if err != nil {
log.Fatal(err)
}
}
```
如果读者想了解官方这个 database/sql 库更加详细的用法的话，可以参
考 http://go-database-sql.org/ 。
包括该库的功能介绍、用法、注意事项和反直觉的一些实现方式（例如同一个
goroutine内对 sql.DB 的查询，可能在多个连接上）都有涉及

聪明如你的话，在上面这段简短的程序中可能已经嗅出了一些不好的味道。官方
的 db 库提供的功能这么简单，我们每次去数据库里读取内容岂不是都要去写这么
一套差不多的代码？或者如果我们的对象是结构体，把 sql.Rows 绑定到对象的工
作就会变得更加得重复而无聊。

是的，所以社区才会有各种各样的SQL Builder和ORM百花齐放。

###  提高生产效率的ORM和SQL Builder
在Web开发领域常常提到的ORM是什么？我们先看看万能的维基百科：
```
对象关系映射（英语：Object Relational Mapping，简称ORM，或O/RM，或O/R mapping），是一种程序设计技术，用于实现面向对象编程语言里不同类型系统的数据之间的转换。
从效果上说，它其实是创建了一个可在编程语言里使用的“虚拟对象数据库”。
```
最为常见的ORM做的是从db到程序的类或结构体这样的映射。所以你手边的程序
可能是从MySQL的表映射你的程序内的类。我们可以先来看看其它的程序语言里的
ORM写起来是怎么样的感觉：
```go
>>> from blog.models import Blog
>>> b = Blog(name='Beatles Blog', tagline='All the latest Beatle
s news.')
>>> b.save()
```
完全没有数据库的痕迹，没错，ORM的目的就是屏蔽掉DB层，很多语言的ORM只
要把你的类或结构体定义好，再用特定的语法将结构体之间的一对一或者一对多关
系表达出来。那么任务就完成了。然后你就可以对这些映射好了数据库表的对象进
行各种操作，例如save，create，retrieve，delete。至于ORM在背地里做了什么阴
险的勾当，你是不一定清楚的。使用ORM的时候，我们往往比较容易有一种忘记了
数据库的直观感受。举个例子，我们有个需求：向用户展示最新的商品列表，我们
再假设，商品和商家是1:1的关联关系，我们就很容易写出像下面这样的代码：
```go
# 伪代码
shopList := []
for product in productList {
shopList = append(shopList, product.GetShop)
}
```
当然了，我们不能批判这样写代码的程序员是偷懒的程序员。因为ORM一类的工具
在出发点上就是屏蔽sql，让我们对数据库的操作更接近于人类的思维方式。这样很
多只接触过ORM而且又是刚入行的程序员就很容易写出上面这样的代码。
这样的代码将对数据库的读请求放大了N倍。也就是说，如果你的商品列表有15个
SKU，那么每次用户打开这个页面，至少需要执行1（查询商品列表）+ 15（查询
相关的商铺信息）次查询。这里N是16。如果你的列表页很大，比如说有600个条
目，那么你就至少要执行1+600次查询。如果说你的数据库能够承受的最大的简单
查询是12万QPS，而上述这样的查询正好是你最常用的查询的话，你能对外提供的
服务能力是多少呢？是200 qps！互联网系统的忌讳之一，就是这种无端的读放
大。
当然，你也可以说这不是ORM的问题，如果你手写sql你还是可能会写出差不多的
程序，那么再来看两个demo：
```go
o := orm.NewOrm()
num, err := o.QueryTable("cardgroup").Filter("Cards__Card__Name"
, cardName).All(&cardgroups)
```



