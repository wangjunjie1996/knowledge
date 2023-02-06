# GO

> 自学 go 语言整理

## Go语言标准库强大

| Go语言标准库包名 |                功  能                     |
| --------------- |    --------------------------------       |
|     bufio      |         带缓冲的 I/O 操作                  |
|     bytes       |        实现字节操作                       |
|    container    |       封装堆、列表和环形列表等容器           |
|     crypto      |                加密算法                    |
|    database     |           数据库驱动和接口                  |
|     debug      |       各种调试文件格式访问及调试功能          |
|    encoding     |    常见算法如 JSON、XML、Base64 等         |
|      flag       |              命令行解析                   |
|       fmt       |              格式化操作                   |
|       go        |Go语言的词法、语法树、类型等。可通过这个包进行代码信息提取和修改|
| html  | HTML 转义及模板系统 |
| image  | 常见图形格式的访问及生成 |
| io  | 实现 I/O 原始访问接口及访问封装 |
| math  | 数学库 |
| net  | 网络库，支持 Socket、HTTP、邮件、RPC、SMTP 等 |
| os  | 操作系统平台不依赖平台操作封装 |
| path  | 兼容各操作系统的路径操作实用函数 |
| plugin  | Go 1.7 加入的插件系统。支持将代码编译为插件，按需加载 |
| reflect  | 语言反射支持。可以动态获得代码中的类型信息，获取和修改变量的值 |
| regexp  | 正则表达式封装 |
| runtime  | 运行时接口 |
| sort  | 排序接口 |
| strings  | 字符串转换、解析及实用函数 |
| time  | 时间接口 |
| text  | 文本模板及 Token 词法器 |

## 在Windows上安装Go语言开发包

### 下载Go语言开发包

（<https://golang.google.cn/dl/>）下载 Windows 系统下的Go语言开发包安装

### 设置环境变量

开发包安装完成后，我们还需要配置一下GOPATH 环境变量，之后才可以使用Go语言进行开发。GOPATH 是一个路径，用来存放开发中需要用到的代码包。
在桌面或者资源管理器右键“此电脑”（或者“我的电脑”）→“属性”→“高级系统设置”→“环境变量”
用户变量添加 GOPATH

## Go语言工程结构

Go语言开发环境时提到的环境变量 GOPATH，项目的构建主要是靠它来实现的。这么说吧，如果想要构建一个项目，就需要将这个项目的目录添加到 GOPATH 中，多个项目之间可以使用;分隔。
如果不配置 GOPATH，即使处于同一目录，代码之间也无法通过绝对路径相互调用。

### 目录结构

一个Go语言项目的目录一般包含以下三个子目录：

* src 目录：放置项目和库的源文件；
* pkg 目录：放置编译后生成的包/库的归档文件；
* bin 目录：放置编译后生成的可执行文件。

1. src 目录

> 用于以包（package）的形式组织并存放 Go 源文件，这里的包与 src 下的每个子目录是一一对应。例如，若一个源文件被声明属于 log 包，那么它就应当保存在 src/log 目录中。

> 并不是说 src 目录下不能存放 Go 源文件，一般在测试或演示的时候也可以把 Go 源文件直接放在 src 目录下，但是这么做的话就只能声明该源文件属于 main 包了。正常开发中还是建议大家把 Go 源文件放入特定的目录中。

> 包是Go语言管理代码的重要机制，其作用类似于Java中的 package 和 C/C++ 的头文件。Go 源文件中第一段有效代码必须是package <包名> 的形式，如 package hello。

> 另外需要注意的是，Go语言会把通过go get 命令获取到的库源文件下载到 src 目录下对应的文件夹当中。

2. pkg 目录

> 用于存放通过go install 命令安装某个包后的归档文件。归档文件是指那些名称以“.a”结尾的文件。

> 该目录与 GOROOT 目录（也就是Go语言的安装目录）下的 pkg 目录功能类似，区别在于这里的 pkg 目录专门用来存放项目代码的归档文件。

> 编译和安装项目代码的过程一般会以代码包为单位进行，比如 log 包被编译安装后，将生成一个名为 log.a 的归档文件，并存放在当前项目的 pkg 目录下。

3. bin 目录

> 与 pkg 目录类似，在通过go install 命令完成安装后，保存由 Go 命令源文件生成的可执行文件。在类 Unix 操作系统下，这个可执行文件的名称与命令源文件的文件名相同。而在 Windows 操作系统下，这个可执行文件的名称则是命令源文件的文件名加 .exe 后缀。

### 源文件

上面我们提到了命令源文件和库源文件，它们到底是什么呢？

* 命令源文件：如果一个 Go 源文件被声明属于 main 包，并且该文件中包含 main 函数，则它就是命令源码文件。命令源文件属于程序的入口，可以通过Go语言的go run 命令运行或者通过go build 命令生成可执行文件。
* 库源文件：库源文件则是指存在于某个包中的普通源文件，并且库源文件中不包含 main 函数。

> 不管是命令源文件还是库源文件，在同一个目录下的所有源文件，其所属包的名称必须一致的。

## 第一个Go语言程序

