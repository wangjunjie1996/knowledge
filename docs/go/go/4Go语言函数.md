# Ｇo语言函数

## Go语言函数声明

Go语言里面拥三种类型的函数：

* 普通的带有名字的函数
* 匿名函数或者 lambda 函数
* 方法

### 普通函数声明（定义）

函数声明包括函数名、形式参数列表、返回值列表（可省略）以及函数体。

```go
func 函数名(形式参数列表)(返回值列表){
    函数体
}

func hypot(x, y float64) float64 {
    return math.Sqrt(x*x + y*y)
}
fmt.Println(hypot(3,4)) // "5"
```

如果一个函数在声明时，包含返回值列表，那么该函数必须以 return 语句结尾
如果一组形参或返回值有相同的类型，我们不必为每个形参都写出参数类型，下面 2 个声明是等价的：

```go
func f(i, j, k int, s, t string) { /* ... */ }
func f(i int, j int, k int, s string, t string) { /* ... */ }
```

### 函数的返回值

Go语言支持多返回值，多返回值能方便地获得函数执行后的多个返回参数，Go语言经常使用多返回值中的最后一个返回参数返回函数执行中可能发生的错误，示例代码如下：

```
conn, err := connectToNetwork()
```

1) 同一种类型返回值
如果返回值是同一种类型，则用括号将多个返回值类型括起来，用逗号分隔每个返回值的类型。
使用 return 语句返回时，值列表的顺序需要与函数声明的返回值类型一致，示例代码如下：

```go
func typedTwoValues() (int, int) {
    return 1, 2
}
func main() {
    a, b := typedTwoValues()
    fmt.Println(a, b)
}
```

纯类型的返回值对于代码可读性不是很友好，特别是在同类型的返回值出现时，无法区分每个返回参数的意义。
2) 带有变量名的返回值
Go语言支持对返回值进行命名，这样返回值就和参数一样拥有参数变量名和类型。
命名的返回值变量的默认值为类型的默认值，即数值为 0，字符串为空字符串，布尔为 false、指针为 nil 等。

```go
func namedRetValues() (a, b int) {
    a = 1
    b = 2
    return
}
// 当函数使用命名返回值时，可以在 return 中不填写返回值列表，如果填写也是可行的, 如下
func namedRetValues() (a, b int) {
    a = 1
    return a, 2
}
```

同一种类型返回值和命名返回值两种形式只能二选一，混用时将会发生编译错误，例如下面的代码：

```
func namedRetValues() (a, b int, int)
```

编译报错提示：

```
mixed named and unnamed function parameters
```

意思是：在函数参数中混合使用了命名和非命名参数。

## Go语言函数变量

在Go语言中，函数也是一种类型，可以和其他类型一样保存在变量中，下面的代码定义了一个函数变量 f，并将一个函数名为 fire() 的函数赋给函数变量 f，这样调用函数变量 f 时，实际调用的就是 fire() 函数，代码如下：

```go
package main

import (
    "fmt"
)

func fire() {
    fmt.Println("fire")
}

func main() {
    var f func()
    f = fire
    f()
}
```

## Go语言字符串的链式处理

完整代码：

```go
package main

import (
    "fmt"
    "strings"
)

// 字符串处理函数，传入字符串切片和处理链
func StringProccess(list []string, chain []func(string) string) {
    // 遍历每一个字符串
    for index, str := range list {
        // 第一个需要处理的字符串
        result := str
        // 遍历每一个处理链
        for _, proc := range chain {

            // 输入一个字符串进行处理，返回数据作为下一个处理链的输入。
            result = proc(result)
        }
        // 将结果放回切片
        list[index] = result
    }
}

// 自定义的移除前缀的处理函数
func removePrefix(str string) string {

    return strings.TrimPrefix(str, "go")
}

func main() {
    // 待处理的字符串列表
    list := []string{
        "go scanner",
        "go parser",
        "go compiler",
        "go printer",
        "go formater",
    }
    // 处理函数链
    chain := []func(string) string{
        removePrefix,
        strings.TrimSpace,
        strings.ToUpper,
    }
    // 处理字符串
    StringProccess(list, chain)
    // 输出处理好的字符串
    for _, str := range list {
        fmt.Println(str)
    }
}
```

## Go语言匿名函数

