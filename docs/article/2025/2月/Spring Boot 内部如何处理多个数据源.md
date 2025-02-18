---

---

# Spring Boot 内部如何处理多个数据源

> 第一次接触到SpringBoot的多数据源还要追溯到大三的时候，当时课设是一个抽奖系统，在设计的时候便采用了SpringBoot的多数据源，通过Hash随机落库抽取奖品。当时只是简单的应用，知其然，但很多东西又不甚其然。后来工作了，业务场景上又涉及到了多数据源，又重新去巩固来学习了一下。但所谓温故知新，常用常新。已经有好一段时间没有再接触多数据源了，最近无意间刷到了相关内容，遂想简单记录一下.


## 配置多个数据源

每个数据库的DataSource代表一个不同的数据库连接，处理诸如连接池和事务管理之类的任务。在单数据库设置中，DataSource当存在所需属性时，Spring Boot 会自动配置。但是，当需要访问多个数据库时，DataSource必须明确定义和配置每个数据库以防止冲突。

Spring Boot 不假设DataSource应如何在应用程序中构建多个对象。相反，DataSource必须手动定义和配置每个对象。典型的方法是为DataSource每个数据库创建一个单独的 bean，并在 Spring 应用程序上下文中注册它们。

每个DataSource要求：

- application.yml或中的配置部分application.properties指定了其连接详细信息。
- @BeanSpring 配置类中的定义用于实例化和注册DataSource。
- 识别默认值的机制DataSource，通常使用@Primary。

在 `application.yml` 或 `application.properties` 中定义数据库连接信息：

```yaml
spring:
  datasource:
    first:
      url: jdbc:mysql://localhost:3306/firstdb
      username: user1
      password: password1
      driver-class-name: com.mysql.cj.jdbc.Driver
    second:
      url: jdbc:postgresql://localhost:5432/seconddb
      username: user2
      password: password2
      driver-class-name: org.postgresql.Driver
```

在 Spring Boot 启动时，它会读取这些配置并映射到相应的 `DataSource` Bean。

### 在 Spring 上下文中定义多个 DataSource

```java
@Configuration
public class DataSourceConfig {
    
    @Primary
    @Bean(name = "firstDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.first")
    public DataSource firstDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean(name = "secondDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.second")
    public DataSource secondDataSource() {
        return DataSourceBuilder.create().build();
    }
}
```

- `@Primary` 指定默认数据源，未指定时 Spring 会自动注入。
- `@ConfigurationProperties` 绑定外部配置到 `DataSource`。
- `@Bean` 使 `DataSource` 可被依赖注入。

## 让组件使用正确的数据源

如果应用程序的组件没有显式指定 `DataSource`，Spring 可能会报 `NoUniqueBeanDefinitionException`。可以通过 `@Qualifier` 绑定 `DataSource`：

```java
@Bean
public JdbcTemplate firstJdbcTemplate(@Qualifier("firstDataSource") DataSource firstDataSource) {
    return new JdbcTemplate(firstDataSource);
}

@Bean
public JdbcTemplate secondJdbcTemplate(@Qualifier("secondDataSource") DataSource secondDataSource) {
    return new JdbcTemplate(secondDataSource);
}
```

每个都JdbcTemplate明确链接到一个DataSource使用@Qualifier，以防止在存在多个对象时产生歧义DataSource。

存储库和服务还必须指定DataSource它们使用哪个。例如，可以按如下方式设置与第一个数据库交互的存储库：


```java
@Repository
public class FirstDatabaseRepository {
    private final JdbcTemplate jdbcTemplate;
    
    public FirstDatabaseRepository(@Qualifier("firstJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public List<String> getData() {
        return jdbcTemplate.queryForList("SELECT name FROM some_table", String.class);
    }
}
```

## 管理跨多个数据源的事务

PlatformTransactionManagerSpring Boot 允许应用程序通过为每个数据库配置单独的实例来管理跨多个数据库的事务DataSource。与自动处理事务的单数据库设置不同，使用多个数据库的应用程序必须明确定义和协调事务边界。这需要配置事务管理器，了解 Spring 如何委托事务控制，并@Transactional正确应用注释，以便操作在预期的数据库上运行DataSource。


### Spring Boot 如何处理事务

Spring 使用PlatformTransactionManager在应用程序级别管理事务。默认情况下，如果只DataSource存在一个，Spring Boot 会自动将其连接到DataSourceTransactionManager并将事务管理应用于使用 的所有操作@Transactional。但是，当存在多个DataSource对象时，Spring Boot 不会假设应该使用哪一个。相反，每个对象都DataSource必须有自己的事务管理器，并且事务必须明确引用正确的事务管理器。

