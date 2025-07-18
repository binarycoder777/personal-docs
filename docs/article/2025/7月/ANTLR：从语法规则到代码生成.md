---

---

# ANTLR：从语法规则到代码生成

> 今天周五，最近在忙其他事情，有一段时间没写博客了，打开编辑器，想记录一下关于antlr这个功能强大的 语法分析器生成器。

## ANTLR是什么

首先介绍一下ANTLR，其全称 Another Tool for Language Recognition，是一个功能强大的 语法分析器生成器。它的作用是根据你定义的一套 语法规则（Grammar），自动生成用于 词法分析（Lexer） 和 语法分析（Parser） 的 Java、Python、C++ 等语言代码。简单来说就是，你告诉ANTLR要识别什么规则的结构
，其便会帮你构建出对应的Token（Lexer），语法树（Parse），并通过监听者模式（Listener） or 访问者模式（Visitor）无侵入的对语法树局部进行定制化操作，而不用关心整个词法、语法树的构建与访问等情况。

**关于词法和语法、语义等知识概念，可以去学习一下编译原理相关知识进行补充了解，笔者虽然大学的时候编译原理这一门课学得还行，也写过词法分析、语法分析、语义分析到最终解释器的代码，但是时间一久，相关内容也忘了不少，而且这门课程确实也很难，值得且需要花费时间与精力去学校**

## 适用场景

- 🌐 自定义语言或 DSL 的解析器（如 SQL 方言、脚本语言等）

- 🛠️ 静态代码分析工具（比如代码质量检查器）

- 🧠 编译器前端（语法分析器）

- 📚 学习语言构造和编译原理

- 📝 配置文件解析（如自定义规则语言）

## 背景

在我们项目中，有许多用到领域特定语言（DSL）以及用户自定义表达式解析计算等需求。但在老项目随着功能需求的不断迭代，业务复杂度不断提高。原有的方案已经不满足现有的场景。例如，需要访问深层嵌套的语法树的局部节点做特定处理，需要在整个分析过程中构建语法树进行处理上下文等等场景。如果在原有的方案上开发成本和心智负担过于沉重。因此，选择了通过ANTLR自定义语法规则进行方案替换优化。

## ANTLR 简单使用

### ANTLR 的核心组件

在使用ANTLR前，先介绍一下ANTLR相关的几个核心概念来组织语法和生成代码：

| 组件               | 说明                      |
| ---------------- | ----------------------- |
| `.g4` 文件         | ANTLR 的语法规则文件，定义语法结构    |
| Lexer（词法分析器）     | 将字符流拆解成 **Token** 流     |
| Parser（语法分析器）    | 根据语法规则组织 Token，构造语法树    |
| Visitor/Listener | 对语法树进行遍历，做语义分析、执行、代码生成等 |

### 一个简单的表达式语法例子

因此，首先我们需要创建一个*.g4的语法规则文件，定义词法和语法规则（实际生产中根据场景，可以将词法与语法.g4文件拆分来进行维护，避免冗余等情况，便于维护）。

下面便创建一个支持 + 和 * 运算的简单计算器。

```bash
grammar Expr;

expr: expr op=('*'|'/') expr      # MulDiv
    | expr op=('+'|'-') expr      # AddSub
    | INT                         # Int
    | '(' expr ')'                # Parens
    ;

INT: [0-9]+;
WS: [ \t\r\n]+ -> skip;
```

**解释：expr 是递归定义，支持括号嵌套和操作符优先级。每个语法规则后加的 # Name 是“标签名”，用于 Visitor 模式中区分子节点。**

> 具体以及其他用法可以参考官方文档:https://github.com/antlr/antlr4/tree/master

### 从语法到代码：使用流程

1. 安装 ANTLR 工具

```bash
brew install antlr # macOS
# or 下载 jar：https://www.antlr.org/download.html
```

如果习惯使用idea的朋友可以在idae上安装对应插件也是一样的。

2. 生成代码

```bash
antlr4 Expr.g4 -visitor -package com.example.expr
```

输出包括但不局限于下面的文件：
- ExprLexer.java
- ExprParser.java
- ExprBaseVisitor.java
- ExprVisitor.java

3.编写 Visitor 解析表达式

```java
public class EvalVisitor extends ExprBaseVisitor<Integer> {
    @Override
    public Integer visitAddSub(ExprParser.AddSubContext ctx) {
        int left = visit(ctx.expr(0));
        int right = visit(ctx.expr(1));
        return ctx.op.getType() == ExprParser.PLUS ? left + right : left - right;
    }

    @Override
    public Integer visitMulDiv(ExprParser.MulDivContext ctx) {
        int left = visit(ctx.expr(0));
        int right = visit(ctx.expr(1));
        return ctx.op.getType() == ExprParser.MUL ? left * right : left / right;
    }

    @Override
    public Integer visitInt(ExprParser.IntContext ctx) {
        return Integer.parseInt(ctx.getText());
    }

    @Override
    public Integer visitParens(ExprParser.ParensContext ctx) {
        return visit(ctx.expr());
    }
}
```

4. 执行并测试

```java
ANTLRInputStream input = new ANTLRInputStream("2 * (3 + 4)");
ExprLexer lexer = new ExprLexer(input);
CommonTokenStream tokens = new CommonTokenStream(lexer);
ExprParser parser = new ExprParser(tokens);
ParseTree tree = parser.expr();

EvalVisitor visitor = new EvalVisitor();
System.out.println(visitor.visit(tree)); // 输出 14
```

至此，一个简单的计算表达式便开发完毕了，ANTLR给我们封装和屏蔽了整个词法，语法规则的构建过程。因此我们只需要专注于编写规则文件以及根据需求使用Listener或Visitor去访问语法树实现我们的业务诉求即可。

## 小结

上面只是一个简单的介绍和例子，实际的开发场景中会遇到奇奇怪怪、各式各样的诉求：可能需要支持上下文敏感语法，可能需要处理优雅的错误提示，可能希望和已有项目无缝集成，甚至还有人拿它写代码转换、重写器、生成器……但不管是哪一种，用 ANTLR 的过程总会逼着你直面语言本质的混乱与秩序。

越往深处走，就越发现语法这东西——远不只是“规则”的堆砌。它是抽象、是妥协、是试图给混乱世界套上的结构化“框”。当站在一棵语法树面前凝视它的结构时，可能会突然意识到：语言本身，就是我们人类思维的一种折射。

而这时，再联想到当下火热的人工智能与自然语言处理，很多问题似乎也不再只是技术性的。是的，我们试图让机器理解人类语言，而 ANTLR 则是在更底层，帮我们定义“什么才算是一门语言”。

当然，最后我想写的是：ANTLR 给了我们一种可能，但并没有告诉我们哪种方式一定是“对”的，也没告诉我们什么时候该停下，什么时候该继续拆分与组合。它只提供了一个工具，而不是答案。因地制宜，适配自己的诉求，或许才是最佳实践。可以写一个优雅的 DSL，也可以做一个粗糙但可用的语法识别器；可以深入语言结构，也可以浅尝辄止。这没有标准答案，只有当下最适合的方案。