Go语言支持匿名函数，即在需要使用函数时再定义函数，匿名函数没有函数名只有函数体，函数可以作为一种类型被赋值给函数类型的变量，匿名函数也往往以变量方式传递，这与C语言的回调函数比较类似，不同的是，Go语言支持随时在代码里定义匿名函数。

### 定义一个匿名函数

```go
func(参数列表)(返回参数列表){
    函数体
}
```

1) 在定义时调用匿名函数

```go
// 匿名函数可以在声明后调用，例如：
func(data int) {
    fmt.Println("hello", data)
}(100)
// 注意第3行}后的(100)，表示对匿名函数进行调用，传递参数为 100。
```

2) 将匿名函数赋值给变量

```go
// 匿名函数可以被赋值，例如：
// 将匿名函数体保存到f()中
f := func(data int) {
    fmt.Println("hello", data)
}

// 使用f()调用
f(100)
```

匿名函数的用途非常广泛，它本身就是一种值，可以方便地保存在各种容器中实现回调函数和操作封装。

### 匿名函数用作回调函数

下面的代码实现对切片的遍历操作，遍历中访问每个元素的操作使用匿名函数来实现，用户传入不同的匿名函数体可以实现对元素不同的遍历操作，代码如下：

```go
package main

import (
    "fmt"
)

// 遍历切片的每个元素, 通过给定函数进行元素访问
func visit(list []int, f func(int)) {

    for _, v := range list {
        f(v)
    }
}

func main() {

    // 使用匿名函数打印切片内容
    visit([]int{1, 2, 3, 4}, func(v int) {
        fmt.Println(v)
    })
}
```

## go 语言接口

Go 语言提供了另外一种数据类型即接口，它把所有的具有共性的方法定义在一起，任何其他类型只要实现了这些方法就是实现了这个接口。

```go
/* 定义接口 */
type interface_name interface {
   method_name1 [return_type]
   method_name2 [return_type]
   method_name3 [return_type]
   ...
   method_namen [return_type]
}
/* 定义结构体 */
type struct_name struct {
   /* variables */
}

/* 实现接口方法 */
func (struct_name_variable struct_name) method_name1() [return_type] {
   /* 方法实现 */
}
...
func (struct_name_variable struct_name) method_namen() [return_type] {
   /* 方法实现*/
}
```

示例

```go
package main

import (
    "fmt"
)

type Phone interface {
    call()
}

type NokiaPhone struct {
}

func (nokiaPhone NokiaPhone) call() {
    fmt.Println("I am Nokia, I can call you!")
}

type IPhone struct {
}

func (iPhone IPhone) call() {
    fmt.Println("I am iPhone, I can call you!")
}

func main() {
    var phone Phone

    phone = new(NokiaPhone)
    phone.call()

    phone = new(IPhone)
    phone.call()

}
```

在上面的例子中，我们定义了一个接口Phone，接口里面有一个方法call()。然后我们在main函数里面定义了一个Phone类型变量，并分别为之赋值为NokiaPhone和IPhone。然后调用call()方法，输出结果如下：

```
I am Nokia, I can call you!
I am iPhone, I can call you!
```

## Go语言闭包（Closure）

Go语言中闭包是引用了自由变量的函数，被引用的自由变量和函数一同存在，即使已经离开了自由变量的环境也不会被释放或者删除，在闭包中可以继续使用这个自由变量，因此，简单的说：

```
函数 + 引用环境 = 闭包
```

### 在闭包内部修改引用的变量

```go
// 准备一个字符串
str := "hello world"

// 创建一个匿名函数
foo := func() {

    // 匿名函数中访问str
    str = "hello dude" // 在匿名函数中并没有定义 str，str 的定义在匿名函数之前，此时，str 就被引用到了匿名函数中形成了闭包。
}

// 调用匿名函数
foo() // 执行闭包，此时 str 发生修改，变为 hello dude。
```

### 示例：闭包的记忆效应

被捕获到闭包中的变量让闭包本身拥有了记忆效应，闭包中的逻辑可以修改闭包捕获的变量，变量会跟随闭包生命期一直存在，闭包本身就如同变量一样拥有了记忆效应。
累加器的实现：

