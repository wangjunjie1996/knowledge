# Go语言结构体

Go 语言通过用自定义的方式形成新的类型，结构体是类型中带有成员的复合类型。Go 语言使用结构体和结构体成员来描述真实世界的实体和实体对应的各种属性。
Go 语言中的类型可以被实例化，使用new或&构造的类型实例的类型是类型的指针。
结构体成员是由一系列的成员变量构成，这些成员变量也被称为“字段”。字段有以下特性：

* 字段拥有自己的类型和值。
* 字段名必须唯一。
* 字段的类型也可以是结构体，甚至是字段所在结构体的类型。
关于 Go 语言的类（class）
* Go 语言中没有“类”的概念，也不支持“类”的继承等面向对象的概念。
* Go 语言的结构体与“类”都是复合结构体，但 Go 语言中结构体的内嵌配合接口比面向对象具有更高的扩展性和灵活性。
* Go 语言不仅认为结构体能拥有方法，且每种自定义类型也可以拥有自己的方法。

## Go语言结构体定义

使用关键字 type 可以将各种基本类型定义为自定义类型，基本类型包括整型、字符串、布尔等。结构体是一种复合的基本类型，通过 type 定义为自定义类型后，使结构体更便于使用。
结构体的定义格式如下：

```go
type 类型名 struct {
    字段1 字段1类型
    字段2 字段2类型
    …
}
```

* 类型名：标识自定义结构体的名称，在同一个包内不能重复。
* struct{}：表示结构体类型，type 类型名 struct{}可以理解为将 struct{} 结构体定义为类型名的类型。
* 字段1、字段2……：表示结构体字段名，结构体中的字段名必须唯一。
* 字段1类型、字段2类型……：表示结构体各个字段的类型。
使用结构体可以表示一个包含 X 和 Y 整型分量的点结构，代码如下：

```go
type Point struct {
    X int
    Y int
}
```

同类型的变量也可以写在一行，颜色的红、绿、蓝 3 个分量可以使用 byte 类型表示，定义的颜色结构体如下：

```go
type Color struct {
    R, G, B byte
}
```

## Go语言实例化结构体

结构体的定义只是一种内存布局的描述，只有当结构体实例化时，才会真正地分配内存，因此必须在定义结构体并实例化后才能使用结构体的字段。
实例化就是根据结构体定义的格式创建一份与格式一致的内存区域，结构体实例与实例间的内存是完全独立的。
Go语言可以通过多种方式实例化结构体，根据实际需要可以选用不同的写法。

### 基本的实例化形式

结构体本身是一种类型，可以像整型、字符串等类型一样，以 var 的方式声明结构体即可完成实例化。

```go
var ins T
// 其中，T 为结构体类型，ins 为结构体的实例。
// 用结构体表示的点结构（Point）的实例化过程请参见下面的代码：
type Point struct {
    X int
    Y int
}

var p Point
p.X = 10
p.Y = 20
```

### 创建指针类型的结构体

Go语言中，还可以使用 new 关键字对类型（包括结构体、整型、浮点数、字符串等）进行实例化，结构体在实例化后会形成指针类型的结构体。

```go
ins := new(T)
```

* T 为类型，可以是结构体、整型、字符串等。
* ins：T 类型被实例化后保存到 ins 变量中，ins 的类型为 *T，属于指针。
Go语言让我们可以像访问普通结构体一样使用.来访问结构体指针的成员。
下面的例子定义了一个玩家（Player）的结构，玩家拥有名字、生命值和魔法值，实例化玩家（Player）结构体后，可对成员进行赋值，代码如下：

```go
type Player struct{
    Name string
    HealthPoint int
    MagicPoint int
}

tank := new(Player)
tank.Name = "Canon"
tank.HealthPoint = 300
```

经过 new 实例化的结构体实例在成员赋值上与基本实例化的写法一致。

### Go语言和 C/C++

在 C/C++ 语言中，使用 new 实例化类型后，访问其成员变量时必须使用->操作符。
在Go语言中，访问结构体指针的成员变量时可以继续使用.，这是因为Go语言为了方便开发者访问结构体指针的成员变量，使用了语法糖（Syntactic sugar）技术，将 ins.Name 形式转换为 (*ins).Name。

### 取结构体的地址实例化

在Go语言中，对结构体进行&取地址操作时，视为对该类型进行一次 new 的实例化操作，取地址格式如下：

```go
ins := &T{}
```

* T 表示结构体类型。
* ins 为结构体的实例，类型为 *T，是指针类型。
下面使用结构体定义一个命令行指令（Command），指令中包含名称、变量关联和注释等，对 Command 进行指针地址的实例化，并完成赋值过程，代码如下：

```go
type Command struct {
    Name    string    // 指令名称
    Var     *int      // 指令绑定的变量
    Comment string    // 指令的注释
}

var version int = 1

cmd := &Command{}
cmd.Name = "version"
cmd.Var = &version
cmd.Comment = "show version"
```

## Go语言初始化结构体的成员变量

### 使用“键值对”初始化结构体

```go
type People struct {
    name  string
    child *People
}

relation := &People{
    name: "爷爷",
    child: &People{
        name: "爸爸",
        child: &People{
                name: "我",
        },
    },
}
```

> 提示：结构体成员中只能包含结构体的指针类型，包含非指针类型会引起编译错误。

### 使用多个值的列表初始化结构体

使用这种格式初始化时，需要注意：

* 必须初始化结构体的所有字段。
* 每一个初始值的填充顺序必须与字段在结构体中的声明顺序一致。
* 键值对与值列表的初始化形式不能混用。

```go
type Address struct {
    Province    string
    City        string
    ZipCode     int
    PhoneNumber string
}

addr := Address{
    "四川",
    "成都",
    610000,
    "0",
}
```

### 初始化匿名结构体

