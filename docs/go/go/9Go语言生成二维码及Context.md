# Go语言生成二维码及Context（上下文）

## 使用Go语言生成二维码图片
使用Go语言编程时，生成任意内容的二维码是非常方便的，因为我们有 go-qrcode 这个库。该库的源代码托管在 github 上，大家可以从 github 上（https://github.com/skip2/go-qrcode）下载并使用这个库。

go-qrcode 的使用很简单，假如要为我们的官网 http://c.biancheng.net/ 生成一张 256*256 的图片，可以使用如下代码：
```go
package main

import "github.com/skip2/go-qrcode"

func main() {
    qrcode.WriteFile("http://c.biancheng.net/",qrcode.Medium,256,"./golang_qrcode.png")
}
```
```
func WriteFile(content string, level RecoveryLevel, size int, filename string) error
```
WriteFile 函数的原型定义如上，它有几个参数，大概意思如下：
* content 表示要生成二维码的内容，可以是任意字符串；
* level 表示二维码的容错级别，取值有 Low、Medium、High、Highest；
* size 表示生成图片的 width 和 height，像素单位；
* filename 表示生成的文件名路径；
* RecoveryLevel 类型其实是个 int，它的定义和常量如下：
```go
type RecoveryLevel int

const (
    // Level L: 7% error recovery.
    Low RecoveryLevel = iota

    // Level M: 15% error recovery. Good default choice.
    Medium

    // Level Q: 25% error recovery.
    High

    // Level H: 30% error recovery.
    Highest
)
```
RecoveryLevel 越高，二维码的容错能力越好。
## 生成二维码图片字节
有时候我们不想直接生成一个 PNG 文件存储，我们想对 PNG 图片做一些处理，比如缩放了，旋转了，或者网络传输了等，基于此，我们可以使用 Encode 函数，生成一个 PNG 图片的字节流，这样我们就可以进行各种处理了。
```
func Encode(content string, level RecoveryLevel, size int) (\[\]byte, error)
```
用法和 WriteFile 函数差不多，只不过返回的是一个 []byte 字节数组，这样我们就可以对这个字节数组进行处理了。
## 自定义二维码
go-qrcode 库还为我们提供了对二维码的自定义方式，比如我们可以自定义二维码的前景色和背景色等。qrcode.New 函数可以返回一个 *QRCode，我们可以对 *QRCode 设置，实现对二维码的自定义。

比如我们设置背景色为绿色，前景色为白色的二维码
```go
package main

import(
    "github.com/skip2/go-qrcode"
    "image/color"
    "log"
)
func main() {
    qr,err:=qrcode.New("http://c.biancheng.net/",qrcode.Medium)
    if err != nil {
        log.Fatal(err)
    } else {
        qr.BackgroundColor = color.RGBA{50,205,50,255}
        qr.ForegroundColor = color.White
        qr.WriteFile(256,"./golang_qrcode.png")
    }
}
```
```go
func New(content string, level RecoveryLevel) (*QRCode, error)

// A QRCode represents a valid encoded QRCode.
type QRCode struct {
    // Original content encoded.
    Content string

    // QR Code type.
    Level         RecoveryLevel
    VersionNumber int

    // User settable drawing options.
    ForegroundColor color.Color
    BackgroundColor color.Color
}
```
## Go语言Context（上下文）
Context 在 Go1.7 之后就加入到了Go语言标准库中，准确说它是 Goroutine 的上下文，包含 Goroutine 的运行状态、环境、现场等信息。

随着 Context 包的引入，标准库中很多接口因此加上了 Context 参数，例如 database/sql 包，Context 几乎成为了并发控制和超时控制的标准做法。
### 什么是 Context
Context 也叫作“上下文”，是一个比较抽象的概念，一般理解为程序单元的一个运行状态、现场、快照。其中上下是指存在上下层的传递，上会把内容传递给下，程序单元则指的是 Goroutine。

每个 Goroutine 在执行之前，都要先知道程序当前的执行状态，通常将这些执行状态封装在一个 Context 变量中，传递给要执行的 Goroutine 中。

