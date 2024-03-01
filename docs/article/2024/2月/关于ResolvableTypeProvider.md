


# 关于ResolvableTypeProvider

> 书读百遍，其义自现。每个阶段重新回过去看以前的知识点，总是有着不同的体会。最开始学习Java的时候，对于泛型，是怎么去使用，后面看书Java核心技术卷1，对泛型有了进一步了解，但更多的还是停留在表面。而今天在使用Spring的事件机制的时候，了解到了Spring对泛型擦除的优雅解决方案：ResolvableTypeProvider，经过一番折腾，又重新拾起了对泛型的一些遗落的知识点...


## 概述

在开始ResolvableTypeProvider之前，还是希望回顾一下[Java的泛型机制](/docs\book\Java语言系列\Java核心技术卷Ⅰ\泛型程序设计.md)，因为ResolvableTypeProvider就是Spring中优雅解决泛型擦除问题的。



