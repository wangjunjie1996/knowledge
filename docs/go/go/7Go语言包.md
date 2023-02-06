# GO语言包
## Go语言包的基本概念
Go语言是使用包来组织源代码的，包（package）是多个 Go 源码的集合，是一种高级的代码复用方案。Go语言中为我们提供了很多内置包，如 fmt、os、io 等。

任何源代码文件必须属于某个包，同时源码文件的第一行有效代码必须是package pacakgeName语句，通过该语句声明自己所在的包。
### 包的基本概念
Go语言的包借助了目录树的组织形式，一般包的名称就是其源文件所在目录的名称，虽然Go语言没有强制要求包名必须和其所在的目录名同名，但还是建议包名和所在目录同名，这样结构更清晰。

包可以定义在很深的目录中，包名的定义是不包括目录路径的，但是包在引用时一般使用全路径引用。比如在GOPATH/src/a/b/下定义一个包 c。在包 c 的源码中只需声明为package c，而不是声明为package a/b/c，但是在导入 c 包时，需要带上路径，例如import "a/b/c"。

包的习惯用法：
* 包名一般是小写的，使用一个简短且有意义的名称。
* 包名一般要和所在的目录同名，也可以不同，包名中不能包含-等特殊符号。
* 包一般使用域名作为目录名称，这样能保证包名的唯一性，比如 GitHub 项目的包一般会放到GOPATH/src/github.com/userName/projectName目录下。
* 包名为 main 的包为应用程序的入口包，编译不包含 main 包的源码文件时不会得到可执行文件。
* 一个文件夹下的所有源码文件只能属于同一个包，同样属于同一个包的源码文件不能放在多个文件夹下。
### 包的导入
要在代码中引用其他包的内容，需要使用 import 关键字导入使用的包。具体语法如下：
```
import "包的路径"
```
注意事项：
* import 导入语句通常放在源码文件开头包声明语句的下面；
* 导入的包名需要使用双引号包裹起来；
* 包名是从GOPATH/src/后开始计算的，使用/进行路径分隔。
包的导入有两种写法，分别是单行导入和多行导入。
### 单行导入
```
import "包 1 的路径"
import "包 2 的路径"
```
### 多行导入
```
import (
    "包 1 的路径"
    "包 2 的路径"
)
```
### 包的导入路径
包的引用路径有两种写法，分别是全路径导入和相对路径导入。
### 全路径导入
包的绝对路径就是GOROOT/src/或GOPATH/src/后面包的存放路径，如下所示：
```
import "lab/test"  // test 包是自定义的包，其源码位于GOPATH/src/lab/test目录下；
import "database/sql/driver" // driver 包的源码位于GOROOT/src/database/sql/driver目录下；
import "database/sql" // sql 包的源码位于GOROOT/src/database/sql目录下。
```
### 相对路径导入
相对路径只能用于导入GOPATH下的包，标准包的导入只能使用全路径导入。

例如包 a 的所在路径是GOPATH/src/lab/a，包 b 的所在路径为GOPATH/src/lab/b，如果在包 b 中导入包 a ，则可以使用相对路径导入方式。示例如下：
```
// 相对路径导入
import "../a"
```
### 包的引用格式
包的引用有四种格式，下面以 fmt 包为例来分别演示一下这四种格式。
#### 1) 标准引用格式
```
import "fmt"
```
此时可以用fmt.作为前缀来使用 fmt 包中的方法，这是常用的一种方式。示例代码如下：
```go
package main

import "fmt"

func main() {
    fmt.Println("C语言中文网")
}
```
#### 2) 自定义别名引用格式
在导入包的时候，我们还可以为导入的包设置别名，如下所示：
```
import F "fmt" // 其中 F 就是 fmt 包的别名，使用时我们可以使用F.来代替标准引用格式的fmt.来作为前缀使用 fmt 包中的方法。
```
#### 3) 省略引用格式
```
import . "fmt"
```
这种格式相当于把 fmt 包直接合并到当前程序中，在使用 fmt 包内的方法是可以不用加前缀fmt.，直接引用。
```go
package main

import . "fmt"

func main() {
    //不需要加前缀 fmt.
    Println("C语言中文网")
}
```
#### 4) 匿名引用格式
在引用某个包时，如果只是希望执行包初始化的 init 函数，而不使用包内部的数据时，可以使用匿名引用格式，如下所示：
```
import _ "fmt"
```
匿名导入的包与其他方式导入的包一样都会被编译到可执行文件中。

使用标准格式引用包，但是代码中却没有使用包，编译器会报错。如果包中有 init 初始化函数，则通过import _ "包的路径"这种方式引用包，仅执行包的初始化函数，即使包没有 init 初始化函数，也不会引发编译器报错。

注意：
* 一个包可以有多个 init 函数，包加载时会执行全部的 init 函数，但并不能保证执行顺序，所以不建议在一个包中放入多个 init 函数，将需要初始化的逻辑放到一个 init 函数里面。
* 包不能出现环形引用的情况，比如包 a 引用了包 b，包 b 引用了包 c，如果包 c 又引用了包 a，则编译不能通过。
* 包的重复引用是允许的，比如包 a 引用了包 b 和包 c，包 b 和包 c 都引用了包 d。这种场景相当于重复引用了 d，这种情况是允许的，并且 Go 编译器保证包 d 的 init 函数只会执行一次。
### 包加载
通过前面一系列的学习相信大家已经大体了解了 Go 程序的启动和加载过程，在执行 main 包的 mian 函数之前， Go 引导程序会先对整个程序的包进行初始化。整个执行的流程如下图所示。
<img src="/img/4-1ZR1102245R8.gif">

## Go语言封装简介及实现细节
在Go语言中封装就是把抽象出来的字段和对字段的操作封装在一起，数据被保护在内部，程序的其它包只能通过被授权的方法，才能对字段进行操作。

封装的好处：
* 隐藏实现细节；
* 可以对数据进行验证，保证数据安全合理。
如何体现封装：
* 对结构体中的属性进行封装；
* 通过方法，包，实现封装。
封装的实现步骤：
* 将结构体、字段的首字母小写；
* 给结构体所在的包提供一个工厂模式的函数，首字母大写，类似一个构造函数；
* 提供一个首字母大写的 Set 方法（类似其它语言的 public），用于对属性判断并赋值；
* 提供一个首字母大写的 Get 方法（类似其它语言的 public），用于获取属性的值。
person.go
```go
package model

import "fmt"

type person struct {
    Name string
    age int   //其它包不能直接访问..
    sal float64
}

//写一个工厂模式的函数，相当于构造函数
func NewPerson(name string) *person {
    return &person{
        Name : name,
    }
}

//为了访问age 和 sal 我们编写一对SetXxx的方法和GetXxx的方法
func (p *person) SetAge(age int) {
    if age >0 && age <150 {
        p.age = age
    } else {
        fmt.Println("年龄范围不正确..")
        //给程序员给一个默认值
    }
}
func (p *person) GetAge() int {
    return p.age
}

func (p *person) SetSal(sal float64) {
    if sal >= 3000 && sal <= 30000 {
        p.sal = sal
    } else {
        fmt.Println("薪水范围不正确..")
    }
}

func (p *person) GetSal() float64 {
    return p.sal
}
```
main.go 中的代码如下所示：
```go
package main

import (
    "fmt"
    "../model"
)

func main() {
    p := model.NewPerson("smith")
    p.SetAge(18)
    p.SetSal(5000)
    fmt.Println(p)
    fmt.Println(p.Name, " age =", p.GetAge(), " sal = ", p.GetSal())
}
```
## Go语言自定义包
我们创建的自定义的包需要将其放在 GOPATH 的 src 目录下（也可以是 src 目录下的某个子目录），而且两个不同的包不能放在同一目录下，这样会引起编译错误。