```go
    package main    // 声明 main 包
    import (
        "fmt"       // 导入 fmt 包，打印字符串是需要用到
    )
    func main() {   // 声明 main 主函数
        fmt.Println("Hello World!") // 打印 Hello World!
    }
```

## Go语言程序的编译和运行

可以通过Go语言提供的go build或者go run命令对Go语言程序进行编译：

* go build 命令可以将Go语言程序代码编译成二进制的可执行文件，但是需要我们手动运行该二进制文件；
* go run 命令则更加方便，它会在编译后直接运行Go语言程序，编译过程中会产生一个临时文件，但不会生成可执行文件，这个特点很适合用来调试程序。

## 变量的声明（使用var关键字）

声明变量的一般形式是使用 var 关键字：

```
var name type
```

其中，var 是声明变量的关键字，name 是变量名，type 是变量的类型。

需要注意的是，Go语言和许多编程语言不同，它在声明变量时将变量的类型放在变量的名称之后。这样做的好处就是可以避免像C语言中那样含糊不清的声明形式，例如：int* a, b; 。其中只有
a 是指针而 b 不是。如果你想要这两个变量都是指针，则需要将它们分开书写。而在 Go 中，则可以和轻松地将它们都声明为指针类型：

```go
var a, b *int
```

Go语言的基本类型有：

* bool
* string
* int、int8、int16、int32、int64
* uint、uint8、uint16、uint32、uint64、uintptr
* byte // uint8 的别名
* rune // int32 的别名 代表一个 Unicode 码
* float32、float64
* complex64、complex128

当一个变量被声明之后，系统自动赋予它该类型的零值：int 为 0，float 为 0.0，bool 为 false，string 为空字符串，指针为 nil 等。所有的内存在 Go 中都是经过初始化的。
变量的命名规则遵循骆驼命名法，即首个单词小写，每个新单词的首字母大写，例如：numShips 和 startDate 。
变量的声明有几种形式，通过下面几节进行整理归纳。

### 标准格式

var 变量名 变量类型

### 批量格式

```go
    var (
        a int
        b string
        c []float32
        d func() bool
        e struct {
            x int
        }
    )
```

### 简短格式

名字 := 表达式

>需要注意的是，简短模式（short variable declaration）有以下限制：

* 定义变量，同时显式初始化。
* 不能提供数据类型。
* 只能用在函数内部。

```go
i, j := 0, 1
```

## 变量的初始化

### 标准格式

var 变量名 类型 = 表达式

```go
var hp int = 100
```

### 编译器推导类型的格式

在标准格式的基础上，将 int 省略后，编译器会尝试根据等号右边的表达式推导 hp 变量的类型。

```go
var hp = 100
```

### 短变量声明并初始化

```go
hp := 100
```

> 注意：由于使用了:=，而不是赋值的=，因此推导声明写法的左值变量必须是没有定义过的变量。若定义过，将会发生编译错误。

使用 Go 的“多重赋值”特性，可以轻松完成变量交换的任务

```go
    var a int = 100
    var b int = 200
    b, a = a, b
    fmt.Println(a, b)
```

多重赋值时，变量的左值和右值按从左到右的顺序赋值。

## 匿名变量（没有名字的变量）

匿名变量的特点是一个下画线“_”，“_”本身就是一个特殊的标识符，被称为空白标识符。它可以像其他标识符那样用于变量的声明或赋值（任何类型都可以赋值给它），但任何赋给这个标识符的值都将被抛弃，因此这些值不能在后续的代码中使用，也不可以使用这个标识符作为变量对其它变量进行赋值或运算。使用匿名变量时，只需要在变量声明的地方使用下画线替换即可。例如：

```go
    func GetData() (int, int) {
        return 100, 200
    }
    func main(){
        a, _ := GetData()
        _, b := GetData()
        fmt.Println(a, b)
    }
```

## Go语言变量的作用域

根据变量定义位置的不同，可以分为以下三个类型：

* 函数内定义的变量称为局部变量
* 函数外定义的变量称为全局变量
* 函数定义中的变量称为形式参数

## Go语言整型（整数类型）

Go语言同时提供了有符号和无符号的整数类型，其中包括 int8、int16、int32 和 int64 四种大小截然不同的有符号整数类型，分别对应 8、16、32、64 bit（二进制位）大小的有符号整数，与此对应的是 uint8、uint16、uint32 和 uint64 四种无符号整数类型。

此外还有两种整数类型 int 和 uint，它们分别对应特定 CPU 平台的字长（机器字大小），其中 int 表示有符号整数，应用最为广泛，uint 表示无符号整数。实际开发中由于编译器和计算机硬件的不同，int 和 uint 所能表示的整数大小会在 32bit 或 64bit 之间变化。

大多数情况下，我们只需要 int 一种整型即可，它可以用于循环计数器（for 循环中控制循环次数的变量）、数组和切片的索引，以及任何通用目的的整型运算符，通常 int 类型的处理速度也是最快的。

用来表示 Unicode 字符的 rune 类型和 int32 类型是等价的，通常用于表示一个 Unicode 码点。这两个名称可以互换使用。同样，byte 和 uint8 也是等价类型，byte 类型一般用于强调数值是一个原始的数据而不是一个小的整数。