匿名结构体没有类型名称，无须通过 type 关键字定义就可以直接使用。

```go
ins := struct {
    // 匿名结构体字段定义
    字段1 字段类型1
    字段2 字段类型2
    …
}{
    // 字段值初始化
    初始化字段1: 字段1的值,
    初始化字段2: 字段2的值,
    …
}

// 示例
msg := &struct {  // 定义部分
    id   int
    data string
}{  // 值初始化部分
    1024,
    "hello",
}
```

## Go语言构造函数

Go语言的类型或结构体没有构造函数的功能，但是我们可以使用结构体初始化的过程来模拟实现构造函数。

### 多种方式创建和初始化结构体——模拟构造函数重载

```go
type Cat struct {
    Color string
    Name  string
}

func NewCatByName(name string) *Cat {
    return &Cat{
        Name: name,
    }
}

func NewCatByColor(color string) *Cat {
    return &Cat{
        Color: color,
    }
}
```

在这个例子中，颜色和名字两个属性的类型都是字符串，由于Go语言中没有函数重载，为了避免函数名字冲突，使用 NewCatByName() 和 NewCatByColor() 两个不同的函数名表示不同的 Cat 构造过程。

### 带有父子关系的结构体的构造和初始化——模拟父级构造调用

黑猫是一种猫，猫是黑猫的一种泛称，同时描述这两种概念时，就是派生，黑猫派生自猫的种类，使用结构体描述猫和黑猫的关系时，将猫（Cat）的结构体嵌入到黑猫（BlackCat）中，表示黑猫拥有猫的特性，然后再使用两个不同的构造函数分别构造出黑猫和猫两个结构体实例，参考下面的代码：

```go
type Cat struct {
    Color string
    Name  string
}

type BlackCat struct {
    Cat  // 嵌入Cat, 类似于派生
}

// “构造基类”
func NewCat(name string) *Cat {
    return &Cat{
        Name: name,
    }
}

// “构造子类”
func NewBlackCat(color string) *BlackCat {
    cat := &BlackCat{}
    cat.Color = color
    return cat
}
```

## Go语言方法和接收器

在Go语言中，结构体就像是类的一种简化形式，那么类的方法在哪里呢？在Go语言中有一个概念，它和方法有着同样的名字，并且大体上意思相同，Go 方法是作用在接收器（receiver）上的一个函数，接收器是某种类型的变量，因此方法是一种特殊类型的函数。
接收器类型可以是（几乎）任何类型，不仅仅是结构体类型，任何类型都可以有方法，甚至可以是函数类型，可以是 int、bool、string 或数组的别名类型，但是接收器不能是一个接口类型，因为接口是一个抽象定义，而方法却是具体实现，如果这样做了就会引发一个编译错误invalid receiver type…。
接收器也不能是一个指针类型，但是它可以是任何其他允许类型的指针，一个类型加上它的方法等价于面向对象中的一个类，一个重要的区别是，在Go语言中，类型的代码和绑定在它上面的方法的代码可以不放置在一起，它们可以存在不同的源文件中，唯一的要求是它们必须是同一个包的。
类型 T（或 T）上的所有方法的集合叫做类型 T（或 T）的方法集。
因为方法是函数，所以同样的，不允许方法重载，即对于一个类型只能有一个给定名称的方法，但是如果基于接收器类型，是有重载的：具有同样名字的方法可以在 2 个或多个不同的接收器类型上存在，比如在同一个包里这么做是允许的。

### 为结构体添加方法

```go
type Bag struct {
    items []int
}

func (b *Bag) Insert(itemid int) {
    b.items = append(b.items, itemid)
}

func main() {
    b := new(Bag)
    b.Insert(1001)
}
```

Insert(itemid int) 的写法与函数一致，(b*Bag) 表示接收器，即 Insert 作用的对象实例。每个方法只能有一个接收器
在 Insert() 转换为方法后，我们就可以愉快地像其他语言一样，用面向对象的方法来调用 b 的 Insert。

### 接收器——方法作用的目标

接收器的格式如下：

```go
func (接收器变量 接收器类型) 方法名(参数列表) (返回参数) {
    函数体
}
```

* 接收器变量：接收器中的参数变量名在命名时，官方建议使用接收器类型名的第一个小写字母，而不是 self、this 之类的命名。例如，Socket 类型的接收器变量应该命名为 s，Connector 类型的接收器变量应该命名为 c 等。
* 接收器类型：接收器类型和参数类似，可以是指针类型和非指针类型。
* 方法名、参数列表、返回参数：格式与函数定义一致。
接收器根据接收器的类型可以分为指针接收器、非指针接收器，两种接收器在使用时会产生不同的效果，根据效果的不同，两种接收器会被用于不同性能和功能要求的代码中。

#### 1) 理解指针类型的接收器

指针类型的接收器由一个结构体的指针组成，更接近于面向对象中的 this 或者 self。
由于指针的特性，调用方法时，修改接收器指针的任意成员变量，在方法结束后，修改都是有效的。