一个包中可以有任意多个文件，文件的名字也没有任何规定（但后缀必须是 .go），这里我们假设包名就是 .go 的文件名（如果一个包有多个 .go 文件，则其中会有一个 .go 文件的文件名和包名相同）。
首先，在 GOPATH 下的 src 目录中新建一个 demo 文件夹 ，并在 demo 文件夹下创建 demo.go 文件，
```go
package demo

import (
    "fmt"
)

func PrintStr() {
    fmt.Println("C语言中文网")
}
```
然后，在 GOPATH 下的 src 目录中新建一个 main 文件夹，并在 main 文件夹下创建 mian.go 文件
```go
package main

import (
    "demo"
)

func main() {
    demo.PrintStr()
}
```
运行结果如下所示：
```
go run main.go
C语言中文网
```
对引用自定义包需要注意以下几点：
* 如果项目的目录不在 GOPATH 环境变量中，则需要把项目移到 GOPATH 所在的目录中，或者将项目所在的目录设置到 GOPATH 环境变量中，否则无法完成编译；
* 使用 import 语句导入包时，使用的是包所属文件夹的名称；
* 包中的函数名第一个字母要大写，否则无法在外部调用；
* 自定义包的包名不必与其所在文件夹的名称保持一致，但为了便于维护，建议保持一致；
* 调用自定义包时使用 包名 . 函数名 的方式，如上例：demo.PrintStr()。
## Go语言package
包（package）是多个 Go 源码的集合，是一种高级的代码复用方案，像 fmt、os、io 等这样具有常用功能的内置包在 Go语言中有 150 个以上，它们被称为标准库，大部分（一些底层的除外）内置于 Go 本身。

包要求在同一个目录下的所有文件的第一行添加如下代码，以标记该文件归属的包：
```
package 包名
```
包的特性如下：
* 一个目录下的同级文件归属一个包。
* 包名可以与其目录不同名。
* 包名为 main 的包为应用程序的入口包，编译源码没有 main 包时，将无法编译输出可执行的文件。
每个包一般都定义了一个不同的名字空间用于它内部的每个标识符的访问。每个名字空间关联到一个特定的包，让我们给类型、函数等选择简短明了的名字，这样可以避免在我们使用它们的时候减少和其它部分名字的冲突。
每个包还通过控制包内名字的可见性和是否导出来实现封装特性。通过限制包成员的可见性并隐藏包 API 的具体实现，将允许包的维护者在不影响外部包用户的前提下调整包的内部实现。通过限制包内变量的可见性，还可以强制用户通过某些特定函数来访问和更新内部变量，这样可以保证内部变量的一致性和并发时的互斥约束。

当我们修改了一个源文件，我们必须重新编译该源文件对应的包和所有依赖该包的其他包。即使是从头构建，Go语言编译器的编译速度也明显快于其它编译语言。Go语言的闪电般的编译速度主要得益于三个语言特性。
* 第一点，所有导入的包必须在每个文件的开头显式声明，这样的话编译器就没有必要读取和分析整个源文件来判断包的依赖关系。
* 第二点，禁止包的环状依赖，因为没有循环依赖，包的依赖关系形成一个有向无环图，每个包可以被独立编译，而且很可能是被并发编译。
* 第三点，编译后包的目标文件不仅仅记录包本身的导出信息，目标文件同时还记录了包的依赖关系。因此，在编译一个包的时候，编译器只需要读取每个直接导入包的目标文件，而不需要遍历所有依赖的的文件。
## Go语言导出包中的标识符
### 导出包内标识符
```go
package mypkg

var myVar = 100

const MyConst = "hello"

type MyStruct struct {
}
```
MyConst 和 MyStruct 可以被外部访问，而 myVar 由于首字母是小写，因此只能在 mypkg 包内使用，不能被外部包引用。
### 导出结构体及接口成员
在被导出的结构体或接口中，如果它们的字段或方法首字母是大写，外部可以访问这些字段和方法，代码如下：
```go
type MyStruct struct {
    // 包外可以访问的字段
    ExportedField int
    // 仅限包内访问的字段
    privateField int
}

type MyInterface interface {
    // 包外可以访问的方法
    ExportedMethod()
    // 仅限包内访问的方法
    privateMethod()
}
```
## Go语言工厂模式自动注册
```go
package base

// 类接口
type Class interface {
    Do()
}

var (
// 保存注册好的工厂信息
    factoryByName = make(map[string]func() Class)
)

// 注册一个类生成工厂
func Register(name string, factory func() Class) {
    factoryByName[name] = factory
}

// 根据名称创建对应的类
func Create(name string) Class {
    if f, ok := factoryByName[name]; ok {
        return f()
    } else {
        panic("name not found")
    }
}
```
这个包叫base，负责处理注册和使用工厂的基础代码，该包不会引用任何外部的包。
```go
package cls1

import (
    "chapter08/clsfactory/base"
    "fmt"
)

// 定义类1
type Class1 struct {
}

// 实现Class接口
func (c *Class1) Do() {
    fmt.Println("Class1")
}

func init() {
    // 在启动时注册类1工厂
    base.Register("Class1", func() base.Class {
        return new(Class1)
    })
}
```
上面的代码展示了Class1的工厂及产品定义过程。
```go
package cls2

import (
    "chapter08/clsfactory/base"
    "fmt"
)

// 定义类2
type Class2 struct {
}

// 实现Class接口
func (c *Class2) Do() {
    fmt.Println("Class2")
}

func init() {
    // 在启动时注册类2工厂
    base.Register("Class2", func() base.Class {
        return new(Class2)
    })
}
```
```go
package main

import (
    "chapter08/clsfactory/base"
    _ "chapter08/clsfactory/cls1"  // 匿名引用cls1包, 自动注册
    _ "chapter08/clsfactory/cls2"  // 匿名引用cls2包, 自动注册
)

func main() {
    // 根据字符串动态创建一个Class1实例
    c1 := base.Create("Class1")
    c1.Do()
    // 根据字符串动态创建一个Class2实例
    c2 := base.Create("Class2")
    c2.Do()
}
```
## Go语言单例模式简述
### 单例模式实现
Go语言实现单例模式的有四种方式，分别是懒汉式、饿汉式、双重检查和 sync.Once。

懒汉式就是创建对象时比较懒，先不急着创建对象，在需要加载配置文件的时候再去创建；饿汉式则是在系统初始化的时候就已经把对象创建好了，需要用的时候直接拿过来用就好了。
#### 1) 懒汉式——非线程安全
非线程安全，指的是在多线程下可能会创建多次对象。在非线程安全的基本上，利用 Sync.Mutex 进行加锁保证线程安全，但由于每次调用该方法都进行了加锁操作，在性能上不是很高效。
```go
//锁对象
var lock sync.Mutex

//加锁保证线程安全
func GetInstance() *Tool {
    lock.Lock()
    defer lock.Unlock()
    if instance == nil {
        instance = new(Tool)
    }

    return instance
}
```
#### 2) 饿汉式
直接创建好对象，不需要判断为空，同时也是线程安全，唯一的缺点是在导入包的同时会创建该对象，并持续占有在内存中。