Spring 根据应用方式确定使用哪个事务管理器@Transactional。当未分配特定事务管理器时，Spring Boot 将选择默认事务管理器，通常链接到@Primary DataSource。对于使用多个数据库的应用程序，事务需要明确与正确的事务管理器相关联，以防止在错误的数据库上执行操作

### 配置单独的事务管理器

每个都DataSource需要自己的事务管理器来独立处理提交和回滚操作。这些事务管理器必须注册为 Spring bean 并映射到各自的DataSource对象。


```java
@Configuration
public class TransactionManagerConfig {
    
    @Primary
    @Bean(name = "firstTransactionManager")
    public PlatformTransactionManager firstTransactionManager(@Qualifier("firstDataSource") DataSource firstDataSource) {
        return new DataSourceTransactionManager(firstDataSource);
    }
    
    @Bean(name = "secondTransactionManager")
    public PlatformTransactionManager secondTransactionManager(@Qualifier("secondDataSource") DataSource secondDataSource) {
        return new DataSourceTransactionManager(secondDataSource);
    }
}
```

每个事务管理器都是使用 创建的DataSourceTransactionManager，它将事务管理器绑定到特定的DataSource。@Primary注释将一个事务管理器标记为默认管理器，这意味着没有显式管理器的事务将使用此管理器。

此设置允许应用程序的不同部分针对单独的数据库执行事务而不会相互干扰。如果存储库或服务与特定数据库交互，则必须指定链接到相应 的事务管理器DataSource。

### 使用 @Transactional 指定事务管理器

默认情况下，`@Transactional` 会使用 `@Primary` 事务管理器。若需使用特定数据库的事务管理器，需要显式指定：

```java
@Service
public class UserService {
    
    @Transactional("firstTransactionManager")
    public void saveToFirstDatabase(User user) {
        // 持久化到第一个数据库
    }
    
    @Transactional("secondTransactionManager")
    public void saveToSecondDatabase(UserDetails userDetails) {
        // 持久化到第二个数据库
    }
}
```

每个方法都带有注释@Transactional，指定应使用的事务管理器。这可以防止在错误的数据库上执行查询，并将事务保持在预期的数据库上下文中。

如果@Transactional在类级别应用，则类中的所有方法将使用相同的事务管理器，除非在方法级别被覆盖。

## 处理多个数据库之间的事务传播

在单数据库设置中，Spring 会自动管理事务边界。当涉及多个数据库时，必须小心控制事务传播，以防止跨不同DataSource对象进行部分更新。

Spring 提供了不同的传播行为，这些传播行为会影响事务跨多个数据库的交互方式：

- REQUIRED（默认）：如果有可用事务，则使用现有事务；否则，启动一个新的事务。
- REQUIRES_NEW：始终创建新事务，并暂停任何现有事务。
- NESTED：在现有事务内创建嵌套事务，允许在不同级别回滚。
- SUPPORTS：如果可用则使用现有事务，但如果不存在则不启动新事务。

当使用多个数据库时，REQUIRES_NEW通常需要防止一个数据库的事务影响另一个数据库。

```java
@Service
public class OrderService {
    
    @Transactional("firstTransactionManager")
    public void saveToFirstDatabase(Order order) {
        // 保存订单
    }
    
    @Transactional(value = "secondTransactionManager", propagation = Propagation.REQUIRES_NEW)
    public void saveToSecondDatabase(Payment payment) {
        // 保存支付信息
    }
}
```

在此代码中，如果在保存付款时发生错误，订单详细信息仍会保留在第一个数据库中，因为REQUIRES_NEW会启动一个单独的事务。如果没有这个，第二个数据库上的回滚可能会无意中回滚第一个数据库上的更改。

## 分布式事务的挑战

Spring 的标准DataSourceTransactionManager仅支持单个数据库中的本地事务DataSource。如果应用程序需要执行跨多个数据库的事务，并且必须以单个单元的形式提交或回滚所有操作，则JtaTransactionManager需要使用分布式事务管理器。

JTA（Java 事务 API）允许将多个数据库事务视为单个工作单元，但它带来了额外的复杂性。对于大多数应用程序来说，使用单独DataSourceTransactionManager实例的独立事务就足够了，只要仔细构建事务以防止数据库之间出现不一致的状态。

如果需要跨数据库的事务一致性，则另一种方法是使用基于事件的机制，其中一个数据库操作触发一个事件，该事件被异步处理以更新第二个数据库。这避免了对分布式事务的需求，同时仍保持一致性。

在 Spring Boot 中管理跨多个数据库的事务需要单独的PlatformTransactionManager实例、显式@Transactional分配和谨慎的事务传播。如果没有显式配置，Spring Boot 默认为单个事务管理器，这可能会将操作定向到错误的数据库。定义单独的事务管理器可使数据库操作保持隔离，而结构化传播可防止意外回滚。如果事务必须跨越多个数据库，JTA 等工具可提供解决方案，但会增加复杂性。正确的事务结构有助于维护跨多个数据库的数据完整性，同时保持管理效率。

