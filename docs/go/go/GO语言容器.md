# GO 语言容器
## Go语言数组详解
* 数组是一个由固定长度的特定类型元素组成的序列，一个数组可以由零个或多个元素组成。因为数组的长度是固定的，所以在Go语言中很少直接使用数组。
* 和数组对应的类型是 Slice（切片），Slice 是可以增长和收缩的动态序列，功能也更灵活，但是想要理解 slice 工作原理的话需要先理解数组，所以本节主要为大家讲解数组的使用，至于 Slice（切片）将在《Go语言切片》一节中为大家讲解。
### Go语言数组的声明
数组的声明语法如下：
```go
var 数组变量名 [元素数量]Type
```
* 数组变量名：数组声明及使用时的变量名。
* 元素数量：数组的元素数量，可以是一个表达式，但最终通过编译期计算的结果必须是整型数值，元素数量不能含有到运行时才能确认大小的数值。
* Type：可以是任意基本类型，包括数组本身，类型为数组本身时，可以实现多维数组。
数组的每个元素都可以通过索引下标来访问，索引下标的范围是从 0 开始到数组长度减 1 的位置，内置函数 len() 可以返回数组中元素的个数。
```go
var a [3]int             // 定义三个整数的数组
fmt.Println(a[0])        // 打印第一个元素
fmt.Println(a[len(a)-1]) // 打印最后一个元素
// 打印索引和元素
for i, v := range a {
    fmt.Printf("%d %d\n", i, v)
}
// 仅打印元素
for _, v := range a {
    fmt.Printf("%d\n", v)
}
```
默认情况下，数组的每个元素都会被初始化为元素类型对应的零值，对于数字类型来说就是 0，同时也可以使用数组字面值语法，用一组值来初始化数组：
```go
var q [3]int = [3]int{1, 2, 3}
var r [3]int = [3]int{1, 2}
fmt.Println(r[2]) // "0"
```
在数组的定义中，如果在数组长度的位置出现“...”省略号，则表示数组的长度是根据初始化值的个数来计算，因此，上面数组 q 的定义可以简化为：
```go
q := [...]int{1, 2, 3}
fmt.Printf("%T\n", q) // "[3]int"
```
数组的长度是数组类型的一个组成部分，因此 [3]int 和 [4]int 是两种不同的数组类型，数组的长度必须是常量表达式，因为数组的长度需要在编译阶段确定。
```go
q := [3]int{1, 2, 3}
q = [4]int{1, 2, 3, 4} // 编译错误：无法将 [4]int 赋给 [3]int
```
### 比较两个数组是否相等
如果两个数组类型相同（包括数组的长度，数组中元素的类型）的情况下，我们可以直接通过较运算符（==和!=）来判断两个数组是否相等，只有当两个数组的所有元素都是相等的时候数组才是相等的，不能比较两个类型不同的数组，否则程序将无法完成编译
```go
a := [2]int{1, 2}
b := [...]int{1, 2}
c := [2]int{1, 3}
fmt.Println(a == b, a == c, b == c) // "true false false"
d := [3]int{1, 2}
fmt.Println(a == d) // 编译错误：无法比较 [2]int == [3]int
```
### 遍历数组——访问每一个数组元素
遍历数组也和遍历切片类似，代码如下所示：
```go
var team [3]string
team[0] = "hammer"
team[1] = "soldier"
team[2] = "mum"
for k, v := range team {
    fmt.Println(k, v)
}
```
输出
```go
0 hammer  
1 soldier  
2 mum
```
### 多维数组
```go
var array_name [size1][size2]...[sizen] array_type
```
```go
// 声明一个二维整型数组，两个维度的长度分别是 4 和 2
var array [4][2]int
// 使用数组字面量来声明并初始化一个二维整型数组
array = [4][2]int{{10, 11}, {20, 21}, {30, 31}, {40, 41}}
// 声明并初始化数组中索引为 1 和 3 的元素
array = [4][2]int{1: {20, 21}, 3: {40, 41}}
// 声明并初始化数组中指定的元素
array = [4][2]int{1: {0: 20}, 3: {1: 41}}
```

## Go语言切片详解
切片（slice）是对数组的一个连续片段的引用，所以切片是一个引用类型（因此更类似于 C/C++中的数组类型，或者Python中的 list 类型），这个片段可以是整个数组，也可以是由起始和终止索引标识的一些项的子集，需要注意的是，终止索引标识的项不包括在切片内。