最后，还有一种无符号的整数类型 uintptr，它没有指定具体的 bit 大小但是足以容纳指针。uintptr 类型只有在底层编程时才需要，特别是Go语言和C语言函数库或操作系统接口相交互的地方。

尽管在某些特定的运行环境下 int、uint 和 uintptr 的大小可能相等，但是它们依然是不同的类型，比如 int 和 int32，虽然 int 类型的大小也可能是 32 bit，但是在需要把 int 类型当做 int32 类型使用的时候必须显示的对类型进行转换，反之亦然。

Go语言中有符号整数采用 2 的补码形式表示，也就是最高 bit 位用来表示符号位，一个 n-bit 的有符号数的取值范围是从 -2(n-1) 到 2(n-1)-1。无符号整数的所有 bit 位都用于表示非负数，取值范围是 0 到 2n-1。例如，int8 类型整数的取值范围是从 -128 到 127，而 uint8 类型整数的取值范围是从 0 到 255。

## Go语言浮点类型（小数类型）

Go语言提供了两种精度的浮点数 float32 和 float64，它们的算术规范由 IEEE754 浮点数国际标准定义，该浮点数规范被所有现代的 CPU 支持。

这些浮点数类型的取值范围可以从很微小到很巨大。浮点数取值范围的极限值可以在 math 包中找到：

* 常量 math.MaxFloat32 表示 float32 能取到的最大数值，大约是 3.4e38；
* 常量 math.MaxFloat64 表示 float64 能取到的最大数值，大约是 1.8e308；
* float32 和 float64 能表示的最小值分别为 1.4e-45 和 4.9e-324。

一个 float32 类型的浮点数可以提供大约 6 个十进制数的精度，而 float64 则可以提供约 15 个十进制数的精度，通常应该优先使用 float64 类型，因为 float32 类型的累计计算误差很容易扩散，并且 float32 能精确表示的正整数并不是很大。

浮点数在声明的时候可以只写整数部分或者小数部分，像下面这样：

```go
    const e = .71828 // 0.71828
    const f = 1.     // 1
```

很小或很大的数最好用科学计数法书写，通过 e 或 E 来指定指数部分：

```go
    const Avogadro = 6.02214129e23  // 阿伏伽德罗常数
    const Planck   = 6.62606957e-34 // 普朗克常数
```

## Go语言复数

在计算机中，复数是由两个浮点数表示的，其中一个表示实部（real），一个表示虚部（imag）。

Go语言中复数的类型有两种，分别是  complex128（64 位实数和虚数）和 complex64（32 位实数和虚数），其中 complex128 为复数的默认类型。

复数的值由三部分组成 RE + IMi，其中 RE 是实数部分，IM 是虚数部分，RE 和 IM 均为 float 类型，而最后的 i 是虚数单位。

声明复数的语法格式如下所示：

```go
var name complex128 = complex(x, y)
```

其中 name 为复数的变量名，complex128 为复数的类型，“=”后面的 complex 为Go语言的内置函数用于为复数赋值，x、y 分别表示构成该复数的两个 float64 类型的数值，x 为实部，y 为虚部。

简写

```go
name := complex(x, y)
```

对于一个复数z := complex(x, y)，可以通过Go语言的内置函数real(z) 来获得该复数的实部，也就是 x；通过imag(z) 获得该复数的虚部，也就是 y。
复数也可以用==和!=进行相等比较，只有两个复数的实部和虚部都相等的时候它们才是相等的。

## 复数运算法则

复数运算法则有：加减法、乘除法。两个复数的和依然是复数，它的实部是原来两个复数实部的和，它的虚部是原来两个虚部的和。复数的加法满足交换律和结合律。此外，复数作为幂和对数的底数、指数、真数时，其运算规则可由欧拉公式e^iθ=cos θ+i sin θ（弧度制）推导而得。

### 加减法

#### 加法法则

复数的加法按照以下规定的法则进行：设z1=a+bi，z2=c+di是任意两个复数，
则它们的和是 (a+bi)+(c+di)=(a+c)+(b+d)i。
两个复数的和依然是复数，它的实部是原来两个复数实部的和，它的虚部是原来两个虚部的和。
复数的加法满足交换律和结合律，
即对任意复数z1，z2，z3，有： z1+z2=z2+z1；(z1+z2)+z3=z1+(z2+z3)。

#### 减法法则

复数的减法按照以下规定的法则进行：设z1=a+bi，z2=c+di是任意两个复数，
则它们的差是 (a+bi)-(c+di)=(a-c)+(b-d)i。
两个复数的差依然是复数，它的实部是原来两个复数实部的差，它的虚部是原来两个虚部的差。

### 乘除法

#### 乘法法则

规定复数的乘法按照以下的法则进行：
设z1=a+bi，z2=c+di(a、b、c、d∈R)是任意两个复数，那么它们的积(a+bi)(c+di)=(ac-bd)+(bc+ad)i。
其实就是把两个复数相乘，类似两个多项式相乘，展开得: ac+adi+bci+bdi2，因为i2=-1，所以结果是(ac－bd)+(bc+ad)i 。两个复数的积仍然是一个复数。