```go
package main

import "fmt"

// 定义属性结构
type Property struct {
    value int  // 属性值
}

// 设置属性值
func (p *Property) SetValue(v int) {
    // 修改p的成员变量
    p.value = v
}

// 取属性值
func (p *Property) Value() int {
    return p.value
}

func main() {
    // 实例化属性
    p := new(Property)
    // 设置值
    p.SetValue(100)
    // 打印值
    fmt.Println(p.Value())
}
```
#### 2)理解非指针类型的接收器
当方法作用于非指针接收器时，Go语言会在代码运行时将接收器的值复制一份，在非指针接收器的方法中可以获取接收器的成员值，但修改后无效。
点（Point）使用结构体描述时，为点添加 Add() 方法，这个方法不能修改 Point 的成员 X、Y 变量，而是在计算后返回新的 Point 对象，Point 属于小内存对象，在函数返回值的复制过程中可以极大地提高代码运行效率，详细过程请参考下面的代码。
```go
package main

import (
    "fmt"
)

// 定义点结构
type Point struct {
    X int
    Y int
}

// 非指针接收器的加方法
func (p Point) Add(other Point) Point {
    // 成员值与参数相加后返回新的结构
    return Point{p.X + other.X, p.Y + other.Y}
}

func main() {
    // 初始化点
    p1 := Point{1, 1}
    p2 := Point{2, 2}
    // 与另外一个点相加
    result := p1.Add(p2)
    // 输出结果 {3 3}
    fmt.Println(result)

}
```
#### 3) 指针和非指针接收器的使用
在计算机中，小对象由于值复制时的速度较快，所以适合使用非指针接收器，大对象因为复制性能较低，适合使用指针接收器，在接收器和参数间传递时不进行复制，只是传递指针。
## Go语言为任意类型添加方法
Go语言可以对任何类型添加方法，给一种类型添加方法就像给结构体添加方法一样，因为结构体也是一种类型。
在Go语言中，使用 type 关键字可以定义出新的自定义类型，之后就可以为自定义类型添加各种方法了
## Go语言类型内嵌和结构体内嵌
结构体可以包含一个或多个匿名（或内嵌）字段，即这些字段没有显式的名字，只有字段的类型是必须的，此时类型也就是字段的名字。匿名字段本身可以是一个结构体类型，即结构体可以包含内嵌结构体。
可以粗略地将这个和面向对象语言中的继承概念相比较，随后将会看到它被用来模拟类似继承的行为。Go语言中的继承是通过内嵌或组合来实现的，所以可以说，在Go语言中，相比较于继承，组合更受青睐。
```go
package main
import "fmt"
type innerS struct {
    in1 int
    in2 int
}
type outerS struct {
    b int
    c float32
    int // anonymous field
    innerS //anonymous field
}
func main() {
    outer := new(outerS)
    outer.b = 6
    outer.c = 7.5
    outer.int = 60
    outer.in1 = 5
    outer.in2 = 10
    fmt.Printf("outer.b is: %d\n", outer.b)
    fmt.Printf("outer.c is: %f\n", outer.c)
    fmt.Printf("outer.int is: %d\n", outer.int)
    fmt.Printf("outer.in1 is: %d\n", outer.in1)
    fmt.Printf("outer.in2 is: %d\n", outer.in2)
    // 使用结构体字面量
    outer2 := outerS{6, 7.5, 60, innerS{5, 10}}
    fmt.Printf("outer2 is:", outer2)
}
```
运行结果如下所示：
```
outer.b is: 6
outer.c is: 7.500000
outer.int is: 60
outer.in1 is: 5
outer.in2 is: 10
outer2 is:{6 7.5 60 {5 10}}
```
通过类型 outer.int 的名字来获取存储在匿名字段中的数据，于是可以得出一个结论：在一个结构体中对于每一种数据类型只能有一个匿名字段。
### 内嵌结构体
同样地结构体也是一种数据类型，所以它也可以作为一个匿名字段来使用，如同上面例子中那样。外层结构体通过 outer.in1 直接进入内层结构体的字段，内嵌结构体甚至可以来自其他包。内层结构体被简单的插入或者内嵌进外层结构体。这个简单的“继承”机制提供了一种方式，使得可以从另外一个或一些类型继承部分或全部实现。
```go
package main
import "fmt"
type A struct {
    ax, ay int
}
type B struct {
    A
    bx, by float32
}
func main() {
    b := B{A{1, 2}, 3.0, 4.0}
    fmt.Println(b.ax, b.ay, b.bx, b.by)
    fmt.Println(b.A)
}
```
输出
```
1 2 3 4
{1 2}
```
### 结构内嵌特性
#### 1) 内嵌的结构体可以直接访问其成员变量
嵌入结构体的成员，可以通过外部结构体的实例直接访问。如果结构体有多层嵌入结构体，结构体实例访问任意一级的嵌入结构体成员时都只用给出字段名，而无须像传统结构体字段一样，通过一层层的结构体字段访问到最终的字段。例如，ins.a.b.c的访问可以简化为ins.c。
#### 2) 内嵌结构体的字段名是它的类型名
内嵌结构体字段仍然可以使用详细的字段进行一层层访问，内嵌结构体的字段名就是它的类型名，代码如下：
```go
var c Color
c.BasicColor.R = 1
c.BasicColor.G = 1
c.BasicColor.B = 0
```
一个结构体只能嵌入一个同类型的成员，无须担心结构体重名和错误赋值的情况，编译器在发现可能的赋值歧义时会报错。
## Go语言结构体内嵌模拟类的继承
```go
package main

import "fmt"

// 可飞行的
type Flying struct{}

func (f *Flying) Fly() {
    fmt.Println("can fly")
}

// 可行走的
type Walkable struct{}

func (f *Walkable) Walk() {
    fmt.Println("can calk")
}

// 人类
type Human struct {
    Walkable // 人类能行走
}

// 鸟类
type Bird struct {
    Walkable // 鸟类能行走
    Flying   // 鸟类能飞行
}

func main() {

    // 实例化鸟类
    b := new(Bird)
    fmt.Println("Bird: ")
    b.Fly()
    b.Walk()

    // 实例化人类
    h := new(Human)
    fmt.Println("Human: ")
    h.Walk()

}
```
## Go语言内嵌结构体成员名字冲突
嵌入结构体内部可能拥有相同的成员名，成员重名时会发生什么？下面通过例子来讲解。
```go
package main

import (
    "fmt"
)

type A struct {
    a int
}

type B struct {
    a int
}

type C struct {
    A
    B
}

func main() {
    c := &C{}
    c.A.a = 1
    fmt.Println(c) // 可以正常输出实例化 C 结构体
}
```
接着，修改为如下代码：
```go
func main() {
    c := &C{}
    c.a = 1
    fmt.Println(c)
}
```
此时再编译运行，编译器报错：
```
.\main.go:22:3: ambiguous selector c.a
```
编译器告知 C 的选择器 a 引起歧义，也就是说，编译器无法决定将 1 赋给 C 中的 A 还是 B 里的字段 a。在使用内嵌结构体时，Go语言的编译器会非常智能地提醒我们可能发生的歧义和错误。
## Go语言使用匿名结构体解析JSON数据
### 定义数据结构
首先，定义手机的各种数据结构体，如屏幕和电池
```go
// 定义手机屏幕
type Screen struct {
    Size       float32  // 屏幕尺寸
    ResX, ResY int      // 屏幕水平和垂直分辨率
}

// 定义电池
type Battery struct {
    Capacity int  // 容量
}
```
在转换 JSON 格式时，JSON 的各个字段名称默认使用结构体的名称，如果想要指定为其它的名称我们可以在声明结构体时添加一个json:" "标签，在" "中可以填入我们想要的内容，代码如下所示：
```go
    type Skill struct {
        Name  string `json:"name"`
        Level int    `json:"level"`
    }
```
### 准备 JSON 数据
准备手机数据结构，填充数据，将数据序列化为 JSON 格式的字节数组，代码如下：
```go
// 生成JSON数据
func genJsonData() []byte {
    // 完整数据结构
    raw := &struct {
        Screen
        Battery
        HasTouchID bool  // 序列化时添加的字段：是否有指纹识别
    }{
        // 屏幕参数
        Screen: Screen{
            Size: 5.5,
            ResX: 1920,
            ResY: 1080,
        },
        // 电池参数
        Battery: Battery{
            2910,
        },
        // 是否有指纹识别
        HasTouchID: true,
    }
    // 将数据序列化为JSON
    jsonData, _ := json.Marshal(raw)
    return jsonData
}
```
### 分离JSON数据
调用 genJsonData 获得 JSON 数据，将需要的字段填充到匿名结构体实例中，通过 json.Unmarshal 反序列化 JSON 数据达成分离 JSON 数据效果。代码如下：
```go
func main() {
    // 生成一段JSON数据
    jsonData := genJsonData()
    fmt.Println(string(jsonData))
    // 只需要屏幕和指纹识别信息的结构和实例
    screenAndTouch := struct {
            Screen
            HasTouchID bool
    }{}

    // 反序列化到screenAndTouch中
    json.Unmarshal(jsonData, &screenAndTouch)

    // 输出screenAndTouch的详细结构
    fmt.Printf("%+v\n", screenAndTouch)

    // 只需要电池和指纹识别信息的结构和实例
    batteryAndTouch := struct {
            Battery
            HasTouchID bool
    }{}

    // 反序列化到batteryAndTouch
    json.Unmarshal(jsonData, &batteryAndTouch)

    // 输出screenAndTouch的详细结构
    fmt.Printf("%+v\n", batteryAndTouch)
}
```
## Go语言垃圾回收和SetFinalizer
Go语言自带垃圾回收机制（GC）。GC 通过独立的进程执行，它会搜索不再使用的变量，并将其释放。需要注意的是，GC 在运行时会占用机器资源。