Go语言中切片的内部结构包含地址、大小和容量，切片一般用于快速地操作一块数据集合，如果将数据集合比作切糕的话，切片就是你要的“那一块”，切的过程包含从哪里开始（切片的起始位置）及切多大（切片的大小），容量可以理解为装切片的口袋大小  

切片默认指向一段连续内存区域，可以是数组，也可以是切片本身。
从连续内存区域生成切片是常见的操作，格式如下：
```go
slice [开始位置 : 结束位置]
```
语法说明如下：
* slice：表示目标切片对象；
* 开始位置：对应目标切片对象的索引；
* 结束位置：对应目标切片的结束索引。
从数组生成切片，代码如下：
```go
var a  = [3]int{1, 2, 3}
fmt.Println(a, a[1:2])
// 输出 [1 2 3]  [2]
```
从数组或切片生成新的切片拥有如下特性：
* 取出的元素数量为：结束位置 - 开始位置；
* 取出元素不包含结束位置对应的索引，切片最后一个元素使用 slice[len(slice)] 获取；
* 当缺省开始位置时，表示从连续区域开头到结束位置；
* 当缺省结束位置时，表示从开始位置到整个连续区域末尾；
* 两者同时缺省时，与切片本身等效；
* 两者同时为 0 时，等效于空切片，一般用于切片复位。
根据索引位置取切片 slice 元素值时，取值范围是（0～len(slice)-1），超界会报运行时错误，生成切片时，结束位置可以填写 len(slice) 但不会报错。
### 直接声明新的切片
var name []Type
```go
// 声明字符串切片
var strList []string
// 声明整型切片
var numList []int
// 声明一个空切片
var numListEmpty = []int{}
// 输出3个切片
fmt.Println(strList, numList, numListEmpty)
// 输出3个切片大小
fmt.Println(len(strList), len(numList), len(numListEmpty))
// 切片判定空的结果
fmt.Println(strList == nil)
fmt.Println(numList == nil)
fmt.Println(numListEmpty == nil)
```
代码输出结果：
```go
[] [] []  
0 0 0  
true  
true  
false
```
### 使用 make() 函数构造切片
如果需要动态地创建一个切片，可以使用 make() 内建函数，格式如下：
```go
make( []Type, size, cap )
```
其中 Type 是指切片的元素类型，size 指的是为这个类型分配多少个元素，cap 为预分配的元素数量，这个值设定后不影响 size，只是能提前分配空间，降低多次分配空间造成的性能问题。
```go
a := make([]int, 2)
b := make([]int, 2, 10)
fmt.Println(a, b)
fmt.Println(len(a), len(b))
```
代码输出如下：
```go
[0 0] [0 0]  
2 2
```
## Go语言append()为切片添加元素
var a []int
a = append(a, 1) // 追加1个元素
a = append(a, 1, 2, 3) // 追加多个元素, 手写解包方式
a = append(a, []int{1,2,3}...) // 追加一个切片, 切片需要解包
不过需要注意的是，在使用 append() 函数为切片动态添加元素时，如果空间不足以容纳足够多的元素，切片就会进行“扩容”，此时新切片的长度会发生改变。  
切片在扩容时，容量的扩展规律是按容量的 2 倍数进行扩充，例如 1、2、4、8、16……，代码如下：
```go
var numbers []int
for i := 0; i < 10; i++ {
    numbers = append(numbers, i)
    fmt.Printf("len: %d  cap: %d pointer: %p\n", len(numbers), cap(numbers), numbers)
}
代码输出如下：
```go
len: 1  cap: 1 pointer: 0xc0420080e8  
len: 2  cap: 2 pointer: 0xc042008150  
len: 3  cap: 4 pointer: 0xc04200e320  
len: 4  cap: 4 pointer: 0xc04200e320  
len: 5  cap: 8 pointer: 0xc04200c200  
len: 6  cap: 8 pointer: 0xc04200c200  
len: 7  cap: 8 pointer: 0xc04200c200  
len: 8  cap: 8 pointer: 0xc04200c200  
len: 9  cap: 16 pointer: 0xc042074000  
len: 10  cap: 16 pointer: 0xc042074000
```
```go
var a []int
a = append(a[:i], append([]int{x}, a[i:]...)...) // 在第i个位置插入x
a = append(a[:i], append([]int{1,2,3}, a[i:]...)...) // 在第i个位置插入切片
```
## Go语言切片复制
Go语言的内置函数 copy() 可以将一个数组切片复制到另一个数组切片中，如果加入的两个数组切片不一样大，就会按照其中较小的那个数组切片的元素个数进行复制。
copy() 函数的使用格式如下：
```go
copy( destSlice, srcSlice []T) int
```
其中 srcSlice 为数据来源切片，destSlice 为复制的目标（也就是将 srcSlice 复制到 destSlice），目标切片必须分配过空间且足够承载复制的元素个数，并且来源和目标的类型必须一致，copy() 函数的返回值表示实际发生复制的元素个数。
下面的代码展示了使用 copy() 函数将一个切片复制到另一个切片的过程：
```go
slice1 := []int{1, 2, 3, 4, 5}
slice2 := []int{5, 4, 3}
copy(slice2, slice1) // 只会复制slice1的前3个元素到slice2中
copy(slice1, slice2) // 只会复制slice2的3个元素到slice1的前3个位置
```
修改原切片不会改变复制的且切片
## Go语言从切片中删除元素
Go语言并没有对删除切片元素提供专用的语法或者接口，需要使用切片本身的特性来删除元素，根据要删除元素的位置有三种情况，分别是从开头位置删除、从中间位置删除和从尾部删除，其中删除切片尾部的元素速度最快。
### 从开头位置删除
删除开头的元素可以直接移动数据指针：
```go
a = []int{1, 2, 3}
a = a[1:] // 删除开头1个元素, 取下标 1 - 结尾的切片数据赋值覆盖
a = a[N:] // 删除开头N个元素, 取下标 N - 结尾的切片数据赋值覆盖
```
也可以不移动数据指针，但是将后面的数据向开头移动，可以用 append 原地完成（所谓原地完成是指在原有的切片数据对应的内存区间内完成，不会导致内存空间结构的变化）：
```go
a = []int{1, 2, 3}
a = append(a[:0], a[1:]...) // 删除开头1个元素,a[:0] 等于 a[0:0]空切片,取下标 1 - 结尾的切片数据追加到空切片里
a = append(a[:0], a[N:]...) // 删除开头N个元素,a[:0] 等于 a[0:0]空切片,取下标 N - 结尾的切片数据追加到空切片里
```
还可以用 copy() 函数来删除开头的元素：
```go
a = []int{1, 2, 3}
a = a[:copy(a, a[1:])] // 删除开头1个元素
a = a[:copy(a, a[N:])] // 删除开头N个元素
```
### 从中间位置删除
对于删除中间的元素，需要对剩余的元素进行一次整体挪动，同样可以用 append 或 copy 原地完成：
```go
a = []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
a = append(a[:i], a[i+1:]...) // 删除中间1个元素
a = append(a[:i], a[i+N:]...) // 删除中间N个元素
a = a[:i+copy(a[i:], a[i+1:])] // 删除中间1个元素
a = a[:i+copy(a[i:], a[i+N:])] // 删除中间N个元素
```
### 从尾部删除
```go
a = []int{1, 2, 3}
a = a[:len(a)-1] // 删除尾部1个元素
a = a[:len(a)-N] // 删除尾部N个元素
```
## Go语言range关键字
通过前面的学习我们了解到切片其实就是多个相同类型元素的连续集合，既然切片是一个集合，那么我们就可以迭代其中的元素，Go语言有个特殊的关键字 range，它可以配合关键字 for 来迭代切片里的每一个元素，如下所示：
```go
// 创建一个整型切片，并赋值
slice := []int{10, 20, 30, 40}
// 迭代每一个元素，并显示其值
for index, value := range slice {
    fmt.Printf("Index: %d Value: %d\n", index, value)
}
```
需要强调的是，range 返回的是每个元素的副本，而不是直接返回对该元素的引用，  
关键字 range 总是会从切片头部开始迭代。如果想对迭代做更多的控制，则可以使用传统的 for 循环，代码如下所示。  
```go
// 创建一个整型切片，并赋值
slice := []int{10, 20, 30, 40}
// 从第三个元素开始迭代每个元素
for index := 2; index < len(slice); index++ {
    fmt.Printf("Index: %d Value: %d\n", index, slice[index])
}
```
## Go语言多维切片简述
var sliceName [][]...[]sliceType  
其中，sliceName 为切片的名字，sliceType为切片的类型，每个[ ]代表着一个维度，切片有几个维度就需要几个[ ]。

  下面以二维切片为例，声明一个二维切片并赋值，代码如下所示。
```go
//声明一个二维切片
var slice [][]int
//为二维切片赋值
slice = [][]int{{10}, {100, 200}}

