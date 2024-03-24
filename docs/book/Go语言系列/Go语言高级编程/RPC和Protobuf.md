---

---

# RPC和Protobuf

## RPC入门
RPC是远程过程调用的简称，是分布式系统中不同节点间流行的通信方式。在互联 网时代，RPC已经和IPC一样成为一个不可或缺的基础构件。因此Go语言的标准库 也提供了一个简单的RPC实现，我们将以此为入口学习RPC的各种用法。

### RPC版"Hello, World"
Go语言的RPC包的路径为net/rpc，也就是放在了net包目录下面。因此我们可以猜 测该RPC包是建立在net包基础之上的。

我们先构造一个HelloService类型，其中的Hello方法用于实现打印功能：
``` go
type HelloService struct {} 
func (p *HelloService) Hello(request string, reply *string) erro r 
{ 
    *reply = "hello:" + request 
    return nil 
}
```
其中Hello方法必须满足Go语言的RPC规则：**方法只能有两个可序列化的参数，其中第二个参数是指针类型，并且返回一个error类型，同时必须是公开的方法。**

然后就可以将HelloService类型的对象注册为一个RPC服务：
```go
func main() { 
    rpc.RegisterName("HelloService", new(HelloService)) 
    listener, err := net.Listen("tcp", ":1234") 
    if err != nil { 
        log.Fatal("ListenTCP error:", err) 
        }
    conn, err := listener.Accept() 
    if err != nil { 
        log.Fatal("Accept error:", err) 
        }
    rpc.ServeConn(conn) }
```
其中rpc.Register函数调用会将对象类型中所有满足RPC规则的对象方法注册为RPC函数，所有注册的方法会放在“HelloService”服务空间之下。然后我们建立一个 唯一的TCP链接，并且通过rpc.ServeConn函数在该TCP链接上为对方提供RPC服务。

下面是客户端请求HelloService服务的代码：
```go
func main() { 
    client, err := rpc.Dial("tcp", "localhost:1234") 
    if err != nil { 
        log.Fatal("dialing:", err) 
    }
    var reply string 
    err = client.Call("HelloService.Hello", "hello", &reply) 
    if err != nil { 
        log.Fatal(err) 
    }
    fmt.Println(reply) }
```
首先是通过rpc.Dial拨号RPC服务，然后通过client.Call调用具体的RPC方法。在调 用client.Call时，第一个参数是用点号链接的RPC服务名字和方法名字，第二和第 三个参数分别我们定义RPC方法的两个参数。

### 更安全的RPC接口
在涉及RPC的应用中，作为开发人员一般至少有三种角色：首先是服务端实现RPC 方法的开发人员，其次是客户端调用RPC方法的人员，最后也是最重要的是制定服 务端和客户端RPC接口规范的设计人员。在前面的例子中我们为了简化将以上几种 角色的工作全部放到了一起，虽然看似实现简单，但是不利于后期的维护和工作的 切割。 如果要重构HelloService服务，第一步需要明确服务的名字和接口：
```go
const HelloServiceName = "path/to/pkg.HelloService" 
type HelloServiceInterface = interface {    Hello(request string, reply *string) error 
}
func RegisterHelloService(svc HelloServiceInterface) error { 
    return rpc.RegisterName(HelloServiceName, svc) 
}
```
我们将RPC服务的接口规范分为三个部分：首先是服务的名字，然后是服务要实现 的详细方法列表，最后是注册该类型服务的函数。为了避免名字冲突，我们在RPC 服务的名字中增加了包路径前缀（这个是RPC服务抽象的包路径，并非完全等价 Go语言的包路径）。RegisterHelloService注册服务时，编译器会要求传入的对象 满足HelloServiceInterface接口。

在定义了RPC服务接口规范之后，客户端就可以根据规范编写RPC调用的代码了：
```go
func main() { 
    client, err := rpc.Dial("tcp", "localhost:1234") 
    if err != nil { 
        log.Fatal("dialing:", err) 
    }
    var reply 
    string err = client.Call(HelloServiceName+".Hello", "hello", &reply ) 
    if err != nil { 
        log.Fatal(err) 
    } 
}
```
其中唯一的变化是client.Call的第一个参数用HelloServiceName+".Hello"代替 了"HelloService.Hello"。然而通过client.Call函数调用RPC方法依然比较繁琐，同时 参数的类型依然无法得到编译器提供的安全保障。 为了简化客户端用户调用RPC函数，我们在可以在接口规范部分增加对客户端的简 单包装：

```go
type HelloServiceClient struct { 
    *rpc.Client 
}

var _ HelloServiceInterface = (*HelloServiceClient)(nil) 

func DialHelloService(network, address string) (*HelloServiceCli ent, error) { 
    c, err := rpc.Dial(network, address) 
    if err != nil { return nil, err 
    }
    return &HelloServiceClient{Client: c}, nil 
}f

unc (p *HelloServiceClient) Hello(request string, reply *string ) error { 
    return p.Client.Call(HelloServiceName+".Hello", request, rep ly) 
}
```

我们在接口规范中针对客户端新增加了HelloServiceClient类型，该类型也必须满足 HelloServiceInterface接口，这样客户端用户就可以直接通过接口对应的方法调用 RPC函数。同时提供了一个DialHelloService方法，直接拨号HelloService服务。

基于新的客户端接口，我们可以简化客户端用户的代码：
```go
func main() { 
    client, err := DialHelloService("tcp", "localhost:1234") 
    if err != nil { 
        log.Fatal("dialing:", err) 
    }
    var reply string 
    err = client.Hello("hello", &reply) 
    if err != nil { 
        log.Fatal(err) 
    } 
}
```
现在客户端用户不用再担心RPC方法名字或参数类型不匹配等低级错误的发生。 最后是基于RPC接口规范编写真实的服务端代码：

```go
type HelloService struct {} 

func (p *HelloService) Hello(request string, reply *string) erro r { 
    *reply = "hello:" + request return nil 
}

func main() { 
    RegisterHelloService(new(HelloService)) listener, err := net.Listen("tcp", ":1234") 
    if err != nil { 
        log.Fatal("ListenTCP error:", err) 
    }
    for {
        conn, err := listener.Accept() 
        if err != nil { 
            log.Fatal("Accept error:", err) 
        }
        go rpc.ServeConn(conn) 
    } 
}
```
在新的RPC服务端实现中，我们用RegisterHelloService函数来注册函数，这样不 仅可以避免命名服务名称的工作，同时也保证了传入的服务对象满足了RPC接口的 定义。最后我们新的服务改为支持多个TCP链接，然后为每个TCP链接提供RPC服 务。

### 跨语言的RPC
标准库的RPC默认采用Go语言特有的gob编码，因此从其它语言调用Go语言实现 的RPC服务将比较困难。在互联网的微服务时代，每个RPC以及服务的使用者都可 能采用不同的编程语言，因此跨语言是互联网时代RPC的一个首要条件。得益于 RPC的框架设计，Go语言的RPC其实也是很容易实现跨语言支持的。

Go语言的RPC框架有两个比较有特色的设计：一个是RPC数据打包时可以通过插 件实现自定义的编码和解码；另一个是RPC建立在抽象的io.ReadWriteCloser接口 之上的，我们可以将RPC架设在不同的通讯协议之上。这里我们将尝试通过官方自 带的net/rpc/jsonrpc扩展实现一个跨语言的RPC。

首先是基于json编码重新实现RPC服务：
```go
func main() { 
    rpc.RegisterName("HelloService", new(HelloService)) 
    listener, err := net.Listen("tcp", ":1234") 
    if err != nil { 
        log.Fatal("ListenTCP error:", err) 
    }
    for {conn, err := listener.Accept() 
    if err != nil { 
        log.Fatal("Accept error:", err) 
    }
    go rpc.ServeCodec(jsonrpc.NewServerCodec(conn))
    } 
}
```

代码中最大的变化是用rpc.ServeCodec函数替代了rpc.ServeConn函数，传入的参 数是针对服务端的json编解码器。然后是实现json版本的客户端：

```go
func main() { 
    conn, err := net.Dial("tcp", "localhost:1234") 
    if err != nil { 
        log.Fatal("net.Dial:", err) 
    }
    client := rpc.NewClientWithCodec(jsonrpc.NewClientCodec(conn )) 
    var reply string 
    err = client.Call("HelloService.Hello", "hello", &reply) 
    if err != nil { 
        log.Fatal(err) 
    }
    fmt.Println(reply) 
}
```
先手工调用net.Dial函数建立TCP链接，然后基于该链接建立针对客户端的json编解 码器。 在确保客户端可以正常调用RPC服务的方法之后，我们用一个普通的TCP服务代替 Go语言版本的RPC服务，这样可以查看客户端调用时发送的数据格式。比如通过 nc命令 nc -l 1234 在同样的端口启动一个TCP服务。然后再次执行一次RPC调 用将会发现nc输出了以下的信息：
```bash
{"method":"HelloService.Hello","params":["hello"],"id":0}
```
这是一个json编码的数据，其中method部分对应要调用的rpc服务和方法组合成的 名字，params部分的第一个元素为参数，id是由调用端维护的一个唯一的调用编 号。请求的json数据对象在内部对应两个结构体：客户端是clientRequest，服务端是 serverRequest。clientRequest和serverRequest结构体的内容基本是一致的：
```go
type clientRequest struct {
     Method string `json:"method"` Params [1]interface{} `json:"params"` Id uint64 `json:"id"` 
}

type serverRequest struct { 
    Method string `json:"method"` Params *json.RawMessage `json:"params"` Id *json.RawMessage `json:"id"` 
}
```
在获取到RPC调用对应的json数据后，我们可以通过直接向架设了RPC服务的TCP 服务器发送json数据模拟RPC方法调用：
```bash
$ echo -e '{"method":"HelloService.Hello","params":["hello"],"id ":1}' | nc localhost 1234
```
返回的结果也是一个json格式的数据：
```json
 {"id":1,"result":"hello:hello","error":null}
 ```
其中id对应输入的id参数，result为返回的结果，error部分在出问题时表示错误信 息。对于顺序调用来说，id不是必须的。但是Go语言的RPC框架支持异步调用，当 返回结果的顺序和调用的顺序不一致时，可以通过id来识别对应的调用。 返回的json数据也是对应内部的两个结构体：客户端是clientResponse，服务端是 serverResponse。两个结构体的内容同样也是类似的：
```go
type clientResponse struct { 
    Id uint64 `json:"id"` 
    Result *json.RawMessage `json:"result"` Error interface{} `json:"error"` 
}

type serverResponse struct { 
    Id *json.RawMessage `json:"id"` 
    Result interface{} `json:"result"` 
    Error interface{} `json:"error"`
}
```
因此无论采用何种语言，只要遵循同样的json结构，以同样的流程就可以和Go语言 编写的RPC服务进行通信。这样我们就实现了跨语言的RPC。

### Http上的RPC

Go语言内在的RPC框架已经支持在Http协议上提供RPC服务。但是框架的http服务 同样采用了内置的gob协议，并且没有提供采用其它协议的接口，因此从其它语言 依然无法访问的。在前面的例子中，我们已经实现了在TCP协议之上运行jsonrpc服 务，并且通过nc命令行工具成功实现了RPC方法调用。现在我们尝试在http协议上 提供jsonrpc服务。

