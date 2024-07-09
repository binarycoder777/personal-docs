---

---

# Spring中的任务调度

当今任务调度的方案多种多样，不同的方案有着不同的适用场景，而在 Spring-Context 模块 scheduling 包下提供了这么一个定时任务管理工具，一般我们使用都是基于注解事先硬编码好的，但是如果想实现动态的添加和停止定时任务视乎就不是那么容易，今天主要想记录一下关于Spring中的@Scheduled与SchedulingConfigurer两种方式。

## 使用@Scheduled

在Spring中使用@Scheduled注解的方式来实现定时任务很简单，只需要遵循的简单规则是：
- 该方法通常应该具有 void 返回类型（如果不是，则返回值将被忽略）
- 该方法不应该需要任何参数

而为了在 Spring 中启用对调度任务和@Scheduled注释的支持，我们可以使用 Java 的注解：
```java
@Configuration
@EnableScheduling
public class SpringConfig {
    ...
}
```
当然，我们也可以在 XML 中做同样的事情：
``` xml
<task:annotation-driven>
```

### 以固定延迟安排任务

```java
@Scheduled(fixedDelay = 1000)
public void scheduleFixedDelayTask() {
    System.out.println(
      "Fixed delay task - " + System.currentTimeMillis() / 1000);
}
```

在这种情况下，上一次执行结束和下一次执行开始之间的时间间隔是固定的。该任务始终等待，直到前一个任务完成。当必须完成前一次执行才能再次运行时，应使用此选项。

### 按固定速率安排任务

```java
@Scheduled(fixedRate = 1000)
public void scheduleFixedRateTask() {
    System.out.println(
      "Fixed rate task - " + System.currentTimeMillis() / 1000);
}
```
当每次任务的执行都是独立的时候应该使用此选项。请注意，默认情况下，计划任务不会并行运行。因此，即使我们使用fixedRate，下一个任务也不会被调用，直到前一个任务完成。

**如果我们想在计划任务中支持并行行为，需要添加@Async注解：**
```java
@EnableAsync
public class ScheduledFixedRateExample {
    @Async
    @Scheduled(fixedRate = 1000)
    public void scheduleFixedRateTaskAsync() throws InterruptedException {
        System.out.println(
          "Fixed rate task async - " + System.currentTimeMillis() / 1000);
        Thread.sleep(2000);
    }

}
```
现在，即使前一个任务尚未完成，这个异步任务也会每秒被调用一次。

### 固定利率与固定延迟

我们可以使用 Spring 的@Scheduled注释运行计划任务，但基于属性fixedDelay 和 fixedRate， 执行的性质会发生变化。
- fixedDelay属性确保任务执行的结束时间和下次执行任务的开始时间之间存在n毫秒的延迟。当我们需要确保始终只有一个任务实例运行时，此属性特别有用。对于依赖作业，它非常有用。

- fixedRate属性每 n毫秒运行一次计划任务。它不会检查该任务之前是否执行过。当所有任务的执行都是独立时，这很有用。如果我们不希望超出内存和线程池的大小，fixedRate 应该非常方便。但是，如果传入的任务不能快速完成，它们最终可能会出现“内存不足异常”。

### 安排初始延迟的任务

接下来让我们安排一个延迟的任务（以毫秒为单位）：
```java
@Scheduled(fixedDelay = 1000, initialDelay = 1000)
public void scheduleFixedRateWithInitialDelayTask() {
 
    long now = System.currentTimeMillis() / 1000;
    System.out.println(
      "Fixed rate task with one second initial delay - " + now);
}
```
注意我们在这个例子中同时使用了fixedDelay和initialDelay。任务将在initialDelay值之后第一次执行，并将继续根据fixedDelay执行。当任务有需要完成的设置时，此选项很方便。

### 使用 Cron 表达式安排任务

有时延迟和速率还不够，我们需要 cron 表达式的灵活性来控制任务的计划：
```java
@Scheduled(cron = "0 15 10 15 * ?")
public void scheduleTaskUsingCronExpression() {
 
    long now = System.currentTimeMillis() / 1000;
    System.out.println(
      "schedule tasks using cron jobs - " + now);
}
```
请注意，在此示例中，我们计划在每月 15 日上午 10:15 执行一项任务。默认情况下，Spring 将使用服务器的本地时区作为 cron 表达式。但是，我们可以使用 zone属性来更改此时区：
```java
@Scheduled(cron = "0 15 10 15 * ?", zone = "Europe/Paris")
```
通过此配置，Spring 将安排注释方法在巴黎时间每月 15 日上午 10:15 运行。

### 参数化时间表
对这些计划进行硬编码很简单，但我们通常需要能够控制计划，而无需重新编译和重新部署整个应用程序。
我们将利用 Spring Expressions 来外部化任务的配置，并将其存储在属性文件中。