// 简写
// 声明一个二维整型切片并赋值
slice := [][]int{{10}, {100, 200}}
```
## 数组和切片定义区别
```go
// 数组
var q [3]int  // 定义三个整数的数组
var q [3]int = [3]int{1, 2, 3} // 定义三个整数的数组并初始化
var q = [3]int{1, 2, 3}
q := [3]int{1, 2, 3}
q := [...]int{1, 2, 3}
var array [4][2]int
var array [4][2]int = [4][2]int{{10, 11}, {20, 21}, {30, 31}, {40, 41}}
var array = [4][2]int{{10, 11}, {20, 21}, {30, 31}, {40, 41}}
array := [4][2]int{{10, 11}, {20, 21}, {30, 31}, {40, 41}}
array := [...][2]int{{10, 11}, {20, 21}, {30, 31}, {40, 41}} // 只有一维可以使用 ...
// 切片
var q []int // 声明整型切片
var q []int = []int{1, 2, 3}
var q = []int{1, 2, 3}
q := []int{1, 2, 3}
var slice [][]int
var slice [][]int = [][]int{{10, 11}, {20, 21}, {30, 31}, {40, 41}}
var slice = [][]int{{10, 11}, {20, 21}, {30, 31}, {40, 41}}
slice := [][]int{{10, 11}, {20, 21}, {30, 31}, {40, 41}}
b := make([]int, 2, 10)
```
## Go语言map
Go语言中 map 是一种特殊的数据结构，一种元素对（pair）的无序集合，pair 对应一个 key（索引）和一个 value（值），所以这个结构也称为关联数组或字典，这是一种能够快速寻找值的理想结构，给定 key，就可以迅速找到对应的 value。  
map 是引用类型，可以使用如下方式声明：
```go
var mapname map[keytype]valuetype
```
> 提示：[keytype] 和 valuetype 之间允许有空格。  

在声明的时候不需要知道 map 的长度，因为 map 是可以动态增长的，未初始化的 map 的值是 nil，使用函数 len() 可以获取 map 中 pair 的数目。  
```go
/** map 定义 **/
var mapLit map[string]int
mapLit = map[string]int{"one": 1, "two": 2}
mapCreated := make(map[string]float32) // 等价于 mapCreated := map[string]float{}
mapCreated["key1"] = 4.5
mapCreated["key2"] = 3.14159
// 用切片作为 map 的值
mp1 := make(map[int][]int)
mp2 := make(map[int]*[]int)