新的RPC服务其实是一个类似REST规范的接口，接收请求并采用相应处理流程：
```go
func main() { 
    rpc.RegisterName("HelloService", new(HelloService)) 
    http.HandleFunc("/jsonrpc", 
        func(w http.ResponseWriter, r *h ttp.Request) { 
            var conn io.ReadWriteCloser = struct { 
                io.Writer io.ReadCloser 
            }
            {
                ReadCloser: r.Body, 
                Writer: w, 
            }
            rpc.ServeRequest(jsonrpc.NewServerCodec(conn)) 
        })
    http.ListenAndServe(":1234", nil) 
}
```
RPC的服务架设在“/jsonrpc”路径，在处理函数中基于http.ResponseWriter和 http.Request类型的参数构造一个io.ReadWriteCloser类型的conn通道。然后基于 conn构建针对服务端的json编码解码器。最后通过rpc.ServeRequest函数为每次请 求处理一次RPC方法调用。

模拟一次RPC调用的过程就是向该链接发送一个json字符串：
```bash
$ curl localhost:1234/jsonrpc -X POST \ --data '{"method":"HelloService.Hello","params":["hello"],"i d":0}
```
返回的结果依然是json字符串： 
```json
{"id":0,"result":"hello:hello","error":null}
```
这样就可以很方便地从不同语言中访问RPC服务了。


## Protobuf
Protobuf是Protocol Buffers的简称，它是Google公司开发的一种数据描述语言，并 于2008年对外开源。Protobuf刚开源时的定位类似于XML、JSON等数据描述语 言，通过附带工具生成代码并实现将结构化数据序列化的功能。但是我们更关注的 是Protobuf作为接口规范的描述语言，可以作为设计安全的跨语言PRC接口的基础 工具。

### Protobuf入门
这里我们尝试将 Protobuf和RPC结合在一起使用，通过Protobuf来最终保证RPC的接口规范和安全。Protobuf中最基本的数据单元是message，是类似Go语言中结构体的存在。在 message中可以嵌套message或其它的基础数据类型的成员。

首先创建hello.proto文件，其中包装HelloService服务中用到的字符串类型：
```go
syntax = "proto3"; 
package main; 
message String { 
    string value = 1; 
}
```
开头的syntax语句表示采用proto3的语法。第三版的Protobuf对语言进行了提炼简 化，所有成员均采用类似Go语言中的零值初始化（不再支持自定义默认值），因此 消息成员也不再需要支持required特性。然后package指令指明当前是main包（这 样可以和Go的包名保持一致，简化例子代码），当然用户也可以针对不同的语言定 制对应的包路径和名称。最后message关键字定义一个新的String类型，在最终生 成的Go语言代码中对应一个String结构体。String类型中只有一个字符串类型的 value成员，该成员编码时用1编号代替名字。

在XML或JSON等数据描述语言中，一般通过成员的名字来绑定对应的数据。但是 Protobuf编码却是通过成员的唯一编号来绑定对应的数据，因此Protobuf编码后数 据的体积会比较小，但是也非常不便于人类查阅。我们目前并不关注Protobuf的编 码技术，最终生成的Go结构体可以自由采用JSON或gob等编码格式，因此大家可 以暂时忽略Protobuf的成员编码部分。

Protobuf核心的工具集是C++语言开发的，在官方的protoc编译器中并不支持Go语 言。要想基于上面的hello.proto文件生成相应的Go代码，需要安装相应的插件。首 先是安装官方的protoc工具，可以从 https://github.com/google/protobuf/releases 下载。然后是安装针对Go语言的代码生成插件，可以通过 go get github.com/golang/protobuf/protoc-gen-go 命令安装。 然后通过以下命令生成相应的Go代码：
```go
$ protoc --go_out=. hello.proto
```
其中 go_out 参数告知protoc编译器去加载对应的protoc-gen-go工具，然后通过该 工具生成代码，生成代码放到当前目录。最后是一系列要处理的protobuf文件的列 表。这里只生成了一个hello.pb.go文件，其中String结构体内容如下：
```go
type String struct { 
    Value string `protobuf:"bytes,1,opt,name=value" json:"value, omitempty"` 
}

func (m *String) Reset() { 
    *m = String{} 
}

func (m *String) String() string { 
    return proto.CompactTextStrin g(m) 
} 

func (*String) ProtoMessage() {

} 

func (*String) Descriptor() ([]byte, []int) { 
    return fileDescriptor_hello_069698f99dd8f029, []int{0} 
}

func (m *String) GetValue() string { 
    if m != nil { 
        return m.Value 
    }
    return "" 
}
```

生成的结构体中还会包含一些以 XXX_ 为名字前缀的成员，我们已经隐藏了这些成 员。同时String类型还自动生成了一组方法，其中ProtoMessage方法表示这是一个 实现了proto.Message接口的方法。此外Protobuf还为每个成员生成了一个Get方 法，Get方法不仅可以处理空指针类型，而且可以和Protobuf第二版的方法保持一致 （第二版的自定义默认值特性依赖这类方法）。

基于新的String类型，我们可以重新实现HelloService服务：
```go
type HelloService struct{} 

func (p *HelloService) Hello(request *String, reply *String) err or {
    reply.Value = "hello:" + request.GetValue() return nil 
}
```
其中Hello方法的输入参数和输出的参数均改用Protobuf定义的String类型表示。因 为新的输入参数为结构体类型，因此改用指针类型作为输入参数，函数的内部代码 同时也做了相应的调整。

至此，我们初步实现了Protobuf和RPC组合工作。在启动RPC服务时，我们依然可 以选择默认的gob或手工指定json编码，甚至可以重新基于protobuf编码实现一个插件。虽然做了这么多工作，但是似乎并没有看到什么收益！

其实用 Protobuf定义语言无关的RPC服务接口才是它真正的价值所在！下面更新hello.proto文件，通过Protobuf来定义HelloService服务：
```go
service HelloService { 
    rpc Hello (String) returns (String); 
}
```
但是重新生成的Go代码并没有发生变化。这是因为世界上的RPC实现有千万种， protoc编译器并不知道该如何为HelloService服务生成代码。不过在protoc-gen-go内部已经集成了一个名字为 grpc 的插件，可以针对gRPC生 成代码：
```bash
$ protoc --go_out=plugins=grpc:. hello.proto
```
在生成的代码中多了一些类似HelloServiceServer、HelloServiceClient的新类型。 这些类型是为gRPC服务的，并不符合我们的RPC要求。

不过gRPC插件为我们提供了改进的思路，下面我们将探索如何为我们的RPC生成 安全的代码。

### 定制代码生成插件
Protobuf的protoc编译器是通过插件机制实现对不同语言的支持。比如protoc命令出 现 --xxx_out 格式的参数，那么protoc将首先查询是否有内置的xxx插件，如果没 有内置的xxx插件那么将继续查询当前系统中是否存在protoc-gen-xxx命名的可执行 程序，最终通过查询到的插件生成代码。对于Go语言的protoc-gen-go插件来说， 里面又实现了一层静态插件系统。比如protoc-gen-go内置了一个gRPC插件，用户 可以通过 --go_out=plugins=grpc 参数来生成gRPC相关代码，否则只会针对 message生成相关代码。

参考gRPC插件的代码，可以发现generator.RegisterPlugin函数可以用来注册插 件。插件是一个generator.Plugin接口：
```go
// A Plugin provides functionality to add to the output during 
// Go code generation, such as to produce RPC stubs. 
type Plugin interface { 
    // Name identifies the plugin. 
    Name() string 
    // Init is called once after data structures are built but b efore
    // code generation begins. 
    Init(g *Generator) 
    // Generate produces the code generated by the plugin for th is file, 
    // except for the imports, by calling the generator's method s P, In, 
    // and Out. 
    Generate(file *FileDescriptor) 
    // GenerateImports produces the import declarations for this file.
    // It is called after Generate. 
    GenerateImports(file *FileDescriptor) }
```
其中Name方法返回插件的名字，这是Go语言的Protobuf实现的插件体系，和 protoc插件的名字并无关系。然后Init函数是通过g参数对插件进行初始化，g参数中 包含Proto文件的所有信息。最后的Generate和GenerateImports方法用于生成主体 代码和对应的导入包代码。

因此我们可以设计一个netrpcPlugin插件，用于为标准库的RPC框架生成代码：
```go
import ( "github.com/golang/protobuf/protoc-gen-go/generator" )

type netrpcPlugin struct{ 
    *generator.Generator 
} 

func (p *netrpcPlugin) Name() string {          
    return "ne trpc" 
} 

func (p *netrpcPlugin) Init(g *generator.Generator) { 
    p.Generato r = g 
} 

func (p *netrpcPlugin) GenerateImports(file *generator.FileDescr iptor) { 
    if len(file.Service) > 0 { 
        p.genImportCode(file) 
    } 
}

func (p *netrpcPlugin) Generate(file *generator.FileDescriptor) { 
    for _, svc := range file.Service { 
        p.genServiceCode(svc) 
    } 
}
```
首先Name方法返回插件的名字。netrpcPlugin插件内置了一个匿名 的 *generator.Generator 成员，然后在Init初始化的时候用参数g进行初始化， 因此插件是从g参数对象继承了全部的公有方法。其中GenerateImports方法调用自 定义的genImportCode函数生成导入代码。Generate方法调用自定义的 genServiceCode方法生成每个服务的代码。

目前，自定义的genImportCode和genServiceCode方法只是输出一行简单的注释：
```go
func (p *netrpcPlugin) genImportCode(file *generator.FileDescrip tor) {
    p.P("// TODO: import code") 
}

func (p *netrpcPlugin) genServiceCode(svc *descriptor.ServiceDes criptorProto) {
     p.P("// TODO: service code, Name = " + svc.GetName()) 
}
```
要使用该插件需要先通过generator.RegisterPlugin函数注册插件，可以在init函数中 完成：
```go
func init() { generator.RegisterPlugin(new(netrpcPlugin)) }
```
因为Go语言的包只能静态导入，我们无法向已经安装的protoc-gen-go添加我们新 编写的插件。我们将重新克隆protoc-gen-go对应的main函数：
```go
package main 

import ( 
    "io/ioutil" "os" "github.com/golang/protobuf/proto" "github.com/golang/protobuf/protoc-gen-go/generator"
)

func main() { 
    g := generator.New() 
    data, err := ioutil.ReadAll(os.Stdin) 
    if err != nil { 
        g.Error(err, "reading input") 
    }
    if err := proto.Unmarshal(data, g.Request); err != nil { 
        g.Error(err, "parsing input proto") 
    }
    if len(g.Request.FileToGenerate) == 0 {     g.Fail("no files to generate") 
    }
    g.CommandLineParameters(g.Request.GetParameter())
    // Create a wrapped version of the Descriptors and EnumDescr iptors that 
    // point to the file that defines them. 
    g.WrapTypes()
    g.SetPackageNames() 
    g.BuildTypeNameMap() 
    g.GenerateAllFiles().
    // Send back the results. 
    data, err = proto.Marshal(g.Response) 
    if err != nil { 
        g.Error(err, "failed to marshal output proto") 
    }
    _, err = os.Stdout.Write(data) 
    if err != nil { 
        g.Error(err, "failed to write output proto") 
    } 
}
```
为了避免对protoc-gen-go插件造成干扰，我们将我们的可执行程序命名为protoc- gen-go-netrpc，表示包含了netrpc插件。然后用以下命令重新编译hello.proto文 件：
```bash
$ protoc --go-netrpc_out=plugins=netrpc:. hello.proto
```
其中 --go-netrpc_out 参数告知protoc编译器加载名为protoc-gen-go-netrpc的插 件，插件中的 plugins=netrpc 指示启用内部唯一的名为netrpc的netrpcPlugin插 件。在新生成的hello.pb.go文件中将包含增加的注释代码。 