- fixedDelay任务：
```java
@Scheduled(fixedDelayString = "${fixedDelay.in.milliseconds}")
```
- fixedRate任务：
```java
@Scheduled(fixedRateString = "${fixedRate.in.milliseconds}")
```
- 基于cron表达式的任务：
```java
@Scheduled(cron = "${cron.expression}")
```

## 使用SchedulingConfigurer

通常情况下， @Scheduled注解的所有属性在Spring上下文启动时只被解析并初始化一次。因此，当我们在 Spring 中使用@Scheduled注释时，无法在运行时更改fixedDelay或fixedRate值。但是，有一个解决方法。使用 Spring 的SchedulingConfigurer提供了一种更加可定制的方式，让我们有机会动态设置延迟或速率。

### 运行时动态设置延迟或速率
让我们创建一个 Spring 配置DynamicSchedulingConfig，并实现SchedulingConfigurer接口：
```java
@Configuration
@EnableScheduling
public class DynamicSchedulingConfig implements SchedulingConfigurer {

    @Autowired
    private TickService tickService;

    @Bean
    public Executor taskExecutor() {
        return Executors.newSingleThreadScheduledExecutor();
    }

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.setScheduler(taskExecutor());
        taskRegistrar.addTriggerTask(
          new Runnable() {
              @Override
              public void run() {
                  tickService.tick();
              }
          },
          new Trigger() {
              @Override
              public Date nextExecutionTime(TriggerContext context) {
                  Optional<Date> lastCompletionTime =
                    Optional.ofNullable(context.lastCompletionTime());
                  Instant nextExecutionTime =
                    lastCompletionTime.orElseGet(Date::new).toInstant()
                      .plusMillis(tickService.getDelay());
                  return Date.from(nextExecutionTime);
              }
          }
        );
    }

}
```
我们注意到，借助ScheduledTaskRegistrar#addTriggerTask方法，我们可以添加一个Runnable任务和一个Trigger实现，以便在每次执行结束后重新计算nextExecutionTime 。

此外，我们用@EnableScheduling注释我们的DynamicSchedulingConfig以使调度正常工作。

因此，我们安排TickService#tick方法在每次延迟后运行，这由getDelay方法在运行时动态确定。

### 并行运行任务

默认情况下，Spring 使用本地单线程调度程序来运行任务。 因此，即使我们有多个@Scheduled方法，它们每个都需要等待线程完成执行前一个任务。如果我们的任务确实独立，那么并行运行它们会更方便。为此，我们需要提供一个更适合我们需求的TaskScheduler ：
```java
@Bean
public TaskScheduler  taskScheduler() {
    ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();
    threadPoolTaskScheduler.setPoolSize(5);
    threadPoolTaskScheduler.setThreadNamePrefix("ThreadPoolTaskScheduler");
    return threadPoolTaskScheduler;
}
```


## 关于ScheduledTaskRegistrar

关于上面讲到的ScheduledTaskRegistrar可以看做类似Beanfactory的一个容器，里面管理了调度的相关任务：
```java
    public static final String CRON_DISABLED = "-";
    @Nullable
    private TaskScheduler taskScheduler;
    @Nullable
    private ScheduledExecutorService localExecutor;
    @Nullable
    private List<TriggerTask> triggerTasks;
    @Nullable
    private List<CronTask> cronTasks;
    @Nullable
    private List<IntervalTask> fixedRateTasks;
    @Nullable
    private List<IntervalTask> fixedDelayTasks;
    private final Map<Task, ScheduledTask> unresolvedTasks = new HashMap(16);
    private final Set<ScheduledTask> scheduledTasks = new LinkedHashSet(16);
```
通过这个类，实现相关任务的注册管理，包裹cron、fixedDelay等等。

## 原理

前面讲到一般我们在使用 Spring 为我们提供的定时任务机制时，首先会在 Spring 配置类上标注一个 @EnableScheduling 注解表示开启定时任务管理，然后在需要实现定时任务的方法上标注 @Scheduled 注解。