/** 遍历 map **/
scene := make(map[string]int)
scene["route"] = 66
scene["brazil"] = 4
scene["china"] = 960
for k, v := range scene {
    fmt.Println(k, v)
}

/** 如果需要特定顺序的遍历结果，正确的做法是先排序，代码如下：**/
var sceneList []string // 声明一个切片保存map数据
// 将map数据遍历复制到切片中
for k := range scene {
    sceneList = append(sceneList, k)
}
// 对切片进行排序
sort.Strings(sceneList)
// 输出
fmt.Println(sceneList)

/** 使用 delete() 内建函数从 map 中删除一组键值对，delete() 函数的格式如下： **/
delete(map, 键)

/** 清空 map 的唯一办法就是重新 make 一个新的 map **/
```
## Go语言sync.Map
Go语言中的 map 在并发情况下，只读是线程安全的，同时读写是线程不安全的。  
并发的 map 读和 map 写，也就是说使用了两个并发函数不断地对 map 进行读和写而发生了竞态问题，map 内部会对这种并发操作进行检查并提前发现。  
需要并发读写时，一般的做法是加锁，但这样性能并不高，Go语言在 1.9 版本中提供了一种效率较高的并发安全的 sync.Map，sync.Map 和 map 不同，不是以语言原生形态提供，而是在 sync 包下的特殊结构。  
sync.Map 有以下特性：  
* 无须初始化，直接声明即可。
* sync.Map 不能使用 map 的方式进行取值和设置等操作，而是使用 sync.Map 的方法进行调用，Store 表示存储，Load 表示获取，Delete 表示删除。
* 使用 Range 配合一个回调函数进行遍历操作，通过回调函数返回内部遍历出来的值，Range 参数中回调函数的返回值在需要继续迭代遍历时，返回 true，终止迭代遍历时，返回 false。
并发安全的 sync.Map 演示代码如下：  
```go
package main

