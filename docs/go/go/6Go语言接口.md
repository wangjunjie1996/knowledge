# Go 语言接口
## Go语言接口声明
每个接口类型由数个方法组成。接口的形式代码如下：
```
type 接口类型名 interface{
    方法名1( 参数列表1 ) 返回值列表1
    方法名2( 参数列表2 ) 返回值列表2
    …
}
```
* 接口类型名：使用 type 将接口定义为自定义的类型名。Go语言的接口在命名时，一般会在单词后面添加 er，如有写操作的接口叫 Writer，有字符串功能的接口叫 Stringer，有关闭功能的接口叫 Closer 等。
* 方法名：当方法名首字母是大写时，且这个接口类型名首字母也是大写时，这个方法可以被接口所在的包（package）之外的代码访问。
* 参数列表、返回值列表：参数列表和返回值列表中的参数变量名可以被忽略，例如：
```
type writer interface{
    Write([]byte) error
}
```
## Go语言实现接口的条件
### 接口被实现的条件一：接口的方法与实现接口的类型方法格式一致
在类型中添加与接口签名一致的方法就可以实现该方法。签名包括方法中的名称、参数列表、返回参数列表。也就是说，只要实现接口类型中的方法的名称、参数列表、返回参数列表中的任意一项与接口要实现的方法不一致，那么接口的这个方法就不会被实现。
```go
package main

import (
    "fmt"
)

// 定义一个数据写入器
type DataWriter interface {
    WriteData(data interface{}) error
}

// 定义文件结构，用于实现DataWriter
type file struct {
}

// 实现DataWriter接口的WriteData方法
func (d *file) WriteData(data interface{}) error {
    // 模拟写入数据
    fmt.Println("WriteData:", data)
    return nil
}

func main() {
    // 实例化 file 赋值给 f，f 的类型为 *file。
    f := new(file)
    // 声明 DataWriter 类型的 writer 接口变量。
    var writer DataWriter
    // 将 *file 类型的 f 赋值给 DataWriter 接口的 writer，虽然两个变量类型不一致。但是 writer 是一个接口，且 f 已经完全实现了 DataWriter() 的所有方法，因此赋值是成功的。
    writer = f
    // DataWriter 接口类型的 writer 使用 WriteData() 方法写入一个字符串。
    writer.WriteData("data")
}
```
### 接口被实现的条件二：接口中所有方法均被实现
当一个接口中有多个方法时，只有这些方法都被实现了，接口才能被正确编译并使用。
## Go语言类型与接口的关系
### 一个类型可以实现多个接口
```go
type Socket struct {
}

func (s *Socket) Write(p []byte) (n int, err error) {
    return 0, nil
}

func (s *Socket) Close() error {
    return nil
}
```
Socket 结构的 Write() 方法实现了 io.Writer 接口：
```go
type Writer interface {
    Write(p []byte) (n int, err error)
}
```
同时，Socket 结构也实现了 io.Closer 接口：
```go
type Closer interface {
    Close() error
}
```
在代码中使用Socket结构实现的Writer接口和Closer接口代码如下：
```go
// 使用io.Writer的代码, 并不知道Socket和io.Closer的存在
func usingWriter( writer io.Writer){
    writer.Write( nil )
}

// 使用io.Closer, 并不知道Socket和io.Writer的存在
func usingCloser( closer io.Closer) {
    closer.Close()
}

func main() {
    // 实例化Socket
    s := new(Socket)
    usingWriter(s)
    usingCloser(s)
}
```
usingWriter() 和 usingCloser() 完全独立，互相不知道对方的存在，也不知道自己使用的接口是 Socket 实现的。
### 多个类型可以实现相同的接口
```go
// 一个服务需要满足能够开启和写日志的功能
type Service interface {
    Start()  // 开启服务
    Log(string)  // 日志输出
}
// 日志器
type Logger struct {
}

// 实现Service的Log()方法
func (g *Logger) Log(l string) {

}

// 游戏服务
type GameService struct {
    Logger  // 嵌入日志器
}

// 实现Service的Start()方法
func (g *GameService) Start() {
}
func main() {
    var s Service = new(GameService)
    s.Start()
    s.Log(“hello”)
}
```
## Go语言类型断言简述
类型断言（Type Assertion）是一个使用在接口值上的操作，用于检查接口类型变量所持有的值是否实现了期望的接口或者具体的类型。在Go语言中类型断言的语法格式如下：
```go
value, ok := x.(T)
```
其中，x 表示一个接口的类型，T 表示一个具体的类型（也可为接口类型）。
该断言表达式会返回 x 的值（也就是 value）和一个布尔值（也就是 ok），可根据该布尔值判断 x 是否为 T 类型：
* 如果 T 是具体某个类型，类型断言会检查 x 的动态类型是否等于具体类型 T。如果检查成功，类型断言返回的结果是 x 的动态值，其类型是 T。
* 如果 T 是接口类型，类型断言会检查 x 的动态类型是否满足 T。如果检查成功，x 的动态值不会被提取，返回值是一个类型为 T 的接口值。
* 无论 T 是什么类型，如果 x 是 nil 接口值，类型断言都会失败。
示例代码如下：
```go
// T 是具体某个类型
package main

import (
    "fmt"
)

func main() {
    var x interface{}
    x = 10
    value, ok := x.(int)
    fmt.Print(value, ",", ok) //10,true

}
```
T 是接口类型
```go
type I interface {
	Walk(string)
}

type A struct {
}

func (a *A) Walk(l string) {
	fmt.Print("walk")
}

type B struct {
}

func main() {
	var x interface{}
	x = new(A)
    value, ok := x.(A)
	value.Walk("sd")
    fmt.Print(value, ",", ok) // walk{},false
}
```