#### 除法法则

## Go语言bool类型（布尔类型）

略

## Go语言字符串

* 一个字符串是一个不可改变的字节序列，字符串可以包含任意的数据，但是通常是用来包含可读的文本，字符串是 UTF-8 字符的一个序列（当字符为 ASCII 码表上的字符时则占用 1 个字节，其它字符根据需要占用 2-4 个字节）。
* UTF-8 是一种被广泛使用的编码格式，是文本文件的标准编码，其中包括 XML 和 JSON 在内也都使用该编码。由于该编码对占用字节长度的不定性，在Go语言中字符串也可能根据需要占用 1 至 4 个字节，这与其它编程语言如 C++、Java 或者 Python 不同（Java 始终使用 2 个字节）。Go语言这样做不仅减少了内存和硬盘空间占用，同时也不用像其它语言那样需要对使用 UTF-8 字符集的文本进行编码和解码。
* 字符串是一种值类型，且值不可变，即创建某个文本后将无法再次修改这个文本的内容，更深入地讲，字符串是字节的定长数组。

### 定义字符串

可以使用双引号""来定义字符串，字符串中可以使用转义字符来实现换行、缩进等效果，常用的转义字符包括：

* \n：换行符
* \r：回车符
* \t：tab 键
* \u 或 \U：Unicode 字符
* \\：反斜杠自身

字符串的内容（纯字节）可以通过标准索引法来获取，在方括号[ ]内写入索引，索引从 0 开始计数：需要注意的是，这种转换方案只对纯 ASCII 码的字符串有效。

### 字符串拼接符“+”

两个字符串 s1 和 s2 可以通过 s := s1 + s2 拼接在一起。将 s2 追加到 s1 尾部并生成一个新的字符串 s。

可以通过下面的方式来对代码中多行的字符串进行拼接：

```go
    str := "Beginning of the string " +
    "second part of the string"
```

> 提示：因为编译器会在行尾自动补全分号，所以拼接字符串用的加号“+”必须放在第一行末尾。

也可以使用“+=”来对字符串进行拼接：

```go
    s := "hel" + "lo,"
    s += "world!"
    fmt.Println(s) //输出 “hello, world!”
```

### 字符串实现基于 UTF-8 编码

Go语言中字符串的内部实现使用 UTF-8 编码，通过 rune 类型，可以方便地对每个 UTF-8 字符进行访问。当然，Go语言也支持按照传统的 ASCII 码方式逐字符进行访问。

### 定义多行字符串

在Go语言中，使用双引号书写字符串的方式是字符串常见表达方式之一，被称为字符串字面量（string literal），这种双引号字面量不能跨行，如果想要在源码中嵌入一个多行字符串时，就必须使用`反引号，代码如下：

```go
    const str = `第一行
    第二行
    第三行
    \r\n
    `
    fmt.Println(str)
```

运行结果

```go
第一行
第二行
第三行
\r\n
```

## Go语言数据类型转换

在必要以及可行的情况下，一个类型的值可以被转换成另一种类型的值。由于Go语言不存在隐式类型转换，因此所有的类型转换都必须显式的声明：

```go
valueOfTypeB = typeB(valueOfTypeA)
```

类型 B 的值 = 类型 B(类型 A 的值)
示例：

```go
a := 5.0
b := int(a)
```

* 类型转换只能在定义正确的情况下转换成功，例如从一个取值范围较小的类型转换到一个取值范围较大的类型（将 int16 转换为 int32）。当从一个取值范围较大的类型转换到取值范围较小的类型时（将 int32 转换为 int16 或将 float32 转换为 int），会发生精度丢失（截断）的情况
* 只有相同底层类型的变量之间可以进行相互转换（如将 int16 类型转换成 int32 类型），不同底层类型的变量相互转换时会引发编译错误（如将 bool 类型转换为 int 类型）：
* 浮点数在转换为整型时，会将小数部分去掉，只保留整数部分。

## Go语言指针

指针（pointer）在Go语言中可以被拆分为两个核心概念：

* 类型指针，允许对这个指针类型的数据进行修改，传递数据可以直接使用指针，而无须拷贝数据，类型指针不能进行偏移和运算。
* 切片，由指向起始元素的原始指针、元素数量和容量组成。
切片比原始指针具备更强大的特性，而且更为安全。切片在发生越界时，运行时会报出宕机，并打出堆栈，而原始指针只会崩溃。

### 认识指针地址和指针类型

一个指针变量可以指向任何一个值的内存地址，它所指向的值的内存地址在 32 和 64 位机器上分别占用 4 或 8 个字节，占用字节的大小与所指向的值的大小无关。当一个指针被定义后没有分配到任何变量时，它的默认值为 nil。指针变量通常缩写为 ptr。

每个变量在运行时都拥有一个地址，这个地址代表变量在内存中的位置。Go语言中使用在变量名前面添加&操作符（前缀）来获取变量的内存地址（取地址操作），格式如下：

```go
ptr := &v    // v 的类型为 T
```

其中 v 代表被取地址的变量，变量 v 的地址使用变量 ptr 进行接收，ptr 的类型为*T，称做 T 的指针类型，*代表指针。
变量、指针和地址三者的关系是，每个变量都拥有地址，指针的值就是地址。

### 从指针获取指针指向的值

当使用&操作符对普通变量进行取地址操作并得到变量的指针后，可以对指针使用*操作符，也就是指针取值，代码如下。

```go
package main

