# Javascript面向对象

## 面向对象
> 本文知识点：原型、原型链、函数对象、普通对象、继承

### 面向对象的基本概念
面向对象也即是 OOP，Object Oriented Programming，是计算机的一种编程架构，OOP 的基本原则是计算机是由子程序作用的单个或者多个对象组合而成，包含属性和方法的对象是类的实例，但是 JavaScript 中没有类的概念，而是直接使用对象来实现编程。

#### 特性：
* 封装：能够将一个实体的信息、功能、响应都封装到一个单独对象中的特性。
>  由于 JavaScript 没有 public、private、protected 这些关键字，但是可以利用变量的作用域来模拟 public 和 private 封装特性。

```js
var insObject = (function() {
    var _name = 'hello'; // private
    return {
        getName: function() { // public
            return _name;
        }
    }
})();
insObject._name; // undefined
insObject.getName(); // hello
```

这里只是实现了一个简单的版本，private 比较好的实现方式可以参考 ES6 实现

* 继承：在不改变源程序的基础上进行扩充，原功能得以保存，并且对子程序进行扩展，避免重复代码编写，后面将详细描述

* 多态：允许将子类类型的指针赋值给父类类型的指针；原生 JS 是弱类型语言，没有多态概念, 但是 JavaScript 也不是不能实现多态的概念，例子：

```js
// 比如我们有台电脑mac， 它有一个方法 system 来获取系统
var mac = {
    system: function(){
       console.log('mac');
    }
}
var getSystem = function() {
    mac.system();
}
getSystem();// mac

// 某一天我们换成 win，为了防止后面又换成 mac，我们让 getSystem 函数有一定的弹性。
var mac = {
  system: function(){
       console.log('mac');
   }
 }
 var win = {
   system: function(){
       console.log('win');
   }
 }
 var getSystem = function(type) {
   if (type == 'mac') {
       mac.system();
   } else if (type == 'win') {
       win.system();
   }
 }
 getSystem('mac');// mac
 getSystem('win');// win
// 但是很明显这个函数还是有问题，某天我又换成 centos 呢。。。。
// 我们改写一下 getSystem 这个函数, 这里我们是假设每个系统获取系统的名称都是 system。
// 实际开发过程中可能不会这样，这种情况可以用适配器模式来解决。
var getSystem = function(ins) {
      if (ins.system instanceOf Function) {
          ins.system();
      }
  }

```

#### JavsScript中面向对象的一些概念：

* 类 class： ES5 以前就是构造函数，ES6 中有 class
* 实例 instance 和对象 object：构造函数创建出来的对象一般称为实例 instance
* 父类和子类：JavaScript 也可以称为父对象和子对象

### JavaScript对象属性

#### 1.属性

* **对象的属性**
* Object.prototype Object 的原型对象，不是每个对象都有 prototype 属性
* Object.prototype.proto 不是标准方法，不鼓励使用，每个对象都有 __proto__ 属性，但是由于浏览器实现方式的不同，__proto__ 属性在chrome、firefox中实现了，在IE中并不支持，替代的方法是 Object.getPrototypeOf()
* Object.prototype.constructor：用于创建一个对象的原型，创建对象的构造函数

* **属性描述符**

* 数据属性：
| 特性名称 | 描述 | 默认值 |
| ------| ------ | ------ |
| value | 属性的值 | undfined |
| writable | 是否可以修改属性的值，true表示可以，false表示不可以 | true |
| enumerable | 属性值是否可枚举，true表示可枚举for-in, false表示不可枚举 | true |
| configurable | 属性的特性是否可配置，表示能否通过delete删除属性后重新定义属性 | true |

例子：
```js
var a = {  test: "test",}
Object.getOwnPropertyDescriptor(a, 'test'); // Object { value: "test", writable: true, enumerable: true, configurable: true }
```