Go语言饿汉式可以使用 init 函数，也可以使用全局变量。
```go
type cfg struct {
}
var cfg *config
func init()  {
   cfg = new(config)
}
// NewConfig 提供获取实例的方法
func NewConfig() *config {
   return cfg
}
type config struct {
}
```
#### 3) 双重检查
在懒汉式（线程安全）的基础上再进行优化，减少加锁的操作，保证线程安全的同时不影响性能。
```go
//锁对象
var lock sync.Mutex

//第一次判断不加锁，第二次加锁保证线程安全，一旦对象建立后，获取对象就不用加锁了。
func GetInstance() *Tool {
    if instance == nil {
        lock.Lock()
        if instance == nil {
            instance = new(Tool)
        }
        lock.Unlock()
    }
    return instance
}
```
#### 4) sync.Once
通过 sync.Once 来确保创建对象的方法只执行一次
```go
var once sync.Once

func GetInstance() *Tool {
    once.Do(func() {
        instance = new(Tool)

    })
    return instance
}
```
sync.Once 内部本质上也是双重检查的方式，但在写法上会比自己写双重检查更简洁，以下是 Once 的源码
```go
func (o *Once) Do(f func()) {
　　//判断是否执行过该方法，如果执行过则不执行
    if atomic.LoadUint32(&o.done) == 1 {
        return
    }
    // Slow-path.
    o.m.Lock()
    defer o.m.Unlock()
　　//进行加锁，再做一次判断，如果没有执行，则进行标志已经扫行并调用该方法
    if o.done == 0 {
        defer atomic.StoreUint32(&o.done, 1)
        f()
    }
}
```
## Go语言sync包与锁
Go语言中 sync 包里提供了互斥锁 Mutex 和读写锁 RWMutex 用于处理并发过程中可能出现同时两个或多个协程（或线程）读或写同一个变量的情况。
### 为什么需要锁
锁是 sync 包中的核心，它主要有两个方法，分别是加锁（Lock）和解锁（Unlock）。

在并发的情况下，多个线程或协程同时其修改一个变量，使用锁能保证在某一时间内，只有一个协程或线程修改这一变量。

不使用锁时，在并发的情况下可能无法得到想要的结果，如下所示：
```go
package main
import (
    "fmt"
    "time"
)
func main() {
    var a = 0
    for i := 0; i < 1000; i++ {
        go func(idx int) {
            a += 1
            fmt.Println(a)
        }(i)
    }
    time.Sleep(time.Second)
}
```
从理论上来说，上面的程序会将 a 的值依次递增输出，然而实际结果却是下面这样子的。
```
2
9
19
22
25
28
32
35
1
40
11
10
13
14
15
43
47
50
53
56
21
4
62
......
```
通过运行结果可以看出 a 的值并不是按顺序递增输出的，这是为什么呢？

协程的执行顺序大致如下所示：
* 从寄存器读取 a 的值；
* 然后做加法运算；
* 最后写到寄存器。
按照上面的顺序，假如有一个协程取得 a 的值为 3，然后执行加法运算，此时又有一个协程对 a 进行取值，得到的值同样是 3，最终两个协程的返回结果是相同的。

而锁的概念就是，当一个协程正在处理 a 时将 a 锁定，其它协程需要等待该协程处理完成并将 a 解锁后才能再进行操作，也就是说同时处理 a 的协程只能有一个，从而避免上面示例中的情况出现。
### 互斥锁 Mutex
上面的示例中出现的问题怎么解决呢？加一个互斥锁 Mutex 就可以了。那什么是互斥锁呢 ？互斥锁中其有两个方法可以调用，如下所示：
```
func (m *Mutex) Lock()
func (m *Mutex) Unlock()
```
将上面的代码略作修改，如下所示：
```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func main() {
    var a = 0
    var lock sync.Mutex
    for i := 0; i < 1000; i++ {
        go func(idx int) {
            lock.Lock()
            defer lock.Unlock()
            a += 1
            fmt.Printf("goroutine %d, a=%d\n", idx, a)
        }(i)
    }
    // 等待 1s 结束主程序
    // 确保所有协程执行完
    time.Sleep(time.Second)
}
```
运行结果如下：
```
goroutine 13, a=1
goroutine 0, a=2
goroutine 1, a=3
goroutine 2, a=4
goroutine 3, a=5
goroutine 4, a=6
goroutine 5, a=7
goroutine 6, a=8
goroutine 7, a=9
goroutine 8, a=10
goroutine 9, a=11
goroutine 10, a=12
goroutine 11, a=13
goroutine 12, a=14
......
```
需要注意的是一个互斥锁只能同时被一个 goroutine 锁定，其它 goroutine 将阻塞直到互斥锁被解锁（重新争抢对互斥锁的锁定），示例代码如下：
```go
package main
import (
    "fmt"
    "sync"
    "time"
)
func main() {
    ch := make(chan struct{}, 2)
    var l sync.Mutex
    go func() {
        l.Lock()
        defer l.Unlock()
        fmt.Println("goroutine1: 我会锁定大概 2s")
        time.Sleep(time.Second * 2)
        fmt.Println("goroutine1: 我解锁了，你们去抢吧")
        ch <- struct{}{}
    }()
    go func() {
        fmt.Println("goroutine2: 等待解锁")
        l.Lock()
        defer l.Unlock()
        fmt.Println("goroutine2: 欧耶，我也解锁了")
        ch <- struct{}{}
    }()
    // 等待 goroutine 执行结束
    for i := 0; i < 2; i++ {
        <-ch
    }
}
```
上面的代码运行结果如下：
```
goroutine1: 我会锁定大概 2s
goroutine2: 等待解锁
goroutine1: 我解锁了，你们去抢吧
goroutine2: 欧耶，我也解锁了
```
### 读写锁
读写锁有如下四个方法：
* 写操作的锁定和解锁分别是func (*RWMutex) Lock和func (*RWMutex) Unlock；
* 读操作的锁定和解锁分别是func (*RWMutex) Rlock和func (*RWMutex) RUnlock。
读写锁的区别在于：
* 当有一个 goroutine 获得写锁定，其它无论是读锁定还是写锁定都将阻塞直到写解锁；
* 当有一个 goroutine 获得读锁定，其它读锁定仍然可以继续；
* 当有一个或任意多个读锁定，写锁定将等待所有读锁定解锁之后才能够进行写锁定。
所以说这里的读锁定（RLock）目的其实是告诉写锁定，有很多协程或者进程正在读取数据，写操作需要等它们读（读解锁）完才能进行写（写锁定）。
我们可以将其总结为如下三条：
* 同时只能有一个 goroutine 能够获得写锁定；
* 同时可以有任意多个 gorouinte 获得读锁定；
* 同时只能存在写锁定或读锁定（读和写互斥）。
## Go语言big包
实际开发中，对于超出 int64 或者 uint64 类型的大数进行计算时，如果对精度没有要求，使用 float32 或者 float64 就可以胜任，但如果对精度有严格要求的时候，我们就不能使用浮点数了，因为浮点数在内存中只能被近似的表示。

Go语言中 math/big 包实现了大数字的多精度计算，支持 Int（有符号整数）、Rat（有理数）和 Float（浮点数）等数字类型。

这些类型可以实现任意位数的数字，只要内存足够大，但缺点是需要更大的内存和处理开销，这使得它们使用起来要比内置的数字类型慢很多。

在 math/big 包中，Int 类型定义如下所示：
```go
// An Int represents a signed multi-precision integer.
// The zero value for an Int represents the value 0.
type Int struct {
    neg bool // sign
    abs nat  // absolute value of the integer
}
```
生成 Int 类型的方法为 NewInt()，如下所示：
```go
// NewInt allocates and returns a new Int set to x.
func NewInt(x int64) *Int {
    return new(Int).SetInt64(x)
}
```
注意：NewInt() 函数只对 int64 有效，其他类型必须先转成 int64 才行。