import (
      "fmt"
      "sync"
)

func main() {
    var scene sync.Map
    // 将键值对保存到sync.Map
    scene.Store("greece", 97)
    scene.Store("london", 100)
    scene.Store("egypt", 200)
    // 从sync.Map中根据键取值
    fmt.Println(scene.Load("london"))
    // 根据键删除对应的键值对
    scene.Delete("london")
    // 遍历所有sync.Map中的键值对
    scene.Range(func(k, v interface{}) bool {
        fmt.Println("iterate:", k, v)
        return true
    })
}
```
输出
```
100 true  
iterate: egypt 200  
iterate: greece 97
```
## Go语言list
### 初始化列表
list 的初始化有两种方法：分别是使用 New() 函数和 var 关键字声明，两种方法的初始化效果都是一致的。  
1. 通过 container/list 包的 New() 函数初始化 list
变量名 := list.New()
2. 通过 var 关键字声明初始化 list
var 变量名 list.List  
列表与切片和 map 不同的是，列表并没有具体元素类型的限制，因此，列表的元素可以是任意类型，这既带来了便利，也引来一些问题，例如给列表中放入了一个 interface{} 类型的值，取出值后，如果要将 interface{} 转换为其他类型将会发生宕机。  
### 在列表中插入元素
双链表支持从队列前方或后方插入元素，分别对应的方法是 PushFront 和 PushBack。  
这两个方法都会返回一个 *list.Element 结构，如果在以后的使用中需要删除插入的元素，则只能通过 *list.Element 配合 Remove() 方法进行删除，这种方法可以让删除更加效率化，同时也是双链表特性之一。  
```go
l := list.New() // 创建一个列表实例。

l.PushBack("fist") // 将 fist 字符串插入到列表的尾部，此时列表是空的，插入后只有一个元素。
l.PushFront(67) // 将数值 67 放入列表，此时，列表中已经存在 fist 元素，67 这个元素将被放在 fist 的前面。
```
列表插入元素的方法如下表所示。  
InsertAfter(v interface {}, mark * Element) * Element	在 mark 点之后插入元素，mark 点由其他插入函数提供
InsertBefore(v interface {}, mark * Element) *Element	在 mark 点之前插入元素，mark 点由其他插入函数提供
PushBackList(other *List)	添加 other 列表元素到尾部
PushFrontList(other *List)	添加 other 列表元素到头部
### 从列表中删除元素
列表插入函数的返回值会提供一个 *list.Element 结构，这个结构记录着列表元素的值以及与其他节点之间的关系等信息，从列表中删除元素时，需要用到这个结构进行快速删除。  
```go
package main

import "container/list"

func main() {
    l := list.New()
    // 尾部添加
    l.PushBack("canon")  // canon
    // 头部添加
    l.PushFront(67) // 67, canon
    // 尾部添加后保存元素句柄
    element := l.PushBack("fist") // 67, canon, fist
    // 在fist之后添加high
    l.InsertAfter("high", element) // 67, canon, fist, hight
    // 在fist之前添加noon
    l.InsertBefore("noon", element) // 67, canon, noon, fist, hight
    // 使用
    l.Remove(element)
}
```
遍历列表——访问列表的每一个元素  
遍历双链表需要配合 Front() 函数获取头元素，遍历时只要元素不为空就可以继续进行，每一次遍历都会调用元素的 Next() 函数，代码如下所示。
```go
for i := l.Front(); i != nil; i = i.Next() {
    fmt.Println(i.Value)
}
```
## Go语言nil
在Go语言中，布尔类型的零值（初始值）为 false，数值类型的零值为 0，字符串类型的零值为空字符串""，而指针、切片、映射、通道、函数和接口的零值则是 nil。  
nil 是Go语言中一个预定义好的标识符，有过其他编程语言开发经验的开发者也许会把 nil 看作其他语言中的 null（NULL），其实这并不是完全正确的，因为Go语言中的 nil 和其他语言中的 null 有很多不同点。  
下面通过几个方面来介绍一下Go语言中 nil。  
nil 标识符是不能比较的  
```go
package main