```go
package main

import (
    "fmt"
)

// 提供一个值, 每次调用函数会指定对值进行累加
func Accumulate(value int) func() int {
    // 返回一个闭包
    return func() int {
        // 累加
        value++
        // 返回一个累加值
        return value
    }
}

func main() {
    // 创建一个累加器, 初始值为1
    accumulator := Accumulate(1)
    // 累加1并打印
    fmt.Println(accumulator())
    fmt.Println(accumulator())
    // 打印累加器的函数地址
    fmt.Printf("%p\n", &accumulator)

    // 创建一个累加器, 初始值为1
    accumulator2 := Accumulate(10)
    // 累加1并打印
    fmt.Println(accumulator2())
    // 打印累加器的函数地址
    fmt.Printf("%p\n", &accumulator2)
}
```

### 示例：闭包实现生成器

闭包的记忆效应被用于实现类似于设计模式中工厂模式的生成器，下面的例子展示了创建一个玩家生成器的过程。

玩家生成器的实现：

```go
package main

import (
    "fmt"
)

// 创建一个玩家生成器, 输入名称, 输出生成器
func playerGen(name string) func() (string, int) {

    // 血量一直为150
    hp := 150

    // 返回创建的闭包
    return func() (string, int) {

        // 将变量引用到闭包中
        return name, hp
    }
}

func main() {

    // 创建一个玩家生成器
    generator := playerGen("high noon")

    // 返回玩家的名字和血量
    name, hp := generator()

    // 打印值
    fmt.Println(name, hp)
}
// high noon 150
```

闭包还具有一定的封装性，第 11 行的变量是 playerGen 的局部变量，playerGen 的外部无法直接访问及修改这个变量，这种特性也与面向对象中强调的封装性类似。

## Go语言可变参数（变参函数）

### 可变参数类型

可变参数是指函数传入的参数个数是可变的，为了做到这点，首先需要将函数定义为可以接受可变参数的类型：

```go
func myfunc(args ...int) {
    for _, arg := range args {
        fmt.Println(arg)
    }
}
```

上面这段代码的意思是，函数 myfunc() 接受不定数量的参数，这些参数的类型全部是 int，所以它可以用如下方式调用：

```go
myfunc(2, 3, 4)  
myfunc(1, 3, 7, 13)
```

形如...type格式的类型只能作为函数的参数类型存在，并且必须是最后一个参数，它是一个语法糖（syntactic sugar），即这种语法对语言的功能并没有影响，但是更方便程序员使用，通常来说，使用语法糖能够增加程序的可读性，从而减少程序出错的可能。  
从内部实现机理上来说，类型...type本质上是一个数组切片，也就是[]type，这也是为什么上面的参数 args 可以用 for 循环来获得每个传入的参数。  

### 任意类型的可变参数

之前的例子中将可变参数类型约束为 int，如果你希望传任意类型，可以指定类型为 interface{}，下面是Go语言标准库中 fmt.Printf() 的函数原型：

```go
func Printf(format string, args ...interface{}) {  
    // ...  
}
```

用 interface{} 传递任意类型数据是Go语言的惯例用法，使用 interface{} 仍然是类型安全的，这和 C/C++不太一样，下面通过示例来了解一下如何分配传入 interface{} 类型的数据。

```go
package main
import "fmt"
func MyPrintf(args ...interface{}) {
    for _, arg := range args {
        switch arg.(type) {
            case int:
                fmt.Println(arg, "is an int value.")
            case string:
                fmt.Println(arg, "is a string value.")
            case int64:
                fmt.Println(arg, "is an int64 value.")
            default:
                fmt.Println(arg, "is an unknown type.")
        }
    }
}
func main() {
    var v1 int = 1
    var v2 int64 = 234
    var v3 string = "hello"
    var v4 float32 = 1.234
    MyPrintf(v1, v2, v3, v4)
}
```

## Go语言defer（延迟执行语句）

Go语言的 defer 语句会将其后面跟随的语句进行延迟处理，在 defer 归属的函数即将返回时，将延迟处理的语句按 defer 的逆序进行执行，也就是说，先被 defer 的语句最后被执行，最后被 defer 的语句，最先被执行。  
关键字 defer 的用法类似于面向对象编程语言Java和C#的 finally 语句块，它一般用于释放某些已分配的资源，典型的例子就是对一个互斥解锁，或者关闭一个文件。  
当有多个 defer 行为被注册时，它们会以逆序执行（类似栈，即后进先出）  

### 使用延迟执行语句在函数退出时释放资源

1) 使用延迟并发解锁  

```go
func readValue(key string) int {
    valueByKeyGuard.Lock()
    // defer后面的语句不会马上调用, 而是延迟到函数结束时调用
    defer valueByKeyGuard.Unlock()
    return valueByKey[key]
}
```