Go语言中还提供了许多 Set 函数，可以方便的把其他类型的整形存入 Int ，因此，我们可以先 new(int) 然后再调用 Set 函数，Set 函数有如下几种：
```go
// SetInt64 函数将 z 转换为 x 并返回 z。
func (z *Int) SetInt64(x int64) *Int {
    neg := false
    if x < 0 {
        neg = true
        x = -x
    }
    z.abs = z.abs.setUint64(uint64(x))
    z.neg = neg
    return z
}
​
// SetUint64 函数将 z 转换为 x 并返回 z。
func (z *Int) SetUint64(x uint64) *Int {
    z.abs = z.abs.setUint64(x)
    z.neg = false
    return z
}
​
// Set 函数将 z 转换为 x 并返回 z。
func (z *Int) Set(x *Int) *Int {
    if z != x {
        z.abs = z.abs.set(x.abs)
        z.neg = x.neg
    }
    return z
}
```
示例代码如下所示：
```go
package main

import (
    "fmt"
    "math/big"
)

func main() {
    big1 := new(big.Int).SetUint64(uint64(1000))
    fmt.Println("big1 is: ", big1) // big1 is:  1000

    big2 := big1.Uint64()
    fmt.Println("big2 is: ", big2) // big2 is:  1000
}
```
除了上述的 Set 函数，math/big 包中还提供了一个 SetString() 函数，可以指定进制数，比如二进制、十进制或者十六进制等！
```go
// SetString sets z to the value of s, interpreted in the given base,
// and returns z and a boolean indicating success. The entire string
// (not just a prefix) must be valid for success. If SetString fails,
// the value of z is undefined but the returned value is nil.
//
// The base argument must be 0 or a value between 2 and MaxBase. If the base
// is 0, the string prefix determines the actual conversion base. A prefix of
// ``0x'' or ``0X'' selects base 16; the ``0'' prefix selects base 8, and a
// ``0b'' or ``0B'' prefix selects base 2. Otherwise the selected base is 10.
//
func (z *Int) SetString(s string, base int) (*Int, bool) {
    r := strings.NewReader(s)
    if _, _, err := z.scan(r, base); err != nil {
        return nil, false
    }
    // entire string must have been consumed
    if _, err := r.ReadByte(); err != io.EOF {
        return nil, false
    }
    return z, true // err == io.EOF => scan consumed all of s
}
```
示例代码如下所示：
```go
package main

import (
    "fmt"
    "math/big"
)

func main() {
    big1, _ := new(big.Int).SetString("1000", 10)
    fmt.Println("big1 is: ", big1) // big1 is:  1000

    big2 := big1.Uint64()
    fmt.Println("big2 is: ", big2) // big2 is:  1000
}
```
```
因为Go语言不支持运算符重载，所以所有大数字类型都有像是 Add() 和 Mul() 这样的方法。
Add 方法的定义如下所示：
func (z *Int) Add(x, y *Int) *Int
该方法会将 z 转换为 x + y 并返回 z。
【示例】计算第 1000 位的斐波那契数列。
```
```go
package main

import (
    "fmt"
    "math/big"
    "time"
)

const LIM = 1000 //求第1000位的斐波那契数列

var fibs [LIM]*big.Int //使用数组保存计算出来的数列的指针

func main() {
    result := big.NewInt(0)
    start := time.Now()
    for i := 0; i < LIM; i++ {
        result = fibonacci(i)
        fmt.Printf("数列第 %d 位: %d\n", i+1, result)
    }
    end := time.Now()
    delta := end.Sub(start)
    fmt.Printf("执行完成，所耗时间为: %s\n", delta)
}

func fibonacci(n int) (res *big.Int) {
    if n <= 1 {
        res = big.NewInt(1)
    } else {
        temp := new(big.Int)
        res = temp.Add(fibs[n-1], fibs[n-2])
    }
    fibs[n] = res
    return
}
```
运行结果如下：
```
数列第 1 位: 1
数列第 2 位: 1
数列第 3 位: 2
数列第 4 位: 3
数列第 5 位: 5
...
数列第 997 位: 10261062362033262336604926729245222132668558120602124277764622905699407982546711488272859468887457959
08773311924256407785074365766118082732679853917775891982813511440749936979646564952426675539110499009
9120377
数列第 998 位: 16602747662452097049541800472897701834948051198384828062358553091918573717701170201065510185595898605
10409473691887927846223301598102952299783631123261876053919903676539979992673143323971886037334508837
5054249
数列第 999 位: 26863810024485359386146727202142923967616609318986952340123175997617981700247881689338369654483356564
19182785616144335631297667364221035032463485041037768036733415117289916972319708276398561576445007847
4174626
数列第 1000 位: 4346655768693745643568852767504062580256466051737178040248172908953655541794905189040387984007925516
92959225930803226347752096896232398733224711616429964409065331879382989696499285160037044761377951668
49228875
执行完成，所耗时间为: 6.945ms
```
## Go语言正则表达式
正则表达式是一种进行模式匹配和文本操纵的复杂而又强大的工具。虽然正则表达式比纯粹的文本匹配效率低，但是它却更灵活，按照它的语法规则，根据需求构造出的正则表达式能够从原始文本中筛选出几乎任何你想要得到的字符组合。