至此，手工定制的Protobuf代码生成插件终于可以工作了

### 自动生成完整的RPC代码
在前面的例子中我们已经构建了最小化的netrpcPlugin插件，并且通过克隆protoc- gen-go的主程序创建了新的protoc-gen-go-netrpc的插件程序。现在开始继续完善 netrpcPlugin插件，最终目标是生成RPC安全接口。

首先是自定义的genImportCode方法中生成导入包的代码：
```go
func (p *netrpcPlugin) genImportCode(file *generator.FileDescrip tor) {
    p.P(`import "net/rpc"`) 
}
```
然后要在自定义的genServiceCode方法中为每个服务生成相关的代码。分析可以发 现每个服务最重要的是服务的名字，然后每个服务有一组方法。而对于服务定义的 方法，最重要的是方法的名字，还有输入参数和输出参数类型的名字。

为此我们定义了一个ServiceSpec类型，用于描述服务的元信息：
```go
type ServiceSpec struct { 
    ServiceName string 
    MethodList []ServiceMethodSpec 
}

type ServiceMethodSpec struct { 
    MethodName string 
    InputTypeName string 
    OutputTypeName string 
}
```
然后我们新建一个buildServiceSpec方法用来解析每个服务的ServiceSpec元信息：
```go
func (p *netrpcPlugin) buildServiceSpec( svc *descriptor.ServiceDescriptorProto, ) *ServiceSpec { 
    spec := &ServiceSpec{ 
        ServiceName: generator.CamelCase(svc.GetName()), 
        }
        for _, m := range svc.Method { 
            spec.MethodList = append(spec.MethodList, ServiceMethodS pec{ MethodName: generator.CamelCase(m.GetName()), 
            InputTypeName: p.TypeName(p.ObjectNamed(m.GetInputT ype())), 
            OutputTypeName: p.TypeName(p.ObjectNamed(m.GetOutput Type())),
            
        }) 
    }
    return spec 
}
```
其中输入参数是 *descriptor.ServiceDescriptorProto 类型，完整描述了一个 服务的所有信息。然后通过 svc.GetName() 就可以获取Protobuf文件中定义的服 务的名字。Protobuf文件中的名字转为Go语言的名字后，需要通 过 generator.CamelCase 函数进行一次转换。类似的，在for循环中我们通 过 m.GetName() 获取方法的名字，然后再转为Go语言中对应的名字。比较复杂的 是对输入和输出参数名字的解析：首先需要通过 m.GetInputType() 获取输入参 数的类型，然后通过 p.ObjectNamed 获取类型对应的类对象信息，最后获取类对 象的名字。

然后我们就可以基于buildServiceSpec方法构造的服务的元信息生成服务的代码：
```go
func (p *netrpcPlugin) genServiceCode(svc *descriptor.ServiceDes criptorProto) { 
    spec := p.buildServiceSpec(svc) 
    var buf bytes.Buffer 
    t := template.Must(template.New("").Parse(tmplService)) 
    err := t.Execute(&buf, spec) 
    if err != nil { 
        log.Fatal(err) 
    }
    p.P(buf.String()) 
}
```
为了便于维护，我们基于Go语言的模板来生成服务代码，其中tmplService是服务 的模板。

在编写模板之前，我们先查看下我们期望生成的最终代码大概是什么样子：
```go
type HelloServiceInterface interface {
     Hello(in String, out *String) error 
}

func RegisterHelloService(srv *rpc.Server, x HelloService) error { 
    if err := srv.RegisterName("HelloService", x); err != nil { 
        return err 
    }
    return nil 
}

type HelloServiceClient struct { 
    *rpc.Client 
}

var _ HelloServiceInterface = (*HelloServiceClient)(nil) 

func DialHelloService(network, address string) (*HelloServiceCli ent, error) { 
    c, err := rpc.Dial(network, address) 
    if err != nil { 
        return nil, err 
    }
    return &HelloServiceClient{Client: c}, nil 
}

func (p *HelloServiceClient) Hello(in String, out *String) error { 
    return p.Client.Call("HelloService.Hello", in, out) 
}
```
其中HelloService是服务名字，同时还有一系列的方法相关的名字。参考最终要生成的代码可以构建如下模板：
```go
const tmplService = ` {{$root := .}}

type {{.ServiceName}}Interface interface { {{- range $_, $m := .MethodList}} 
    {{$m.MethodName}}(*{{$m.InputTypeName}}, *{{$m.OutputTypeNam e}}) error 
    {{- end}} 
}

func Register{{.ServiceName}}( 
    srv *rpc.Server, x {{.ServiceName}}Interface, ) error { 
        if err := srv.RegisterName("{{.ServiceName}}", x); err != ni l { return err 
        }
    return nil
}

type {{.ServiceName}}Client struct { *rpc.Client 
}

var _ {{.ServiceName}}Interface = (*{{.ServiceName}}Client)(nil)

func Dial{{.ServiceName}}(network, address string) ( *{{.ServiceName}}Client, error, ) { 
    c, err := rpc.Dial(network, address) 
    if err != nil { 
        return nil, err 
    }
    return &{{.ServiceName}}Client{Client: c}, nil 
}

{{range $_, $m := .MethodList}} 
func (p *{{$root.ServiceName}}Client) {{$m.MethodName}}( in *{{$m.InputTypeName}}, out *{{$m.OutputTypeName}}, ) error { 
    return p.Client.Call("{{$root.ServiceName}}.{{$m.MethodName} 
    }", in, out) 
}
{{end}} `
```
当Protobuf的插件定制工作完成后，每次hello.proto文件中RPC服务的变化都可以 自动生成代码。也可以通过更新插件的模板，调整或增加生成代码的内容。在掌握 了定制Protobuf插件技术后，你将彻底拥有这个技术。

## 玩转RPC


### 客户端RPC的实现原理

Go语言的RPC库最简单的使用方式是通过 Client.Call 方法进行同步阻塞调用， 该方法的实现如下：

```go
func (client *Client) Call( serviceMethod string, args interface{}, reply interface{}, ) error { 
    call := <-client.Go(serviceMethod, args, reply, make(chan *C all, 1)).Done 
    return call.Error 
}
```
首先通过 Client.Go 方法进行一次异步调用，返回一个表示这次调用的 Call 结 构体。然后等待 Call 结构体的Done管道返回调用结果。

我们也可以通过 Client.Go 方法异步调用前面的HelloService服务：
```go
func doClientWork(client *rpc.Client) { 
    helloCall := client.Go("HelloService.Hello", "hello", new(st ring), nil) 
    // do some thing 
    helloCall = <-helloCall.Done 
    if err := helloCall.Error; err != nil { 
        log.Fatal(err) 
    }
    args := helloCall.Args.(string) 
    reply := helloCall.Reply.(string)
    fmt.Println(args, reply) 
}
```
在异步调用命令发出后，一般会执行其他的任务，因此异步调用的输入参数和返回 值可以通过返回的Call变量进行获取。执行异步调用的 Client.Go 方法实现如下：
```go
func (client *Client) Go( serviceMethod string, args interface{}, reply interface{}, done chan *Call, ) *Call { 
    call := new(Call) 
    call.ServiceMethod = serviceMethod 
    call.Args = args 
    call.Reply = reply 
    call.Done = make(chan *Call, 10) 
    // buffered. 
    client.send(call) 
    return call 
}
```
首先是构造一个表示当前调用的call变量，然后通过 client.send 将call的完整参 数发送到RPC框架。 client.send 方法调用是线程安全的，因此可以从多个 Goroutine同时向同一个RPC链接发送调用指令。当调用完成或者发生错误时，将调用 call.done 方法通知完成：
```go
func (call *Call) done() { 
    select { 
        case call.Done <- call: 
        // ok 
        default: 
        // We don't want to block here. It is the caller's respo nsibility to make 
        // sure the channel has enough buffer space. See comment in Go(). 
    } 
}
```
从 Call.done 方法的实现可以得知 call.Done 管道会将处理后的call返回。

### 基于RPC实现Watch功能
在很多系统中都提供了Watch监视功能的接口，当系统满足某种条件时Watch方法 返回监控的结果。在这里我们可以尝试通过RPC框架实现一个基本的Watch功能。 如前文所描述，因为 client.send 是线程安全的，我们也可以通过在不同的 Goroutine中同时并发阻塞调用RPC方法。通过在一个独立的Goroutine中调用 Watch函数进行监控。

为了便于演示，我们计划通过RPC构造一个简单的内存KV数据库。首先定义服务如下：
```go
type KVStoreService struct { 
    m map[string]string 
    filter map[string]func(key string) 
    mu sync.Mutex 
}

func NewKVStoreService() *KVStoreService { 
    return &KVStoreService{ 
        m: make(map[string]string), 
        filter: make(map[string]func(key string)), 
    } 
}
```
其中 m 成员是一个map类型，用于存储KV数据。 filter 成员对应每个Watch调 用时定义的过滤器函数列表。而 mu 成员为互斥锁，用于在多个Goroutine访问或 修改时对其它成员提供保护。然后就是Get和Set方法：
```go
func (p *KVStoreService) Get(key string, value *string) error { 
    p.mu.Lock() 
    defer p.mu.Unlock() 
    if v, ok := p.m[key]; ok { 
        *value = v 
        return nil 
    }
    return fmt.Errorf("not found") 
}

func (p *KVStoreService) Set(kv [2]string, reply *struct{}) erro r { 
    p.mu.Lock() 
     p.mu.Unlock() 
     key, value := kv[0], kv[1] 
     if oldValue := p.m[key]; oldValue != value { 
        for _, fn := range p.filter { 
            fn(key) 
        } 
    }
    p.m[key] = value 
    return nil 
}
```
在Set方法中，输入参数是key和value组成的数组，用一个匿名的空结构体表示忽 略了输出参数。当修改某个key对应的值时会调用每一个过滤器函数。 而过滤器列表在Watch方法中提供：
```go
func (p *KVStoreService) Watch(timeoutSecond int, keyChanged *st ring) error { 
    id := fmt.Sprintf("watch-%s-%03d", time.Now(), rand.Int()) 
    ch := make(chan string, 10) 
    // buffered 
    p.mu.Lock() 
    p.filter[id] = func(key string) { 
        ch <- key
    } 
    p.mu.Unlock() 
    select { 
        case <-time.After(time.Duration(timeoutSecond) * time.Second ): 
            return fmt.Errorf("timeout") 
        case key := <-ch: *keyChanged = key 
            return nil 
    }
    return nil 
}
```
Watch方法的输入参数是超时的秒数。当有key变化时将key作为返回值返回。如果 超过时间后依然没有key被修改，则返回超时的错误。Watch的实现中，用唯一的id 表示每个Watch调用，然后根据id将自身对应的过滤器函数注册到 p.filter 列 表。

