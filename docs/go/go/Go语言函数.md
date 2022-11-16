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