GC 是自动进行的，如果要手动进行 GC，可以使用 runtime.GC() 函数，显式的执行 GC。显式的进行 GC 只在某些特殊的情况下才有用，比如当内存资源不足时调用 runtime.GC() ，这样会立即释放一大片内存，但是会造成程序短时间的性能下降。

finalizer（终止器）是与对象关联的一个函数，通过 runtime.SetFinalizer 来设置，如果某个对象定义了 finalizer，当它被 GC 时候，这个 finalizer 就会被调用，以完成一些特定的任务，例如发信号或者写日志等。

在Go语言中 SetFinalizer 函数是这样定义的：
```go
func SetFinalizer(x, f interface{})
```
参数说明如下：
```
    参数 x 必须是一个指向通过 new 申请的对象的指针，或者通过对复合字面值取址得到的指针。
    参数 f 必须是一个函数，它接受单个可以直接用 x 类型值赋值的参数，也可以有任意个被忽略的返回值。
```
SetFinalizer 函数可以将 x 的终止器设置为 f，当垃圾收集器发现 x 不能再直接或间接访问时，它会清理 x 并调用 f(x)。

另外，x 的终止器会在 x 不能直接或间接访问后的任意时间被调用执行，不保证终止器会在程序退出前执行，因此一般终止器只用于在长期运行的程序中释放关联到某对象的非内存资源。例如，当一个程序丢弃一个 os.File 对象时没有调用其 Close 方法，该 os.File 对象可以使用终止器去关闭对应的操作系统文件描述符。