Go语言通过 regexp 包为正则表达式提供了官方支持，其采用 RE2 语法，除了\c、\C外，Go语言和 Perl、Python等语言的正则基本一致。
### 正则表达式语法规则
正则表达式是由普通字符（例如字符 a 到 z）以及特殊字符（称为"元字符"）构成的文字序列，可以是单个的字符、字符集合、字符范围、字符间的选择或者所有这些组件的任意组合。
```
单一：
    .                  匹配任意一个字符，如果设置 s = true，则可以匹配换行符

    [字符类]            匹配“字符类”中的一个字符，“字符类”见后面的说明
    [^字符类]           匹配“字符类”外的一个字符，“字符类”见后面的说明

    \小写Perl标记       匹配“Perl类”中的一个字符，“Perl类”见后面的说明
    \大写Perl标记       匹配“Perl类”外的一个字符，“Perl类”见后面的说明

    [:ASCII类名:]       匹配“ASCII类”中的一个字符，“ASCII类”见后面的说明
    [:^ASCII类名:]      匹配“ASCII类”外的一个字符，“ASCII类”见后面的说明

    \pUnicode普通类名   匹配“Unicode类”中的一个字符(仅普通类)，“Unicode类”见后面的说明
    \PUnicode普通类名   匹配“Unicode类”外的一个字符(仅普通类)，“Unicode类”见后面的说明

    \p{Unicode类名}     匹配“Unicode类”中的一个字符，“Unicode类”见后面的说明
    \P{Unicode类名}     匹配“Unicode类”外的一个字符，“Unicode类”见后面的说明
```
```
复合：
    xy             匹配 xy（x 后面跟随 y）
    x|y            匹配 x 或 y (优先匹配 x)
```
```
重复：
    x*             匹配零个或多个 x，优先匹配更多(贪婪)
    x+             匹配一个或多个 x，优先匹配更多(贪婪)
    x?             匹配零个或一个 x，优先匹配一个(贪婪)
    x{n,m}         匹配 n 到 m 个 x，优先匹配更多(贪婪)
    x{n,}          匹配 n 个或多个 x，优先匹配更多(贪婪)
    x{n}           只匹配 n 个 x
    x*?            匹配零个或多个 x，优先匹配更少(非贪婪)
    x+?            匹配一个或多个 x，优先匹配更少(非贪婪)
    x??            匹配零个或一个 x，优先匹配零个(非贪婪)
    x{n,m}?        匹配 n 到 m 个 x，优先匹配更少(非贪婪)
    x{n,}?         匹配 n 个或多个 x，优先匹配更少(非贪婪)
    x{n}?          只匹配 n 个 x
```
```
分组：
    (子表达式)            被捕获的组，该组被编号 (子匹配)
    (?P<命名>子表达式)    被捕获的组，该组被编号且被命名 (子匹配)
    (?:子表达式)          非捕获的组 (子匹配)
    (?标记)               在组内设置标记，非捕获，标记影响当前组后的正则表达式
    (?标记:子表达式)      在组内设置标记，非捕获，标记影响当前组内的子表达式

    标记的语法是：
    xyz  (设置 xyz 标记)
    -xyz (清除 xyz 标记)
    xy-z (设置 xy 标记, 清除 z 标记)

    可以设置的标记有：
    i              不区分大小写 (默认为 false)
    m              多行模式：让 ^ 和 $ 匹配整个文本的开头和结尾，而非行首和行尾(默认为 false)
    s              让 . 匹配 \n (默认为 false)
    U              非贪婪模式：交换 x* 和 x*? 等的含义 (默认为 false)
```
```
位置标记：
    ^              如果标记 m=true 则匹配行首，否则匹配整个文本的开头（m 默认为 false）
    $              如果标记 m=true 则匹配行尾，否则匹配整个文本的结尾（m 默认为 false）
    \A             匹配整个文本的开头，忽略 m 标记
    \b             匹配单词边界
    \B             匹配非单词边界
    \z             匹配整个文本的结尾，忽略 m 标记
```
```
转义序列：
    \a             匹配响铃符    （相当于 \x07）
                    注意：正则表达式中不能使用 \b 匹配退格符，因为 \b 被用来匹配单词边界，
                    可以使用 \x08 表示退格符。
    \f             匹配换页符    （相当于 \x0C）
    \t             匹配横向制表符（相当于 \x09）
    \n             匹配换行符    （相当于 \x0A）
    \r             匹配回车符    （相当于 \x0D）
    \v             匹配纵向制表符（相当于 \x0B）
    \123           匹配 8  進制编码所代表的字符（必须是 3 位数字）
    \x7F           匹配 16 進制编码所代表的字符（必须是 3 位数字）
    \x{10FFFF}     匹配 16 進制编码所代表的字符（最大值 10FFFF  ）
    \Q...\E        匹配 \Q 和 \E 之间的文本，忽略文本中的正则语法

    \\             匹配字符 \
    \^             匹配字符 ^
    \$             匹配字符 $
    \.             匹配字符 .
    \*             匹配字符 *
    \+             匹配字符 +
    \?             匹配字符 ?
    \{             匹配字符 {
    \}             匹配字符 }
    \(             匹配字符 (
    \)             匹配字符 )
    \[             匹配字符 [
    \]             匹配字符 ]
    \|             匹配字符 |
```
```
可以将“命名字符类”作为“字符类”的元素：
    [\d]           匹配数字 (相当于 \d)
    [^\d]          匹配非数字 (相当于 \D)
    [\D]           匹配非数字 (相当于 \D)
    [^\D]          匹配数字 (相当于 \d)
    [[:name:]]     命名的“ASCII 类”包含在“字符类”中 (相当于 [:name:])
    [^[:name:]]    命名的“ASCII 类”不包含在“字符类”中 (相当于 [:^name:])
    [\p{Name}]     命名的“Unicode 类”包含在“字符类”中 (相当于 \p{Name})
    [^\p{Name}]    命名的“Unicode 类”不包含在“字符类”中 (相当于 \P{Name})
```
```
“字符类”取值如下（“字符类”包含“Perl类”、“ASCII类”、“Unicode类”）：
    x                    单个字符
    A-Z                  字符范围(包含首尾字符)
    \小写字母            Perl类
    [:ASCII类名:]        ASCII类
    \p{Unicode脚本类名}  Unicode类 (脚本类)
    \pUnicode普通类名    Unicode类 (普通类)
```
```
“Perl 类”取值如下：
    \d             数字 (相当于 [0-9])
    \D             非数字 (相当于 [^0-9])
    \s             空白 (相当于 [\t\n\f\r ])
    \S             非空白 (相当于[^\t\n\f\r ])
    \w             单词字符 (相当于 [0-9A-Za-z_])
    \W             非单词字符 (相当于 [^0-9A-Za-z_])
```
```
“ASCII 类”取值如下
    [:alnum:]      字母数字 (相当于 [0-9A-Za-z])
    [:alpha:]      字母 (相当于 [A-Za-z])
    [:ascii:]      ASCII 字符集 (相当于 [\x00-\x7F])
    [:blank:]      空白占位符 (相当于 [\t ])
    [:cntrl:]      控制字符 (相当于 [\x00-\x1F\x7F])
    [:digit:]      数字 (相当于 [0-9])
    [:graph:]      图形字符 (相当于 [!-~])
    [:lower:]      小写字母 (相当于 [a-z])
    [:print:]      可打印字符 (相当于 [ -~] 相当于 [ [:graph:]])
    [:punct:]      标点符号 (相当于 [!-/:-@[-反引号{-~])
    [:space:]      空白字符(相当于 [\t\n\v\f\r ])
    [:upper:]      大写字母(相当于 [A-Z])
    [:word:]       单词字符(相当于 [0-9A-Za-z_])
    [:xdigit:]     16 進制字符集(相当于 [0-9A-Fa-f])
```
```
“Unicode 类”取值如下---普通类：
    C                 -其他-          (other)
    Cc                控制字符        (control)
    Cf                格式            (format)
    Co                私人使用区      (private use)
    Cs                代理区          (surrogate)
    L                 -字母-          (letter)
    Ll                小写字母        (lowercase letter)
    Lm                修饰字母        (modifier letter)
    Lo                其它字母        (other letter)
    Lt                首字母大写字母  (titlecase letter)
    Lu                大写字母        (uppercase letter)
    M                 -标记-          (mark)
    Mc                间距标记        (spacing mark)
    Me                关闭标记        (enclosing mark)
    Mn                非间距标记      (non-spacing mark)
    N                 -数字-          (number)
    Nd                十進制数字      (decimal number)
    Nl                字母数字        (letter number)
    No                其它数字        (other number)
    P                 -标点-          (punctuation)
    Pc                连接符标点      (connector punctuation)
    Pd                破折号标点符号  (dash punctuation)
    Pe                关闭的标点符号  (close punctuation)
    Pf                最后的标点符号  (final punctuation)
    Pi                最初的标点符号  (initial punctuation)
    Po                其他标点符号    (other punctuation)
    Ps                开放的标点符号  (open punctuation)
    S                 -符号-          (symbol)
    Sc                货币符号        (currency symbol)
    Sk                修饰符号        (modifier symbol)
    Sm                数学符号        (math symbol)
    So                其他符号        (other symbol)
    Z                 -分隔符-        (separator)
    Zl                行分隔符        (line separator)
    Zp                段落分隔符      (paragraph separator)
    Zs                空白分隔符      (space separator)
```
```
“Unicode 类”取值如下---脚本类：
    Arabic                  阿拉伯文
    Armenian                亚美尼亚文
    Balinese                巴厘岛文
    Bengali                 孟加拉文
    Bopomofo                汉语拼音字母
    Braille                 盲文
    Buginese                布吉文
    Buhid                   布希德文
    Canadian_Aboriginal     加拿大土著文
    Carian                  卡里亚文
    Cham                    占族文
    Cherokee                切诺基文
    Common                  普通的，字符不是特定于一个脚本
    Coptic                  科普特文
    Cuneiform               楔形文字
    Cypriot                 塞浦路斯文
    Cyrillic                斯拉夫文
    Deseret                 犹他州文
    Devanagari              梵文
    Ethiopic                衣索比亚文
    Georgian                格鲁吉亚文
    Glagolitic              格拉哥里文
    Gothic                  哥特文
    Greek                   希腊
    Gujarati                古吉拉特文
    Gurmukhi                果鲁穆奇文
    Han                     汉文
    Hangul                  韩文
    Hanunoo                 哈鲁喏文
    Hebrew                  希伯来文
    Hiragana                平假名（日语）
    Inherited               继承前一个字符的脚本
    Kannada                 坎那达文
    Katakana                片假名（日语）
    Kayah_Li                克耶字母
    Kharoshthi              卡罗须提文
    Khmer                   高棉文
    Lao                     老挝文
    Latin                   拉丁文
    Lepcha                  雷布查文
    Limbu                   林布文
    Linear_B                B类线形文字（古希腊）
    Lycian                  利西亚文
    Lydian                  吕底亚文
    Malayalam               马拉雅拉姆文
    Mongolian               蒙古文
    Myanmar                 缅甸文
    New_Tai_Lue             新傣仂文
    Nko                     Nko文
    Ogham                   欧甘文
    Ol_Chiki                桑塔利文
    Old_Italic              古意大利文
    Old_Persian             古波斯文
    Oriya                   奥里亚文
    Osmanya                 奥斯曼亚文
    Phags_Pa                八思巴文
    Phoenician              腓尼基文
    Rejang                  拉让文
    Runic                   古代北欧文字
    Saurashtra              索拉什特拉文（印度县城）
    Shavian                 萧伯纳文
    Sinhala                 僧伽罗文
    Sundanese               巽他文
    Syloti_Nagri            锡尔赫特文
    Syriac                  叙利亚文
    Tagalog                 塔加拉文
    Tagbanwa                塔格巴努亚文
    Tai_Le                  德宏傣文
    Tamil                   泰米尔文
    Telugu                  泰卢固文
    Thaana                  塔安那文
    Thai                    泰文
    Tibetan                 藏文
    Tifinagh                提非纳文
    Ugaritic                乌加里特文
    Vai                     瓦伊文
    Yi                      彝文
```
### Regexp 包的使用
下面通过几个示例来演示一下 regexp 包的使用。