* 访问器属性：
| 特性名称 | 描述 | 默认值 |
| ------| ------ | ------ |
| set | 设置属性时调用的函数 | undfined |
| get | 写入属性时调用的函数 | undfined |
| configurable | 表示能否通过delete删除属性后重新定义属性 | true |
| enumerable | 表示能否通过for-in循环返回属性 | true |

> 访问器属性不能直接定义，必须使用 Object.defineProperty() 来定义。

```js
var book = {
    _year : 2004,
    edition : 1
};
Object.defineProperty(book,"year",{
    get : function () {
        alert(this._year);
    },
    set : function (newValue) {
        if (newValue > 2004) {
            this._year = newValue;
            this.edition += newValue - 2004;
        }
    }
});
book.year;      // 弹出窗口，显示 2004
book.year = 2005;
console.log(book.edition);   // 2
```

#### 2.方法

* Object.prototype.toString() 返回对象的字符串表示
* Object.prototype.hasOwnProperty() 返回一个布尔值，表示某个对象是否含有指定的属性，而且此属性非原型链继承，也就是说不会检查原型链上的属性
* Object.prototype.isPrototypeOf() 返回一个布尔值，表示指定的对象是否在本对象的原型链中
* Object.prototype.propertyIsEnumerable() 判断指定属性是否可枚举
* Object.prototype.watch() 给对象的某个属性增加监听
* Object.prototype.unwatch() 移除对象某个属性的监听
* Object.prototype.valueOf() 返回指定对象的原始值
* 获取和设置属性
    Object.defineProperty 定义单个属性
    Object.defineProperties 定义多个属性
    Object.getOwnPropertyDescriptor 获取属性
* Object.assign() 拷贝可枚举属性 （ES6新增）
* Object.create() 创建对象
* Object.entries() 返回一个包含由给定对象所有可枚举属性的属性名和属性值组成的 [属性名，属性值] 键值对的数组，数组中键值对的排列顺序和使用for…in循环遍历该对象时返回的顺序一致
* Object.freeze() 冻结一个对象，冻结指的是不能向这个对象添加新的属性，不能修改其已有属性的值，不能删除已有属性，以及不能修改该对象已有属性的可枚举性、可配置性、可写性。也就是说，这个对象永远是不可变的。该方法返回被冻结的对象
* Object.getOwnPropertyNames() 返回指定对象的属性名组成的数组
* Object.getPrototypeOf 返回该对象的原型
* Object.is(value1, value2) 判断两个值是否是同一个值 (ES6 新增)
* Object.keys() 返回一个由给定对象的所有可枚举自身属性的属性名组成的数组，数组中属性名的排列顺序和使用for-in循环遍历该对象时返回的顺序一致
* Object.setPrototypeOf(obj, prototype) 将一个指定的对象的原型设置为另一个对象或者null
* Object.values 返回一个包含指定对象所有的可枚举属性值的数组，数组中的值顺序和使用for…in循环遍历的顺序一样

#### 对象的深拷贝和浅拷贝

* 浅拷贝仅仅是复制引用，拷贝后 a === b， 注意 Object.assign 方法实现的是浅复制（此处有深刻教训！！！）
* 深拷贝这是创建了一个新的对象，然后把旧的对象中的属性和方法拷贝到新的对象中，拷贝后 a !== b
* 深拷贝的实现由很多例子，例如 jQuery 的 extend 和 lodash 中的 cloneDeep, clone。jQuery 可以使用 $.extend(true, {}, ...) 来实现深拷贝, 但是 jQuery 无法复制 JSON 对象之外的对象，例如 ES6 引入的 Map、Set 等。而 lodash 加入的大量的代码来实现ES6新引入的标准对象

#### 对象分为函数对象和普通对象

> Object、Function、Array、Date等js的内置对象都是函数对象, 只有Function的实例都是函数对象、其他的实例都是普通对象

### Javascript prototype 属性

* prototype 属性使您有能力向对象添加属性和方法。
* 语法

