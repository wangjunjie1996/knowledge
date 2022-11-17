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
