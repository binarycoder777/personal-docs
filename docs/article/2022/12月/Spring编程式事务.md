---

title: Spring编程式事务
author: John Doe
tags:
  - Spring
  - 事务
categories:
  - Spring
date: 2022-06-17 16:55:00
---
描述：今天在做项目实现活动领取功能模块时，考虑到在系统中，用户的领取次数表和领取活动表的后续开销问题，在设计时通过自研的分库分表db-router-Spring-boot-starter组件对该功能涉及的两张表进行了分库操作。即让不同uid的用户产生的领取活动信息和活动次数信息打到不同的数据库上，减轻数据库的压力。但在后续开发时，发现涉及到两张表的修改，而这里又用到了分库操作，对数据源进行了切换。导致常用的@trancation注解在这里并不适用。为此，去温习了一下编程式事务，用于解决此处的问题。在这里记录一下。

编程式事务主要有2种用法
- 方式1：通过PlatformTransactionManager控制事务
- 方式2：通过TransactionTemplate控制事务

### 方式1：PlatformTransactionManager
1. 定义事务管理器PlatformTransactionManager
（事务管理器相当于一个管理员，这个管理员就是用来帮你控制事务的，比如开启事务，提交事务，回滚事务等等。spring中使用PlatformTransactionManager这个接口来表示事务管理器，PlatformTransactionManager多个实现类，用来应对不同的环境
）
  - JpaTransactionManager：如果你用jpa来操作db，那么需要用这个管理器来帮你控制事务。

  - DataSourceTransactionManager：如果你用是指定数据源的方式，比如操作数据库用的是：JdbcTemplate、mybatis、ibatis，那么需要用这个管理器来帮你控制事务。

  - HibernateTransactionManager：如果你用hibernate来操作db，那么需要用这个管理器来帮你控制事务。

  - JtaTransactionManager：如果你用的是java中的jta来操作db，这种通常是分布式事务，此时需要用这种管理器来控制事务。
 ![upload successful](../images/pasted-234.png)
 
2. 定义事务属性TransactionDefinition：定义事务属性，比如事务隔离级别、事务超时时间、事务传播方式、是否是只读事务等等。spring中使用TransactionDefinition接口来表示事务的定义信息，有个子类比较常用：DefaultTransactionDefinition。

3. 开启事务：调用事务管理器的getTransaction方法，即可以开启一个事务，这个方法会返回一个TransactionStatus表示事务状态的一个对象，通过TransactionStatus提供的一些方法可以用来控制事务的一些状态，比如事务最终是需要回滚还是需要提交。（执行了getTransaction后，spring内部会执行一些操作。将数据源datasource和connection映射起来放在了ThreadLocal中。通过resources这个ThreadLocal获取datasource其对应的connection对象）

4. 执行业务操作：用同一个dataSource，而事务管理器开启事务的时候，会创建一个连接，将datasource和connection映射之后丢在了ThreadLocal中，而JdbcTemplate内部执行db操作的时候，也需要获取连接，JdbcTemplate会以自己内部的datasource去上面的threadlocal中找有没有关联的连接，如果有直接拿来用，若没找到将重新创建一个连接，而此时是可以找到的，那么JdbcTemplate就参与到spring的事务中了。

5. 提交或回滚

分析：

TransactionTemplate，主要有2个方法：

executeWithoutResult：无返回值场景

executeWithoutResult(Consumer< TransactionStatus> action)：没有返回值的，需传递一个Consumer对象，在accept方法中做业务操作

execute：有返回值场景

< T> T execute(TransactionCallback< T> action)：有返回值的，需要传递一个TransactionCallback对象，在doInTransaction方法中做业务操作
  
  通过上面2个方法，事务管理器会自动提交事务或者回滚事务。

什么时候事务会回滚，有2种方式

方式1

在execute或者executeWithoutResult内部执行transactionStatus.setRollbackOnly();将事务状态标注为回滚状态，spring会自动让事务回滚

方式2

execute方法或者executeWithoutResult方法内部抛出任意异常即可回滚。

总结：平时我们用的最多的是声明式事务，声明式事务的底层还是使用上面这种方式来控制事务的，只不过对其进行了封装，让我们用起来更容易些。了解不同的方法有助于我们在不同的场景的应用。