import (
    "fmt"
)

func main() {
    // 准备一个字符串类型
    var house = "Malibu Point 10880, 90265"
    // 对字符串取地址, ptr类型为*string
    ptr := &house
    // 打印ptr的类型
    fmt.Printf("ptr type: %T\n", ptr)
    // 打印ptr的指针地址
    fmt.Printf("address: %p\n", ptr)
    // 对指针进行取值操作
    value := *ptr
    // 取值后的类型
    fmt.Printf("value type: %T\n", value)
    // 指针取值后就是指向变量的值
    fmt.Printf("value: %s\n", value)
}
```

运行结果：

```go
ptr type: *string
address: 0xc0420401b0
value type: string
value: Malibu Point 10880, 90265
```

取地址操作符&和取值操作符*是一对互补操作符，&取出地址，*根据地址取出地址指向的值。
变量、指针地址、指针变量、取地址、取值的相互关系和特性如下：

* 对变量进行取地址操作使用&操作符，可以获得这个变量的指针变量。
* 指针变量的值是指针地址。
* 对指针变量进行取值操作使用*操作符，可以获得指针变量指向的原变量的值。

### 使用指针修改值

通过指针不仅可以取值，也可以修改值。
使用指针同样可以进行数值交换，代码如下：

```go
package main

import "fmt"

// 交换函数
func swap(a, b *int) {
    // 取a指针的值, 赋给临时变量t
    t := *a
    // 取b指针的值, 赋给a指针指向的变量, 注意，此时*a的意思不是取 a 指针的值，而是“a 指向的变量”。
    *a = *b
    // 将a指针的值赋给b指针指向的变量
    *b = t
}
func main() {
// 准备两个变量, 赋值1和2
    x, y := 1, 2
    // 交换变量值
    swap(&x, &y)
    // 输出变量值
    fmt.Println(x, y)
}
```

```
*操作符作为右值时，意义是取指针的值，作为左值时，也就是放在赋值操作符的左边时，表示 a 指针指向的变量。其实归纳起来，*操作符的根本意义就是操作指针指向的变量。当操作在右值时，就是取指向变量的值，当操作在左值时，就是将值设置给指向的变量。
```

### 创建指针的另一种方法——new() 函数

```go
    str := new(string)
    *str = "Go语言教程"
    fmt.Println(*str)
```

### 指针和指针类型

1. 什么是指针
一个指针变量指向了一个值的内存地址。类似于变量和常量，在使用指针前你需要声明指针。指针声明格式如下：

```go
var var_name *var-type
```

var-type 为指针类型，var_name 为指针变量名，* 号用于指定变量是作为一个指针。以下是有效的指针声明：

```go
var ip *int        /* 指向整型*/
var fp *float32    /* 指向浮点型 */
```

2. 指针类型
Go 中的指针类型不止一种，每一种普通类型就对应一个指针类型。相应地，指针类型也限定了它自己只能指向对应类型的普通变量（地址）。
指针类型的语法为：

```go
*BaseType // BaseType指代的是任何普通类型。
```

## Go语言变量的生命周期

变量的生命周期指的是在程序运行期间变量有效存在的时间间隔。
变量的生命周期与变量的作用域有着不可分割的联系：

* 全局变量：它的生命周期和整个程序的运行周期是一致的；
* 局部变量：它的生命周期则是动态的，从创建这个变量的声明语句开始，到这个变量不再被引用为止；
* 形式参数和函数返回值：它们都属于局部变量，在函数被调用的时候创建，函数调用结束后被销毁。

## Go语言常量和const关键字

Go语言中的常量使用关键字 const 定义，用于存储不会改变的数据，常量是在编译时被创建的，即使定义在函数内部也是如此，并且只能是布尔型、数字型（整数型、浮点型和复数）和字符串型。由于编译时的限制，定义常量的表达式必须为能被编译器求值的常量表达式。
常量的定义格式和变量的声明语法类似：const name [type] = value，例如：

```go
const pi = 3.14159 // 相当于 math.Pi 的近似值
```

在Go语言中，你可以省略类型说明符 [type]，因为编译器可以根据变量的值来推断其类型。

* 显式类型定义： const b string = "abc"
* 隐式类型定义： const b = "abc"

常量的值必须是能够在编译时就能够确定的，可以在其赋值表达式中涉及计算过程，但是所有用于计算的值必须在编译期间就能获得。

* 正确的做法：const c1 = 2/3
* 错误的做法：const c2 = getNumber() // 引发构建错误: getNumber() 用做值

和变量声明一样，可以批量声明多个常量：

```go
    const (
        e  = 2.7182818
        pi = 3.1415926
    )