```js
Object.prototype.name = value;
Object.prototype.fun = function() {};
```

```js
// 定义一个数组方法，逻辑为遍历数组，把每一项的字母都转为大写。
Array.prototype.myUcase=function(){
  for (i = 0;i < this.length;i++){
    this[i] = this[i].toUpperCase();
  }
}
var array = ["Banana","Orange","Apple","Mango"];
// 运行 array.myUcase() 后， array 的值就变为[BANANA,ORANGE,APPLE,MANGO]
array.myUcase();
```

#### 深入了解原型及原型链

面向对象是当代编程的主流思想。无论是 C++ 还是 Java，都是面向对象的。严格意义上来讲，JavaScript 并不是面向对象的，但Javascript 的灵活性足以让我们将其用作一门面向对象语言。javascript的对象是不同于 Java, C++ 中对象的概念的。JavaScript是一种没有类的，面向对象的语言。它使用原型继承来代替类继承。

>undefined, number, string, boolean 四种属于简单的值类型，不是对象，使用基本类型变量可以调用方法是因为产生了包装对象（临时的）。剩下的几种情况——函数、数组、对象、null、new Number(10)都是对象，他们都是引用类型。

学过 java 或者 C++ 的人都知道，对象是什么、对象是怎样产生的。为了和 javascript 中的对象进行比较，举一个 java 下对象的例子
```java
class Person {
  String name;
  String age;
  public void main() {
    System.out.println("hello");
  }
}
Person people1 = new Preson();
```
在 c++ 或 java 中对象是 new 一个 calss 出来的，里面有字段，属性，和方法。但是在 javascript 对象里面的一切都是属性，只有属性，没有方法。那么方法如何表示呢？方法也是一种属性，表示为键值对的形式。

```js
// 通过字面量定义一个对象
var Person = {
  name: 'Carlos',
  age: 24,
  main: function() {},
}
// 或者通过方法创建
function Person() {
  name: 'Carlos',
  age: 24,
  main: function() {},
}
```
可以看到，javascript 中 function（函数）的作用相当于 java 中 class（类）的作用，那么在 javascript 中一句很重要的话就是，对象都是通过函数创建的。

* 所有的对象都是由函数创建。
1、函数也是一个对象，由 Function 函数创建。
```js
function fun(x, y){ return x + y };

// 等价于
var fun = new Function("x", "y", "return x + y;");
```
2.Function 也是一个对象，由它自己创建

* 所有的函数都有 prototype 属性（原型）
>注意，是函数才有 prototype ，普通对象没有。

函数创建时就自动带有这个属性，也就是我们讲的“原型”。
这个 prototype 的属性值是一个对象（属性的集合，再次强调！），默认的只有一个叫做 constructor 的属性，指向这个函数本身。

* 所有的对象都有 `__proto__`。
1、所有的对象都有 `__proto__` ，指向创建它的函数的 prototype 。

> 注意，你要这样来理解这句话的意思，那就是同一个函数 new 出来的对象的 `__proto__` 都统一指向了这个函数的 prototype ，也就是说通过这个函数 new 出来的所有对象都可以直接使用该函数原型上的任意属性和方法！，

2、所有的函数，比如 function fn(){}，都是由 Function 函数创建，因此 fn 的 `__proto__` 指向 Function 的 prototype 。同理，Object 函数也是由 Function 创建，因此 Object 的 `__proto__` 同样指向 Function 的 prototype ！
3、prototype 也是一个对象，原始 prototype 只有一个叫做 constructor 的属性，指向这个函数本身。因为 prototype 是一个对象，因此它也是由 Object 方法创建，因此它的 `__proto__` 将指向 Object.prototype 。
```js
Function.prototype.__proto__ === Objecct.prototype // true
```
Object.prototype 却是一个特例——它的 `__proto__` 指向的是 null，切记切记！

```js
function foo(){}
var fn = new foo();
```