而在Spring中以 Enable 打头的注解通常会导入一些配置类来实现功能：
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Import(SchedulingConfiguration.class)
@Documented
public @interface EnableScheduling {

}
```
而在 @EnableScheduling 注解里面果然导入了一个 SchedulingConfiguration 配置类：
```java
@Configuration(proxyBeanMethods = false)
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public class SchedulingConfiguration {

   @Bean(name = TaskManagementConfigUtils.SCHEDULED_ANNOTATION_PROCESSOR_BEAN_NAME)
   @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
   public ScheduledAnnotationBeanPostProcessor scheduledAnnotationProcessor() {
      return new ScheduledAnnotationBeanPostProcessor();
   }

}
```
而在 SchedulingConfiguration 配置类里面，做的事情比较少，就是将一个 ScheduledAnnotationBeanPostProcessor 注册成为 Bean 到 Spring 容器，熟悉 Spring 生命周期的都应该知道，像 BeanPostProcessor 实现类都是在 Bean 的创建过程中，可以收集 Bean 的信息做一些特殊的处理

### ScheduledAnnotationBeanPostProcessor
ScheduledAnnotationBeanPostProcessor 是实现了 BeanPostProcessor 接口的，所以我们可以优先从该接口的实现方法查找入手，这里我就直接告诉你，它是在 postProcessAfterInitialization 这个实现方法去解析 @Scheduled 注解的，它会找到带有 @Scheduled 的方法然后遍历方法上的注解，根据注解信息，调用 processScheduled 封装成不同的定时任务实现类，一般来说 @Scheduled 注解提供了三种定时任务的时间配置：
1. 基于 cron 表达式的
2. fixedDelay 方式配置
3. fixedRate 方式配置

这也是我们使用Scheduled经常会使用到的几个属性或者方式。

### ScheduledTaskRegistrar

```java
private final ScheduledTaskRegistrar registrar;
```
上面就是定义在 ScheduledAnnotationBeanPostProcessor 类的一个成员变量 registrar ，通过检索整个类，并未发现有任何公共方法可以获取到这个成员变量，而且这个 registrar 成员变量对象也不是 Bean 对象也就是说并不在 Spring 的容器，虽然可以拿到 ScheduledAnnotationBeanPostProcessor 这个 Bean 对象，然后使用反射暴力获取 registrar 成员变量，但是这种方式不够优雅。最后通过分析 ScheduledAnnotationBeanPostProcessor 的构造方法，可以尝试下面这一种方式：
```java
public ScheduledAnnotationBeanPostProcessor() {
   this.registrar = new ScheduledTaskRegistrar();
}

/**
 * @since 5.1
 */
public ScheduledAnnotationBeanPostProcessor(ScheduledTaskRegistrar registrar) {
   Assert.notNull(registrar, "ScheduledTaskRegistrar is required");
   this.registrar = registrar;
}
```
可以看到 ScheduledAnnotationBeanPostProcessor 有两个构造方法，一个是无参的构造方法在其内部自动创建了一个 ScheduledTaskRegistrar 定时任务注册器，另外一个有参构造方法可以外部传入一个 ScheduledTaskRegistrar 对象，其实在我们使用 @EnableScheduling 注解的时候，它就是使用的默认的无参构造方法去创建的一个 ScheduledAnnotationBeanPostProcessor ：
```java
@Configuration(proxyBeanMethods = false)
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public class SchedulingConfiguration {

   @Bean(name = TaskManagementConfigUtils.SCHEDULED_ANNOTATION_PROCESSOR_BEAN_NAME)
   @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
   public ScheduledAnnotationBeanPostProcessor scheduledAnnotationProcessor() {
      // 默认使用无参构造创建注册的
      return new ScheduledAnnotationBeanPostProcessor();
   }

}
```
那么我们可以不使用 @EnableScheduling 注解，不让它帮我们去注册一个默认无参的 ScheduledAnnotationBeanPostProcessor ，我们可以自己这样做：
```java
@Configuration(proxyBeanMethods = false)
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public class SchedulingConfiguration {

    @Bean(name = TaskManagementConfigUtils.SCHEDULED_ANNOTATION_PROCESSOR_BEAN_NAME)
    @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
    public ScheduledAnnotationBeanPostProcessor scheduledAnnotationProcessor(ScheduledTaskRegistrar scheduledTaskRegistrar) {
        return new ScheduledAnnotationBeanPostProcessor(scheduledTaskRegistrar);
    }

    @Bean
    public ScheduledTaskRegistrar scheduledTaskRegistrar() {
        return new ScheduledTaskRegistrar();
    }
 }
```
我们自己手动去注册一个有参构造的，并且指定使用我们自己创建定义的 ScheduledTaskRegistrar ，在这一步只是完成了整合，接下来就是拿到 ScheduledTaskRegistrar 如何自己去注册添加定时任务了。

分析到这里，其实我们可以发现，真正管理注册定时任务的是 ScheduledTaskRegistrar 对象，而 ScheduledAnnotationBeanPostProcessor 的主要工作就是找到所有带有 @Scheduled 注解的 Bean 对象，然后根据注解参数封装成对应的 Task 对象，最后调用 ScheduledTaskRegistrar 提供的方法来完成定时任务的注册，那么其实如果你不需要使用注解来定义定时任务的话，你完全可以不注册 ScheduledAnnotationBeanPostProcessor ，只要有 ScheduledTaskRegistrar 就可以工作了。

### 封装 ScheduledTaskRegistrar
```java
@Component
public class ScheduledTaskRegistrarCenter {