```

如果是批量声明的常量，除了第一个外其它的常量右边的初始化表达式都可以省略，如果省略初始化表达式则表示使用前面常量的初始化表达式，对应的常量类型也是一样的。例如：

```go
    const (
        a = 1
        b
        c = 2
        d
    )
    fmt.Println(a, b, c, d) // "1 1 2 2"
```

### iota 常量生成器

常量声明可以使用 iota 常量生成器初始化，它用于生成一组以相似规则初始化的常量，但是不用每行都写一遍初始化表达式。在一个 const 声明语句中，在第一个声明的常量所在的行，iota 将会被置为 0，然后在每一个有常量声明的行加一。

```go
    type Weekday int
    const (
        Sunday Weekday = iota
        Monday
        Tuesday
        Wednesday
        Thursday
        Friday
        Saturday
    )
```

周日将对应 0，周一为 1，以此类推。

### 无类型常量

Go语言的常量有个不同寻常之处。虽然一个常量可以有任意一个确定的基础类型，例如 int 或 float64，或者是类似 time.Duration 这样的基础类型，但是许多常量并没有一个明确的基础类型。

编译器为这些没有明确的基础类型的数字常量提供比基础类型更高精度的算术运算，可以认为至少有 256bit 的运算精度。这里有六种未明确类型的常量类型，分别是无类型的布尔型、无类型的整数、无类型的字符、无类型的浮点数、无类型的复数、无类型的字符串。

通过延迟明确常量的具体类型，不仅可以提供更高的运算精度，而且可以直接用于更多的表达式而不需要显式的类型转换。
math.Pi 无类型的浮点数常量，可以直接用于任意需要浮点数或复数的地方：

```go
    var x float32 = math.Pi
    var y float64 = math.Pi
    var z complex128 = math.Pi
