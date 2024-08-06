---

title: MySQL EXPLAIN 详解
author: John Doe
tags:
  - MySQL
  - Explain
categories:
  - MySQL
date: 2022-04-10 16:23:00
---

MySQL 提供了一个EXPALIN 命令，可以用于对SQL语句的执行计划进行分析，并详细的输出分析结果，供开发人员进行针对性的优化。

我们想要查询一条sql有没有用上索引，有没有全表查询，这些都可以通过explain这个命令来查看。

通过explain命令，我们可以深入了解到MySQL的基于开销的优化器，还可以获得很多被优化器考虑到的访问策略的细节以及运行sql语句时哪种策略预计会被优化器采用。

xplain的使用十分简单，通过在查询语句前面加一个explain关键字即可。

## 参数说明
explain 命令一共返回12列信息，分别是：

    id、select_type、table、partitions、type、possible_keys、key、key_len、ref、rows、filtered、Extra
    
### id 列
- 每个select语句都会自动分配的一个唯一标识符
- 表示查询中，操作表的顺序，有三种情况
      id相同，执行顺序从上到下
      id不同，如果是子查询，id号会自增，id越大，优先级越高
      id相同的不相同的同时存在
- id列为null表示为结果集，不需要使用这个语句来查询

### select_type 列（很重要）
查询类型，主要用于区别 普通查询、联合查询（union、union all）、子查询等复杂查询。

- simple：表示不需要union操作或者不包含子查询的简单select查询。有连接查询时，外层的查询为simple，且只有一个。

- primary：一个需要使用union的操作或者含有子查询的select，位于最外层的单位查询的select_type即为primary。且只有一个

- subquery:除了from子句中包含的子查询外，其它地方出现的子查询都可能时subquery

- dependent subquery:子查询的结果受到外层的影响

- union、union result:union 连接的多表查询，第一个查询primary，后面的是union, 结果集是 union result

- dependent union:和union一样，出现在union或者union all中，但是这个查询要受到外部查询的影响

- derived:在from子句后面的子查询，也叫派生表,注意，在MySql5.6 对于此查询没有优化，所以查询类型是derived.在mysql 5.7 使用了 Merge Derived table 优化，查询类型变为SIMPLE。通过控制参数: optimizer_switch='derived=on|off' 决定开始还是优化。默认开启。

## table列
- 显示的查询表名，如果查询使用了别名，那么这里显示的就是别名
- 如果不涉及对数据表的操作，那么这里就是null
- 如果显示为尖括号括起来< derived N>就表示这是一个临时表，N就是执行计划的id，表示结果来自这个查询

- 如果显示为尖括号括起来的< union n,m>也表示一个临时表，表示来自union查询id为n、m的结果集

## partitions 列
分区信息

## type 列 （重要）
依次从好到差：

    system、const、eq_ref、ref、full_text、ref_or_null、unique_subquery、
    index_subquery、range、index_merge、index、all


除了 All 以外，其它的类型都可以用到索引，除了index_merge可以使用多个索引之外，其它的类型最多只能使用到一个索引。

- system：表中只有一行数据或者是空表
- const：使用唯一索引或者主键，返回记录一定是一条的等值where条件时，通常type是const。
- eq_ref:连接字段为主键或者唯一索引，此类型通常出现于多表的join查询，表示对于前表的每一个结果，都对应后表的唯一一条结果。并且查询的比较是=操作，查询效率比较高。
- ref:

  1. 非主键或者唯一键的等值查询
  2. join连接字段是非主键或者唯一键
  3. 最左前缀索引匹配
  
- fulltext:全文检索索引。

- ref_or_null:和ref类似，增加了null值判断

- unique_subquery、 index_subquery:都是子查询，前者返回唯一值，后者返回可能有重复。

- range (重要):索引范围扫描，常用于 ><,is null,between,in,like等

- index_merge(索引合并):表示查询使用了两个或者以上的索引数量，常见于and或者or查询匹配上了多个不同索引的字段

- index(辅助索引):减少回表次数,因为要查询的索引都在一颗索引树上

- all: 全表扫描

## possible_keys 列
此次查询中，可能选用的索引
## key列
查询实际使用的索引，select_type为index_merge时，key列可能有多个索引，其它时候这里只会有一个
## key_len 列
- 用于处理查询的索引长度，如果是单列索引，那么整个索引长度都会计算进去，如果是多列索引，那么查询不一定能使用到所有的列，具体使用了多少个列的索引，这里就会计算进去，没有使用到的索引，这里不会计算进去。
- 留意一下这个长度，计算一下就知道这个索引使用了多少列
- 另外，key_len 只计算 where 条件使用到索引长度，而排序和分组就算用到了索引也不会计算key_len

## ref
- 如果是使用的常数等值查询，这里会显示const
- 如果是连接查询，被驱动表的执行计划这里会显示驱动表的关联字段
- 如果是条件使用了表达式或者函数，或者条件列发生了内部隐式转换，这里可能会显示func

## rows
执行计划估算的扫描行数，不是精确值（innodb不是精确值，myisam是精确值，主要是因为innodb使用了mvcc）

## extra
这个列包含很多不适合在其它列显示的重要信息，有很多种，常用的有：
- using temporary

 - 表示使用了临时表存储中间结果   
 - MySQL在对 order by和group by 时使用临时表
 - 临时表可以是内存临时表和磁盘临时表，执行计划中看不出来，需要查看status变量：used_tmp_table、used_tmp_disk_table才可以看出来

- no table used

 - 不带from字句的查询或者from dual查询（explain select 1;）
 
使用 not in() 形式的子查询查询或者not exists运算符的连接查询，这种叫做反链接

    即：一般连接先查询内表再查询外表，反链接就是先查询外表再查询内表

- using filesort

 - 排序时无法使用到所以就会出现这个，常见于order by和group by
 - 说明MySQL会使用一个外部的索引进行排序，而不是按照索引顺序进行读取
  - MySQL中无法利用索引完成的排序就叫“文件排序”
  
- using index 查询时候不需要回表

   - 表示相应的select查询中使用到了覆盖索引(Covering index)，避免访问表的数据行
   - 如果同时出现了using where，说明索引被用来执行查询键值如果没有using where，表示读取数据而不是执行查找操作
   
- using where
  - 表示存储引擎返回的记录并不都是符合条件的，需要在server层进行筛选过滤，性能很低
  
- using index condition
   - 索引下推，不需要再在server层进行过滤,5.6.x开始支持
   
- first match
    - 5.6.x 开始出现的优化子查询的新特性之一，常见于where字句含有in()类型的子查询，如果内表数据量过大，可能出现
- loosescan
    - 5.6.x 开始出现的优化子查询的新特性之一，常见于where字句含有in()类型的子查询，如果内表返回有重复值，可能出现
    
## filtered 列
5.7之后的版本默认就有这个字段，不需要使用explain extended了。这个字段表示存储引擎返回的数据在server层过滤后，剩下多少满足查询的记录数量的比例，注意是百分比，不是具体记录数。