终止器会按依赖顺序执行：如果 A 指向 B，两者都有终止器，且 A 和 B 没有其它关联，那么只有 A 的终止器执行完成，并且 A 被释放后，B 的终止器才可以执行。此外，我们也可以使用SetFinalizer(x, nil)来清理绑定到 x 上的终止器。
> 提示：终止器只有在对象被 GC 时，才会被执行。其他情况下，都不会被执行，即使程序正常结束或者发生错误。
## Go语言链表操作
```
链表是一种物理存储单元上非连续、非顺序的存储结构，数据元素的逻辑顺序是通过链表中的指针链接次序实现的。
链表由一系列结点（链表中每一个元素称为结点）组成，结点可以在运行时动态生成。每个结点包括两个部分：一个是存储数据元素的数据域，另一个是存储下一个结点地址的指针域。
使用链表结构可以避免在使用数组时需要预先知道数据大小的缺点，链表结构可以充分利用计算机内存空间，实现灵活的内存动态管理。但是链表失去了数组随机读取的优点，同时链表由于增加了结点的指针域，空间开销比较大。
链表允许插入和移除表上任意位置上的结点，但是不允许随机存取。链表有三种类型：单向链表、双向链表以及循环链表。
```
### 单链表
```
单向链表中每个结点包含两部分，分别是数据域和指针域，上一个结点的指针指向下一结点，依次相连，形成链表。
这里介绍三个概念：首元结点、头结点和头指针。
```
* 首元结点：就是链表中存储第一个元素的结点，如下图中 a1 的位置。
* 头结点：它是在首元结点之前附设的一个结点，其指针域指向首元结点。头结点的数据域可以存储链表的长度或者其它的信息，也可以为空不存储任何信息。
* 头指针：它是指向链表中第一个结点的指针。若链表中有头结点，则头指针指向头结点；若链表中没有头结点，则头指针指向首元结点。
<img src="/img/4-1911291A225308.gif">
头结点在链表中不是必须的，但增加头结点有以下几点好处：
* 增加了头结点后，首元结点的地址保存在头结点的指针域中，对链表的第一个数据元素的操作与其他数据元素相同，无需进行特殊处理。
* 增加头结点后，无论链表是否为空，头指针都是指向头结点的非空指针，若链表为空的话，那么头结点的指针域为空。

### 使用 Struct 定义单链表
```go
type Node struct {
    Data  int
    Next  *node
}
```
其中成员 Data 用来存放结点中的有用数据，Next 是指针类型的成员，它指向 Node struct 类型数据，也就是下一个结点的数据类型。
```go
package main

import "fmt"

type Node struct {
    data int
    next *Node
}

func Shownode(p *Node) { //遍历
    for p != nil {
        fmt.Println(*p)
        p = p.next //移动指针
    }
}

func main() {
    var head = new(Node)
    head.data = 1
    var node1 = new(Node)
    node1.data = 2

    head.next = node1
    var node2 = new(Node)
    node2.data = 3

    node1.next = node2
    Shownode(head)
}
```
运行结果如下：
```go
{1 0xc00004c1e0}
{2 0xc00004c1f0}
{3 }
```
### 插入结点
单链表的结点插入方法一般使用头插法或者尾插法。
#### 1) 头插法
每次插入在链表的头部插入结点，代码如下所示：
```go
package main

import "fmt"

type Node struct {
    data  int
    next  *Node
}

func Shownode(p *Node){   //遍历
    for p != nil{
        fmt.Println(*p)
        p=p.next  //移动指针
    }
}

func main() {
    var head = new(Node)
    head.data = 0
    var tail *Node
    tail = head   //tail用于记录头结点的地址，刚开始tail的的指针指向头结点
    for i :=1 ;i<10;i++{
        var node = Node{data:i}
        node.next = tail   //将新插入的node的next指向头结点
        tail = &node      //重新赋值头结点
    }

    Shownode(tail) //遍历结果
}
```
运行结果如下:
```go
{9 0xc000036270}
{8 0xc000036260}
{7 0xc000036250}
{6 0xc000036240}
{5 0xc000036230}
{4 0xc000036220}
{3 0xc000036210}
{2 0xc000036200}
{1 0xc0000361f0}
{0 }
```
#### 2) 尾插法
每次插入结点在尾部，这也是我们较为习惯的方法。
```go
package main

import "fmt"

type Node struct {
    data  int
    next  *Node
}

func Shownode(p *Node){   //遍历
    for p != nil{
        fmt.Println(*p)
        p=p.next  //移动指针
    }
}

func main() {
    var head = new(Node)
    head.data = 0
    var tail *Node
    tail = head   //tail用于记录最末尾的结点的地址，刚开始tail的的指针指向头结点
    for i :=1 ;i<10;i++{
        var node = Node{data:i}
        (*tail).next = &node
        tail = &node
    }

    Shownode(head) //遍历结果
}
```
```
{0 0xc0000361f0}
{1 0xc000036200}
{2 0xc000036210}
{3 0xc000036220}
{4 0xc000036230}
{5 0xc000036240}
{6 0xc000036250}
{7 0xc000036260}
{8 0xc000036270}
{9 }
```
### 循环链表
循环链表跟单链表唯一的区别就在尾结点。单向链表的尾结点指针指向空地址，表示这就是最后的结点了，而循环链表的尾结点指针是指向链表的头结点，它像一个环一样首尾相连，所以叫作“循环”链表
### 双向链表
单向链表只有一个方向，结点只有一个后继指针 next 指向后面的结点。而双向链表，顾名思义它支持两个方向，每个结点不止有一个后继指针 next 指向后面的结点，还有一个前驱指针 prev 指向前面的结点。