【示例 1】匹配指定类型的字符串。
```go
package main

import (
    "fmt"
    "regexp"
)

func main() {
    buf := "abc azc a7c aac 888 a9c  tac"
    //解析正则表达式，如果成功返回解释器
    reg1 := regexp.MustCompile(`a.c`)
    if reg1 == nil {
        fmt.Println("regexp err")
        return
    }
    //根据规则提取关键信息
    result1 := reg1.FindAllStringSubmatch(buf, -1)
    fmt.Println("result1 = ", result1)
}
```
运行结果如下：
```
result1 =  [[abc] [azc] [a7c] [aac] [a9c]]　　
```
## Go语言time包
### time 包简介
时间一般包含时间值和时区，可以从Go语言中 time 包的源码中看出：
```go
type Time struct {
    // wall and ext encode the wall time seconds, wall time nanoseconds,
    // and optional monotonic clock reading in nanoseconds.
    //
    // From high to low bit position, wall encodes a 1-bit flag (hasMonotonic),
    // a 33-bit seconds field, and a 30-bit wall time nanoseconds field.
    // The nanoseconds field is in the range [0, 999999999].
    // If the hasMonotonic bit is 0, then the 33-bit field must be zero
    // and the full signed 64-bit wall seconds since Jan 1 year 1 is stored in ext.
    // If the hasMonotonic bit is 1, then the 33-bit field holds a 33-bit
    // unsigned wall seconds since Jan 1 year 1885, and ext holds a
    // signed 64-bit monotonic clock reading, nanoseconds since process start.
    wall uint64
    ext  int64

    // loc specifies the Location that should be used to
    // determine the minute, hour, month, day, and year
    // that correspond to this Time.
    // The nil location means UTC.
    // All UTC times are represented with loc==nil, never loc==&utcLoc.
    loc *Location
}
```
上面代码中：
* wall：表示距离公元 1 年 1 月 1 日 00:00:00UTC 的秒数；
* ext：表示纳秒；
* loc：代表时区，主要处理偏移量，不同的时区，对应的时间不一样。
### 如何正确表示时间呢？
公认最准确的计算应该是使用“原子震荡周期”所计算的物理时钟了（Atomic Clock, 也被称为原子钟），这也被定义为标准时间（International Atomic Time）。

而我们常常看见的 UTC（Universal Time Coordinated，世界协调时间）就是利用这种 Atomic Clock 为基准所定义出来的正确时间。UTC 标准时间是以 GMT（Greenwich Mean Time，格林尼治时间）这个时区为主，所以本地时间与 UTC 时间的时差就是本地时间与 GMT 时间的时差。
```
UTC + 时区差 ＝ 本地时间
```
国内一般使用的是北京时间，与 UTC 的时间关系如下：
```
UTC + 8 个小时 = 北京时间
```
在Go语言的 time 包里面有两个时区变量，如下：
```
    time.UTC：UTC 时间
    time.Local：本地时间
```
同时，Go语言还提供了 LoadLocation 方法和 FixedZone 方法来获取时区变量，如下：
```
FixedZone(name string, offset int) *Location // 其中，name 为时区名称，offset 是与 UTC 之前的时差。
LoadLocation(name string) (*Location, error) // 其中，name 为时区的名字。
```
### 时间的获取
#### 1) 获取当前时间
通过 time.Now() 函数来获取当前的时间对象，然后通过事件对象来获取当前的时间信息。示例代码如下：
```go
package main

import (
    "fmt"
    "time"
)

func main() {
    now := time.Now() //获取当前时间
    fmt.Printf("current time:%v\n", now)
    year := now.Year()     //年
    month := now.Month()   //月
    day := now.Day()       //日
    hour := now.Hour()     //小时
    minute := now.Minute() //分钟
    second := now.Second() //秒
    fmt.Printf("%d-%02d-%02d %02d:%02d:%02d\n", year, month, day, hour, minute, second)
}
```
运行结果如下：
```
current time:2023-01-03 02:56:42.132839744 +0000 UTC m=+0.000048903
2023-01-03 02:56:42
```
#### 2) 获取时间戳
时间戳是自 1970 年 1 月 1 日（08:00:00GMT）至当前时间的总毫秒数，它也被称为 Unix 时间戳（UnixTimestamp）。

