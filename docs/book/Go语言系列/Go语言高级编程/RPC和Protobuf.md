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