2) 使用延迟释放文件句柄  

```go
// 根据文件名查询其大小
func fileSize(filename string) int64 {
    // 根据文件名打开文件, 返回文件句柄和错误
    f, err := os.Open(filename)
    // 如果打开时发生错误, 返回文件大小为0
    if err != nil {
        return 0
    }
    // 取文件状态信息
    info, err := f.Stat()

    // 如果获取信息时发生错误, 关闭文件并返回文件大小为0
    if err != nil {
        f.Close()
        return 0
    }
    // 取文件大小
    size := info.Size()
    // 关闭文件
    f.Close()
    // 返回文件大小
    return size
}
```

在上面的例子中，第 25 行是对文件的关闭操作，下面使用 defer 对代码进行简化，代码如下：

```go
func fileSize(filename string) int64 {

    f, err := os.Open(filename)

    if err != nil {
        return 0
    }

    // 延迟调用Close, 此时Close不会被调用
    defer f.Close()

    info, err := f.Stat()

    if err != nil {
        // defer机制触发, 调用Close关闭文件
        return 0
    }

    size := info.Size()

    // defer机制触发, 调用Close关闭文件
    return size
}
```

## Go语言处理运行时错误

Go语言的错误处理思想及设计包含以下特征：  

* 一个可能造成错误的函数，需要返回值中返回一个错误接口（error），如果调用是成功的，错误接口将返回 nil，否则返回错误。
* 在函数调用后需要检查错误，如果发生错误，则进行必要的错误处理。
Go语言没有类似Java或 .NET 中的异常处理机制，虽然可以使用 defer、panic、recover 模拟，但官方并不主张这样做，Go语言的设计者认为其他语言的异常机制已被过度使用，上层逻辑需要为函数发生的异常付出太多的资源，同时，如果函数使用者觉得错误处理很麻烦而忽略错误，那么程序将在不可预知的时刻崩溃。  
Go语言希望开发者将错误处理视为正常开发必须实现的环节，正确地处理每一个可能发生错误的函数，同时，Go语言使用返回值返回错误的机制，也能大幅降低编译器、运行时处理错误的复杂度，让开发者真正地掌握错误的处理。  

### net 包中的例子

net.Dial() 是Go语言系统包 net 即中的一个函数，一般用于创建一个 Socket 连接。  
net.Dial 拥有两个返回值，即 Conn 和 error，这个函数是阻塞的，因此在 Socket 操作后，会返回 Conn 连接对象和 error，如果发生错误，error 会告知错误的类型，Conn 会返回空。  
根据Go语言的错误处理机制，Conn 是其重要的返回值，因此，为这个函数增加一个错误返回，类似为 error，参见下面的代码：  

```go
func Dial(network, address string) (Conn, error) {
    var d Dialer
    return d.Dial(network, address)
}
```

在 io 包中的 Writer 接口也拥有错误返回，代码如下：

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}
```

io 包中还有 Closer 接口，只有一个错误返回，代码如下：

```go
type Closer interface {
    Close() error
}
```

### 错误接口的定义格式  

error 是 Go 系统声明的接口类型，代码如下：  

```go
type error interface {
    Error() string
}
```

所有符合 Error()string 格式的方法，都能实现错误接口，Error() 方法返回错误的具体描述，使用者可以通过这个字符串知道发生了什么错误。

### 自定义一个错误

返回错误前，需要定义会产生哪些可能的错误，在Go语言中，使用 errors 包进行错误的定义，格式如下：  

```go
var err = errors.New("this is an error")
```

错误字符串由于相对固定，一般在包作用域声明，应尽量减少在使用时直接使用 errors.New 返回。

1) errors 包  
Go语言的 errors 中对 New 的定义非常简单，代码如下：  

```go
// 创建错误对象
func New(text string) error {
    return &errorString{text}
}

// 错误字符串
type errorString struct {
    s string
}

// 返回发生何种错误
func (e *errorString) Error() string {
    return e.s
}
```

2) 在代码中使用错误定义  
下面的代码会定义一个除法函数，当除数为 0 时，返回一个预定义的除数为 0 的错误。  

```go
package main

import (
    "errors"
    "fmt"
)

// 定义除数为0的错误
var errDivisionByZero = errors.New("division by zero")