##  Go语言数据I/O对象及操作
Go语言标准库的 bufio 包中，实现了对数据 I/O 接口的缓冲功能。这些功能封装于接口 io.ReadWriter、io.Reader 和 io.Writer 中，并对应创建了 ReadWriter、Reader 或 Writer 对象，在提供缓冲的同时实现了一些文本基本 I/O 操作功能。
### ReadWriter 对象
ReadWriter 对象可以对数据 I/O 接口 io.ReadWriter 进行输入输出缓冲操作，ReadWriter 结构定义如下：
```go
type ReadWriter struct {
    *Reader
    *Writer
}
```
默认情况下，ReadWriter 对象中存放了一对 Reader 和 Writer 指针，它同时提供了对数据 I/O 对象的读写缓冲功能。可以使用 NewReadWriter() 函数创建 ReadWriter 对象，该函数的功能是根据指定的 Reader 和 Writer 创建一个 ReadWriter 对象，ReadWriter 对象将会向底层 io.ReadWriter 接口写入数据，或者从 io.ReadWriter 接口读取数据。该函数原型声明如下：
```go
func NewReadWriter(r *Reader, w *Writer) *ReadWriter
```
在函数 NewReadWriter() 中，参数 r 是要读取的来源 Reader 对象，参数 w 是要写入的目的 Writer 对象。
### Reader 对象
Reader 对象可以对数据 I/O 接口 io.Reader 进行输入缓冲操作，Reader 结构定义如下：
```go
type Reader struct {
    //contains filtered or unexported fields
)
```
默认情况下 Reader 对象没有定义初始值，输入缓冲区最小值为 16。当超出限制时，另创建一个二倍的存储空间。
#### 创建 Reader 对象
可以创建 Reader 对象的函数一共有两个，分别是 NewReader() 和 NewReaderSize()，下面分别介绍。
##### 1) NewReader() 函数
NewReader() 函数的功能是按照缓冲区默认长度创建 Reader 对象，Reader 对象会从底层 io.Reader 接口读取尽量多的数据进行缓存。该函数原型如下：
```go
func NewReader(rd io.Reader) *Reader
```
其中，参数 rd 是 io.Reader 接口，Reader 对象将从该接口读取数据。
##### 2) NewReaderSize() 函数
NewReaderSize() 函数的功能是按照指定的缓冲区长度创建 Reader 对象，Reader 对象会从底层 io.Reader 接口读取尽量多的数据进行缓存。该函数原型如下：
```go
func NewReaderSize(rd io.Reader, size int) *Reader
```
其中，参数 rd 是 io.Reader 接口，参数 size 是指定的缓冲区字节长度。
### 操作 Reader 对象
操作 Reader 对象的方法共有 11 个，分别是 Read()、ReadByte()、ReadBytes()、ReadLine()、ReadRune ()、ReadSlice()、ReadString()、UnreadByte()、UnreadRune()、Buffered()、Peek()，下面分别介绍
#### 1) Read() 方法
Read() 方法的功能是读取数据，并存放到字节切片 p 中。Read() 执行结束会返回已读取的字节数，因为最多只调用底层的 io.Reader 一次，所以返回的 n 可能小于 len(p)，当字节流结束时，n 为 0，err 为 io. EOF。该方法原型如下：
```
func (b *Reader) Read(p []byte) (n int, err error)
```
在方法 Read() 中，参数 p 是用于存放读取数据的字节切片。示例代码如下：
```go
package main

import (
    "bufio"
    "bytes"
    "fmt"
)

func main() {
    data := []byte("C语言中文网")
    rd := bytes.NewReader(data)
    r := bufio.NewReader(rd)
    var buf [128]byte
    n, err := r.Read(buf[:])
    fmt.Println(string(buf[:n]), n, err) // C语言中文网 16
}
```
#### 2) ReadByte() 方法
ReadByte() 方法的功能是读取并返回一个字节，如果没有字节可读，则返回错误信息。该方法原型如下：
```
func (b *Reader) ReadByte() (c byte,err error)
```
```go
func main() {
    data := []byte("Go语言入门教程")
    rd := bytes.NewReader(data)
    r := bufio.NewReader(rd)
    c, err := r.ReadByte()
    fmt.Println(string(c), err) // G <nil>
}
```
#### 3) ReadBytes() 方法
ReadBytes() 方法的功能是读取数据直到遇到第一个分隔符“delim”，并返回读取的字节序列（包括“delim”）。如果 ReadBytes 在读到第一个“delim”之前出错，它返回已读取的数据和那个错误（通常是 io.EOF）。只有当返回的数据不以“delim”结尾时，返回的 err 才不为空值。该方法原型如下：
```
func (b *Reader) ReadBytes(delim byte) (line []byte, err error)
```
其中，参数 delim 用于指定分割字节。示例代码如下：
```go
func main() {
    data := []byte("C语言中文网, Go语言入门教程")
    rd := bytes.NewReader(data)
    r := bufio.NewReader(rd)
    var delim byte = ','
    line, err := r.ReadBytes(delim)
    fmt.Println(string(line), err) // C语言中文网, <nil>
}
```
#### 4) ReadLine() 方法
ReadLine() 是一个低级的用于读取一行数据的方法，大多数调用者应该使用 ReadBytes('\n') 或者 ReadString('\n')。ReadLine 返回一行，不包括结尾的回车字符，如果一行太长（超过缓冲区长度），参数 isPrefix 会设置为 true 并且只返回前面的数据，剩余的数据会在以后的调用中返回。

当返回最后一行数据时，参数 isPrefix 会置为 false。返回的字节切片只在下一次调用 ReadLine 前有效。ReadLine 会返回一个非空的字节切片或一个错误，方法原型如下：
```
func (b *Reader) ReadLine() (line []byte, isPrefix bool, err error)
```
示例代码如下：
```go
func main() {
    data := []byte("Golang is a beautiful language. \r\n I like it!")
    rd := bytes.NewReader(data)
    r := bufio.NewReader(rd)
    line, prefix, err := r.ReadLine()
    fmt.Println(string(line), prefix, err) // Golang is a beautiful language.  false
}
```
#### 5) ReadRune() 方法
ReadRune() 方法的功能是读取一个 UTF-8 编码的字符，并返回其 Unicode 编码和字节数。如果编码错误，ReadRune 只读取一个字节并返回 unicode.ReplacementChar(U+FFFD) 和长度 1。该方法原型如下：
```
func (b *Reader) ReadRune() (r rune, size int, err error)
```
示例代码如下：
```go
func main() {
    data := []byte("C语言中文网")
    rd := bytes.NewReader(data)
    r := bufio.NewReader(rd)
    ch, size, err := r.ReadRune()
    fmt.Println(string(ch), size, err) // C 1 <nil>
}
```
#### 6) ReadSlice() 方法
ReadSlice() 方法的功能是读取数据直到分隔符“delim”处，并返回读取数据的字节切片，下次读取数据时返回的切片会失效。如果 ReadSlice 在查找到“delim”之前遇到错误，它返回读取的所有数据和那个错误（通常是 io.EOF）。

