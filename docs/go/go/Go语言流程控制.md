# Go语言流程控制

## Go语言分支结构
```go
if condition {
    // do something
}

if condition {
    // do something
} else {
    // do something
}

if condition1 {
    // do something
} else if condition2 {
    // do something else
}else {
    // catch-all or default
}
```
关键字 if 和 else 之后的左大括号{必须和关键字在同一行，如果你使用了 else if 结构，则前段代码块的右大括号}必须和 else if 关键字在同一行，这两条规则都是被编译器强制规定的。  
非法的 Go 代码:
```go
if x{
}
else { // 无效的
}
```
在有些情况下，条件语句两侧的括号是可以被省略的，当条件比较复杂时，则可以使用括号让代码更易读，在使用 &&、|| 或 ! 时可以使用括号来提升某个表达式的运算优先级，并提高代码的可读性。  
```go
if err := Connect(); err != nil {
    fmt.Println(err)
    return
}
```
Connect 是一个带有返回值的函数，err:=Connect() 是一个语句，执行 Connect 后，将错误保存到 err 变量中。  
err != nil 才是 if 的判断表达式，当 err 不为空时，打印错误并返回。  
这种写法可以将返回值与判断放在一行进行处理，而且返回值的作用范围被限制在 if、else 语句组合中。  
## Go语言循环结构
与多数语言不同的是，Go语言中的循环语句只支持 for 关键字，而不支持 while 和 do-while 结构，关键字 for 的基本使用方法与C语言和C++中非常接近：  
```go
sum := 0
for i := 0; i < 10; i++ {
    sum += i
}
```
可以看到比较大的一个不同在于 for 后面的条件表达式不需要用圆括号()括起来，Go语言还进一步考虑到无限循环的场景，让开发者不用写无聊的 for(;;){}和do{} while(1);，而直接简化为如下的写法：  
```go
sum := 0
for {
    sum++
    if sum > 100 {
        break
    }
}
```
使用循环语句时，需要注意的有以下几点：  
  * 左花括号{必须与 for 处于同一行。
  * Go语言中的 for 循环与C语言一样，都允许在循环条件中定义和初始化变量，唯一的区别是，Go语言不支持以逗号为间隔的多个赋值语句，必须使用平行赋值的方式来初始化多个变量。
  * Go语言的 for 循环同样支持 continue 和 break 来控制循环，但是它提供了一个更高级的 break，可以选择中断哪一个循环，如下例：
```go
JLoop:
  for j := 0; j < 5; j++ {
      for i := 0; i < 10; i++ {
          if i > 5 {
              break JLoop
          }
          fmt.Println(i)
      }
  }
```
## Go语言键值循环
for range 结构是Go语言特有的一种的迭代结构，在许多情况下都非常有用，for range 可以遍历数组、切片、字符串、map 及通道（channel），for range 语法上类似于其它语言中的 foreach 语句，一般形式为：
```go
for key, val := range coll {  
    ...  
}
```
val 始终为集合中对应索引的值拷贝，因此它一般只具有只读性质，对它所做的任何修改都不会影响到集合中原有的值。一个字符串是 Unicode 编码的字符（或称之为 rune ）集合，因此也可以用它来迭代字符串：  
通过 for range 遍历的返回值有一定的规律：  
* 数组、切片、字符串返回索引和值。
* map 返回键和值。
* 通道（channel）只返回通道内的值。

## Go语言switch语句

Go语言的 switch 要比C语言的更加通用，表达式不需要为常量，甚至不需要为整数，case 按照从上到下的顺序进行求值，直到找到匹配的项，如果 switch 没有表达式，则对 true 进行匹配，因此，可以将 if else-if else 改写成一个 switch。
相对于C语言和Java等其它语言来说，Go语言中的 switch 结构使用上更加灵活，语法设计尽量以使用方便为主。
Go语言改进了 switch 的语法设计，case 与 case 之间是独立的代码块，不需要通过 break 语句跳出当前 case 代码块以避免执行到下一行，
```go
var a = "hello"
switch a {
case "hello":
    fmt.Println(1)
case "world":
    fmt.Println(2)
default:
    fmt.Println(0)
}
```
1) 一分支多值
```go
var a = "mum"
switch a {
case "mum", "daddy":
    fmt.Println("family")
}
```
2) 分支表达式
case 后不仅仅只是常量，还可以和 if 一样添加表达式，代码如下：
```go
var r int = 11
switch {
case r > 10 && r < 20:
    fmt.Println(r)
}
```
## Go语言goto语句
Go语言中 goto 语句通过标签进行代码间的无条件跳转，同时 goto 语句在快速跳出循环、避免重复退出上也有一定的帮助，使用 goto 语句能简化一些代码的实现过程。
### 使用 goto 退出多层循环
```go
package main

import "fmt"

func main() {
    for x := 0; x < 10; x++ {

        for y := 0; y < 10; y++ {

            if y == 2 {
                // 跳转到标签
                goto breakHere
            }

        }
    }
    // 手动返回, 避免执行进入标签
    return
    // 标签
    breakHere:
        fmt.Println("done")
}
```
### 使用 goto 集中处理错误
多处错误处理存在代码重复时是非常棘手的，例如：
```go
err := firstCheckError()
if err != nil {
    fmt.Println(err)
    exitProcess()
    return
}
err = secondCheckError()
if err != nil {
    fmt.Println(err)
    exitProcess()
    return
}
fmt.Println("done")
```
使用 goto 语句来实现同样的逻辑：
```go
    err := firstCheckError()
    if err != nil {
        goto onExit
    }
    err = secondCheckError()
    if err != nil {
        goto onExit
    }
    fmt.Println("done")
    return
onExit:
    fmt.Println(err)
    exitProcess()
```
## Go语言break
Go语言中 break 语句可以结束 for、switch 和 select 的代码块，另外 break 语句还可以在语句后面添加标签，表示退出某个标签对应的代码块，标签要求必须定义在对应的 for、switch 和 select 的代码块上。
跳出指定循环：
```go
package main
import "fmt"
func main() {
OuterLoop:
    for i := 0; i < 2; i++ {
        for j := 0; j < 5; j++ {
            switch j {
            case 2:
                fmt.Println(i, j)
                break OuterLoop
            case 3:
                fmt.Println(i, j)
                break OuterLoop
            }
        }
    }
}
// 输出 0 2
```
## Go语言continue
Go语言中 continue 语句可以结束当前循环，开始下一次的循环迭代过程，仅限在 for 循环内使用，在 continue 语句后添加标签时，表示开始标签对应的循环，例如：
```go
package main
import "fmt"
func main() {
OuterLoop:
    for i := 0; i < 2; i++ {

        for j := 0; j < 5; j++ {
            switch j {
            case 2:
                fmt.Println(i, j)
                continue OuterLoop
            }
        }
    }
}
```
代码输出结果如下：
```
0 2
1 2
```