在网络编程下，当接收到一个网络请求 Request，在处理 Request 时，我们可能需要开启不同的 Goroutine 来获取数据与逻辑处理，即一个请求 Request，会在多个 Goroutine 中处理。而这些 Goroutine 可能需要共享 Request 的一些信息，同时当 Request 被取消或者超时的时候，所有从这个 Request 创建的所有 Goroutine 也应该被结束。
### Context 接口
Context 包的核心就是 Context 接口，其定义如下：
```go
type Context interface {
    Deadline() (deadline time.Time, ok bool)
    Done() <-chan struct{}
    Err() error
    Value(key interface{}) interface{}
}
```
其中：
* Deadline 方法需要返回当前 Context 被取消的时间，也就是完成工作的截止时间（deadline）；
* Done 方法需要返回一个 Channel，这个 Channel 会在当前工作完成或者上下文被取消之后关闭，多次调用 Done 方法会返回同一个Channel；
* Err 方法会返回当前 Context 结束的原因，它只会在 Done 返回的 Channel 被关闭时才会返回非空的值：
* 如果当前 Context 被取消就会返回 Canceled 错误；
* 如果当前 Context 超时就会返回 DeadlineExceeded 错误；
* Value 方法会从 Context 中返回键对应的值，对于同一个上下文来说，多次调用 Value 并传入相同的 Key 会返回相同的结果，该方法仅用于传递跨 API 和进程间跟请求域的数据。
### Background()和TODO()
Go语言内置两个函数：Background() 和 TODO()，这两个函数分别返回一个实现了 Context 接口的 background 和 todo。

Background() 主要用于 main 函数、初始化以及测试代码中，作为 Context 这个树结构的最顶层的 Context，也就是根 Context。

TODO()，它目前还不知道具体的使用场景，在不知道该使用什么 Context 的时候，可以使用这个。

background 和 todo 本质上都是 emptyCtx 结构体类型，是一个不可取消，没有设置截止时间，没有携带任何值的 Context。

上面的两种方式是创建根context，不具备任何功能，具体实践还是要依靠context包提供的With系列函数来进行派生：
### WithCancel
```
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)
```
WithCancel 返回带有新 Done 通道的父节点的副本，当调用返回的 cancel 函数或当关闭父上下文的 Done 通道时，将关闭返回上下文的 Done 通道，无论先发生什么情况。

取消此上下文将释放与其关联的资源，因此代码应该在此上下文中运行的操作完成后立即调用 cancel，示例代码如下：
```go
package main

import (
    "context"
    "fmt"
)

func main() {
    gen := func(ctx context.Context) <-chan int {
        dst := make(chan int)
        n := 1
        go func() {
            for {
                select {
                case <-ctx.Done():
                    return // return结束该goroutine，防止泄露
                case dst <- n:
                    n++
                }
            }
        }()
        return dst
    }

    ctx, cancel := context.WithCancel(context.Background())
    defer cancel() // 当我们取完需要的整数后调用cancel

    for n := range gen(ctx) {
        fmt.Println(n)
        if n == 5 {
            break
        }
    }
}
```
上面的代码中，gen 函数在单独的 Goroutine 中生成整数并将它们发送到返回的通道，gen 的调用者在使用生成的整数之后需要取消上下文，以免 gen 启动的内部 Goroutine 发生泄漏。
```
go run main.go
1
2
3
4
5
```
### WithDeadline
```
func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc)
```
WithDeadline 函数会返回父上下文的副本，并将 deadline 调整为不迟于 d。如果父上下文的 deadline 已经早于 d，则 WithDeadline(parent, d) 在语义上等同于父上下文。当截止日过期时，当调用返回的 cancel 函数时，或者当父上下文的 Done 通道关闭时，返回上下文的 Done 通道将被关闭，以最先发生的情况为准。