如果缓冲区满时也没有查找到“delim”，则返回 ErrBufferFull 错误。ReadSlice 返回的数据会在下次 I/O 操作时被覆盖，大多数调用者应该使用 ReadBytes 或者 ReadString。只有当 line 不以“delim”结尾时，ReadSlice 才会返回非空 err。该方法原型如下：
```
func (b *Reader) ReadSlice(delim byte) (line []byte, err error)
```
```go
func main() {
    data := []byte("C语言中文网, Go语言入门教程")
    rd := bytes.NewReader(data)
    r := bufio.NewReader(rd)
    var delim byte = ','
    line, err := r.ReadSlice(delim)
    fmt.Println(string(line), err)
    line, err = r.ReadSlice(delim)
    fmt.Println(string(line), err)
    line, err = r.ReadSlice(delim)
    fmt.Println(string(line), err)
}
```
运行结果如下：
```
C语言中文网,   <nil>
Go语言入门教程 EOF
EOF
```
#### 7) ReadString() 方法
ReadString() 方法的功能是读取数据直到分隔符“delim”第一次出现，并返回一个包含“delim”的字符串。如果 ReadString 在读取到“delim”前遇到错误，它返回已读字符串和那个错误（通常是 io.EOF）。只有当返回的字符串不以“delim”结尾时，ReadString 才返回非空 err。该方法原型如下：
```
func (b *Reader) ReadString(delim byte) (line string, err error)
```
其中，参数 delim 用于指定分割字节。示例代码如下：
```go
func main() {
    data := []byte("C语言中文网, Go语言入门教程")
    rd := bytes.NewReader(data)
    r := bufio.NewReader(rd)
    var delim byte = ','
    line, err := r.ReadString(delim)
    fmt.Println(line, err)
}
```
运行结果为：
```go
C语言中文网, <nil>
```
#### 8) UnreadByte() 方法

UnreadByte() 方法的功能是取消已读取的最后一个字节（即把字节重新放回读取缓冲区的前部）。只有最近一次读取的单个字节才能取消读取。该方法原型如下：
```
func (b *Reader) UnreadByte() error
```
#### 9) UnreadRune() 方法

UnreadRune() 方法的功能是取消读取最后一次读取的 Unicode 字符。如果最后一次读取操作不是 ReadRune，UnreadRune 会返回一个错误（在这方面它比 UnreadByte 更严格，因为 UnreadByte 会取消上次任意读操作的最后一个字节）。该方法原型如下：
```
func (b *Reader) UnreadRune() error
```
#### 10) Buffered() 方法
Buffered() 方法的功能是返回可从缓冲区读出数据的字节数, 示例代码如下：
```go
func main() {
    data := []byte("Go语言入门教程")
    rd := bytes.NewReader(data)
    r := bufio.NewReader(rd)
    var buf [14]byte
    n, err := r.Read(buf[:])
    fmt.Println(string(buf[:n]), n, err)
    rn := r.Buffered()
    fmt.Println(rn)
    n, err = r.Read(buf[:])
    fmt.Println(string(buf[:n]), n, err)
    rn = r.Buffered()
    fmt.Println(rn)
}
```
运行结果如下：
```
Go语言入门 14  <nil>
6
教程 6   <nil>
0
```
#### 11) Peek() 方法
Peek() 方法的功能是读取指定字节数的数据，这些被读取的数据不会从缓冲区中清除。在下次读取之后，本次返回的字节切片会失效。如果 Peek 返回的字节数不足 n 字节，则会同时返回一个错误说明原因，如果 n 比缓冲区要大，则错误为 ErrBufferFull。该方法原型如下：
```
func (b *Reader) Peek(n int) ([]byte, error)
```
在方法 Peek() 中，参数 n 是希望读取的字节数。示例代码如下：
```go
func main() {
    data := []byte("Go语言入门教程")
    rd := bytes.NewReader(data)
    r := bufio.NewReader(rd)
    bl, err := r.Peek(8)
    fmt.Println(string(bl), err)
    bl, err = r.Peek(14)
    fmt.Println(string(bl), err)
    bl, err = r.Peek(20)
    fmt.Println(string(bl), err)
}
```
运行结果如下：
```
Go语言   <nil>
Go语言入门   <nil>
Go语言入门教程 <nil>
```
### Writer 对象
Writer 对象可以对数据 I/O 接口 io.Writer 进行输出缓冲操作

默认情况下 Writer 对象没有定义初始值，如果输出缓冲过程中发生错误，则数据写入操作立刻被终止，后续的写操作都会返回写入异常错误。

bufio.Writer 结构包装了一个 io.Writer 对象，提供缓存功能，同时实现了 io.Writer 接口。

Writer 结构没有任何导出的字段，结构定义如下：
```
type Writer struct {
        err error        // 写过程中遇到的错误
        buf []byte        // 缓存
        n   int            // 当前缓存中的字节数
        wr  io.Writer    // 底层的 io.Writer 对象
    }
```

#### 创建 Writer 对象
创建 Writer 对象的函数共有两个分别是 NewWriter() 和 NewWriterSize()，下面分别介绍一下。
##### 1) NewWriter() 函数
NewWriter() 函数的功能是按照默认缓冲区长度创建 Writer 对象，Writer 对象会将缓存的数据批量写入底层 io.Writer 接口。该函数原型如下：
```
func NewWriter(wr io.Writer) *Writer
```
其中，参数 wr 是 io.Writer 接口，Writer 对象会将数据写入该接口。
NewWriter 函数是调用 NewWriterSize 函数实现的
```go
func NewWriter(wr io.Writer) *Writer {
    // 默认缓存大小：defaultBufSize=4096
    return NewWriterSize(wr, defaultBufSize)
}
```
##### 2) NewWriterSize() 函数
NewWriterSize() 函数的功能是按照指定的缓冲区长度创建 Writer 对象，Writer 对象会将缓存的数据批量写入底层 io.Writer 接口。该函数原型如下：
```
func NewWriterSize(wr io.Writer, size int) *Writer
```
其中，参数 wr 是 io.Writer 接口，参数 size 是指定的缓冲区字节长度。