KVStoreService服务的注册和启动过程我们不再赘述。下面我们看看如何从客户端 使用Watch方法：
```go
func doClientWork(client *rpc.Client) { 
    go func() { 
        var keyChanged string 
        err := client.Call("KVStoreService.Watch", 30, &keyChang ed) 
        if err != nil { 
            log.Fatal(err) 
        }
        fmt.Println("watch:", keyChanged) 
    } () 
    err := client.Call( "KVStoreService.Set", [2]string{"abc", "abc-value"}, new(struct{}), )
    if err != nil { 
        log.Fatal(err) 
    }
    time.Sleep(time.Second*3) 
}
```
首先启动一个独立的Goroutine监控key的变化。同步的watch调用会阻塞，直到有 key发生变化或者超时。然后在通过Set方法修改KV值时，服务器会将变化的key通 过Watch方法返回。这样我们就可以实现对某些状态的监控。

### 反向RPC
通常的RPC是基于C/S结构，RPC的服务端对应网络的服务器，RPC的客户端也对 应网络客户端。但是对于一些特殊场景，比如在公司内网提供一个RPC服务，但是在外网无法链接到内网的服务器。这种时候我们可以参考类似反向代理的技术，首 先从内网主动链接到外网的TCP服务器，然后基于TCP链接向外网提供RPC服务。以下是启动反向RPC服务的代码：
```go
func main() { 
    rpc.Register(new(HelloService)) 
    for {
        conn, _ := net.Dial("tcp", "localhost:1234") 
        if conn == nil { 
            time.Sleep(time.Second) 
            continue 
        }
        rpc.ServeConn(conn) 
        conn.Close() 
    } 
}
```
反向RPC的内网服务将不再主动提供TCP监听服务，而是首先主动链接到对方的 TCP服务器。然后基于每个建立的TCP链接向对方提供RPC服务。而RPC客户端则需要在一个公共的地址提供一个TCP服务，用于接受RPC服务器的 链接请求：
```go
func main() { 
    listener, err := net.Listen("tcp", ":1234") 
    if err != nil { 
        log.Fatal("ListenTCP error:", err) 
    }
    clientChan := make(chan *rpc.Client) 
    go func() { 
        for {
            conn, err := listener.Accept() 
            if err != nil { 
                log.Fatal("Accept error:", err) 
            }
        clientChan <- rpc.NewClient(conn) 
        } 
    }() 
    doClientWork(clientChan) 
}
```
当每个链接建立后，基于网络链接构造RPC客户端对象并发送到clientChan管道。 客户端执行RPC调用的操作在doClientWork函数完成：
```go
func doClientWork(clientChan <-chan *rpc.Client) { 
    client := <-clientChan 
    defer client.Close() 
    var reply string 
    err = client.Call("HelloService.Hello", "hello", &reply) 
    if err != nil { 
        log.Fatal(err) 
    }
    fmt.Println(reply) 
}
```
首先从管道去取一个RPC客户端对象，并且通过defer语句指定在函数退出前关闭客 户端。然后是执行正常的RPC调用。

### 上下文信息

基于上下文我们可以针对不同客户端提供定制化的RPC服务。我们可以通过为每个 链接提供独立的RPC服务来实现对上下文特性的支持

首先改造HelloService，里面增加了对应链接的conn成员：
```go
type HelloService struct { conn net.Conn }
```
然后为每个链接启动独立的RPC服务：
```go
func main() { 
    listener, err := net.Listen("tcp", ":1234") 
    if err != nil { 
        log.Fatal("ListenTCP error:", err) 
    }
    for {
        conn, err := listener.Accept() 
        if err != nil { 
            log.Fatal("Accept error:", err) 
        }
        go func() { 
            defer conn.Close() 
            p := rpc.NewServer() 
            p.Register(&HelloService{conn: conn}) 
            p.ServeConn(conn) 
        } () 
    } 
}
```
Hello方法中就可以根据conn成员识别不同链接的RPC调用：
```go
func (p *HelloService) Hello(request string, reply *string) erro r { 
    *reply = "hello:" + request + ", from" + p.conn.RemoteAddr() .String() 
    return nil 
}
```
基于上下文信息，我们可以方便地为RPC服务增加简单的登陆状态的验证：
```go
type HelloService struct { 
    conn net.Conn 
    isLogin bool 
}

func (p *HelloService) Login(request string, reply *string) erro r { 
    if request != "user:password" { 
        return fmt.Errorf("auth failed") 
    }
    log.Println("login ok") 
    p.isLogin = true 
    return nil 
}

func (p *HelloService) Hello(request string, reply *string) erro r { 
    if !p.isLogin { 
        return fmt.Errorf("please login") 
    }
    *reply = "hello:" + request + ", from" + p.conn.RemoteAddr() .String() 
    return nil 
}
```
这样可以要求在客户端链接RPC服务时，首先要执行登陆操作，登陆成功后才能正 常执行其他的服务。


##  gRPC入门
gRPC是Google公司基于Protobuf开发的跨语言的开源RPC框架。gRPC基于 HTTP/2协议设计，可以基于一个HTTP/2链接提供多个服务，对于移动设备更加友好。本节将讲述gRPC的简单用法。

### gRPC技术栈