func div(dividend, divisor int) (int, error) {

    // 判断除数为0的情况并返回
    if divisor == 0 {
        return 0, errDivisionByZero
    }

    // 正常计算，返回空错误
    return dividend / divisor, nil
}

func main() {
    fmt.Println(div(1, 0))
}
```

### 示例：在解析中使用自定义错误

使用 errors.New 定义的错误字符串的错误类型是无法提供丰富的错误信息的，那么，如果需要携带错误信息返回，就需要借助自定义结构体实现错误接口。  
下面代码将实现一个解析错误（ParseError），这种错误包含两个内容，分别是文件名和行号，解析错误的结构还实现了 error 接口的 Error() 方法，返回错误描述时，就需要将文件名和行号返回。  

```go
package main

import (
    "fmt"
)

// 声明一个解析错误
type ParseError struct {
    Filename string // 文件名
    Line     int    // 行号
}

// 实现error接口，返回错误描述
func (e *ParseError) Error() string {
    return fmt.Sprintf("%s:%d", e.Filename, e.Line)
}

// 创建一些解析错误
func newParseError(filename string, line int) error {
    return &ParseError{filename, line}
}
func main() {

    var e error
    // 创建一个错误实例，包含文件名和行号
    e = newParseError("main.go", 1)

    // 通过error接口查看错误描述
    fmt.Println(e.Error())

    // 根据错误接口具体的类型，获取详细错误信息
    switch detail := e.(type) {
    case *ParseError: // 这是一个解析错误
        fmt.Printf("Filename: %s Line: %d\n", detail.Filename, detail.Line)
    default: // 其他类型的错误
        fmt.Println("other error")
    }
}
```

## Go语言宕机（panic）

Go语言的类型系统会在编译时捕获很多错误，但有些错误只能在运行时检查，如数组访问越界、空指针引用等，这些运行时错误会引起宕机。  

### 手动触发宕机

Go语言可以在程序中手动触发宕机，让程序崩溃，这样开发者可以及时地发现错误，同时减少可能的损失。  
Go语言程序在宕机时，会将堆栈和 goroutine 信息输出到控制台，所以宕机也可以方便地知晓发生错误的位置，那么我们要如何触发宕机呢，示例代码如下所示：  

```go
package main

func main() {
    panic("crash")
}
```

代码运行崩溃并输出如下：

```go
panic: crash  
  
goroutine 1 [running]:  
main.main()  
    D:/code/main.go:4 +0x40  
exit status 2
```

### 在运行依赖的必备资源缺失时主动触发宕机  

regexp 是Go语言的正则表达式包，正则表达式需要编译后才能使用，而且编译必须是成功的，表示正则表达式可用。  
编译正则表达式函数有两种，具体如下：  

1) func Compile(expr string) (*Regexp, error)  
编译正则表达式，发生错误时返回编译错误同时返回 Regexp 为 nil，该函数适用于在编译错误时获得编译错误进行处理，同时继续后续执行的环境。  
2) func MustCompile(str string) *Regexp  
当编译正则表达式发生错误时，使用 panic 触发宕机，该函数适用于直接使用正则表达式而无须处理正则表达式错误的情况。  
MustCompile 的代码如下：  

```go
func MustCompile(str string) *Regexp {
    regexp, error := Compile(str)
    if error != nil {
        panic(`regexp: Compile(` + quote(str) + `): ` + error.Error())
    }
    return regexp
}
```

### 在宕机时触发延迟执行语句

当 panic() 触发的宕机发生时，panic() 后面的代码将不会被运行，但是在 panic() 函数前面已经运行过的 defer 语句依然会在宕机发生时发生作用，参考下面代码：  

```go
package main

import "fmt"

func main() {
    defer fmt.Println("宕机后要做的事情1")
    defer fmt.Println("宕机后要做的事情2")
    panic("宕机")
}
```

代码输出如下：

```go
宕机后要做的事情2  
宕机后要做的事情1  
panic: 宕机  
  
goroutine 1 [running]:  
main.main()  
    D:/code/main.go:8 +0xf8  