NewWriterSize 的源码：
```go
func NewWriterSize(wr io.Writer, size int) *Writer {
    // 已经是 bufio.Writer 类型，且缓存大小不小于 size，则直接返回
    b, ok := wr.(*Writer)
    if ok && len(b.buf) >= size {
        return b
    }
    if size <= 0 {
        size = defaultBufSize
    }
    return &Writer{
        buf: make([]byte, size),
        wr:  w,
    }
}
```
#### 操作 Writer 对象
操作 Writer 对象的方法共有 7 个，分别是 Available()、Buffered()、Flush()、Write()、WriteByte()、WriteRune() 和 WriteString() 方法，下面分别介绍。

##### Available 和 Buffered 方法
Available 方法获取缓存中还未使用的字节数（缓存大小 - 字段 n 的值）；Buffered 方法获取写入当前缓存中的字节数（字段 n 的值）

Available
```go
func main() {
    wr := bytes.NewBuffer(nil)
    w := bufio.NewWriter(wr)
    p := []byte("C语言中文网")
    fmt.Println("写入前未使用的缓冲区为：", w.Available())
    w.Write(p)
    fmt.Printf("写入%q后，未使用的缓冲区为：%d\n", string(p), w.Available())
}
```
运行结果
```
写入前未使用的缓冲区为： 4096
写入"C语言中文网"后，未使用的缓冲区为：4080
```
Buffered
```go
func main() {
    wr := bytes.NewBuffer(nil)
    w := bufio.NewWriter(wr)
    p := []byte("C语言中文网")
    fmt.Println("写入前缓存中的字节数：", w.Buffered())
    w.Write(p)
    fmt.Printf("写入%q后，缓存中的字节数：%d\n", string(p), w.Buffered())
    w.Flush()
    fmt.Println("执行 Flush 方法后，写入的字节数为：", w.Buffered())
}
```
结果
```
写入前缓存中的字节数: 0
写入"C语言中文网"后，缓存中的字节数：16
执行 Flush 方法后，写入的字节数为： 0
```
#####  Flush 方法
该方法将缓存中的所有数据写入底层的 io.Writer 对象中。使用 bufio.Writer 时，在所有的 Write 操作完成之后，应该调用 Flush 方法使得缓存都写入 io.Writer 对象中。
```
func (b *Writer) Flush() error
```
```go
func main() {
    wr := bytes.NewBuffer(nil)
    w := bufio.NewWriter(wr)
    p := []byte("C语言中文网")
    w.Write(p)
    fmt.Printf("未执行 Flush 缓冲区输出 %q\n", string(wr.Bytes()))
    w.Flush()
    fmt.Printf("执行 Flush 后缓冲区输出 %q\n", string(wr.Bytes()))
}
```
运行结果如下：
```
未执行 Flush 缓冲区输出 ""
执行 Flush 后缓冲区输出 "C语言中文网"
```
##### 4) Write() 方法
Write() 方法的功能是把字节切片 p 写入缓冲区，返回已写入的字节数 nn。如果 nn 小于 len(p)，则同时返回一个错误原因。该方法原型如下：
```
func (b *Writer) Write(p []byte) (nn int, err error)
```
其中，参数 p 是要写入的字节切片。示例代码如下：
```go
func main() {
    wr := bytes.NewBuffer(nil)
    w := bufio.NewWriter(wr)
    p := []byte("C语言中文网")
    n, err := w.Write(p)
    w.Flush()
    fmt.Println(string(wr.Bytes()), n, err) // C语言中文网 16 <nil>
}
```
##### 5) WriteByte() 方法
WriteByte() 方法的功能是写入一个字节，如果成功写入，error 返回 nil，否则 error 返回错误原因。该方法原型如下：
```
func (b *Writer) WriteByte(c byte) error
```
其中，参数 c 是要写入的字节数据，比如 ASCII 字符。示例代码如下：
```go
func main() {
    wr := bytes.NewBuffer(nil)
    w := bufio.NewWriter(wr)
    var c byte = 'G'
    err := w.WriteByte(c)
    w.Flush()
    fmt.Println(string(wr.Bytes()), err) // G <nil>
}
```
##### 6) WriteRune() 方法
WriteRune() 方法的功能是以 UTF-8 编码写入一个 Unicode 字符，返回写入的字节数和错误信息。该方法原型如下：
```
func (b *Writer) WriteRune(r rune) (size int,err error)
```
其中，参数 r 是要写入的 Unicode 字符。示例代码如下：
```go
func main() {
    wr := bytes.NewBuffer(nil)
    w := bufio.NewWriter(wr)
    var r rune = 'G'
    size, err := w.WriteRune(r)
    w.Flush()
    fmt.Println(string(wr.Bytes()), size, err) // G 1 <nil>
}
```
##### 7) WriteString() 方法
WriteString() 方法的功能是写入一个字符串，并返回写入的字节数和错误信息。如果返回的字节数小于 len(s)，则同时返回一个错误说明原因。该方法原型如下：
```go
func (b *Writer) WriteString(s string) (int, error)
```
其中，参数 s 是要写入的字符串。示例代码如下：
```go
func main() {
    wr := bytes.NewBuffer(nil)
    w := bufio.NewWriter(wr)
    s := "C语言中文网"
    n, err := w.WriteString(s)
    w.Flush()
    fmt.Println(string(wr.Bytes()), n, err) // C语言中文网 16 <nil>
}
```
