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