```

## Golang模拟枚举

Go语言现阶段没有枚举类型，但是可以使用 const 常量配合上一节《Go语言常量》中介绍的 iota 来模拟枚举类型，请看下面的代码：

```go
type Weapon int
const (
     Arrow Weapon = iota    // 开始生成枚举值, 默认为0
     Shuriken
     SniperRifle
     Rifle
     Blower
)
// 输出所有枚举值
fmt.Println(Arrow, Shuriken, SniperRifle, Rifle, Blower)
// 使用枚举类型并赋初值
var weapon Weapon = Blower
fmt.Println(weapon)
```

## Go语言type关键字

区分类型别名与类型定义
定义类型别名的写法为：

```go
type TypeAlias = Type
```

类型别名规定：TypeAlias 只是 Type 的别名，本质上 TypeAlias 与 Type 是同一个类型，就像一个孩子小时候有小名、乳名，上学后用学名，英语老师又会给他起英文名，但这些名字都指的是他本人。

类型别名与类型定义表面上看只有一个等号的差异，那么它们之间实际的区别有哪些呢？下面通过一段代码来理解。

```go
package main
import (
    "fmt"
)
// 将NewInt定义为int类型
type NewInt int
// 将int取一个别名叫IntAlias
type IntAlias = int
func main() {
    // 将a声明为NewInt类型
    var a NewInt
    // 查看a的类型名
    fmt.Printf("a type: %T\n", a)
    // 将a2声明为IntAlias类型
    var a2 IntAlias
    // 查看a2的类型名
    fmt.Printf("a2 type: %T\n", a2)
}
```

代码运行结果：

```
a type: main.NewInt
a2 type: int
```

### 非本地类型不能定义方法

能够随意地为各种类型起名字，是否意味着可以在自己包里为这些类型任意添加方法呢？参见下面的代码演示：

```go
package main
import (
    "time"
)
// 定义time.Duration的别名为MyDuration
type MyDuration = time.Duration
// 为MyDuration添加一个函数
func (m MyDuration) EasySet(a string) {
}
func main() {
}
```

编译上面代码报错，信息如下： cannot define new methods on non-local type time.Duration
编译器提示：不能在一个非本地的类型 time.Duration 上定义新方法，非本地类型指的就是 time.Duration 不是在 main 包中定义的，而是在 time 包中定义的，与 main 包不在同一个包中，因此不能为不在一个包中的类型定义方法。
解决这个问题有下面两种方法：

* 将第 8 行修改为 type MyDuration time.Duration，也就是将 MyDuration 从别名改为类型；
* 将 MyDuration 的别名定义放在 time 包中。

## Go语言注释的定义及使用

* 单行注释简称行注释，是最常见的注释形式，可以在任何地方使用以//开头的单行注释；
* 多行注释简称块注释，以/*开头，并以*/结尾，且不可以嵌套使用，多行注释一般用于包的文档描述或注释成块的代码片段。

## Go语言关键字与标识符简述

Go语言的词法元素包括 5 种，分别是标识符（identifier）、关键字（keyword）、操作符（operator）、分隔符（delimiter）、字面量（literal），它们是组成Go语言代码和程序的最基本单位。

### 关键字

关键字即是被Go语言赋予了特殊含义的单词，也可以称为保留字。
Go语言中的关键字一共有 25 个：
|           |             |          |              |           |
|------|----|----|----|----|
|   break   |   default   |   func   |   interface  |  select   |
|   case   |   defer   |   go   |   map  |  struct   |
|   chan   |   else   |   goto   |   package  |  switch   |
|   const   |   fallthrough   |   if   |   range  |  type   |
|   continue   |   for   |   import   |   return  |  var   |

### 标识符

标识符是指Go语言对各种变量、方法、函数等命名时使用的字符序列，标识符由若干个字母、下划线_、和数字组成，且第一个字符必须是字母。通俗的讲就是凡可以自己定义的名称都可以叫做标识符。
 标识符的命名需要遵守以下规则：

* 由 26 个英文字母、0~9、_组成；
* 不能以数字开头，例如 var 1num int 是错误的；
* Go语言中严格区分大小写；
* 标识符不能包含空格；
* 不能以系统保留关键字作为标识符，比如 break，if 等等。
命名标识符时还需要注意以下几点：
* 标识符的命名要尽量采取简短且有意义；
* 不能和标准库中的包名重复；
* 为变量、函数、常量命名时采用驼峰命名法，例如 stuName、getVal；

在Go语言中还存在着一些特殊的标识符，叫做预定义标识符，

append bool byte cap close complex complex64 complex128 uint16
copy false float32 float64 imag int int8 int16 uint32
int32 int64 iota len make new nil panic uint64
print println real recover string true uint uint8 uintptr

## Go语言运算符的优先级

> 运算符是用来在程序运行时执行数学或逻辑运算的，在Go语言中，一个表达式可以包含多个运算符，当表达式中存在多个运算符时，就会遇到优先级的问题，此时应该先处理哪个运算符呢？这个就由Go语言运算符的优先级来决定的。

<img src="/img/yunsuanfuyouxianji.png">

## Go语言strconv包

> 在实际开发中我们往往需要对一些常用的数据类型进行转换，如 string、int、int64、float 等数据类型之间的转换，Go语言中的 strconv 包为我们提供了字符串和基本数据类型之间的转换功能。
  strconv 包中常用的函数包括 Atoi()、Itia()、parse 系列函数、format 系列函数、append 系列函数等，下面就来分别介绍一下。

### string 与 int 类型之间的转换

#### Itoa()：整型转字符串

 Itoa() 函数用于将 int 类型数据转换为对应的字符串类型，函数签名如下。

```go
func Itoa(i int) string
```

示例代码如下：

```go
func main() {
    num := 100
    str := strconv.Itoa(num)
    fmt.Printf("type:%T value:%#v\n", str, str)
}
```

运行结果如下所示：

```go
type:string value:"100"
```

#### Atoi()：字符串转整型

Atoi() 函数用于将字符串类型的整数转换为 int 类型，函数签名如下。

```go
func Atoi(s string) (i int, err error)
```

通过函数签名可以看出 Atoi() 函数有两个返回值，i 为转换成功的整型，err 在转换成功是为空转换失败时为相应的错误信息。

  示例代码如下：

```go
func main() {
    str1 := "110"
    str2 := "s100"
    num1, err := strconv.Atoi(str1)
    if err != nil {
        fmt.Printf("%v 转换失败！", str1)
    } else {
        fmt.Printf("type:%T value:%#v\n", num1, num1)
    }
    num2, err := strconv.Atoi(str2)
    if err != nil {
        fmt.Printf("%v 转换失败！", str2)
    } else {
        fmt.Printf("type:%T value:%#v\n", num2, num2)
    }
}
```

运行结果如下所示：

```go
type:int value:110
s100 转换失败！
```

### Parse 系列函数

> Parse 系列函数用于将字符串转换为指定类型的值，其中包括 ParseBool()、ParseFloat()、ParseInt()、ParseUint()。

#### ParseBool()

ParseBool() 函数用于将字符串转换为 bool 类型的值，它只能接受 1、0、t、f、T、F、true、false、True、False、TRUE、FALSE，其它的值均返回错误，函数签名如下。

```go
func ParseBool(str string) (value bool, err error)
```

示例代码如下：

```go
func main() {
    str1 := "110"
    boo1, err := strconv.ParseBool(str1)
    if err != nil {
        fmt.Printf("str1: %v\n", err)
    } else {
        fmt.Println(boo1)
    }
    str2 := "t"
    boo2, err := strconv.ParseBool(str2)
    if err != nil {
        fmt.Printf("str2: %v\n", err)
    } else {
        fmt.Println(boo2)
    }
}
```

运行结果如下：

```go
str1: strconv.ParseBool: parsing "110": invalid syntax
true
```

#### ParseInt()

ParseInt() 函数用于返回字符串表示的整数值（可以包含正负号），函数签名如下：

```go
func ParseInt(s string, base int, bitSize int) (i int64, err error)
```

参数说明：

* base 指定进制，取值范围是 2 到 36。如果 base 为 0，则会从字符串前置判断，“0x”是 16 进制，“0”是 8 进制，否则是 10 进制。
* bitSize 指定结果必须能无溢出赋值的整数类型，0、8、16、32、64 分别代表 int、int8、int16、int32、int64。
* 返回的 err 是 *NumErr 类型的，如果语法有误，err.Error = ErrSyntax，如果结果超出类型范围 err.Error = ErrRange。
示例代码如下：

```go
func main() {
    str := "-11"
    num, err := strconv.ParseInt(str, 10, 0)
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Println(num)
    }
}
```

运行结果如下：

```go
-11
```

#### ParseUnit()

ParseUint() 函数的功能类似于 ParseInt() 函数，但 ParseUint() 函数不接受正负号，用于无符号整型，函数签名如下：

```go
func ParseUint(s string, base int, bitSize int) (n uint64, err error)
```

示例代码如下：

```go
func main() {
    str := "11"
    num, err := strconv.ParseUint(str, 10, 0)
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Println(num)
    }
}
```

运行结果如下：

```go
11
```

#### ParseFloat()

ParseFloat() 函数用于将一个表示浮点数的字符串转换为 float 类型，函数签名如下。

```go
func ParseFloat(s string, bitSize int) (f float64, err error)
```

 参数说明：

* 如果 s 合乎语法规则，函数会返回最为接近 s 表示值的一个浮点数（使用 IEEE754 规范舍入）。
* bitSize 指定了返回值的类型，32 表示 float32，64 表示 float64；
* 返回值 err 是 *NumErr 类型的，如果语法有误 err.Error=ErrSyntax，如果返回值超出表示范围，返回值 f 为 ±Inf，err.Error= ErrRange。
示例代码如下：

```go
func main() {
    str := "3.1415926"
    num, err := strconv.ParseFloat(str, 64)
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Println(num)
    }
}
```

运行结果如下：3.1415926
Parse 系列函数都有两个返回值，第一个返回值是转换后的值，第二个返回值为转化失败的错误信息。

### Format 系列函数

> Format 系列函数实现了将给定类型数据格式化为字符串类型的功能，其中包括 FormatBool()、FormatInt()、FormatUint()、FormatFloat()。

#### FormatBool()

FormatBool() 函数可以一个 bool 类型的值转换为对应的字符串类型，函数签名如下。

```go
func FormatBool(b bool) string
```

```go
func main() {
    num := true
    str := strconv.FormatBool(num)
    fmt.Printf("type:%T,value:%v\n ", str, str)
    // 输出 type:string,value:true
}
```

#### FormatInt()

FormatInt() 函数用于将整型数据转换成指定进制并以字符串的形式返回，函数签名如下：

```go
func FormatInt(i int64, base int) string
```

其中，参数 i 必须是 int64 类型，参数 base 必须在 2 到 36 之间，返回结果中会使用小写字母“a”到“z”表示大于 10 的数字。

```go
func main() {
    var num int64 = 100
    str := strconv.FormatInt(num, 16)
    fmt.Printf("type:%T,value:%v\n ", str, str)
    // 输出 type:string,value:64
}
```

#### FormatUint()

FormatUint() 函数与 FormatInt() 函数的功能类似，但是参数 i 必须是无符号的 uint64 类型，函数签名如下。

```go
func FormatUint(i uint64, base int) string
```

```go
func main() {
    var num uint64 = 110
    str := strconv.FormatUint(num, 16)
    fmt.Printf("type:%T,value:%v\n ", str, str)
    // 输出 type:string,value:6e
}
```

#### FormatFloat()

FormatFloat() 函数用于将浮点数转换为字符串类型，函数签名如下：

```go
func FormatFloat(f float64, fmt byte, prec, bitSize int) string
```

参数说明：

* bitSize 表示参数 f 的来源类型（32 表示 float32、64 表示 float64），会据此进行舍入。
* fmt 表示格式，可以设置为“f”表示 -ddd.dddd、“b”表示 -ddddp±ddd，指数为二进制、“e”表示 -d.dddde±dd 十进制指数、“E”表示 -d.ddddE±dd 十进制指数、“g”表示指数很大时用“e”格式，否则“f”格式、“G”表示指数很大时用“E”格式，否则“f”格式。
* prec 控制精度（排除指数部分）：当参数 fmt 为“f”、“e”、“E”时，它表示小数点后的数字个数；当参数 fmt 为“g”、“G”时，它控制总的数字个数。如果 prec 为 -1，则代表使用最少数量的、但又必需的数字来表示 f。

```go
func main() {
    var num float64 = 3.1415926
    str := strconv.FormatFloat(num, 'E', -1, 64)
    fmt.Printf("type:%T,value:%v\n ", str, str)
    // 输出 type:string,value:3.1415926E+00
}
```

### Append 系列函数

Append 系列函数用于将指定类型转换成字符串后追加到一个切片中，其中包含 AppendBool()、AppendFloat()、AppendInt()、AppendUint()。
Append 系列函数和 Format 系列函数的使用方法类似，只不过是将转换后的结果追加到一个切片中。

```go
package main
import (
    "fmt"
    "strconv"
)
func main() {
    // 声明一个slice
    b10 := []byte("int (base 10):")

    // 将转换为10进制的string，追加到slice中
    b10 = strconv.AppendInt(b10, -42, 10)
    fmt.Println(string(b10))
    b16 := []byte("int (base 16):")
    b16 = strconv.AppendInt(b16, -42, 16)
    fmt.Println(string(b16))
    // 输出
    // int (base 10):-42
    // int (base 16):-2a
}
```