exit status 2
```

## Go语言宕机恢复（recover）

Recover 是一个Go语言的内建函数，可以让进入宕机流程中的 goroutine 恢复过来，recover 仅在延迟函数 defer 中有效，在正常的执行过程中，调用 recover 会返回 nil 并且没有其他任何效果，如果当前的 goroutine 陷入恐慌，调用 recover 可以捕获到 panic 的输入值，并且恢复正常的执行。  
通常来说，不应该对进入 panic 宕机的程序做任何处理，但有时，需要我们可以从宕机中恢复，至少我们可以在程序崩溃前，做一些操作，举个例子，当 web 服务器遇到不可预料的严重问题时，在崩溃前应该将所有的连接关闭，如果不做任何处理，会使得客户端一直处于等待状态，如果 web 服务器还在开发阶段，服务器甚至可以将异常信息反馈到客户端，帮助调试。  
Go语言没有异常系统，其使用 panic 触发宕机类似于其他语言的抛出异常，recover 的宕机恢复机制就对应其他语言中的 try/catch 机制。  

### 让程序在崩溃时继续执行

下面的代码实现了 ProtectRun() 函数，该函数传入一个匿名函数或闭包后的执行函数，当传入函数以任何形式发生 panic 崩溃后，可以将崩溃发生的错误打印出来，同时允许后面的代码继续运行，不会造成整个进程的崩溃。  

```go
package main

import (
    "fmt"
    "runtime"
)

// 崩溃时需要传递的上下文信息
type panicContext struct {
    function string // 所在函数
}

// 保护方式允许一个函数
func ProtectRun(entry func()) {

    // 延迟处理的函数
    defer func() {

        // 发生宕机时，获取panic传递的上下文并打印
        err := recover()

        switch err.(type) {
        case runtime.Error: // 运行时错误
            fmt.Println("runtime error:", err)
        default: // 非运行时错误
            fmt.Println("error:", err)
        }

    }()

    entry()

}

func main() {
    fmt.Println("运行前")

    // 允许一段手动触发的错误
    ProtectRun(func() {

        fmt.Println("手动宕机前")

        // 使用panic传递上下文
        panic(&panicContext{
            "手动触发panic",
        })

        fmt.Println("手动宕机后")
    })

    // 故意造成空指针访问错误
    ProtectRun(func() {

        fmt.Println("赋值宕机前")

        var a *int
        *a = 1

        fmt.Println("赋值宕机后")
    })

    fmt.Println("运行后")
}
```

输出

```go
运行前  
手动宕机前  
error: &{手动触发panic}  
赋值宕机前  
runtime error: runtime error: invalid memory address or nil pointer dereference  
运行后
```

### panic 和 recover 的关系

panic 和 recover 的组合有如下特性：

* 有 panic 没 recover，程序宕机。
* 有 panic 也有 recover，程序不会宕机，执行完对应的 defer 后，从宕机点退出当前函数后继续执行。

```
提示
虽然 panic/recover 能模拟其他语言的异常机制，但并不建议在编写普通函数时也经常性使用这种特性。
在 panic 触发的 defer 函数内，可以继续调用 panic，进一步将错误外抛，直到程序整体崩溃。
如果想在捕获错误时设置当前函数的返回值，可以对返回值使用命名返回值方式直接进行设置。
```

## Go语言计算函数执行时间

函数的运行时间的长短是衡量这个函数性能的重要指标，特别是在对比和基准测试中，要得到函数的运行时间，最简单的办法就是在函数执行之前设置一个起始时间，并在函数运行结束时获取从起始时间到现在的时间间隔，这个时间间隔就是函数的运行时间。  
在Go语言中我们可以使用 time 包中的 Since() 函数来获取函数的运行时间，Go语言官方文档中对 Since() 函数的介绍是这样的。  
> func Since(t Time) Duration
Since() 函数返回从 t 到现在经过的时间，等价于time.Now().Sub(t)。  
【示例】使用 Since() 函数获取函数的运行时间。  

```go
package main

import (
    "fmt"
    "time"
)

func test() {
    start := time.Now() // 获取当前时间
    sum := 0
    for i := 0; i < 100000000; i++ {
        sum++
    }
    elapsed := time.Since(start)
    fmt.Println("该函数执行完成耗时：", elapsed)
}

func main() {
    test()
}
// 该函数执行完成耗时： 39.8933ms
```

## Go语言通过内存缓存来提升性能

递归函数的缺点就是比较消耗内存，而且效率比较低，那么我们要怎样提高程序的执行效率呢？  
当在进行大量计算的时候，提升性能最直接有效的一种方式是避免重复计算，通过在内存中缓存并重复利用缓存从而避免重复执行相同计算的方式称为内存缓存。  