    private final Map<String, ScheduledTask> scheduledTaskMap = new ConcurrentHashMap<>();

    private final ScheduledTaskRegistrar registrar;

    public ScheduledTaskRegistrarCenter(ScheduledTaskRegistrar registrar) {
        Assert.notNull(registrar, "ScheduledTaskRegistrar is required");
        this.registrar = registrar;
    }

    public ScheduledTask addTask(String taskName, Task task) {
        ScheduledTask scheduledTask;
        if (task instanceof CronTask) {
            scheduledTask = registrar.scheduleCronTask((CronTask) task);
        } else if (task instanceof FixedDelayTask) {
            scheduledTask = registrar.scheduleFixedDelayTask((FixedDelayTask) task);
        } else if (task instanceof FixedRateTask) {
            scheduledTask = registrar.scheduleFixedRateTask((FixedRateTask) task);
        } else if (task instanceof TriggerTask) {
            scheduledTask = registrar.scheduleTriggerTask((TriggerTask) task);
        } else {
            throw new IllegalArgumentException("unsupported type: " + task.getClass());
        }
        scheduledTaskMap.put(taskName, scheduledTask);
        return scheduledTask;
    }

    public boolean stopTask(String taskName) {
        ScheduledTask scheduledTask = scheduledTaskMap.get(taskName);
        if (scheduledTask != null) {
            scheduledTask.cancel();
            return true;
        }
        return false;
    }
}
```
通过提供一个统一的管理定时任务的对象，在注册的时候判断 Task 的类型，然后调用相应的定时任务注册方法，最后将返回的 ScheduledTask 保存到一个 Map 集合，在将来需要停止定时任务时，只需要传入当时注册定时任务的名字即可。

## 其他的一些调度方式

上面讲解了常用的Spring自带的Schedule调度方式，下面分析一下常见的一些调度方案：

1. 基于配置的调度：Quartz Scheduler，Quartz 是一个功能强大的任务调度器，适用于复杂的调度需求。它支持基于 CRON 表达式、依赖任务等。
```java
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class MyJob implements Job {
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        System.out.println("Executing job: " + new Date());
    }
}

// Quartz 需要配置 JobDetail 和 Trigger，并将其与 Scheduler 绑定。

public class QuartzScheduler {
    public static void main(String[] args) throws SchedulerException {
        JobDetail job = JobBuilder.newJob(MyJob.class)
                                  .withIdentity("myJob", "group1")
                                  .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                                        .withIdentity("myTrigger", "group1")
                                        .startNow()
                                        .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                                                .withIntervalInSeconds(40)
                                                .repeatForever())
                                        .build();

        Scheduler scheduler = new StdSchedulerFactory().getScheduler();
        scheduler.start();
        scheduler.scheduleJob(job, trigger);
    }
}
```

2. 基于事件的调度

Akka 提供了一种基于事件的调度机制，适用于分布式系统中的任务调度。

```java

object AkkaScheduler {
  def main(args: Array[String]): Unit = {
    val system = ActorSystem("MySystem")
    val scheduler = system.scheduler

    scheduler.schedule(
      initialDelay = 0.seconds,
      interval = 5.seconds
    )(() => println("Scheduled task executed"))
  }
}
```

3. 基于消息队列的调度

消息队列可以用于异步任务调度和执行，通过生产者-消费者模式实现任务分发。

```java
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TaskProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void produceTask(String message) {
        rabbitTemplate.convertAndSend("taskQueue", message);
    }
}

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class TaskConsumer {

    @RabbitListener(queues = "taskQueue")
    public void handleTask(String message) {
        System.out.println("Received task: " + message);
    }
}


```

4. 基于 Kubernetes 的调度

Kubernetes 提供了 CronJob 资源，用于在 Kubernetes 集群中调度容器化任务。

```yml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: cron-job-example
spec:
  schedule: "*/5 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: my-container
            image: busybox
            args:
            - /bin/sh
            - -c
            - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure
```

5. 基于云平台的调度

AWS CloudWatch Events / Azure Logic Apps / Google Cloud Scheduler这些云平台提供了内置的调度服务，可以用于触发云函数、执行容器任务等。

``` aw
# AWS Lambda example
import json
import boto3

def lambda_handler(event, context):
    # Your code here
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
```

## 小结

关于Spring中的任务调度就先记录到这，但最后我想说的事，不同的任务调度方案有不同的应用场景和优缺点，选择合适的方案需要根据具体需求进行评估。简单的时间驱动任务可以使用 @Scheduled 注解，复杂的调度需求可以使用 Quartz，分布式系统中的事件驱动任务可以使用 Akka Scheduler，而基于消息队列的调度适用于异步任务处理。对于容器化和云环境中的任务调度，可以选择 Kubernetes CronJob 或云平台的调度服务。最后，没有最好的，只有最合适的。