* **原型**
```js
var person = function name() {
  this.name = name;
}
person.prototype.getName = function() {
  return this.name;
}
var zs = new person('zs');
zs.getName();
zs.hasOwnProperty();
```
用上面的代码为例讲解原型链
首先 person 是个函数，我们在它的原型（prototype）上添加了一个 getNam e的方法（函数属性）,然后 zs 是 person new 出来的一个对象，因此 zs 的 `__proto__` 指向 person 的 prototype。person.prototype 作为一个普通对象，是由 Object 函数创建的，因此它的 `__proto__`指向 Object.prototype 。

我们看到，zs 对象本身没有 getName 方法，那它是怎么访问到的？

在当前对象中没有找到某个属性时，它会顺着 `__proto__` 属性依次向上查找，直到找到为止！因此，getName 属性在 zs 对象中没有找到，就会继续找 `zs.__proto__` ，也就是 person.prototype ，很显然，这里找到了，就不会再向上查找了,

hasOwnProperty 属性显然 zs 对象中没有找到，就会继续找 `zs.__proto__` ，也就是 person.prototype ，很显然，person.prototype 中也找不到，于是继续向上在 `person.prototype.__proto__` 中找。person.prototype 是一个普通对象，它是由 Object 方法创建的，因此 `person.prototype.__proto__` 就是 Object.prototype ，很显然，Object.prototype 里面已经定义了 hasOwnProperty方法（属性），因此在这里也找到了。

上面这种查找形式就称为原型链。就像一根链条一样，依次向上链接起来。这也是ES5及之前的所谓“继承”实现。




## 闭包与继承

### 闭包
### 继承
#### ES5 继承
* **ES5的六种继承方式：**

继承方法	继承核心代码	优点	缺点
原型链继承	child.prototype = new parent()	父类方法可以复用	不可以传参， 实例的引用类型会被共享
构造函数继承	在子类child里执行parent.call(this}	实例的引用类型不共享 ，可以传参	父类的方法不能复用，子类实例的方法每次都是被单独创建的
组合式继承	child.prototype = new parent(); parent.call(this)	父类的方法可以被复用；父类的引用属性不会被共享； 子类构建实例时可以向父类传递参数	调用两次父类的构造函数，第一次给子类的原型添加了父类的name, arr属性；第二次又给子类的构造函数添加了父类的name, arr属性，从而覆盖了子类原型中的同名参数
原型式继承	原型式继承的object方法本质上是对参数对象的一个浅复制	父类方法可以复用	子类的引用属性会被所有子类的实例共享；子类构建实例时不能向父类传参；
寄生式继承	使用原型式继承获得一个目标对象的浅复制，然后增强这个浅复制的能力	-	-
寄生组合继承	-	-	-
es6 class extends	-	-	-


* 构造函数继承
```js
var a = {
    name: 'a',
};
var name = 'window';
var getName = function(){
    console.log(this.name);
}
// 执行getName()时，函数体的this指向window，而执行getName.call(a)时，函数体的this指向的是a对象
getName() // 输出window
getName.call(a) // 输出
```
实现构造函数继承
```js
function SuperType () {
    this.colors = ['red', 'green'];
}

function SubType () {
    // 继承SuperType
    SuperType.call(this);
}

var instance1 = new SubType();
instance1.colors.push('blue');
console.log(instance1.colors);
// red, green, blue

var instance2 = new SubType();
console.log(instance2.colors);
// red, green
```
SuperType.call(this); 这一行代码，实际上意思是在SubType的实例初始化过程中，调用了SuperType的构造函数，因此SubType的每个实例都有colors这个属性
* 优点：子对象可以传递参数给父对象。
```js
function SuperType(name) {
    this.name = name;
}
function SubType(name, age) {
    name = name || 'hello';
    SuperType.call(this, name);
    this.age = age;
}
var instance1 = new SubType('scofield', 28);
console.log(instance1.name);
console.log(instance1.age);
```
需要注意的地方是在调用父对象的构造函数之后，再给子类型中的定义属性，否则会被重写。
* 关于 Object.create() 和对象继承
Object.create()函数是 JavaScript 提供给我们的一个在创建对象时设置对象内部 [[proto]] 属性的 API，通过修改 [[proto]] 属性的值，我们就能决定对象所继承的对象，从而以我们想要的方式实现继承。
```js
var x = {
    name: 'tom',
    sayName: function() {
        console.log(this.name)
    }
}
var y = Object.create(x, {
    name: {
        configurable: true,
        enumerable: true,
        value: 'kitty',
        writable: true,
    }
})
y.sayName() // 'kitty'
```
Object.create() 函数接收两个参数，第一个参数是创建对象想要继承的原型对象，第二个参数是一个属性描述对象，然后会返回一个对象。
> 1. 创建了一个空对象，并赋值给相应变量；
   2. 将第一个参数对象设置为该对象 [[proto]] 属性的值；
   3. 在该对象上调用 defineProperty()方法，并将第二个参数传入该方法中；
