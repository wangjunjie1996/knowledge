# springboot 异步
## SpringBoot中的异步实现
在SpringBoot中将一个方法声明为异步方法非常简单，只需两个注解即可@EnableAsync和@Async。其中@EnableAsync用于开启SpringBoot支持异步的功能，用在SpringBoot的启动类上。@Async用于方法上，标记该方法为异步处理方法。

需要注意的是@Async并不支持用于被@Configuration注解的类的方法上。同一个类中，一个方法调用另外一个有@Async的方法，注解也是不会生效的。

### @EnableAsync的使用示例：
```java
@SpringBootApplication
@EnableAsync
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
```
### @Async的使用示例：
```java
@Service
public class SyncService {

    @Async
    public void asyncEvent() {
        // 业务处理
    }
}
```
@Async注解的使用与Callable有类似之处，在默认情况下使用的都是SimpleAsyncTaskExecutor线程池，可参考Callable中的方式来自定义线程池。

### @Async使用总结
```
1、 非必须不使用异步。如果是核心业务包含事务处理，先同步记录数据，再异步发起。防止直接发起后异步没被调度到服务关闭，造成数据丢失
2、 核心业务必须使用自定义线程池，防止默认异步线程池阻塞，也方便通过线程池监控核心执行情况
3、 简单业务场景使用默认线程池时，避免操作长时间过长占用默认线程池，影响Spring以及别的框架组件异步任务执行
4、 @Async可能失效的原因
	a) @SpringBootApplication启动类当中没有添加@EnableAsync注解。
	b) 异步方法使用注解@Async的返回值只能为void或者Future。
	c) 没有走Spring的代理类。因为@Transactional和@Async注解的实现都是基于Spring的AOP，而AOP的实现是基于动态代理模式实现的。那么注解失效的原因就很明显了，有可能因为调用方法的是对象本身而不是代理对象，因为没有经过Spring容器管理。
```
### @Async失效解决方法
```
a) 注解的方法必须是public方法。
b) 注解的方法不要定义为static
c) 方法一定要从另一个类中调用，也就是从类的外部调用，类的内部调用是无效的。
d) 如果需要从类的内部调用，需要先获取其代理类。
```