取消此上下文将释放与其关联的资源，因此代码应该在此上下文中运行的操作完成后立即调用 cancel，示例代码如下：
```go
package main

import (
    "context"
    "fmt"
    "time"
)

func main() {
    d := time.Now().Add(50 * time.Millisecond)
    ctx, cancel := context.WithDeadline(context.Background(), d)

    // 尽管ctx会过期，但在任何情况下调用它的cancel函数都是很好的实践。
    // 如果不这样做，可能会使上下文及其父类存活的时间超过必要的时间。
    defer cancel()

    select {
    case <-time.After(1 * time.Second):
        fmt.Println("overslept")
    case <-ctx.Done():
        fmt.Println(ctx.Err())
    }
}
```
运行结果如下：
```
go run main.go
context deadline exceeded
```
上面的代码中，定义了一个 50 毫秒之后过期的 deadline，然后我们调用 context.WithDeadline(context.Background(), d) 得到一个上下文（ctx）和一个取消函数（cancel），然后使用一个 select 让主程序陷入等待，等待 1 秒后打印 overslept 退出或者等待 ctx 过期后退出。因为 ctx 50 毫秒后就过期，所以 ctx.Done() 会先接收到值，然后打印 ctx.Err() 取消原因。
### WithTimeout
```
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)
```
WithTimeout 函数返回 WithDeadline(parent, time.Now().Add(timeout))。

取消此上下文将释放与其相关的资源，因此代码应该在此上下文中运行的操作完成后立即调用 cancel，示例代码如下：
```go
package main

import (
    "context"
    "fmt"
    "time"
)

func main() {
    // 传递带有超时的上下文
    // 告诉阻塞函数在超时结束后应该放弃其工作。
    ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
    defer cancel()

    select {
    case <-time.After(1 * time.Second):
        fmt.Println("overslept")
    case <-ctx.Done():
        fmt.Println(ctx.Err()) // 终端输出"context deadline exceeded"
    }
}
```
运行结果如下：
```
go run main.go
context deadline exceeded
```
### WithValue
WithValue 函数能够将请求作用域的数据与 Context 对象建立关系。函数声明如下：
```
func WithValue(parent Context, key, val interface{}) Context
```
WithValue 函数接收 context 并返回派生的 context，其中值 val 与 key 关联，并通过 context 树与 context 一起传递。这意味着一旦获得带有值的 context，从中派生的任何 context 都会获得此值。不建议使用 context 值传递关键参数，函数应接收签名中的那些值，使其显式化。

所提供的键必须是可比较的，并且不应该是 string 类型或任何其他内置类型，以避免使用上下文在包之间发生冲突。WithValue 的用户应该为键定义自己的类型，为了避免在分配给接口{ }时进行分配，上下文键通常具有具体类型 struct{}。或者，导出的上下文关键变量的静态类型应该是指针或接口。
```go
package main

import (
    "context"
    "fmt"
)

func main() {
    type favContextKey string // 定义一个key类型
    // f:一个从上下文中根据key取value的函数
    f := func(ctx context.Context, k favContextKey) {
        if v := ctx.Value(k); v != nil {
            fmt.Println("found value:", v)
            return
        }
        fmt.Println("key not found:", k)
    }
    k := favContextKey("language")
    // 创建一个携带key为k，value为"Go"的上下文
    ctx := context.WithValue(context.Background(), k, "Go")

    f(ctx, k)
    f(ctx, favContextKey("color"))
}
```
运行结果如下：
```
go run main.go
found value: Go
key not found: color
```
使用 Context 的注意事项：
* 不要把 Context 放在结构体中，要以参数的方式显示传递；
* 以 Context 作为参数的函数方法，应该把 Context 作为第一个参数；
* 给一个函数方法传递 Context 的时候，不要传递 nil，如果不知道传递什么，就使用 context.TODO；
* Context 的 Value 相关方法应该传递请求域的必要数据，不应该用于传递可选参数；
* Context 是线程安全的，可以放心的在多个 Goroutine 中传递。

Go语言中的 Context 的主要作用还是在多个 Goroutine 或者模块之间同步取消信号或者截止日期，用于减少对资源的消耗和长时间占用，避免资源浪费，虽然传值也是它的功能之一，但是这个功能我们还是很少用到。

在真正使用传值的功能时我们也应该非常谨慎，不能将请求的所有参数都使用 Context 进行传递，这是一种非常差的设计，比较常见的使用场景是传递请求对应用户的认证令牌以及用于进行分布式追踪的请求 ID。