基于时间对象获取时间戳的示例代码如下：
```go
package main

import (
    "fmt"
    "time"
)

func main() {
    now := time.Now()            //获取当前时间
    timestamp1 := now.Unix()     //时间戳
    timestamp2 := now.UnixNano() //纳秒时间戳
    fmt.Printf("现在的时间戳：%v\n", timestamp1) // 现在的时间戳：1576127858
    fmt.Printf("现在的纳秒时间戳：%v\n", timestamp2) // 现在的纳秒时间戳：1576127858829900100
}
```
使用 time.Unix() 函数可以将时间戳转为时间格式，示例代码如下：
```go
    now := time.Now()                  //获取当前时间
    timestamp := now.Unix()            //时间戳
    timeObj := time.Unix(timestamp, 0) //将时间戳转为时间格式
    fmt.Println(timeObj) // 2019-12-12 13:24:09 +0800 CST
```
#### 3) 获取当前是星期几
time 包中的 Weekday 函数能够返回某个时间点所对应是一周中的周几，示例代码如下：
```go
package main

import (
    "fmt"
    "time"
)

func main() {
    //时间戳
    t := time.Now()
    fmt.Println(t.Weekday().String()) // Thursday
}
```
### 时间操作函数
#### 1) Add
我们在日常的开发过程中可能会遇到要求某个时间 + 时间间隔之类的需求，Go语言中的 Add 方法如下：
```
func (t Time) Add(d Duration) Time  // Add 函数可以返回时间点 t + 时间间隔 d 的值。
```
【示例】求一个小时之后的时间：
```go
package main

import (
    "fmt"
    "time"
)

func main() {
    now := time.Now()
    later := now.Add(time.Hour) // 当前时间加1小时后的时间
    fmt.Println(later)
}
```
#### 2) Sub
求两个时间之间的差值：
```
func (t Time) Sub(u Time) Duration  // 返回一个时间段 t - u 的值。如果结果超出了 Duration 可以表示的最大值或最小值，将返回最大值或最小值，要获取时间点 t - d（d 为 Duration），可以使用 t.Add(-d)。
```
#### 3) Equal
判断两个时间是否相同：
```
func (t Time) Equal(u Time) bool  // Equal 函数会考虑时区的影响，因此不同时区标准的时间也可以正确比较，Equal 方法和用 t==u 不同，Equal 方法还会比较地点和时区信息。
```
#### 4) Before
判断一个时间点是否在另一个时间点之前：
```
func (t Time) Before(u Time) bool
```
如果 t 代表的时间点在 u 之前，则返回真，否则返回假。
#### 5) After
判断一个时间点是否在另一个时间点之后：
```
func (t Time) After(u Time) bool
```
如果 t 代表的时间点在 u 之后，则返回真，否则返回假。
### 定时器
使用 time.Tick(时间间隔) 可以设置定时器，定时器的本质上是一个通道（channel），示例代码如下：
```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ticker := time.Tick(time.Second) //定义一个1秒间隔的定时器
    for i := range ticker {
        fmt.Println(i) //每秒都会执行的任务
    }
}
```
运行结果如下：
```
2019-12-12 15:14:26.4158067 +0800 CST m=+16.007460701
2019-12-12 15:14:27.4159467 +0800 CST m=+17.007600701
2019-12-12 15:14:28.4144689 +0800 CST m=+18.006122901
2019-12-12 15:14:29.4159581 +0800 CST m=+19.007612101
2019-12-12 15:14:30.4144337 +0800 CST m=+20.006087701
...
```
### 时间格式化
时间类型有一个自带的 Format 方法进行格式化，需要注意的是Go语言中格式化时间模板不是常见的Y-m-d H:M:S而是使用Go语言的诞生时间 2006 年 1 月 2 号 15 点 04 分 05 秒。
> 提示：如果想将时间格式化为 12 小时格式，需指定 PM。
```go
package main

import (
    "fmt"
    "time"
)

func main() {
    now := time.Now()
    // 格式化的模板为Go的出生时间2006年1月2号15点04分 Mon Jan
    // 24小时制
    fmt.Println(now.Format("2006-01-02 15:04:05.000 Mon Jan"))
    // 12小时制
    fmt.Println(now.Format("2006-01-02 03:04:05.000 PM Mon Jan"))
    fmt.Println(now.Format("2006/01/02 15:04"))
    fmt.Println(now.Format("15:04 2006/01/02"))
    fmt.Println(now.Format("2006/01/02"))
}
```
运行结果如下：
```
2019-12-12 15:20:52.037 Thu Dec
2019-12-12 03:20:52.037 PM Thu Dec
2019/12/12 15:20
15:20 2019/12/12
2019/12/12
```
### 解析字符串格式的时间
Parse 函数可以解析一个格式化的时间字符串并返回它代表的时间。
```
func Parse(layout, value string) (Time, error)
```
与 Parse 函数类似的还有 ParseInLocation 函数。
```
func ParseInLocation(layout, value string, loc \*Location) (Time, error)
```
ParseInLocation 与 Parse 函数类似，但有两个重要的不同之处：
* 第一，当缺少时区信息时，Parse 将时间解释为 UTC 时间，而 ParseInLocation 将返回值的 Location 设置为 loc；
* 第二，当时间字符串提供了时区偏移量信息时，Parse 会尝试去匹配本地时区，而 ParseInLocation 会去匹配 loc。
```go
package main

import (
    "fmt"
    "time"
)

func main() {
    var layout string = "2006-01-02 15:04:05"
    var timeStr string = "2019-12-12 15:22:12"

    timeObj1, _ := time.Parse(layout, timeStr)
    fmt.Println(timeObj1)

    timeObj2, _ := time.ParseInLocation(layout, timeStr, time.Local)
    fmt.Println(timeObj2)
}
```
运行结果如下：
```
2019-12-12 15:22:12 +0000 UTC
2019-12-12 15:22:12 +0800 CST
```
## Go语言os包用法简述
Go语言的 os 包中提供了操作系统函数的接口，是一个比较重要的包。顾名思义，os 包的作用主要是在服务器上进行系统的基本操作，如文件操作、目录操作、执行命令、信号与中断、进程、系统状态等等。
### os 包中的常用函数
#### 1) Hostname
```
func Hostname() (name string, err error) // Hostname 函数会返回内核提供的主机名。
```
#### 2) Environ
```
func Environ() []string  // Environ 函数会返回所有的环境变量，返回值格式为“key=value”的字符串的切片拷贝。
```
#### 3) Getenv
```
func Getenv(key string) string // Getenv 函数会检索并返回名为 key 的环境变量的值。如果不存在该环境变量则会返回空字符串。
```
#### 4) Setenv
```
func Setenv(key, value string) error  // Setenv 函数可以设置名为 key 的环境变量，如果出错会返回该错误。
```
#### 5) Exit
```go
func Exit(code int) // Exit 函数可以让当前程序以给出的状态码 code 退出。一般来说，状态码 0 表示成功，非 0 表示出错。程序会立刻终止，并且 defer 的函数不会被执行。
```
#### 6) Getuid
```
func Getuid() int  // Getuid 函数可以返回调用者的用户 ID。
```
#### 7) Getgid
```
func Getgid() int  // Getgid 函数可以返回调用者的组 ID。
```
#### 8) Getpid
```
func Getpid() int  // Getpid 函数可以返回调用者所在进程的进程 ID。
```
#### 9) Getwd
```
func Getwd() (dir string, err error)  // Getwd 函数可以返回一个对应当前工作目录的根路径。如果当前目录可以经过多条路径抵达（因为硬链接），Getwd 会返回其中一个。
```
#### 10) Mkdir
```
func Mkdir(name string, perm FileMode) error // Mkdir 函数可以使用指定的权限和名称创建一个目录。如果出错，会返回 *PathError 底层类型的错误。
```
#### 11) MkdirAll
```
func MkdirAll(path string, perm FileMode) error
```
MkdirAll 函数可以使用指定的权限和名称创建一个目录，包括任何必要的上级目录，并返回 nil，否则返回错误。权限位 perm 会应用在每一个被该函数创建的目录上。如果 path 指定了一个已经存在的目录，MkdirAll 不做任何操作并返回 nil。
#### 12) Remove
```
func Remove(name string) error
Remove 函数会删除 name 指定的文件或目录。如果出错，会返回 *PathError 底层类型的错误。
RemoveAll 函数跟 Remove 用法一样，区别是会递归的删除所有子目录和文件。
```
### os/exec 执行外部命令
exec 包可以执行外部命令，它包装了 os.StartProcess 函数以便更容易的修正输入和输出，使用管道连接 I/O，以及作其它的一些调整。
```
func LookPath(file string) (string, error)
```
在环境变量 PATH 指定的目录中搜索可执行文件，如果 file 中有斜杠，则只在当前目录搜索。返回完整路径或者相对于当前目录的一个相对路径。
```go
package main

import (
    "fmt"
    "os/exec"
)

func main() {
    f, err := exec.LookPath("main")
    if err != nil {
        fmt.Println(err)
    }
    fmt.Println(f)
}
```
```
main.exe
```
### os/user 获取当前用户信息
可以通过 os/user 包中的 Current() 函数来获取当前用户信息，该函数会返回一个 User 结构体，结构体中的 Username、Uid、HomeDir、Gid 分别表示当前用户的名称、用户 id、用户主目录和用户所属组 id，函数原型如下：
```
func Current() (*User, error)
```
```go
package main

import (
    "log"
    "os/user"
)

func main() {
    u, _ := user.Current()
    log.Println("用户名：", u.Username)
    log.Println("用户id", u.Uid)
    log.Println("用户主目录：", u.HomeDir)
    log.Println("主组id：", u.Gid)

    // 用户所在的所有的组的id
    s, _ := u.GroupIds()
    log.Println("用户所在的所有组：", s)
}
```
```
2019/12/13 15:12:14 用户名： LENOVO-PC\\Administrator
2019/12/13 15:12:14 用户id S-1-5-21-711400000-2334436127-1750000211-000
2019/12/13 15:12:14 用户主目录： C:\\Users\\Administrator
2019/12/13 15:12:14 主组id： S-1-5-22-766000000-2300000100-1050000262-000
2019/12/13 15:12:14 用户所在的所有组： \[S-1-5-32-544 S-1-5-22-000 S-1-5-21-777400999-2344436111-1750000262-003\]
```
### os/signal 信号处理
一个运行良好的程序在退出（正常退出或者强制退出，如 Ctrl+C，kill 等）时是可以执行一段清理代码的，将收尾工作做完后再真正退出。一般采用系统 Signal 来通知系统退出，如 kill pid，在程序中针对一些系统信号设置了处理函数，当收到信号后，会执行相关清理程序或通知各个子进程做自清理。