x.(type) 这种方式的类型断言，就只能和 switch 搭配使用，
```go
func checkType(x interface{}){
	switch t := x.(type) {
	case string:
		fmt.Println("string类型： ",t)
	case int:
		fmt.Println("int类型： ",t)
	case bool:
		fmt.Println("bool类型： ",t)
        default:
        fmt.Println("未知类型")
	}
}

func main() {
	var x interface{}
	x = 666
	checkType(x)
	x = "test"
	checkType(x)
}

//运行结果：
//	int类型：  666
//	string类型：  test
```
## Go语言排序
一个内置的排序算法需要知道三个东西：序列的长度，表示两个元素比较的结果，一种交换两个元素的方式；这就是 sort.Interface 的三个方法：
```go
package sort
type Interface interface {
    Len() int            // 获取元素数量
    Less(i, j int) bool // i，j是序列元素的指数。
    Swap(i, j int)        // 交换元素
}
```
为了对序列进行排序，我们需要定义一个实现了这三个方法的类型，然后对这个类型的一个实例应用 sort.Sort 函数。思考对一个字符串切片进行排序，这可能是最简单的例子了。下面是这个新的类型 MyStringList  和它的 Len，Less 和 Swap 方法
```go
type MyStringList  []string
func (p MyStringList ) Len() int { return len(m) }
func (p MyStringList ) Less(i, j int) bool { return m[i] < m[j] }
func (p MyStringList ) Swap(i, j int) { m[i], m[j] = m[j], m[i] }
```
### 使用sort.Interface接口进行排序
对一系列字符串进行排序时，使用字符串切片（[]string）承载多个字符串。使用 type 关键字，将字符串切片（[]string）定义为自定义类型 MyStringList。为了让 sort 包能识别 MyStringList，能够对 MyStringList 进行排序，就必须让 MyStringList 实现 sort.Interface 接口。