![https://github.com/binarycoder777/personal-pic/blob/main/pic/image.png]()
最底层为TCP或Unix Socket协议，在此之上是HTTP/2协议的实现，然后在HTTP/2 协议之上又构建了针对Go语言的gRPC核心库。应用程序通过gRPC插件生产的 Stub代码和gRPC核心库通信，也可以直接和gRPC核心库通信。

### gRPC入门
如果从Protobuf的角度看，gRPC只不过是一个针对service接口生成代码的生成器。创建hello.proto文件，定义HelloService接口：
```go
syntax = "proto3"; 
package main; 
message String { string value = 1; }
service HelloService { 
    rpc Hello (String) 
    returns (String); 
}
```
使用protoc-gen-go内置的gRPC插件生成gRPC代码：
```bash
$ protoc --go_out=plugins=grpc:. hello.proto
```
gRPC插件会为服务端和客户端生成不同的接口：
```go
type HelloServiceServer interface { Hello(context.Context, *String) (*String, error) }

type HelloServiceClient interface { Hello(context.Context, *String, ...grpc.CallOption) (*String , error) }

```
gRPC通过context.Context参数，为每个方法调用提供了上下文支持。客户端在调 用方法的时候，可以通过可选的grpc.CallOption类型的参数提供额外的上下文信 息。基于服务端的HelloServiceServer接口可以重新实现HelloService服务：
```go
type HelloServiceImpl struct{} 

func (p *HelloServiceImpl) Hello( ctx context.Context, args *String, ) (*String, error) { 
    reply := &String
    {
        Value: "hello:" + args.GetValue()
    } 
    return reply, nil 
}
```
gRPC服务的启动流程和标准库的RPC服务启动流程类似：
```go
func main() { 
    grpcServer := grpc.NewServer() 
    RegisterHelloServiceServer(grpcServer, new(HelloServiceImpl) ) 
    lis, err := net.Listen("tcp", ":1234") 
    if err != nil { 
        log.Fatal(err) 
    }
    grpcServer.Serve(lis) 
}
```
首先是通过 grpc.NewServer() 构造一个gRPC服务对象，然后通过gRPC插件生 成的RegisterHelloServiceServer函数注册我们实现的HelloServiceImpl服务。然后 通过 grpcServer.Serve(lis) 在一个监听端口上提供gRPC服务。 然后就可以通过客户端链接gRPC服务了：
```go
func main() { 
    conn, err := grpc.Dial("localhost:1234", grpc.WithInsecure() )
     if err != nil { 
        log.Fatal(err) 
    }
    defer conn.Close() 
    client := NewHelloServiceClient(conn) 
    reply, err := client.Hello(context.Background(), &String{Val ue: "hello"}) 
    if err != nil { 
        log.Fatal(err) 
    }
    fmt.Println(reply.GetValue()) 
}
```
其中grpc.Dial负责和gRPC服务建立链接，然后NewHelloServiceClient函数基于已 经建立的链接构造HelloServiceClient对象。返回的client其实是一个 HelloServiceClient接口对象，通过接口定义的方法就可以调用服务端对应的gRPC 服务提供的方法。

gRPC和标准库的RPC框架有一个区别，gRPC生成的接口并不支持异步调用。不 过我们可以在多个Goroutine之间安全地共享gRPC底层的HTTP/2链接，因此可以 通过在另一个Goroutine阻塞调用的方式模拟异步调用。

### gRPC流
RPC是远程函数调用，因此每次调用的函数参数和返回值不能太大，否则将严重影 响每次调用的响应时间。因此传统的RPC方法调用对于上传和下载较大数据量场景 并不适合。同时传统RPC模式也不适用于对时间不确定的订阅和发布模式。为此， gRPC框架针对服务器端和客户端分别提供了流特性。服务端或客户端的单向流是双向流的特例，我们在HelloService增加一个支持双向 流的Channel方法：

```go
service HelloService { 
    rpc Hello (String) returns (String); 
    rpc Channel (stream String) returns (stream String); 
}
```
关键字stream指定启用流特性，参数部分是接收客户端参数的流，返回值是返回给 客户端的流。重新生成代码可以看到接口中新增加的Channel方法的定义：
```go
type HelloServiceServer interface { 
    Hello(context.Context, *String) (*String, error) 
    Channel(HelloService_ChannelServer) error 
}

type HelloServiceClient interface { 
    Hello(ctx context.Context, in *String, opts ...grpc.CallOpti on) ( *String, error, )
    Channel(ctx context.Context, opts ...grpc.CallOption) ( HelloService_ChannelClient, error, ) 
}
```
在服务端的Channel方法参数是一个新的HelloService_ChannelServer类型的参 数，可以用于和客户端双向通信。客户端的Channel方法返回一个 HelloService_ChannelClient类型的返回值，可以用于和服务端进行双向通信。

HelloService_ChannelServer和HelloService_ChannelClient均为接口类型：
```go
type HelloService_ChannelServer interface { 
    Send(*String) error 
    Recv() (*String, error) 
    grpc.ServerStream 
}

type HelloService_ChannelClient interface { 
    Send(*String) error 
    Recv() (*String, error) 
    grpc.ClientStream 
}
```
可以发现服务端和客户端的流辅助接口均定义了Send和Recv方法用于流数据的双 向通信。现在我们可以实现流服务：
```go
func (p *HelloServiceImpl) Channel(stream HelloService_ChannelSe rver) error { 
    for {
        args, err := stream.Recv() 
        if err != nil { 
            if err == io.EOF { 
                return nil 
            }
            return err
        }
        reply := &String{Value: "hello:" + args.GetValue()} 
        err = stream.Send(reply) 
        if err != nil { 
            return err 
        } 
    } 
}
```
服务端在循环中接收客户端发来的数据，如果遇到io.EOF表示客户端流被关闭，如 果函数退出表示服务端流关闭。生成返回的数据通过流发送给客户端，双向流数据 的发送和接收都是完全独立的行为。需要注意的是，发送和接收的操作并不需要一 一对应，用户可以根据真实场景进行组织代码。客户端需要先调用Channel方法获取返回的流对象：

```go
stream, err := client.Channel(context.Background())
 if err != nil { 
    log.Fatal(err) 
}
```
在客户端我们将发送和接收操作放到两个独立的Goroutine。首先是向服务端发送数 据：
```go
go func() { 
    for {
        if err := stream.Send(&String{Value: "hi"}); 
        err != nil { 
            log.Fatal(err) 
        }
        time.Sleep(time.Second) 
    } 
}()
```
然后在循环中接收服务端返回的数据：
```go
for {
    reply, err := stream.Recv() 
    if err != nil { 
        if err == io.EOF { 
            break 
        }
        log.Fatal(err) 
    }
    fmt.Println(reply.GetValue()) 
}
```
这样就完成了完整的流接收和发送支持。

###  发布和订阅模式
基于 Watch的思路虽然也可以构造发布和订阅系统，但是因为RPC缺乏流机制导致每次 只能返回一个结果。在发布和订阅模式中，由调用者主动发起的发布行为类似一个 普通函数调用，而被动的订阅者则类似gRPC客户端单向流中的接收者。现在我们 可以尝试基于gRPC的流特性构造一个发布和订阅系统。

发布订阅是一个常见的设计模式，开源社区中已经存在很多该模式的实现。其中 docker项目中提供了一个pubsub的极简实现，下面是基于pubsub包实现的本地发 布订阅代码：
```go
import ( 
    "github.com/moby/moby/pkg/pubsub" 
)
func main() { 
    p := pubsub.NewPublisher(100*time.Millisecond, 10) 
    golang := p.SubscribeTopic(func(v interface{}) bool { 
        if key, ok := v.(string); ok { 
            if strings.HasPrefix(key, "golang:") { 
                return true 
                } 
            }
            return false 
        })
    docker := p.SubscribeTopic(func(v interface{}) bool { 
        if key, ok := v.(string); ok { 
            if strings.HasPrefix(key, "docker:") { 
                return true 
            } 
        }
        return false
    })
    go p.Publish("hi") 
    go p.Publish("golang: https://golang.org") 
    go p.Publish("docker: https://www.docker.com/") 
    time.Sleep(1) 
    go func() { 
        fmt.Println("golang topic:", <-golang) 
    }() 
    go func() { 
        fmt.Println("docker topic:", <-docker) 
    }() 
    <-make(chan bool) 
}
```
其中 pubsub.NewPublisher 构造一个发布对象， p.SubscribeTopic() 可以通 过函数筛选感兴趣的主题进行订阅

现在尝试基于gRPC和pubsub包，提供一个跨网络的发布和订阅系统。首先通过 Protobuf定义一个发布订阅服务接口：
```go
service PubsubService { 
    rpc Publish (String) returns (String);
    rpc Subscribe (String) returns (stream String); 
}
```
其中Publish是普通的RPC方法，Subscribe则是一个单向的流服务。然后gRPC插 件会为服务端和客户端生成对应的接口：
```go
type PubsubServiceServer interface { 
    Publish(context.Context, *String) (*String, error) 
    Subscribe(*String, PubsubService_SubscribeServer) error 
}
    type PubsubServiceClient interface { 
        Publish(context.Context, *String, ...grpc.CallOption) (*Stri ng, error) 
        Subscribe(context.Context, *String, ...grpc.CallOption) ( PubsubService_SubscribeClient, error, ) 
    }
    type PubsubService_SubscribeServer interface { 
        Send(*String) error grpc.ServerStream 
    }
```
因为Subscribe是服务端的单向流，因此生成的HelloService_SubscribeServer接口 中只有Send方法。

然后就可以实现发布和订阅服务了：
```go
type PubsubService struct { pub *pubsub.Publisher }

func NewPubsubService() *PubsubService { 
    return &PubsubService{ 
        pub: pubsub.NewPublisher(100*time.Millisecond, 10), 
    } 
}
```
然后是实现发布方法和订阅方法：
```go
func (p *PubsubService) Publish( ctx context.Context, arg *String, ) (*String, error) { 
    p.pub.Publish(arg.GetValue()) 
    return &String{}, nil 
}

func (p *PubsubService) Subscribe( arg *String, stream PubsubService_SubscribeServer, ) error { 
    ch := p.pub.SubscribeTopic(func(v interface{}) bool { 
        if key, ok := v.(string); ok { 
            if strings.HasPrefix(key,arg.GetValue()) { 
                return true 
            } 
        return false 
    })
    for v := range ch { 
        if err := stream.Send(&String{Value: v.(string)});
         err ! = nil { return err } 
    }
    return nil 
}
```
这样就可以从客户端向服务器发布信息了：
```go
func main() { 
    conn, err := grpc.Dial("localhost:1234", grpc.WithInsecure() ) 
    if err != nil { log.Fatal(err) }
    defer conn.Close() 
    client := NewPubsubServiceClient(conn) 
    _, err = client.Publish( context.Background(), &String{Value: "golang: hello Go"} , )
    if err != nil { log.Fatal(err) }
    _, err = client.Publish( context.Background(), &String{Value: "docker: hello Dock er"},)
    if err != nil { log.Fatal(err) } 
}
```
然后就可以在另一个客户端进行订阅信息了：
```go
func main() { 
    conn, err := grpc.Dial("localhost:1234", grpc.WithInsecure() ) 
    if err != nil { log.Fatal(err) }
    defer conn.Close() 
    client := NewPubsubServiceClient(conn) 
    stream, err := client.Subscribe( context.Background(), &String{Value: "golang:"}, )
    if err != nil { log.Fatal(err) }
    for {
        reply, err := stream.Recv() 
        if err != nil { 
            if err == io.EOF { break }
            log.Fatal(err) 
        }
        fmt.Println(reply.GetValue()) 
    } 
}
```
到此我们就基于gRPC简单实现了一个跨网络的发布和订阅服务。

## gRPC进阶

### 证书认证
gRPC建立在HTTP/2协议之上，对TLS提供了很好的支持。没有启用证书的 gRPC服务在和客户端进行的是明文通讯，信息面临被任何第三方监听的风险。为 了保障gRPC通信不被第三方监听篡改或伪造，我们可以对服务器启动TLS加密特 性。可以用以下命令为服务器和客户端分别生成私钥和证书：
```bash
$ openssl genrsa -out server.key 2048 
$ openssl req -new -x509 -days 3650 \ -subj "/C=GB/L=China/O=grpc-server/CN=server.grpc.io" \ -key server.key -out server.crt 

$ openssl genrsa -out client.key 2048 
$ openssl req -new -x509 -days 3650 \ -subj "/C=GB/L=China/O=grpc-client/CN=client.grpc.io" \ -key client.key -out client.crt
```
以上命令将生成server.key、server.crt、client.key和client.crt四个文件。其中以.key 为后缀名的是私钥文件，需要妥善保管。以.crt为后缀名是证书文件，也可以简单理 解为公钥文件，并不需要秘密保存。在subj参数中的 /CN=server.grpc.io 表示 服务器的名字为 server.grpc.io ，在验证服务器的证书时需要用到该信息。 有了证书之后，我们就可以在启动gRPC服务时传入证书选项参数：
```go
func main() { 
    creds, err := credentials.NewServerTLSFromFile("server.crt", "server.key") 
    if err != nil { 
        log.Fatal(err) 
    }
    server := grpc.NewServer(grpc.Creds(creds)) ... 
}
```
其中credentials.NewServerTLSFromFile函数是从文件为服务器构造证书对象，然 后通过grpc.Creds(creds)函数将证书包装为选项后作为参数传入grpc.NewServer函数。

在客户端基于服务器的证书和服务器名字就可以对服务器进行验证：
```go
func main() { 
    creds, err := credentials.NewClientTLSFromFile( "server.crt", "server.grpc.io", )
    if err != nil { log.Fatal(err) }
    conn, err := grpc.Dial("localhost:5000", grpc.WithTransportCredentials(creds), )
    if err != nil { log.Fatal(err) }
    defer conn.Close() ... 
}
```
其中redentials.NewClientTLSFromFile是构造客户端用的证书对象，第一个参数是 服务器的证书文件，第二个参数是签发证书的服务器的名字。然后通过 grpc.WithTransportCredentials(creds)将证书对象转为参数选项传人grpc.Dial函 数。

以上这种方式，需要提前将服务器的证书告知客户端，这样客户端在链接服务器时 才能进行对服务器证书认证。在复杂的网络环境中，服务器证书的传输本身也是一 个非常危险的问题。如果在中间某个环节，服务器证书被监听或替换那么对服务器 的认证也将不再可靠。

为了避免证书的传递过程中被篡改，可以通过一个安全可靠的根证书分别对服务器 和客户端的证书进行签名。这样客户端或服务器在收到对方的证书后可以通过根证 书进行验证证书的有效性。
```bash
$ openssl genrsa -out ca.key 2048 
$ openssl req -new -x509 -days 3650 \ -subj "/C=GB/L=China/O=gobook/CN=github.com" \ -key ca.key -out ca.crt
```

然后是重新对服务器端证书进行签名：
```bash
$ openssl req -new \ -subj "/C=GB/L=China/O=server/CN=server.io" \ -key server.key \ -out server.csr 
$ openssl x509 -req -sha256 \ -CA ca.crt -CAkey ca.key -CAcreateserial -days 3650 \ -in server.csr \ -out server.crt
```
签名的过程中引入了一个新的以.csr为后缀名的文件，它表示证书签名请求文件。 在证书签名完成之后可以删除.csr文件。 然后在客户端就可以基于CA证书对服务器进行证书验证：

```go
func main() { 
    certificate, err := tls.LoadX509KeyPair("client.crt", "clien t.key") 
    if err != nil { log.Fatal(err) }
    certPool := x509.NewCertPool() 
    ca, err := ioutil.ReadFile("ca.crt") 
    if err != nil { log.Fatal(err) }
    if ok := certPool.AppendCertsFromPEM(ca); !ok { 
        log.Fatal("failed to append ca certs") 
    }
    creds := credentials.NewTLS(&tls.Config{ 
        Certificates: []tls.Certificate{certificate}, 
        ServerName: tlsServerName, 
        // NOTE: this is requ ired! 
        RootCAs: certPool, 
    })
    conn, err := grpc.Dial( "localhost:5000", grpc.WithTransportCredentials(creds), )
    if err != nil { log.Fatal(err) }
    defer conn.Close() ... 
}
```
在新的客户端代码中，我们不再直接依赖服务器端证书文件。在 credentials.NewTLS函数调用中，客户端通过引入一个CA根证书和服务器的名字来 实现对服务器进行验证。客户端在链接服务器时会首先请求服务器的证书，然后使 用CA根证书对收到的服务器端证书进行验证。

如果客户端的证书也采用CA根证书签名的话，服务器端也可以对客户端进行证书认 证。我们用CA根证书对客户端证书签名：
```bash
$ openssl req -new \ -subj "/C=GB/L=China/O=client/CN=client.io" \ -key client.key \ -out client.csr 
$ openssl x509 -req -sha256 \ -CA ca.crt -CAkey ca.key -CAcreateserial -days 3650 \ -in client.csr \ -out client.crt
```
因为引入了CA根证书签名，在启动服务器时同样要配置根证书：
```go
func main() { 
    certificate, err := tls.LoadX509KeyPair("server.crt", "serve r.key") 
    if err != nil { log.Fatal(err) }
    certPool := x509.NewCertPool() 
    ca, err := ioutil.ReadFile("ca.crt") 
    if err != nil { log.Fatal(err) }
    if ok := certPool.AppendCertsFromPEM(ca); !ok { log.Fatal("failed to append certs") }
    creds := credentials.NewTLS(&tls.Config{ 
        Certificates: []tls.Certificate{certificate}, 
        ClientAuth: tls.RequireAndVerifyClientCert, 
        // NOTE: t his is optional! 
        ClientCAs: certPool, 
    })
    server := grpc.NewServer(grpc.Creds(creds))
     ... 
}
```
服务器端同样改用credentials.NewTLS函数生成证书，通过ClientCAs选择CA根证 书，并通过ClientAuth选项启用对客户端进行验证。 到此我们就实现了一个服务器和客户端进行双向证书验证的通信可靠的gRPC系 统。


### Token认证
前面讲述的基于证书的认证是针对每个gRPC链接的认证。gRPC还为每个gRPC方 法调用提供了认证支持，这样就基于用户Token对不同的方法访问进行权限管理。要实现对每个gRPC方法进行认证，需要实现grpc.PerRPCCredentials接口：
```go
type PerRPCCredentials interface { 
    // GetRequestMetadata gets the current request metadata, ref reshing 
    // tokens if required. This should be called by the transpor t layer on 
    // each request, and the data should be populated in headers or other 
    // context. If a status code is returned, it will be used as the status 
    // for the RPC. uri is the URI of the entry point for the re quest.
    // When supported by the underlying implementation, ctx can be used for 
    // timeout and cancellation. 
    // TODO(zhaoq): Define the set of the qualified keys instead of leaving 
    // it as an arbitrary string. 
    GetRequestMetadata(ctx context.Context, uri ...string) ( map[string]string, error, )
    // RequireTransportSecurity indicates whether the credential s requires 
    // transport security. 
    RequireTransportSecurity() bool 
}
```
在GetRequestMetadata方法中返回认证需要的必要信息。 RequireTransportSecurity方法表示是否要求底层使用安全链接。在真实的环境中建 议必须要求底层启用安全的链接，否则认证信息有泄露和被篡改的风险。 我们可以创建一个Authentication类型，用于实现用户名和密码的认证：

```go
type Authentication struct { 
    User string 
    Password string 
}

func (a *Authentication) GetRequestMetadata(context.Context, ... string) ( map[string]string, error, ) { 
    return map[string]string{"user":a.User, "password": a.Passwo rd}, nil 
}

func (a *Authentication) RequireTransportSecurity() bool { 
    return false 
}
```
在GetRequestMetadata方法中，我们返回地认证信息包装login和password两个信 息。为了演示代码简单，RequireTransportSecurity方法表示不要求底层使用安全链 接。然后在每次请求gRPC服务时就可以将Token信息作为参数选项传人：
```go
func main() { 
    auth := Authentication{ Login: "gopher", Password: "password", }
    conn, err := grpc.Dial("localhost"+port, grpc.WithInsecure() , grpc.WithPerRPCCredentials(&auth)) 
    if err != nil { log.Fatal(err) }
    defer conn.Close() 
    ... 
}
```
通过grpc.WithPerRPCCredentials函数将Authentication对象转为grpc.Dial参数。因 为这里没有启用安全链接，需要传人grpc.WithInsecure()表示忽略证书认证。然后在gRPC服务端的每个方法中通过Authentication类型的Auth方法进行身份认 证：
```go
type grpcServer struct { 
    auth *Authentication 
} 

func (p *grpcServer) SomeMethod( ctx context.Context, in *HelloRequest, ) (*HelloReply, error) { 
    if err := p.auth.Auth(ctx); 
    err != nil { return nil, err }
    return &HelloReply{Message: "Hello " + in.Name}, nil 
}

func (a *Authentication) Auth(ctx context.Context) error {
    md, ok := metadata.FromIncomingContext(ctx) 
    if !ok { return fmt.Errorf("missing credentials") }
    var appid string
    var appkey string 
    if val, ok := md["login"]; ok { appid = val[0] } 
    if val, ok := md["password"]; ok { appkey = val[0] } 
    if appid != a.Login || appkey != a.Password { 
        return grpc.Errorf(codes.Unauthenticated, "invalid token" ) 
    }
    return nil 
}
```
详细地认证工作主要在Authentication.Auth方法中完成。首先通过 metadata.FromIncomingContext从ctx上下文中获取元信息，然后取出相应的认证 信息进行认证。如果认证失败，则返回一个codes.Unauthenticated类型地错误


### 截取器
gRPC中的grpc.UnaryInterceptor和grpc.StreamInterceptor分别对普通方法和流方 法提供了截取器的支持。我们这里简单介绍普通方法的截取器用法。要实现普通方法的截取器，需要为grpc.UnaryInterceptor的参数实现一个函数：
``` go
func filter(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler, ) (resp interface{}, err error) { 
    log.Println("fileter:", info) 
    return handler(ctx, req) 
}
```
函数的ctx和req参数就是每个普通的RPC方法的前两个参数。第三个info参数表示 当前是对应的那个gRPC方法，第四个handler参数对应当前的gRPC方法函数。上 面的函数中首先是日志输出info参数，然后调用handler对应的gRPC方法函数。要使用filter截取器函数，只需要在启动gRPC服务时作为参数输入即可：
```go
server := grpc.NewServer(grpc.UnaryInterceptor(filter))
```
然后服务器在收到每个gRPC方法调用之前，会首先输出一行日志，然后再调用对 方的方法。 如果截取器函数返回了错误，那么该次gRPC方法调用将被视作失败处理。因此， 我们可以在截取器中对输入的参数做一些简单的验证工作。同样，也可以对handler 返回的结果做一些验证工作。截取器也非常适合前面对Token认证工作。 下面是截取器增加了对gRPC方法异常的捕获：
```go
func filter( ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler, ) (resp interface{}, err error) { 
    log.Println("fileter:", info) 
    defer func() { 
        if r := recover(); r != nil { err = fmt.Errorf("panic: %v", r) } }() 
    return handler(ctx, req) 
}
```
不过gRPC框架中只能为每个服务设置一个截取器，因此所有的截取工作只能在一 个函数中完成。开源的grpc-ecosystem项目中的go-grpc-middleware包已经基于 gRPC对截取器实现了链式截取器的支持。以下是go-grpc-middleware包中链式截取器的简单用法
```go
import "github.com/grpc-ecosystem/go-grpc-middleware" 
myServer := grpc.NewServer( 
    grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer( filter1, filter2, ... )),
    grpc.StreamInterceptor(grpc_middleware.ChainStreamServer( filter1, filter2, ... )), 
)
```

### 和Web服务共存
gRPC构建在HTTP/2协议之上，因此我们可以将gRPC服务和普通的Web服务架设 在同一个端口之上。对于没有启动TLS协议的服务则需要对HTTP2/2特性做适当的调整：
```go
func main() { 
    mux := http.NewServeMux() 
    h2Handler := h2c.NewHandler(mux, &http2.Server{}) 
    server = &http.Server{Addr: ":3999", Handler: h2Handler} 
    server.ListenAndServe() 
}
```
启用普通的https服务器则非常简单：
```go
func main() { 
    mux := http.NewServeMux() 
    mux.HandleFunc("/", func(w http.ResponseWriter, req *http.Re quest) {fmt.Fprintln(w, "hello") })
    http.ListenAndServeTLS(port, "server.crt", "server.key", http.HandlerFunc(func(w http.ResponseWriter, r *http.Req uest) { 
        mux.ServeHTTP(w, r) return 
    }), ) 
}
```
而单独启用带证书的gRPC服务也是同样的简单：
```go
func main() { 
    creds, err := credentials.NewServerTLSFromFile("server.crt", "server.key") 
    if err != nil { log.Fatal(err) }
    grpcServer := grpc.NewServer(grpc.Creds(creds))
     ... 
}
```
因为gRPC服务已经实现了ServeHTTP方法，可以直接作为Web路由处理对象。如 果将gRPC和Web服务放在一起，会导致gRPC和Web路径的冲突，在处理时我们 需要区分两类服务。 我们可以通过以下方式生成同时支持Web和gRPC协议的路由处理函数：
```go
func main() { 
    ... 
    http.ListenAndServeTLS(port, "server.crt", "server.key", http.HandlerFunc(func(w http.ResponseWriter, r *http.Req uest) { 
        if r.ProtoMajor != 2 { 
            mux.ServeHTTP(w, r) 
            return 
        }
        if strings.Contains( r.Header.Get("Content-Type"), "application/grpc" , ) { 
            grpcServer.ServeHTTP(w, r) 
            // gRPC Server 
            return 
        }
        mux.ServeHTTP(w, r) 
        return 
    }), ) 
}
```
首先gRPC是建立在HTTP/2版本之上，如果HTTP不是HTTP/2协议则必然无法提供 gRPC支持。同时，每个gRPC调用请求的Content-Type类型会被标注 为"application/grpc"类型。 这样我们就可以在gRPC端口上同时提供Web服务了。

## gRPC和Protobuf扩展

### 验证器
到目前为止，我们接触的全部是第三版的Protobuf语法。第二版的Protobuf有个默 认值特性，可以为字符串或数值类型的成员定义默认值。我们采用第二版的Protobuf语法创建文件：
```go
syntax = "proto2"; 
package main; 
message Message { 
    optional string name = 1 [default = "gopher"]; 
    optional int32 age = 2 [default = 10]; 
}
```
内置的默认值语法其实是通过Protobuf的扩展选项特性实现。在第三版的Protobuf 中不再支持默认值特性，但是我们可以通过扩展选项自己模拟默认值特性。 下面是用proto3语法的扩展特性重新改写上述的proto文件：
```go
syntax = "proto3"; 
package main; 
import "google/protobuf/descriptor.proto"; 
extend google.protobuf.FieldOptions { 
    string default_string = 50000; 
    int32 default_int = 50001; 
}
message Message { 
    string name = 1 [(default_string) = "gopher"]; 
    int32 age = 2[(default_int) = 10]; 
}

```
其中成员后面的方括号内部的就是扩展语法。重新生成Go语言代码，里面会包含扩 展选项相关的元信息：
```go
var E_DefaultString = &proto.ExtensionDesc{ 
    ExtendedType: (*descriptor.FieldOptions)(nil), 
    ExtensionType: (*string)(nil), 
    Field: 50000, 
    Name: "main.default_string", 
    Tag: "bytes,50000,opt,name=default_string,json=def aultString", 
    Filename: "helloworld.proto", 
}
var E_DefaultInt = &proto.ExtensionDesc{ 
    ExtendedType: (*descriptor.FieldOptions)(nil), 
    ExtensionType: (*int32)(nil), 
    Field: 50001, 
    Name: "main.default_int", 
    Tag: "varint,50001,opt,name=default_int,json=defau ltInt", 
    Filename: "helloworld.proto", 
}
```
我们可以在运行时通过类似反射的技术解析出Message每个成员定义的扩展选项， 然后从每个扩展的相关联的信息中解析出我们定义的默认值。 在开源社区中，github.com/mwitkow/go-proto-validators 已经基于Protobuf的扩展 特性实现了功能较为强大的验证器功能。要使用该验证器首先需要下载其提供的代 码生成插件：
```bash
$ go get github.com/mwitkow/go-proto-validators/protoc-gen-goval idators
```
然后基于go-proto-validators验证器的规则为Message成员增加验证规则：
```go
syntax = "proto3"; 
package main; 
import "github.com/mwitkow/go-proto-validators/validator.proto"; 
message Message { 
    string important_string = 1 [ (validator.field) = {regex: "^[a-z]{2,5}$"} ];
    int32 age = 2 [ (validator.field) = {int_gt: 0, int_lt: 100} ]; 
}
```
在方括弧表示的成员扩展中，validator.field表示扩展是validator包中定义的名为 field扩展选项。validator.field的类型是FieldValidator结构体，在导入的 validator.proto文件中定义。所有的验证规则都由validator.proto文件中的FieldValidator定义：
```go
syntax = "proto2"; 
package validator; 
import "google/protobuf/descriptor.proto"; 
extend google.protobuf.FieldOptions { optional FieldValidator field = 65020; }
message FieldValidator { 
    // Uses a Golang RE2-syntax regex to match the field content s. 
    optional string regex = 1; 
    // Field value of integer strictly greater than this value. 
    optional int64 int_gt = 2; 
    // Field value of integer strictly smaller than this value. 
    optional int64 int_lt = 3; 
    // ... more ... 
}
```
从FieldValidator定义的注释中我们可以看到验证器扩展的一些语法：其中regex表 示用于字符串验证的正则表达式，int_gt和int_lt表示数值的范围。然后采用以下的命令生成验证函数代码： 
```bash
protoc \ --proto_path=${GOPATH}/src \ --proto_path=${GOPATH}/src/github.com/google/protobuf/src \ --proto_path=. \ --govalidators_out=. --go_out=plugins=grpc:.\ hello.proto
```
以上的命令会调用protoc-gen-govalidators程序，生成一个独立的名为 hello.validator.pb.go的文件：
```go
var _regex_Message_ImportantString = regexp.MustCompile("^[a-z]{ 2,5}$") 

func (this *Message) Validate() error { 
    if !_regex_Message_ImportantString.MatchString(this.Importan tString) {
        return go_proto_validators.FieldError("ImportantString", fmt.Errorf(`value '%v' must be a string conforming to regex "^[ a-z]{2,5}$"`,this.ImportantString, )) 
    }
    if !(this.Age > 0) { 
        return go_proto_validators.FieldError("Age", fmt.Errorf( `value '%v' must be greater than '0'`, this.Age, )) 
    }
    if !(this.Age < 100) { 
        return go_proto_validators.FieldError("Age", fmt.Errorf( `value '%v' must be less than '100'`, this.Age, )) 
    }
    return nil 
}
```
生成的代码为Message结构体增加了一个Validate方法，用于验证该成员是否满足 Protobuf中定义的条件约束。无论采用何种类型，所有的Validate方法都用相同的签 名，因此可以满足相同的验证接口。 通过生成的验证函数，并结合gRPC的截取器，我们可以很容易为每个方法的输入 参数和返回值进行验证。

### REST接口
gRPC服务一般用于集群内部通信，如果需要对外暴露服务一般会提供等价的REST 接口。通过REST接口比较方便前端JavaScript和后端交互。开源社区中的grpc- gateway项目就实现了将gRPC服务转为REST服务的能力。
!()[https://github.com/binarycoder777/personal-pic/blob/main/pic/image.png]
通过在Protobuf文件中添加路由相关的元信息，通过自定义的代码插件生成路由相 关的处理代码，最终将REST请求转给更后端的gRPC服务处理。 路由扩展元信息也是通过Protobuf的元数据扩展用法提供：

```go
syntax = "proto3";
package main; 
import "google/api/annotations.proto"; 
message StringMessage { string value = 1; }
service RestService { 
    rpc Get(StringMessage) 
    returns (StringMessage) { 
        option (google.api.http) = { get: "/get/{value}" }; 
    }
    rpc Post(StringMessage) 
    returns (StringMessage) { 
        option (google.api.http) = { post: "/post" body: "*" }; 
    } 
}
```
我们首先为gRPC定义了Get和Post方法，然后通过元扩展语法在对应的方法后添加 路由信息。其中“/get/{value}”路径对应的是Get方法， {value} 部分对应参数中的 value成员，结果通过json格式返回。Post方法对应“/post”路径，body中包含json格 式的请求信息。然后通过以下命令安装protoc-gen-grpc-gateway插件：
```bash
go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc -gateway
```
再通过插件生成grpc-gateway必须的路由处理代码：
```bash
$ protoc -I/usr/local/include -I. \ -I$GOPATH/src \ -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_p arty/googleapis \ --grpc-gateway_out=. --go_out=plugins=grpc:.\ hello.proto
```
插件会为RestService服务生成对应的RegisterRestServiceHandlerFromEndpoint函 数：
```go
func RegisterRestServiceHandlerFromEndpoint( ctx context.Context, mux *runtime.ServeMux, endpoint string, opts []grpc.DialOption, ) (err error) { ... }
```
RegisterRestServiceHandlerFromEndpoint函数用于将定义了Rest接口的请求转发 到真正的gRPC服务。注册路由处理函数之后就可以启动Web服务了：
```go
func main() { 
    ctx := context.Background() 
    ctx, cancel := context.WithCancel(ctx) 
    defer cancel() 
    mux := runtime.NewServeMux() 
    err := RegisterRestServiceHandlerFromEndpoint( ctx, mux, "localhost:5000", []grpc.DialOption{grpc.WithInsecure()}, )
    if err != nil { log.Fatal(err) }
    http.ListenAndServe(":8080", mux) 
}
```
启动grpc服务 ,端口5000

```go
type RestServiceImpl struct{} 

func (r *RestServiceImpl) Get(ctx context.Context, message *Stri ngMessage) (*StringMessage, error) { 
    return &StringMessage{Value: "Get hi:" + message.Value + "#" }, nil 
}

func (r *RestServiceImpl) Post(ctx context.Context, message *Str ingMessage) (*StringMessage, error) { 
    return &StringMessage{Value: "Post hi:" + message.Value + "@" }, nil 
}

func main() { 
    grpcServer := grpc.NewServer() 
    RegisterRestServiceServer(grpcServer, new(RestServiceImpl)) 
    lis, _ := net.Listen("tcp", ":5000") 
    grpcServer.Serve(lis) 
}
```
首先通过runtime.NewServeMux()函数创建路由处理器，然后通过 RegisterRestServiceHandlerFromEndpoint函数将RestService服务相关的REST接 口中转到后面的gRPC服务。grpc-gateway提供的runtime.ServeMux类也实现了 http.Handler接口，因此可以和标准库中的相关函数配合使用。当gRPC和REST服务全部启动之后，就可以用curl请求REST服务了：
```bash
$ curl localhost:8080/get/gopher {"value":"Get: gopher"} 
$ curl localhost:8080/post -X POST --data '{"value":"grpc"}' {"value":"Post: grpc"}
```
在对外公布REST接口时，我们一般还会提供一个Swagger格式的文件用于描述这 个接口规范。
```bash
$ go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-sw agger 
$ protoc -I. \ -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_par ty/googleapis \ --swagger_out=. \ hello.proto
```
然后会生成一个hello.swagger.json文件。这样的话就可以通过swagger-ui这个项 目，在网页中提供REST接口的文档和测试等功能。

###  Nginx
最新的Nginx对gRPC提供了深度支持。可以通过Nginx将后端多个gRPC服务聚合 到一个Nginx服务。同时Nginx也提供了为同一种gRPC服务注册多个后端的功能， 这样可以轻松实现gRPC负载均衡的支持。

##  pbgo: 基于Protobuf的框架

###  Protobuf扩展语法
目前Protobuf相关的很多开源项目都使用到了Protobuf的扩展语法。在grpc-gateway项目 中，则是通过为服务的每个方法增加Http相关的映射规则实现对Rest接口的支持。 pbgo也是通过Protobuf的扩展语法来为rest接口增加元信息。
```go
syntax = "proto3"; 

package pbgo; 

option go_package = "github.com/chai2010/pbgo;pbgo"; 

import "google/protobuf/descriptor.proto"; 

extend google.protobuf.MethodOptions { HttpRule rest_api = 20180715; }

message HttpRule { 
    string get = 1; 
    string put = 2; 
    string post = 3; 
    string delete = 4; 
    string patch = 5; 
}
```
pbgo.proto文件是pbgo框架的一个部分，需要被其他的proto文件导入。Protobuf本 身自有一套完整的包体系，在这里包的路径就是pbgo。Go语言也有自己的一套包 体系，我们需要通过go_package的扩展语法定义Protobuf和Go语言之间包的映射 关系。定义Protobuf和Go语言之间包的映射关系之后，其他导入pbgo.ptoto包的 Protobuf文件在生成Go语言时，会生成pbgo.proto映射的Go语言包路径。

Protobuf扩展语法有五种类型，分别是针对文件的扩展信息、针对message的扩展 信息、针对message成员的扩展信息、针对service的扩展信息和针对service方法的 扩展信息。在使用扩展前首先需要通过extend关键字定义扩展的类型和可以用于扩 展的成员。扩展成员可以是基础类型，也可以是一个结构体类型。pbgo中只定义了 service的方法的扩展，只定义了一个名为rest_api的扩展成员，类型是HttpRule结 构体。定义好扩展之后，我们就可以从其他的Protobuf文件中使用pbgo的扩展。创建一个 hello.proto文件：

```go
syntax = "proto3"; 

package hello_pb; 

import "github.com/chai2010/pbgo/pbgo.proto"; 

message String { string value = 1; }

service HelloService { rpc Hello (String) returns (String) { 
        option (pbgo.rest_api) = { 
            get: "/hello/:value" 
        }; 
    } 
}
```
首先我们通过导入 github.com/chai2010/pbgo/pbgo.proto 文件引入扩展定 义，然后在HelloService的Hello方法中使用了pbgo定义的扩展。Hello方法扩展的信 息表示该方法对应一个REST接口，只有一个GET方法对应"/hello/:value"路径。在 REST方法的路径中采用了httprouter路由包的语法规则，":value"表示路径中的该字 段对应的是参数中同名的成员。

### 插件中读取扩展信息
插件是一个generator.Plugin接口： 
```go
type Plugin interface { 
    // Name identifies the plugin. 
    Name() string 
    // Init is called once after data structures are built but b efore
    // code generation begins. 
    Init(g *Generator) 
    // Generate produces the code generated by the plugin for th is file, 
    // except for the imports, by calling the generator's method s P, In, 
    // and Out. 
    Generate(file *FileDescriptor) 
    // GenerateImports produces the import declarations for this file.
    // It is called after Generate. 
    GenerateImports(file *FileDescriptor) }
```
我们需要在Generate和GenerateImports函数中分别生成相关的代码。而Protobuf 文件的全部信息都在*generator.FileDescriptor类型函数参数中描述，因此我们需要 从函数参数中提前扩展定义的元数据。 pbgo框架中的插件对象是pbgoPlugin，在Generate方法中首先需要遍历Protobuf文 件中定义的全部服务，然后再遍历每个服务的每个方法。在得到方法结构之后再通 过自定义的getServiceMethodOption方法提取rest扩展信息：
```go
func (p *pbgoPlugin) Generate(file *generator.FileDescriptor) { 
    for _, svc := range file.Service { 
        for _, m := range svc.Method { 
            httpRule := p.getServiceMethodOption(m) ... 
        } 
    } 
}
```
在讲述getServiceMethodOption方法之前我们先回顾下方法扩展的定义： 
```go
extend google.protobuf.MethodOptions {
    HttpRule rest_api = 20180715; 
}
```
pbgo为服务的方法定义了一个rest_api名字的扩展，在最终生成的Go语言代码中会 包含一个pbgo.E_RestApi全局变量，通过该全局变量可以获取用户定义的扩展信 息。下面是getServiceMethodOption方法的实现：
```go
func (p *pbgoPlugin) getServiceMethodOption( m *descriptor.MethodDescriptorProto, ) *pbgo.HttpRule { 
    if m.Options != nil && proto.HasExtension(m.Options, pbgo.E_ RestApi) {
        ext, _ := proto.GetExtension(m.Options, pbgo.E_RestApi) 
        if ext != nil { 
            if x, _ := ext.(*pbgo.HttpRule); x != nil { 
                return x 
            } 
        } 
    }
    return nil 
}
```
首先通过proto.HasExtension函数判断每个方法是否定义了扩展，然后通过 proto.GetExtension函数获取用户定义的扩展信息。在获取到扩展信息之后，我们 再将扩展转型为pbgo.HttpRule类型。

### 生成REST代码
pbgo框架同时也提供了一个插件用于生成REST代码。不过我们的目的是学习pbgo 框架的设计过程，因此我们先尝试手写Hello方法对应的REST代码，然后插件再根 据手写的代码构造模板自动生成代码。

HelloService只有一个Hello方法，Hello方法只定义了一个GET方式的REST接口：
```go
message String { string value = 1; }

service HelloService { 
    rpc Hello (String) returns (String) { 
        option (pbgo.rest_api) = { 
            get: "/hello/:value" 
        }; 
    } 
}
```
为了方便最终的用户，我们需要为HelloService构造一个路由。因此我们希望有个 一个类似HelloServiceHandler的函数，可以基于HelloServiceInterface服务的接口 生成一个路由处理器：
```go
type HelloServiceInterface interface { 
    Hello(in *String, out *String) error 
}

func HelloServiceHandler(svc HelloServiceInterface) http.Handler { 
    var router = httprouter.New() 
    _handle_HelloService_Hello_get(router, svc) 
    return router 
}
```
代码中选择的是开源中比较流行的httprouter路由引擎。其中 _handle_HelloService_Hello_get函数用于将Hello方法注册到路由处理器：
```go
func _handle_HelloService_Hello_get(router * httprouter.Router, svc HelloServiceInterface, ) {
    router.Handle("GET", "/hello/:value", func(w http.ResponseWriter, r * http.Request, ps httprout er.Params) {
        var protoReq, protoReply String err: = pbgo.PopulateFieldFromPath( & protoReq, fieldPa th, ps.ByName("value")) if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest) return
        }
        if err: = svc.Hello( & protoReq, & protoReply);
        err != nil {
            http.Error(w, err.Error(), http.StatusInternalSe rverError) return
        }
        if err: = json.NewEncoder(w).Encode( & protoReply);
        er r != nil {
            http.Error(w, err.Error(), http.StatusInternalSe rverError) return
        }
    }, )
}
```
首先通过router.Handle方法注册路由函数。在路由函数内部首先通 过 ps.ByName("value") 从URL中加载value参数，然后通过 pbgo.PopulateFieldFromPath辅助函数设置value参数对应的成员。当输入参数准备 就绪之后就可以调用HelloService服务的Hello方法，最终将Hello方法返回的结果用 json编码返回。

### 启动REST服务
虽然从头构造pbgo框架的过程比较繁琐，但是使用pbgo构造REST服务却是异常简 单。首先要构造一个满足HelloServiceInterface接口的服务对象：
```go
import ("github.com/chai2010/pbgo/examples/hello.pb") type HelloService struct {}
func(p * HelloService) Hello(request * hello_pb.String, reply * he llo_pb.String) error {
    reply.Value = "hello:" + request.GetValue() return nil
}
```
和RPC代码一样，在Hello方法中简单返回结果。然后调用该服务对应的 HelloServiceHandler函数生成路由处理器，并启动服务：
```go
func main() { 
    router := hello_pb.HelloServiceHandler(new(HelloService)) 
    log.Fatal(http.ListenAndServe(":8080", router)) 
}
```
然后在命令行测试REST服务： 
```bash
$ curl localhost:8080/hello/vgo
```
这样一个超级简单的pbgo框架就完成了！


##  grpcurl工具
Protobuf本身具有反射功能，可以在运行时获取对象的Proto文件。gRPC同样也提 供了一个名为reflection的反射包，用于为gRPC服务提供查询。gRPC官方提供了一 个C++实现的grpc_cli工具，可以用于查询gRPC列表或调用gRPC方法。但是 C++版本的grpc_cli安装比较复杂，我们推荐用纯Go语言实现的grpcurl工具。

### 启动反射服务
reflection包中只有一个Register函数，用于将grpc.Server注册到反射服务中。 reflection包文档给出了简单的使用方法：
```go
import ("google.golang.org/grpc/reflection") 
func main() {
    s: = grpc.NewServer() 
    pb.RegisterYourOwnServer(s, & server {}) 
     // Register reflection service on gRPC server. 
    reflection.Register(s) s.Serve(lis) 
}
```
如果启动了gprc反射服务，那么就可以通过reflection包提供的反射服务查询gRPC 服务或调用gRPC方法。

### 查看服务列表
grpcurl是Go语言开源社区开发的工具，需要手工安装：
```bash
$ go get github.com/fullstorydev/grpcurl 
$ go install github.com/fullstorydev/grpcurl/cmd/grpcurl
```
grpcurl中最常使用的是list命令，用于获取服务或服务方法的列表。比如 grpcurl localhost:1234 list 命令将获取本地1234端口上的grpc服务的列表。在使用 grpcurl时，需要通过 -cert 和 -key 参数设置公钥和私钥文件，链接启用了tls协 议的服务。对于没有没用tls协议的grpc服务，通过 -plaintext 参数忽略tls证书的 验证过程。如果是Unix Socket协议，则需要指定 -unix 参数。

如果没有配置好公钥和私钥文件，也没有忽略证书的验证过程，那么将会遇到类似 以下的错误：
```bash
$ grpcurl localhost:1234 list 
Failed to dial target host "localhost:1234": tls: first record d oes not \ look like a TLS handshake
```
如果grpc服务正常，但是服务没有启动reflection反射服务，将会遇到以下错误：
```bash
$ grpcurl -plaintext localhost:1234 list 
Failed to list services: server does not support the reflection API
```
假设grpc服务已经启动了reflection反射服务，服务的Protobuf文件如下：
```go
syntax = "proto3";
package HelloService;
message String {
    string value = 1;
}
service HelloService {
    rpc Hello(String) returns(String);
    rpc Channel(stream String) returns(stream String);
}
```
grpcurl用list命令查看服务列表时将看到以下输出：
```bash
$ grpcurl -plaintext localhost:1234 list 
HelloService.HelloService 
grpc.reflection.v1alpha.ServerReflection
```
其中HelloService.HelloService是在protobuf文件定义的服务。而ServerReflection 服务则是reflection包注册的反射服务。通过ServerReflection服务可以查询包括本 身在内的全部gRPC服务信息。

###  服务的方法列表
继续使用list子命令还可以查看HelloService服务的方法列表：
```bash
$ grpcurl -plaintext localhost:1234 list HelloService.HelloServi 
ce
Channel 
Hello
```
从输出可以看到HelloService服务提供了Channel和Hello两个方法，和Protobuf文件 的定义是一致的。如果还想了解方法的细节，可以使用grpcurl提供的describe子命令查看更详细的描 述信息：
```bash
$ grpcurl -plaintext localhost:1234 describe HelloService.HelloS ervice
HelloService.HelloService is a service: 
{ 
    "name": "HelloService", 
    "method": [ 
        { 
            "name": "Hello", 
            "inputType": ".HelloService.String", 
            "outputType": ".HelloService.String", 
            "options": { } 
        },
        { 
            "name": "Channel", 
            "inputType": ".HelloService.String",
             "outputType": ".HelloService.String", 
             "options": { },
             "clientStreaming": true, 
             "serverStreaming": true 
             
        } 
    ],
    "options": { } 
}
```
输出列出了服务的每个方法，每个方法输入参数和返回值对应的类型。

###  获取类型信息
在获取到方法的参数和返回值类型之后，还可以继续查看类型的信息。下面是用 describe命令查看参数HelloService.String类型的信息：
```bash
$ grpcurl -plaintext localhost:1234 describe HelloService.String
HelloService.String is a message:
{ 
    "name": "String",
    "field": [
        { "name": "value", "number": 1, "label": "LABEL_OPTIONAL", "type": "TYPE_STRING", "options": { },"jsonName": "value" }
    ],
    "options": { } 
}
```
json信息对应HelloService.String类型在Protobuf中的定义如下： 
```go
message String { string value = 1; }
```
输出的json数据只不过是Protobuf文件的另一种表示形式。

### 调用方法
在获取gRPC服务的详细信息之后就可以json调用gRPC方法了。 下面命令通过 -d 参数传入一个json字符串作为输入参数，调用的是HelloService 服务的Hello方法：
```bash
$ grpcurl -plaintext -d '{"value": "gopher"}' \
grpcurl -plaintext -d '{"value": "gopher"}' \ localhost:1234 HelloService.HelloService/Hello
{ 
    "value": "hello:gopher" 
}
```
如果 -d 参数是 @ 则表示从标准输入读取json输入参数，这一般用于比较输入复 杂的json数据，也可以用于测试流方法。下面命令是链接Channel流方法，通过从标准输入读取输入流参数：
```bash
$ grpcurl -plaintext -d @ localhost:1234 HelloService.HelloService/Channel
{"value": "gopher"} 
{ "value": "hello:gopher" }
{"value": "wasm"}
{ "value": "hello:wasm" }
```
通过grpcurl工具，我们可以在没有客户端代码的环境下测试gRPC服务。