Go语言中对信号的处理主要使用 os/signal 包中的两个方法，一个是 Notify 方法用来监听收到的信号，一个是 stop 方法用来取消监听。
```
func Notify(c chan<- os.Signal, sig ...os.Signal)
```
其中，第一个参数表示接收信号的 channel，第二个及后面的参数表示设置要监听的信号，如果不设置表示监听所有的信号。

【示例 1】使用 Notify 方法来监听收到的信号：
```go
package main

import (
    "fmt"
    "os"
    "os/signal"
)

func main() {
    c := make(chan os.Signal, 0)
    signal.Notify(c)

    // Block until a signal is received.
    s := <-c
    fmt.Println("Got signal:", s)
}
```
运行该程序，然后在 CMD 窗口中通过 Ctrl+C 来结束该程序，便会得到输出结果：
```
Got signal: interrupt
```
【示例 2】使用 stop 方法来取消监听：
```go
package main

import (
    "fmt"
    "os"
    "os/signal"
)

func main() {
    c := make(chan os.Signal, 0)
    signal.Notify(c)

    signal.Stop(c) //不允许继续往c中存入内容
    s := <-c       //c无内容，此处阻塞，所以不会执行下面的语句，也就没有输出
    fmt.Pr
```
因为使用 Stop 方法取消了 Notify 方法的监听，所以运行程序没有输出结果。
## Go语言flag包
在编写命令行程序（工具、server）时，我们有时需要对命令参数进行解析，各种编程语言一般都会提供解析命令行参数的方法或库，以方便程序员使用。在Go语言中的 flag 包中，提供了命令行参数解析的功能。
* 命令行参数（或参数）：是指运行程序时提供的参数；
* 已定义命令行参数：是指程序中通过 flag.Type 这种形式定义了的参数；
* 非 flag（non-flag）命令行参数（或保留的命令行参数）：可以简单理解为 flag 包不能解析的参数。
### flag 参数类型
flag 包支持的命令行参数类型有 bool、int、int64、uint、uint64、float、float64、string、duration，如下表所示：
| flag 参数 | 有效值 |
| ----      | ----- |
| 字符串 flag | 合法字符串 |
| 整数 flag | 1234、0664、0x1234 等类型，也可以是负数 |
| 浮点数 flag | 合法浮点数 |
| bool 类型 flag | 1、0、t、f、T、F、true、false、TRUE、FALSE、True、False |
| 时间段 flag | 任何合法的时间段字符串，如“300ms”、“-1.5h”、“2h45m”， |
| 合法的单位有“ns”、“us”、“µs”、“ms”、“s”、“m”、“h” |  |
### flag 包基本使用
#### 1) flag.Type()
```
flag.Type(flag 名, 默认值, 帮助信息) *Type
```
Type 可以是 Int、String、Bool 等，返回值为一个相应类型的指针，例如我们要定义姓名、年龄、婚否三个命令行参数，我们可以按如下方式定义：
```
name := flag.String("name", "张三", "姓名")
age := flag.Int("age", 18, "年龄")
married := flag.Bool("married", false, "婚否")
delay := flag.Duration("d", 0, "时间间隔")
```
需要注意的是，此时 name、age、married、delay 均为对应类型的指针。
#### 2) flag.TypeVar()
```
flag.TypeVar(Type 指针, flag 名, 默认值, 帮助信息)
```
TypeVar 可以是 IntVar、StringVar、BoolVar 等，其功能为将 flag 绑定到一个变量上，例如我们要定义姓名、年龄、婚否三个命令行参数，我们可以按如下方式定义：
```
var name string
var age int
var married bool
var delay time.Duration
flag.StringVar(&name, "name", "张三", "姓名")
flag.IntVar(&age, "age", 18, "年龄")
flag.BoolVar(&married, "married", false, "婚否")
flag.DurationVar(&delay, "d", 0, "时间间隔")
```
#### flag.Parse()
通过以上两种方法定义好命令行 flag 参数后，需要通过调用 flag.Parse() 来对命令行参数进行解析。

支持的命令行参数格式有以下几种：
* -flag：只支持 bool 类型；
* -flag=x；
* -flag x：只支持非 bool 类型。
其中，布尔类型的参数必须使用等号的方式指定。

flag 包的其他函数：
```
flag.Args()  //返回命令行参数后的其他参数，以 \[\]string 类型
flag.NArg()  //返回命令行参数后的其他参数个数
flag.NFlag() //返回使用的命令行参 数个数
```
结合上面的介绍知识，我们来看一个实例，代码如下：
```go
package main

import (
    "flag"
    "fmt"
)

var Input_pstrName = flag.String("name", "gerry", "input ur name")
var Input_piAge = flag.Int("age", 20, "input ur age")
var Input_flagvar int

func Init() {
    flag.IntVar(&Input_flagvar, "flagname", 1234, "help message for flagname")
}

func main() {
    Init()
    flag.Parse()

    // After parsing, the arguments after the flag are available as the slice flag.Args() or individually as flag.Arg(i). The arguments are indexed from 0 through flag.NArg()-1
    // Args returns the non-flag command-line arguments
    // NArg is the number of arguments remaining after flags have been processed
    fmt.Printf("args=%s, num=%d\n", flag.Args(), flag.NArg())
    for i := 0; i != flag.NArg(); i++ {
        fmt.Printf("arg[%d]=%s\n", i, flag.Arg(i))
    }

    fmt.Println("name=", *Input_pstrName)
    fmt.Println("age=", *Input_piAge)
    fmt.Println("flagname=", Input_flagvar)
}
```
运行结果如下：
```
go run main.go -name "aaa" -age=123 -flagname=999
args=[], num=0
name= aaa
age= 123
flagname= 999
```
#### 自定义 Value
另外，我们还可以创建自定义 flag，只要实现 flag.Value 接口即可（要求 receiver 是指针类型），这时候可以通过如下方式定义该 flag：
```
flag.Var(&flagVal, "name", "help message for flagname")
```
【示例】解析喜欢的编程语言，并直接解析到 slice 中，我们可以定义如下 sliceValue 类型，然后实现 Value 接口：
```go
package main

import (
    "flag"
    "fmt"
    "strings"
)

//定义一个类型，用于增加该类型方法
type sliceValue []string

//new一个存放命令行参数值的slice
func newSliceValue(vals []string, p *[]string) *sliceValue {
    *p = vals
    return (*sliceValue)(p)
}

/*
Value接口：
type Value interface {
    String() string
    Set(string) error
}
实现flag包中的Value接口，将命令行接收到的值用,分隔存到slice里
*/
func (s *sliceValue) Set(val string) error {
    *s = sliceValue(strings.Split(val, ","))
    return nil
}

//flag为slice的默认值default is me,和return返回值没有关系
func (s *sliceValue) String() string {
    *s = sliceValue(strings.Split("default is me", ","))
    return "It's none of my business"
}

/*
可执行文件名 -slice="java,go"  最后将输出[java,go]
可执行文件名 最后将输出[default is me]
*/
func main(){
    var languages []string
    flag.Var(newSliceValue([]string{}, &languages), "slice", "I like programming `languages`")
    flag.Parse()

    //打印结果slice接收到的值
    fmt.Println(languages)
}
```
通过-slice go,php这样的形式传递参数，languages 得到的就是 [go, php]，如果不加-slice参数则打印默认值[default is me]，如下所示：
```
go run main.go -slice go,php,java
[go php java]
```