下面是对字符串排序的详细代码（代码1）：
```go
package main

import (
    "fmt"
    "sort"
)

// 将[]string定义为MyStringList类型
type MyStringList []string

// 实现sort.Interface接口的获取元素数量方法
func (m MyStringList) Len() int {
    return len(m)
}

// 实现sort.Interface接口的比较元素方法
func (m MyStringList) Less(i, j int) bool {
    return m[i] < m[j]
}

// 实现sort.Interface接口的交换元素方法
func (m MyStringList) Swap(i, j int) {
    m[i], m[j] = m[j], m[i]
}

func main() {
    // 准备一个内容被打乱顺序的字符串切片
    names := MyStringList{
        "3. Triple Kill",
        "5. Penta Kill",
        "2. Double Kill",
        "4. Quadra Kill",
        "1. First Blood",
    }

    // 使用sort包进行排序
    sort.Sort(names)

    // 遍历打印结果
    for _, v := range names {
            fmt.Printf("%s\n", v)
    }
}
```
输出
```
1. First Blood
2. Double Kill
3. Triple Kill
4. Quadra Kill
5. Penta Kill
```
### 常见类型的便捷排序
通过实现 sort.Interface 接口的排序过程具有很强的可定制性，可以根据被排序对象比较复杂的特性进行定制。例如，需要多种排序逻辑的需求就适合使用 sort.Interface 接口进行排序。但大部分情况中，只需要对字符串、整型等进行快速排序。Go语言中提供了一些固定模式的封装以方便开发者迅速对内容进行排序。
#### 1) 字符串切片的便捷排序
sort 包中有一个 StringSlice 类型，定义如下：
```
type StringSlice []string

func (p StringSlice) Len() int           { return len(p) }
func (p StringSlice) Less(i, j int) bool { return p[i] < p[j] }
func (p StringSlice) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }

// Sort is a convenience method.
func (p StringSlice) Sort() { Sort(p) }
```
sort 包中的 StringSlice 的代码与 MyStringList 的实现代码几乎一样。因此，只需要使用 sort 包的 StringSlice 就可以更简单快速地进行字符串排序。将代码1中的排序代码简化后如下所示：
```go
names := sort.StringSlice{
    "3. Triple Kill",
    "5. Penta Kill",
    "2. Double Kill",
    "4. Quadra Kill",
    "1. First Blood",
}

sort.Sort(names)
```
#### 2) 对整型切片进行排序
除了字符串可以使用 sort 包进行便捷排序外，还可以使用 sort.IntSlice 进行整型切片的排序。sort.IntSlice 的定义如下：
```go
type IntSlice []int

func (p IntSlice) Len() int           { return len(p) }
func (p IntSlice) Less(i, j int) bool { return p[i] < p[j] }
func (p IntSlice) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }

// Sort is a convenience method.
func (p IntSlice) Sort() { Sort(p) }
```
sort 包在 sort.Interface 对各类型的封装上还有更进一步的简化，下面使用 sort.Strings 继续对代码1进行简化，代码如下：
```go
names := []string{
    "3. Triple Kill",
    "5. Penta Kill",
    "2. Double Kill",
    "4. Quadra Kill",
    "1. First Blood",
}

sort.Strings(names)

// 遍历打印结果
for _, v := range names {
    fmt.Printf("%s\n", v)
}
```
#### 3) sort包内建的类型排序接口一览
Go语言中的 sort 包中定义了一些常见类型的排序方法，如下表所示。

| 类 型 | 	实现 sort.lnterface 的类型 | 	直接排序方法  |   说 明  |
| ------ | ------ | ------ | ------ |
| 字符串（String）|	StringSlice |	sort.Strings(a [] string) |	字符 ASCII 值升序|
|整型（int）	|IntSlice	|sort.Ints(a []int)	|数值升序|
|双精度浮点（float64）|	Float64Slice	|sort.Float64s(a []float64)	|数值升序|
### 对结构体数据进行排序
除了基本类型的排序，也可以对结构体进行排序。结构体比基本类型更为复杂，排序时不能像数值和字符串一样拥有一些固定的单一原则。结构体的多个字段在排序中可能会存在多种排序的规则，例如，结构体中的名字按字母升序排列，数值按从小到大的顺序排序。一般在多种规则同时存在时，需要确定规则的优先度，如先按名字排序，再按年龄排序等。
#### 1) 完整实现sort.Interface进行结构体排序
将一批英雄名单使用结构体定义，英雄名单的结构体中定义了英雄的名字和分类。排序时要求按照英雄的分类进行排序，相同分类的情况下按名字进行排序，详细代码实现过程如下。
代码2
```go
package main

import (
    "fmt"
    "sort"
)

// 声明英雄的分类
type HeroKind int

// 定义HeroKind常量, 类似于枚举
const (
    None HeroKind = iota
    Tank
    Assassin
    Mage
)

// 定义英雄名单的结构
type Hero struct {
    Name string  // 英雄的名字
    Kind HeroKind  // 英雄的种类
}

// 将英雄指针的切片定义为Heros类型
type Heros []*Hero

// 实现sort.Interface接口取元素数量方法
func (s Heros) Len() int {
    return len(s)
}

// 实现sort.Interface接口比较元素方法
func (s Heros) Less(i, j int) bool {

    // 如果英雄的分类不一致时, 优先对分类进行排序
    if s[i].Kind != s[j].Kind {
        return s[i].Kind < s[j].Kind
    }

    // 默认按英雄名字字符升序排列
    return s[i].Name < s[j].Name
}

// 实现sort.Interface接口交换元素方法
func (s Heros) Swap(i, j int) {
    s[i], s[j] = s[j], s[i]
}

func main() {

    // 准备英雄列表
    heros := Heros{
        &Hero{"吕布", Tank},
        &Hero{"李白", Assassin},
        &Hero{"妲己", Mage},
        &Hero{"貂蝉", Assassin},
        &Hero{"关羽", Tank},
        &Hero{"诸葛亮", Mage},
    }

    // 使用sort包进行排序
    sort.Sort(heros)

    // 遍历英雄列表打印排序结果
    for _, v := range heros {
        fmt.Printf("%+v\n", v)
    }
}
```
输出
```
&{Name:关羽 Kind:1}
&{Name:吕布 Kind:1}
&{Name:李白 Kind:2}
&{Name:貂蝉 Kind:2}
&{Name:妲己 Kind:3}
&{Name:诸葛亮 Kind:3}
```
#### 2) 使用sort.Slice进行切片元素排序
从 Go 1.8 开始，Go语言在 sort 包中提供了 sort.Slice() 函数进行更为简便的排序方法。sort.Slice() 函数只要求传入需要排序的数据，以及一个排序时对元素的回调函数，类型为 func(i,j int)bool，sort.Slice() 函数的定义如下：
```
func Slice(slice interface{}, less func(i, j int) bool)
```
使用 sort.Slice() 函数，对代码2重新优化的完整代码如下：
```go
package main

import (
    "fmt"
    "sort"
)

type HeroKind int

const (
    None = iota
    Tank
    Assassin
    Mage
)

type Hero struct {
    Name string
    Kind HeroKind
}

func main() {

    heros := []*Hero{
        {"吕布", Tank},
        {"李白", Assassin},
        {"妲己", Mage},
        {"貂蝉", Assassin},
        {"关羽", Tank},
        {"诸葛亮", Mage},
    }

    sort.Slice(heros, func(i, j int) bool {
        if heros[i].Kind != heros[j].Kind {
            return heros[i].Kind < heros[j].Kind
        }

        return heros[i].Name < heros[j].Name
    })

    for _, v := range heros {
        fmt.Printf("%+v\n", v)
    }
}
```
## Go语言error接口
### error 基本用法
Go语言中返回的 error 类型究竟是什么呢？查看Go语言的源码就会发现 error 类型是一个非常简单的接口类型，如下所示：
```
// The error built-in interface type is the conventional interface for
// representing an error condition, with the nil value representing no error.
type error interface {
    Error() string
}
```
error 接口有一个签名为 Error() string 的方法，所有实现该接口的类型都可以当作一个错误类型。Error() 方法给出了错误的描述，在使用 fmt.Println 打印错误时，会在内部调用 Error() string 方法来得到该错误的描述。