这样的方法有很多局限，比如我们只能在创建对象时设置对象的继承对象，又比如这种设置继承的方式是一次性的，我们永远无法依靠这种方式创造出多个有相同继承关系的对象

#### ES6 继承
> ES6 中有关 class 的继承方式，引入了 extends 关键字。但其本质仍然是构造函数 + 原型链的组合式继承。
```js
class A {
    constructor(name, age) {
            this.name = name;
            this.age = age;
    }
    getName() {
           return this.name;
    }
}

class B extends A {
     constructor(name, age) {
          super(name, age);
          this.job = "IT";
     }
     getJob() {
          return this.job;
     }
     getNameAndJob() {
          return super.getName() + this.job;
     }
}

var b = new B("Tom",20);
console.log(b.name);
console.log(b.age);
console.log(b.getName());
console.log(b.getJob());
console.log(b.getNameAndJob());
//输出：Tom，20，Tom，IT，TomIT
```
> 上面代码定义了一个B类（class），该类通过extends关键字，继承了A类的所有属性和方法。A类中的所有方法默认是添加到B的原型上，所以extends继承的实质仍然是原型链。
* super这个关键字，既可以当作函数使用，也可以当作对象使用。当作函数使用时，super代表父类的构造函数，并在子类中执行Parent.apply(this)，从而将父类实例对象的属性和方法，添加到子类的this上面。以下三点需要特别注意
1.子类必须在constructor方法中调用super方法，如果子类没有定义constructor方法，constructor方法以及其内部的super方法会被默认添加。
2.在子类的constructor方法中，只有调用super之后，才可以使用this关键字，否则会报错。
3. super()只能用在子类的constructor方法之中，用在其他地方就会报错。
* **静态方法的继承**
```js
// 在一个方法前加上关键字static，就表示该方法不会被实例继承，但是父类的静态方法，会被子类继承。
class A {
   static say() {
       console.log("hello");
    }
}
class B extends A {}
console.log(B.say());
//输出：hello
```
```js
// 也可以使用super在子类的静态方法中调用父类的静态方法。super在静态方法中指向父类本身，而不是父类的原型对象。
class A {
static say() {
console.log("hello");
}
}
class B extends A {
static toStr() {
super.say();
}
}
var b = new B();
console.log(B.toStr());
//输出：hello
```




## 内置对象

### Array 对象

Array 对象用于在单个的变量中存储多个值。