## Spring Boot 如何在内部绑定数据源

Spring BootDataSource通过其自动配置机制处理初始化，该机制处理应用程序属性、实例化必要的对象并在应用程序上下文中注册它们。当DataSource存在多个 bean 时，此过程变得更加复杂，需要 Spring Boot 为每个 bean 分别管理属性绑定、依赖项注入和事务处理。

### 属性绑定和数据源创建

Spring Boot 在启动时从配置文件加载数据库连接详细信息。它通过 实现此操作@ConfigurationProperties，它将外部属性绑定到 Java 对象，然后再将它们注入应用程序上下文。

对于单个DataSource，Spring Boot 会自动将以 为前缀的属性绑定spring.datasource到内部DataSourceProperties对象。当DataSource定义多个对象时，每个对象必须具有唯一的前缀，以便 Spring Boot 可以正确映射它们。

读取属性后，Spring Boot 将使用它DataSourceBuilder.create().build()来实例化DataSource对象。此方法DataSource根据提供的驱动程序类和连接详细信息构造一个。如果没有明确指定驱动程序类，Spring Boot 将尝试根据数据库 URL 确定正确的驱动程序类。

Spring Boot 在创建对象时遵循一个结构化的流程DataSource：

- application.properties从或读取数据库属性application.yml。
- DataSourceProperties使用将属性映射到对象@ConfigurationProperties。
- 用于DataSourceBuilder.create().build()创建DataSource实例。
- 将每个 bean 注册DataSource为具有指定名称的 Spring bean。
- @Primary如果某个注释被标记为默认注释，则分配该注释DataSource。

当存在多个DataSourcebean 时，必须在其他组件中显式引用正确的实例。如果没有显式 bean 名称，Spring Boot 可能不知道DataSource要注入哪个，从而导致NoUniqueBeanDefinitionException错误。

### 依赖注入和 Bean 解析

一旦DataSource对象注册完毕，Spring Boot 就会通过将依赖项注入到需要数据库访问的其他 bean 中来解决依赖关系。当只有一个依赖项DataSource存在时，Spring Boot会在DataSource需要依赖项的地方自动将其注入。但是，如果有多个DataSource对象，则必须明确限定依赖项以避免产生歧义。

DataSourceSpring Boot根据以下因素确定要注入的内容：

- 存在注释@Primary，将其标记DataSource为默认值。
- @Qualifier在需要特定的组件中明确使用DataSource。
- 当不存在注释时，构造函数参数名称与 bean 名称匹配。

如果某个组件（例如存储库或事务管理器）需要DataSource并且存在多个实例，Spring Boot 不会尝试猜测要使用哪一个。相反，它会抛出异常，除非@Qualifier使用 来指定正确的 bean。

### Spring Boot 如何解决多个事务管理器

由于每个事务都是单独管理的DataSource，因此 Spring Boot 不会自动将事务管理器链接到正确的DataSource。相反，必须手动定义每个事务管理器并将其分配给其对应的DataSource。

Spring Boot 不强制在多数据库环境中应使用哪个事务管理器。如果@Transactional使用 而不指定事务管理器，Spring Boot 将默认使用链接到 的事务管理器@Primary DataSource。

为了避免错误定向的事务，与特定数据库交互的存储库和服务必须明确声明它们使用的事务管理器：

```java
@Transactional("firstTransactionManager") 
public  void  saveToFirstDatabase (User user) { 
    // 将用户保留在第一个数据库中
} 

@Transactional("secondTransactionManager") 
public  void  saveToSecondDatabase (UserDetails userDetails) { 
    // 将用户详细信息保留在第二个数据库中
}

```
除非使用外部事务管理器（例如 JTA），否则 Spring Boot 不会跨多个数据库合并事务。

Spring Boot 读取配置属性，将它们绑定到DataSourceProperties，并DataSource使用 创建 bean DataSourceBuilder。每个都DataSource在应用程序上下文中注册，并通过@Primary和管理依赖项解析@Qualifier。组件必须明确引用正确的DataSource，EntityManagerFactory为 JPA 定义单独的实例，并分配事务管理器以正确指导数据库操作。Spring Boot 不会自动协调多个DataSource对象，需要显式配置来管理它们的交互。


## 小结

学习如逆水行舟，不进则退。虽然很早就已经了解学习了datasource相关的内容，但是时间一久，难免忘记。忘记是一件很正常的事，但希望每一次重新温习都能有新的收获，同时下一次需要用的时候能很好的重新拾起相关内容。

