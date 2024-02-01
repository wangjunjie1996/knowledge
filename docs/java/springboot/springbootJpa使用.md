# SpringBoot集成jpa
## 什么是 JPA
全称Java Persistence API，可以通过注解或者XML描述【对象-关系表】之间的映射关系，并将实体对象持久化到数据库中。  
为我们提供了：  
1. ORM映射元数据：JPA支持XML和注解两种元数据的形式，元数据描述对象和表之间的映射关系，框架据此将实体对象持久化到数据库表中；  
如：@Entity、@Table、@Column、@Transient等注解。
2. JPA 的API：用来操作实体对象，执行CRUD操作，框架在后台替我们完成所有的事情，开发者从繁琐的JDBC和SQL代码中解脱出来。  
如：entityManager.merge(T t)；
3. JPQL查询语言：通过面向对象而非面向数据库的查询语言查询数据，避免程序的SQL语句紧密耦合。
## Springboot整合SpringData JPA
1. 编写一个实体类（bean）和数据表进行映射，并且配置好映射关系；
```java
//使用JPA注解配置映射关系
@Entity //告诉JPA这是一个实体类（和数据表映射的类）
@Table(name = "tbl_user") //@Table来指定和哪个数据表对应;如果省略默认表名就是user；
public class User {

    @Id //这是一个主键
    @GeneratedValue(strategy = GenerationType.IDENTITY)//自增主键
    private Integer id;

    @Column(name = "last_name",length = 50) //这是和数据表对应的一个列
    private String lastName;
    @Column //省略默认列名就是属性名
    private String email;
}
```
2. 编写一个Dao接口来操作实体类对应的数据表（Repository）
```java
/继承JpaRepository来完成对数据库的操作
public interface UserRepository extends JpaRepository<User,Integer> {
}
```
3. 基本的配置JpaProperties
```yaml
spring:  
 jpa:
    hibernate:
#     更新或者创建数据表结构
      ddl-auto: update
#    控制台显示SQL
    show-sql: true
```
4. pom
```xml
 <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```
## Jpa使用（不需要实现sql语句编写）
1. JPA注解
* @Entity  声明类为实体或表
* @Table  声明表名
  * 当实体类与其映射的数据库表名不同名时需要使用 @Table 标注说明，该标注与 @Entity 标注并列使用，置于实体类声明语句之前，可写于单独语句行，也可与声明语句同行。
  * @Table 标注的常用选项是 name，用于指明数据库的表名 @Table标注还有一个两个选项 catalog 和 schema 用于设置表所属的数据库目录或模式，通常为数据库名。
* @Basic  指定非约束明确的各个字段
  * @Basic 表示一个简单的属性到数据库表的字段的映射,对于没有任何标注的 getXxxx() 方法,默认即为@Basic fetch: 表示该属性的读取策略,有 EAGER 和 LAZY 两种,分别表示主支抓取和延迟加载,默认为 EAGER.optional:表示该属性是否允许为null, 默认为true
* @Embedded  指定类或它的值是一个可嵌入的类的实例的实体的属性, 
* @Embeddable
```java
// JPA嵌入式对象(又名组件)
// 一个实体类要在多个不同的实体类中进行使用，而本身又不需要独立生成一个数据库表,这就是需要@Embedded、@Embeddable的时候了
// @embeddable是注释Java类的，表示类是嵌入类。@embedded是注释属性的，表示该属性的类是嵌入类。
// 模拟场景
// User 类
@Entity
@Table(catalog = "jpa", name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "sex")
    private String sex;

    @Column(name = "height")
    private Float height;

    @Column(name = "city")
    private String city;

    @Column(name = "district")
    private String district;

    @Column(name = "street")
    private String street;

    @Column(name = "community")
    private String community;
}
// 输出结果 => User(id=1, name=Joshua, sex=男, height=1.75, city=重庆, district=璧山区, street=XX街道, community=XXX小区)
// 那么问题来了, User类字段过多,是不是可以整合一下 ?比如 city 、district 、street 、community这些字段，我们都可以整合为一个 Address 类,并通过@Embedded和@Embeddable注解进行关联
// Address 类
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
//以上四个注解用于构造对象,以及get/set/toString...
@Embeddable // 声明该类是可嵌入的
public class Address {

    /*
    属性名有些问题需要注意下:
    1. 尽量和数据库字段一样
    2. 如果属性名和数据库字段名不一样,加上@Column(name = "数据库字段名")
    3. 拓展: 如果Address类不仅被 User 引用,其他类也在使用,说明这些表结构类似,但是字段名在每个表不一样,可以去了解一下@AttributeOverrides注解
    */
    private String city;
    private String district;
    private String street;
    private String community;
}
// 改造后的 User 类
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(catalog = "jpa", name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "sex")
    private String sex;

    @Column(name = "height")
    private Float height;

    @Embedded // 其实通过测试发现,这个注解在Address使用了@Embeddable后可省略,但是防止后面出问题还是加上
    private Address address;

}
// 输出结果 => User(id=8, name=Jack, sex=男, height=1.8, address=Address(city=重庆, district=合川区, street=YY街道, community=YYY小区))
```
* @Id 指定的类的属性，用于识别(一个表中的主键)
* @GeneratedValue  指定如何标识属性可以被初始化，例如自动、手动、或从序列表中获得的值
```
在JPA中,@GeneratedValue注解存在的意义主要就是为一个实体生成一个唯一标识的主键(JPA要求每一个实体Entity,必须有且只有一个主键),@GeneratedValue提供了主键的生成策略。
@GeneratedValue注解有两个属性,分别是strategy和generator,其中generator属性的值是一个字符串,默认为"",其声明了主键生成器的名称(对应于同名的主键生成器@SequenceGenerator和@TableGenerator)。
过strategy 属性指定。默认情况下，JPA 自动选择一个最适合底层数据库的主键生成策略：SqlServer对应identity，MySQL 对应 auto increment。 
在javax.persistence.GenerationType中定义了以下几种可供选择的策略： 
–IDENTITY：采用数据库ID自增长的方式来自增主键字段，Oracle 不支持这种方式； 
–AUTO： JPA自动选择合适的策略，是默认选项； 
–SEQUENCE：通过序列产生主键，通过@SequenceGenerator 注解指定序列名，MySql不支持这种方式 
–TABLE：通过表产生主键，框架借由表模拟序列产生主键，使用该策略可以使应用更易于数据库移植。
```
* @Transient  用在属性上，指定的属性，它是不持久的，即：该值永远不会存储在数据库里。
* @Column  指定持久属性栏属性
注释定义了将成员属性映射到关系表中的哪一列和该列的结构信息，属性如下：
```
1）name：映射的列名。如：映射tbl_user表的name列，可以在name属性的上面或getName方法上面加入；
2）unique：是否唯一；
3）nullable：是否允许为空；
4）length：对于字符型列，length属性指定列的最大字符长度；
5）insertable：是否允许插入；
6）updatetable：是否允许更新；
7）columnDefinition：定义建表时创建此列的DDL；
8）secondaryTable：从表名。如果此列不建在主表上（默认是主表），该属性定义该列所在从表的名字
```
* @SequenceGenerator 用来定义一个生成主键的序列,与GeneratedValue 联合使用才有效,可以在类前面进行声明，也可以在字段上进行声明, 给 与GeneratedValue 的 generator 使用