import (
    "fmt"
)

func main() {
    fmt.Println(nil==nil)
}

PS D:\code> go run .\main.go  
# command-line-arguments  
.\main.go:8:21: invalid operation: nil == nil (operator == not defined on nil)
从上面的运行结果不难看出，==对于 nil 来说是一种未定义的操作。
```
nil 不是关键字或保留字  
nil 并不是Go语言的关键字或者保留字，也就是说我们可以定义一个名称为 nil 的变量，比如下面这样：
```go
var nil = errors.New("my god")
```
虽然上面的声明语句可以通过编译，但是并不提倡这么做。  
nil 没有默认类型  
不同类型 nil 的指针是一样的  
```go
var arr []int
var num *int
fmt.Printf("%p\n", arr)
fmt.Printf("%p", num)
// 结果 0x0  0x0
```
两个相同类型的 nil 值也可能无法比较  
在Go语言中 map、slice 和 function 类型的 nil 值不能比较，比较两个无法比较类型的值是非法的，下面的语句无法编译。  
```go
package main

import (
    "fmt"
)

func main() {
    var s1 []int
    var s2 []int
    fmt.Printf(s1 == s2)
}
```
运行结果如下所示：
```
PS D:\code> go run .\main.go  
# command-line-arguments  
.\main.go:10:19: invalid operation: s1 == s2 (slice can only be compared to nil)
```
通过上面的错误提示可以看出，能够将上述不可比较类型的空值直接与 nil 标识符进行比较，如下所示：
```go
package main

import (
    "fmt"
)

func main() {
    var s1 []int
    fmt.Println(s1 == nil)
}
```
运行结果如下所示：
```
PS D:\code> go run .\main.go  
true
```
nil 是 map、slice、pointer、channel、func、interface 的零值  
不同类型的 nil 值占用的内存大小可能是不一样的  
一个类型的所有的值的内存布局都是一样的，nil 也不例外，nil 的大小与同类型中的非 nil 类型的大小是一样的。但是不同类型的 nil 值的大小可能不同。  
具体的大小取决于编译器和架构  
## Go语言make和new关键字的区别及实现原理
Go语言中 new 和 make 是两个内置函数，主要用来创建并分配类型的内存。在我们定义变量的时候，可能会觉得有点迷惑，不知道应该使用哪个函数来声明变量，其实他们的规则很简单，new 只分配内存，而 make 只能用于 slice、map 和 channel 的初始化，下面我们就来具体介绍一下。  
### new
在Go语言中，new 函数描述如下：
```go
// The new built-in function allocates memory. The first argument is a type,
// not a value, and the value returned is a pointer to a newly
// allocated zero value of that type.
func new(Type) *Type
```
从上面的代码可以看出，new 函数只接受一个参数，这个参数是一个类型，并且返回一个指向该类型内存地址的指针。同时 new 函数会把分配的内存置为零，也就是类型的零值。  
```go
var sum *int
sum = new(int) //分配空间
*sum = 98
fmt.Println(*sum)
```
### make
make 也是用于内存分配的，但是和 new 不同，它只用于 chan、map 以及 slice 的内存创建，而且它返回的类型就是这三个类型本身，而不是他们的指针类型，因为这三种类型就是引用类型，所以就没有必要返回他们的指针了。  
make 函数只用于 map，slice 和 channel，并且不返回指针。如果想要获得一个显式的指针，可以使用 new 函数进行分配，或者显式地使用一个变量的地址。  
Go语言中的 new 和 make 主要区别如下：
```
make 只能用来分配及初始化类型为 slice、map、chan 的数据。new 可以分配任意类型的数据；
new 分配返回的是指针，即类型 *Type。make 返回引用，即 Type；
new 分配的空间被清零。make 分配空间后，会进行初始化；
```
最后，简单总结一下Go语言中 make 和 new 关键字的实现原理，make 关键字的主要作用是创建 slice、map 和 Channel 等内置的数据结构，而 new 的主要作用是为类型申请一片内存空间，并返回指向这片内存的指针。