[Math 对象](https://www.w3school.com.cn/jsref/jsref_obj_array.asp) / [Math 对象](https://www.runoob.com/jsref/jsref-obj-array.html)

#### 创建 Array 对象的语法：

```js
new Array();
new Array(size);
new Array(element0, element1, ..., elementn);
```

#### sort() 排序

* 语法

```js
// sortBy 参数是排序方法，必须是函数, 不传会默认按照字母顺序排序
arrayObject.sort(sortBy)
// 升序排序
[1,9,3,8,2,1,5].sort((a,b) => a - b);
// 降序排序
[1,9,3,8,2,1,5].sort((a,b) => b - a);
```

* 进阶：函数嵌套传参（自定义函数（属性名））

```js
/** 原生方式 **/
var arr = [
    { name:'zopp', age:0 },
    { name:'gpp', age:18 },
    { name:'yjj', age:8 }
];
function compare (用于判断的属性名) {
    return function(a,b){
        var value1 = a[用于判断的属性名];
        var value2 = b[用于判断的属性名];
        return value1 - value2;
    }
}
console.log(arr.sort(compare('age')))  //返回对象，age从小到大正向排序
/** es6 语法 **/
var arr = [
    { name:'zopp', age:0 },
    { name:'gpp', age:18 },
    { name:'yjj',age:8 }
];
arr.sort((a,b) => a.age - b.age);
```

#### sort() 原理与通用方法

参考字母排序方法
让我们来看看 sort() 是如何通过 0，1，-1 来对不同的对象数组进行排序的。

* sort() 通用方法

```js
// 通用简单升序
var arr = [10, 20, 1, 2];
arr.sort(function (x, y) {
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
});
console.log(arr); // [1, 2, 10, 20]
// 通用简单降序 改变上一段代码的 return 返回值的 1 和 -1 的位置（位置对调）。
```

* sort 原理

1.sort() 方法会接受一个比较函数 compare(a, b)，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字。<br>
2.最后，永远要记住一句话，凡是返回1或者大于0的正数的时候就要交换位置。（内部实现,不同的浏览器内部排序方式不同，使用的算法是不同的，具体使用的什么算法可以自己去实践验证了解）<br>
例如：

```js
var arr = [1, 5, 4, 2];
// 现在要进行升序排列，从左到右的数组项关系最终应该为： a < b < c < d
// 所以只要在当a大于b的时候去交换它们的位置就好了：
if( a > b ) {
    return 1;
}
// 对应降序，从左到右的数组项关系最终应该为： a > b > c > d, 所以只要b大于a就交换位置
if( b > a ) {
    return 1;
}
```

简化后：

```js
// 升序
return a - b;
// 倒序
return b - a;
```

### Boolean 对象

[Boolean 对象](https://www.w3school.com.cn/jsref/jsref_obj_boolean.asp) / [Boolean 对象](https://www.runoob.com/jsref/jsref-obj-boolean.html)

### Date 对象

Date 对象用于处理日期和时间。

[Date 对象](https://www.w3school.com.cn/jsref/jsref_obj_date.asp) / [Date 对象](https://www.runoob.com/jsref/jsref-obj-date.html)

### Math 对象

Math 对象用于执行数学任务。

> 注释：Math 对象并不像 Date 和 String 那样是对象的类，因此没有构造函数 Math()，像 Math.sin() 这样的函数只是函数，不是某个对象的方法。您无需创建它，通过把 Math 作为对象使用就可以调用其所有属性和方法。

- 常用属性
```js
//max() 与 min() 求一组数的最大值和最小值
Math.max(10,9,22);   // => 22
Math.min(10,9,8,22);  // => 8
Math.PI    // 圆周率 => 3.141592653589793
Math.E     // 自然对数底，数学中的 e 的值2.718281828459045
Math.LN10   // 10的自然对数，约等于 2.303
Math.LN2    // 2的自然对数，约等于 0.693
Math.LOG2E   // 以2为底e的对数，约等于 1.443
Math.LOG10E  // 以10为底e的对数，约等于 0.434
Math.SQRT1_2  // 返回 2 的平方根的倒数( 即1/2的平方根 )。这个值近似为 0.7071067811865476
Math.SQRT2   // 2的平方根，约等于 1.414
```

-常用方法
```js
//舍入方法：
Math.ceil()    // 天花板函数 向上舍入 例：Math.ceil(2.34); // => 3
Math.floor()    // 地板函数  向下舍入 例：Math.ceil(2.3); // => 2
Math.round()    // 四舍五入  例：Math.round(2.7); // => 3
Math.random()    // 获取随机数（0-1）
Math.abs(num)    // 求num的绝对值
Math.exp(num)    // 求e的num次幂
Math.pow(num,power) // 求num的power次方
Math.sqrt(num)    // 求num的平方根
```

- 三角函数：
`sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()` 参数都是弧度（0-2π）

- 获取给定范围内的随机数
```js
function getRandom(min,max){
  return Math.floor(Math.random() * (max - min + 1)) + min; //随机整数
}
```

[Math 对象](https://www.w3school.com.cn/jsref/jsref_obj_math.asp) / [Math 对象](https://www.runoob.com/jsref/jsref-obj-date.html)

### Number 对象

Number 对象是原始数值的包装对象。

>注意： 如果一个参数值不能转换为一个数字将返回 NaN (非数字值)。

#### ES6 新增 Number 属性
- ES 6 增加了以下三个 Number 对象的属性：

1.EPSILON: 表示 1 和比最接近 1 且大于 1 的最小 Number 之间的差别<br>
2.MIN_SAFE_INTEGER: 表示在 JavaScript中最小的安全的 integer 型数字 (-(253 - 1))。<br>
3.MAX_SAFE_INTEGER: 表示在 JavaScript 中最大的安全整数（253 - 1）。<br>

#### ES6 新增 Number 方法

- ES 6 增加了以下两个 Number 对象的方法：

1.Number.isInteger(): 用来判断给定的参数是否为整数。<br>
2.Number.isSafeInteger(): 判断传入的参数值是否是一个"安全整数"。<br>



[Number 对象](https://www.w3school.com.cn/jsref/jsref_obj_number.asp) / [Number 对象](https://www.runoob.com/jsref/jsref-obj-number.html)

### String 对象

[String 对象](https://www.w3school.com.cn/jsref/jsref_obj_string.asp) / [String 对象](https://www.runoob.com/jsref/jsref-obj-string.html)

> 值得注意的是，String对象的数据类型为 Object ，我们可以通过 typeof 运算符进行查看，其结果是"object"。
```js
var strObj = new String( "CodePlayer" );
var str1 = "CodePlayer";
var str2 = String( "CodePlayer" );

document.writeln( typeof strObj ); // object 【在js中，绝大多数类型的对象使用typeof运算符，其结果都是"object"】
document.writeln( typeof str1 ); // string
document.writeln( typeof str2 ); // string

//String对象和String数据类型的值相等，但类型不相等
document.writeln( str1 === str2 ); // true (全等)
document.writeln( str1 == strObj ); // true (值相等)
document.writeln( str1 === strObj ); // false (不全等：值相等，但类型不相等)

//只有对String对象使用instanceof运算符，其结果才返回true
document.writeln( strObj instanceof String ); // true
document.writeln( str1 instanceof String ); // false
```

#### JavaScript match() 方法
match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。该方法类似 indexOf() 和 lastIndexOf()，但是它返回指定的值，而不是字符串的位置。
* 语法
```js
stringObject.match(searchvalue);
stringObject.match(regexp);
```
* 用 match 分割地址字符串的省市区
```js
const reg = /.+?(省|市|自治区|自治州|县|区)/g;
const area = '湖北省武汉市洪山区关谷'.match(reg);  // area 为 [ "湖北省", "武汉市", "洪山区" ]
const [province, city, district] = area; // ES6语法，从数组取出值放到对应变量里。
// province 为湖北省，city 为武汉市，district 为洪山区。
```



### 参考文档
> ** javascript 每个对象还有很多内置的属性和方法，每个对象的详情内容可参考文档 **

- [W3school手册文档](https://www.w3school.com.cn/jsref/index.asp)
- [文档](https://www.runoob.com/jsref/jsref-obj-array.html)