一般情况下，如果函数需要返回错误，就将 error 作为多个返回值中的最后一个（但这并非是强制要求）。

创建一个 error 最简单的方法就是调用 errors.New 函数，它会根据传入的错误信息返回一个新的 error，示例代码如下：
```go
package main

import (
    "errors"
    "fmt"
    "math"
)

func Sqrt(f float64) (float64, error) {
    if f < 0 {
        return -1, errors.New("math: square root of negative number")
    }
    return math.Sqrt(f), nil
}

func main() {
    result, err := Sqrt(-13)
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Println(result)
    }
}
```
运行结果如下：
```
math: square root of negative number
```
### 自定义错误类型
除了上面的 errors.New 用法之外，我们还可以使用 error 接口自定义一个 Error() 方法，来返回自定义的错误信息。
```go
package main

import (
    "fmt"
    "math"
)

type dualError struct {
    Num     float64
    problem string
}

func (e dualError) Error() string {
    return fmt.Sprintf("Wrong!!!,because \"%f\" is a negative number", e.Num)
}

func Sqrt(f float64) (float64, error) {
    if f < 0 {
        return -1, dualError{Num: f}
    }
    return math.Sqrt(f), nil
}
func main() {
    result, err := Sqrt(-13)
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Println(result)
    }
}
```
运行结果如下：
```
Wrong!!!,because "-13.000000" is a negative number
```
## Go语言实现Web服务器
### 搭建一个简单的 Web 服务器
```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/", index) // index 为向 url发送请求时，调用的函数
    log.Fatal(http.ListenAndServe("localhost:8000", nil))
}

func index(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "C语言中文网")
}
```
运行之后并没有什么提示信息，但是命令行窗口会被占用（不能再输入其它命令）。这时我们在浏览器中输入 localhost:8000 可以看到下图所示的内容，则说明我们的服务器成功运行了。

上面的代码只是展示了 Web 服务器的简单应用，下面我们来完善一下，为这个服务器添加一个页面并设置访问的路由。

首先我们准备一个 html 文件，并命名为 index.html，代码如下所示：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>C语言中文网</title>
</head>
<body>
    <h1>C语言中文网</h1>
</body>
</html>
```
然后将我们上面写的 Web 服务器的代码简单修改一下，如下所示：
```go
package main

import (
    "io/ioutil"
    "log"
    "net/http"
)

func main() {
    // 在/后面加上 index ，来指定访问路径
    http.HandleFunc("/index", index)
    log.Fatal(http.ListenAndServe("localhost:8000", nil))
}

func index(w http.ResponseWriter, r *http.Request) {
    content, _ := ioutil.ReadFile("./index.html")
    w.Write(content)
}
```
