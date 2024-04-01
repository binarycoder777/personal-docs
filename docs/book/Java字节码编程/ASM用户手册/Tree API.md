---

---

# Tree API

## 类

### 接口和组件

用于生成和转换已编译 Java 类的 ASM 树 API 是基于 ClassNode 类的
```java
public class ClassNode ... { 
public int version; 
public int access; 
public String name; 
public String signature; 
public String superName; 
public List<String> interfaces; 
public String sourceFile; 
public String sourceDebug; 
public String outerClass; 
public String outerMethod; 
public String outerMethodDesc; 
public List<AnnotationNode> visibleAnnotations; 
public List<AnnotationNode> invisibleAnnotations; 
public List<Attribute> attrs; 
public List<InnerClassNode> innerClasses; 
public List<FieldNode> fields; 
public List<MethodNode> methods; 
}
```
这些字段的内容与核心 API 相同。例如，name 是一个内部名字，signature 是一个类签名,一些字段包含其他 XxxNode 类,它们拥有一种类似的结构，即拥有一些字段，对应于类文件结构的子部分,例如，FieldNode 类看起来是这样的：
```java
public class FieldNode ... {
 public int access; 
 public String name; 
 public String desc; 
 public String signature; 
 public Object value; 
 public FieldNode(int access, String name, String desc, 
 String signature, Object value) { 
 ... 
 } 
 ... 
}
```
MethodNode 类是类似的：
```java
public class MethodNode ... { 
 public int access; 
 public String name; 
 public String desc; 
 public String signature; 
 public List<String> exceptions; 
 ... 
 public MethodNode(int access, String name, String desc, 
 String signature, String[] exceptions) 
 { 
 ... 
 } 
}
```

#### 生成类
用树 API 生成类的过程就是：创建一个 ClassNode 对象，并初始化它的字段。
```java
ClassNode cn = new ClassNode(); 
cn.version = V1_5; 
cn.access = ACC_PUBLIC + ACC_ABSTRACT + ACC_INTERFACE; 
cn.name = "pkg/Comparable"; 
cn.superName = "java/lang/Object"; 
cn.interfaces.add("pkg/Mesurable"); 
cn.fields.add(new FieldNode(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, 
 "LESS", "I", null, new Integer(-1))); 
cn.fields.add(new FieldNode(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, 
 "EQUAL", "I", null, new Integer(0))); 
cn.fields.add(new FieldNode(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, 
 "GREATER", "I", null, new Integer(1))); 
cn.methods.add(new MethodNode(ACC_PUBLIC + ACC_ABSTRACT, 
 "compareTo", "(Ljava/lang/Object;)I", null, null));
 ```
 使用树 API 生成类时，需要多花费大约 30%的时间,占用的内存也多于使用
核心 API。但可以按任意顺序生成类元素，这在一些情况下可能非常方便。

#### 添加和删除类成员
添加和删除类就是在 ClassNode 对象的 fields 或 methods 列表中添加或删除元素。例
如，如果像下面这样定义了 ClassTransformer 类，以便能够轻松地编写类转换器：
```java

public class ClassTransformer { 
 protected ClassTransformer ct; 
 public ClassTransformer(ClassTransformer ct) { 
 this.ct = ct; 
 } 
 public void transform(ClassNode cn) { 
 if (ct != null) { 
 ct.transform(cn); 
 } 
 } 
}

public class RemoveMethodTransformer extends ClassTransformer { 
 private String methodName; 
 private String methodDesc; 
 public RemoveMethodTransformer(ClassTransformer ct, 
 String methodName, String methodDesc) { 
 super(ct); 
 this.methodName = methodName; 
 this.methodDesc = methodDesc; 
 } 
 @Override public void transform(ClassNode cn) { 
 Iterator<MethodNode> i = cn.methods.iterator(); 
 while (i.hasNext()) { 
 MethodNode mn = i.next(); 
 if (methodName.equals(mn.name) && methodDesc.equals(mn.desc)) { 
 i.remove(); 
 } 
 } 
 super.transform(cn); 
 } 
}
```
可以看出，它与核心 API 的主要区别是需要迭代所有方法，而在使用核心 API 时是不需要
这样做的（这一工作会在 ClassReader 中为你完成）。事实上，这一区别对于几乎所有基于树
的转换都是有效的。
```java
public class AddFieldTransformer extends ClassTransformer {
 private int fieldAccess; 
 private String fieldName; 
 private String fieldDesc; 
 public AddFieldTransformer(ClassTransformer ct, int fieldAccess, 
 String fieldName, String fieldDesc) { 
 super(ct); 
 this.fieldAccess = fieldAccess; 
 this.fieldName = fieldName; 
 this.fieldDesc = fieldDesc; 
 } 
 @Override public void transform(ClassNode cn) { 
 boolean isPresent = false; 
 for (FieldNode fn : cn.fields) { 
 if (fieldName.equals(fn.name)) { 
 isPresent = true; 
 break; 
 } 
 } 
 if (!isPresent) { 
 cn.fields.add(new FieldNode(fieldAccess, fieldName, fieldDesc,
null, null)); 
 } 
 super.transform(cn); 
 } 
}
 ```
 和生成类的情景一样，使用树 API 转换类时，所花费的时间和占用的内存也要多于使用核
心 API 的时候。但使用树 API 有可能使一些转换的实现更为容易。比如有一个转换，要向一个
类中添加注释，包含其内容的数字签名，就属于上述情景。在使用核心 API 时，只有在访问了
整个类之后才能计算数字签名，但这时再添加包含其内容的注释就太晚了，因为对注释的访问必
须位于类成员之前。而在使用树 API 时，这个问题就消失了，因为这时不存在此种限制。

事实上，有可能用核心 API 实现 AddDigitialSignature 示例，但随后，必须分两遍来
转换这个类。第一遍，首先用一个 ClassReader（没有 ClassWriter）来访问这个类，以根
据类的内容来计算数字签名。在第二遍，重复利用同一个 ClassReader 对类进行第一次访问，
这一次是向一个 ClassWriter 链接一个 AddAnnotationAdapter。通过推广这一论述过程，
我们可以看出，事实上，任何转换都可以仅用核心 API 来实现，只需在必要时分几遍完成。但
这样就ᨀ高了转换代码的复杂性，要求在各遍之间存储状态（这种状态可能非常复杂，需要一个
完整的树形表示！），而且对一个类进行多次分析是有成本的，必需将这一成本与构造相应
ClassNode 的成本进行比较。

结论是：**树 API 通常用于那些不能由核心 API 一次实现的转换。**但当然也存在例外。例如
一个混淆器不能由核心 API 一遍实现，因为必须首先在原名称和混淆后的名字之间建立了完整
的映射之后，才可能转换类，而这个映射的建立需要对所有类进行分析。但树 API 也不是一个
好的解决方案，因为它需要将所有待混淆类的对象表示保存在内存中。在这种情况下，最好是分
两遍使用核心 API：一遍用于计算原名与混淆后名称之间的映射（一个简单的散列表，它需要的
内存要远少于所有类的完整对象表示），另一遍用于根据这一映射来转换类。

### 组件合成
到现在为止，我们只是看到了如何创建和转换 ClassNode 对象，但还没有看到如何由一个
类的字节数组表示来构造一个 ClassNode，或者反过来，由 ClassNode 构造这个字节数组。
事实上，这一功能可以通过合成核心 API 和树 API 组件来完成，

#### 介绍

ClassNode 类扩展了 ClassVisitor 类，还ᨀ供了一个
accept 方法，它以一个 ClassVisitor 为参数。Accept 方法基于 ClassNode 字段值生成
事件，而 ClassVisitor 方法执行逆操作，即根据接到的事件设定 ClassNode 字段：
```java
public class ClassNode extends ClassVisitor { 
 ... 
 public void visit(int version, int access, String name, 
 String signature, String superName, String[] interfaces[]) { 
 this.version = version;
 this.access = access; 
 this.name = name; 
 this.signature = signature; 
 ... 
 } 
 ... 
 public void accept(ClassVisitor cv) { 
 cv.visit(version, access, name, signature, ...); 
 ... 
 } 
}
```
要由字节数组构建 ClassNode，可以将它与 ClassReader 合在一起，使 ClassReader
生成的事件可供 ClassNode 组件使用，从而初始化其字段（由上述代码可以看出）：
```java
ClassNode cn = new ClassNode(); 
ClassReader cr = new ClassReader(...); 
cr.accept(cn, 0);
```
反过来，可以将 ClassNode 转换为其字节数组表示，只需将它与 ClassWriter 合在一起
即可，从而使 ClassNode 的 accept 方法生成的事件可供 ClassWriter 使用：
```java
ClassWriter cw = new ClassWriter(0); 
cn.accept(cw); 
byte[] b = cw.toByteArray();
```

#### 模式
要用树 API 转换类，可以将这些元素放在一起：
```java
ClassNode cn = new ClassNode(ASM4); 
ClassReader cr = new ClassReader(...); 
cr.accept(cn, 0); 
... // 可以在这里根据需要转换 cn 
ClassWriter cw = new ClassWriter(0); 
cn.accept(cw); 
byte[] b = cw.toByteArray();
```
还可能与核心 API 一起使用基于树的类转换器，比如类适配器。有两种常见模式可用于此
种情景。第一种模式使用继承：
```java
public class MyClassAdapter extends ClassNode {
 public MyClassAdapter(ClassVisitor cv) { 
 super(ASM4); 
 this.cv = cv; 
 } 
 @Override public void visitEnd() { 
 // put your transformation code here 
 accept(cv); 
 } 
}
```
当这个类适配器用在一个经典的转换链时：
```java
ClassWriter cw = new ClassWriter(0); 
ClassVisitor ca = new MyClassAdapter(cw); 
ClassReader cr = new ClassReader(...); 
cr.accept(ca, 0);
byte[] b = cw.toByteArray();
```
cr 生成的事件供 ClassNode ca 使用，从而初始化这个对象的字段。最后，在使用 visitEnd
事件时，ca 执行转换，并通过调用其 accept 方法，生成与所转换类对应的新事件，然后由 cw
使用。，可以看出，ca 和 cw 之间的事
件发生在 cr 和 ca 之间的事件之后，而不是像正常类适配器一样同时进行。事实上，对于所有
基于树的转换都是如此

第二种模式可用于以类似程序图获得相同结果，它使用的是委托而非继承：
```java
public class MyClassAdapter extends ClassVisitor { 
 ClassVisitor next; 
 public MyClassAdapter(ClassVisitor cv) { 
 super(ASM4, new ClassNode()); 
 next = cv; 
 } 
 @Override public void visitEnd() { 
 ClassNode cn = (ClassNode) cv; 
 // 将转换代码放在这里
 cn.accept(next); 
 } 
}
```
这一模式使用两个对象而不是一个，但其工作方式完全与第一种模式相同：接收到的事件用
于构造一个 ClassNode，它被转换，并在接收到最后一个事件后，变回一个基于事件的表示。

这两种模式都允许用基于事件的适配器来编写基于树的类适配器。它们也可用于将基于树的
适配器组合在一起，但如果只需要组合基于树的适配器，那这并非最佳解决方案：在这种情况下，
使用诸如 ClassTransformer 的类将会避免在两种表示之间进行不必要的转换。

## 方法

### 接口和组件
用于生成和转换方法的 ASM 树 API 是基于 MethodNode 类的
```java
public class MethodNode ... { 
 public int access; 
 public String name; 
 public String desc; 
 public String signature; 
 public List<String> exceptions; 
 public List<AnnotationNode> visibleAnnotations; 
 public List<AnnotationNode> invisibleAnnotations; 
 public List<Attribute> attrs; 
 public Object annotationDefault; 
 public List<AnnotationNode>[] visibleParameterAnnotations; 
 public List<AnnotationNode>[] invisibleParameterAnnotations; 
 public InsnList instructions; 
 public List<TryCatchBlockNode> tryCatchBlocks; 
 public List<LocalVariableNode> localVariables; 
 public int maxStack; 
 public int maxLocals; 
}
```
这个类的大多数字段都类似于 ClassNode 的对应字段。最重要的是从 instructions 字
段开始的最后几个。这个 instructions 字段是一个指令列表，用一个 InsnList 对象管理，
它的公共 API 如下：
```java
public class InsnList { // public accessors omitted 
 int size(); 
 AbstractInsnNode getFirst(); 
 AbstractInsnNode getLast(); 
 AbstractInsnNode get(int index); 
 boolean contains(AbstractInsnNode insn); 
 int indexOf(AbstractInsnNode insn); 
 void accept(MethodVisitor mv);
 ListIterator iterator(); 
 ListIterator iterator(int index); 
 AbstractInsnNode[] toArray(); 
 void set(AbstractInsnNode location, AbstractInsnNode insn); 
 void add(AbstractInsnNode insn); 
 void add(InsnList insns); 
 void insert(AbstractInsnNode insn); 
 void insert(InsnList insns); 
 void insert(AbstractInsnNode location, AbstractInsnNode insn); 
 void insert(AbstractInsnNode location, InsnList insns); 
 void insertBefore(AbstractInsnNode location, AbstractInsnNode insn); 
 void insertBefore(AbstractInsnNode location, InsnList insns); 
 void remove(AbstractInsnNode insn); 
 void clear(); 
}
 ```
 InsnList 是一个由指令组成的双向链表，它们的链接存储在 AbstractInsnNode 对象
本身中。这一点极为重要，因为它对于必须如何使用指令对象和指令列表的方式有许多影响：
- 一个 AbstractInsnNode 对象在一个指令列表中最多出现一次。
- 一个 AbstractInsnNode 对象不能同时属于多个指令列表。
- 一个结果是：如果一个 AbstractInsnNode 属于某个列表，要将它添加到另一列表，
必须先将其从原列表中删除。
- 另一结果是：将一个列表中的所有元素都添加到另一个列表中，将会清空第一个列表。

AbstractInsnNode 类是表示字节代码指令的类的超类。它的公共 API 如下：
```java
public abstract class AbstractInsnNode { 
 public int getOpcode(); 
 public int getType(); 
 public AbstractInsnNode getPrevious(); 
 public AbstractInsnNode getNext(); 
 public void accept(MethodVisitor cv); 
 public AbstractInsnNode clone(Map labels); 
}
```
它的子类是 Xxx InsnNode 类，对应于 MethodVisitor 接口的 visitXxx Insn 方法，
而且其构造方式完全相同。例如，VarInsnNode 类对应于 visitVarInsn 方法，且具有以下
结构：
```java
public class VarInsnNode extends AbstractInsnNode { 
 public int var; 
 public VarInsnNode(int opcode, int var) { 
 super(opcode); 
 this.var = var; 
 } 
 ... 
}
```
标记与帧，还有行号，尽管它们并不是指令，但也都用 AbstractInsnNode 类的子类表
示，即 LabelNode、FrameNode 和 LineNumberNode 类。这样就允许将它们恰好插在列表
中对应的真实指令之前，与核心 API 中一样（在核心 API 中，就是恰在相应的指令之前访问标
记和帧）。因此，很容易使用 AbstractInsnNode 类ᨀ供的 getNext 方法找到跳转指令的目
标：这是目标标记之后第一个是真正指令的 AbstractInsnNode。另一个结果是：与核心 API
一样，只要标记保持不变，删除指令并不会破坏跳转指令。

#### 生成方法
用树 API 生成一个方法包括：创建一个 MethodNode，初始化其字段。最重要的部分是方
法代码的生成。
```java
MethodNode mn = new MethodNode(...); 
InsnList il = mn.instructions; 
il.add(new VarInsnNode(ILOAD, 1)); 
LabelNode label = new LabelNode(); 
il.add(new JumpInsnNode(IFLT, label)); 
il.add(new VarInsnNode(ALOAD, 0)); 
il.add(new VarInsnNode(ILOAD, 1)); 
il.add(new FieldInsnNode(PUTFIELD, "pkg/Bean", "f", "I")); 
LabelNode end = new LabelNode(); 
il.add(new JumpInsnNode(GOTO, end)); 
il.add(label); 
il.add(new FrameNode(F_SAME, 0, null, 0, null)); 
il.add(new TypeInsnNode(NEW, "java/lang/IllegalArgumentException")); 
il.add(new InsnNode(DUP)); 
il.add(new MethodInsnNode(INVOKESPECIAL, 
 "java/lang/IllegalArgumentException", "<init>", "()V")); 
il.add(new InsnNode(ATHROW)); 
il.add(end); 
il.add(new FrameNode(F_SAME, 0, null, 0, null)); 
il.add(new InsnNode(RETURN)); 
mn.maxStack = 2; 
mn.maxLocals = 2;
```
和类的情景一样，使用树 API 来生成方法时，花费的时间和占用的内存都要多于使用核心
API 的情况。但可以按照任意顺序来生成其内容。具体来说，这些指令可按非顺序方式生成，这
在一些情况下是很有用的。

比如，考虑一个压缩编译器。通常，要编译表达式 e1+e2，首先发送 e1的代码，然后发出 e2
的代码，然后发出将这两个值相加的代码。但如果 e1 和 e2不是同一基元类型，必须恰在 e1 的代
码之后插入一个转换操作，恰在 e2 的代码之后插入另一个。但是究竟发出哪些转换操作取决于
e1 和 e2 的类型。

现在，如果表达式的类型是由发出已编译代码的方法返回的，那在使用核心 API 时就会存
在一个问题：只有在已经编译了 e2 之后才能知道必须插在 e1 之后的转换，但这时已经太晚了，
因为我们不能在之前访问的指令之间插入指令。①在使用树 API 时不存在这一问题。例如，一种
可能性是使用比如下面所示的 compile 方法：
```java
public Type compile(InsnList output) { 
 InsnList il1 = new InsnList(); 
 InsnList il2 = new InsnList(); 
 Type t1 = e1.compile(il1); 
 Type t2 = e2.compile(il2); 
 Type t = ...; // 计算 t1 和 t2 的公共超类型
 output.addAll(il1); // 在常量时间内完成
 output.add(...); // 由 t1 到 t 的转换指令
 output.addAll(il2); // 在常量时间内完成
 output.add(...); // 由 t2 到 t 的转换指令
  output.add(new InsnNode(t.getOpcode(IADD))); 
 return t; 
}
```
#### 转换方法
用树 API 转换方法只需要修改一个 MethodNode 对象的字段，特别是 instructions 列
表。尽管这个列表可以采用任意方式修改，但常见做法是通过迭代修改。事实上，与通用
ListIterator 约定不同，InsnList 返回的 ListIterator 支持许多并发列表修改①。事实
上，可以使用 InsnList 方法删除包括当前元素在内的一或多个元素，删除下一个元素之后的
一或多个元素（也就是说，不是紧随当今元素之后的元素，而是它后面一个元素之后的元素），
或者在当前元素之前或其后续者之后插入一或多个元素。这些修改将反映在迭代器中，即在下一
元素之后插入（或删除）的元素将在迭代器中被看到（或不被看到）

如果需要在一个列表的指令 i 之后插入几条指令，那另一种修改指令列表的常见做法是将这
些新指令插入一个临时指令列表中，再在一个步骤内将这个临时列表插到主列表中：
```java
InsnList il = new InsnList(); 
il.add(...); 
... 
il.add(...); 
mn.instructions.insert(i, il); 
```
逐条插入指令也是可行的，但却非常麻烦，因为必须在每次插之后更新插入点。

### 无状态转换和有状态转换
让我们用一些示例来具体看看如何用树 API 转换方法。
```java
public class AddTimerTransformer extends ClassTransformer { 
 public AddTimerTransformer(ClassTransformer ct) { 
 super(ct); 
 } 
 @Override public void transform(ClassNode cn) { 
 for (MethodNode mn : (List<MethodNode>) cn.methods) { 
 if ("<init>".equals(mn.name) || "<clinit>".equals(mn.name)) { 
 continue; 
 } 
 InsnList insns = mn.instructions; 
 if (insns.size() == 0) { 
 continue; 
 } 
 Iterator<AbstractInsnNode> j = insns.iterator(); 
 while (j.hasNext()) { 
 AbstractInsnNode in = j.next(); 
 int op = in.getOpcode(); 
 if ((op >= IRETURN && op <= RETURN) || op == ATHROW) {
InsnList il = new InsnList(); 
 il.add(new FieldInsnNode(GETSTATIC, cn.name, "timer", "J")); 
 il.add(new MethodInsnNode(INVOKESTATIC, "java/lang/System", 
 "currentTimeMillis", "()J")); 
 il.add(new InsnNode(LADD)); 
 il.add(new FieldInsnNode(PUTSTATIC, cn.name, "timer", "J")); 
 insns.insert(in.getPrevious(), il); 
 } 
 }
 InsnList il = new InsnList(); 
 il.add(new FieldInsnNode(GETSTATIC, cn.name, "timer", "J")); 
 il.add(new MethodInsnNode(INVOKESTATIC, "java/lang/System", 
 "currentTimeMillis", "()J")); 
 il.add(new InsnNode(LSUB)); 
 il.add(new FieldInsnNode(PUTSTATIC, cn.name, "timer", "J")); 
 insns.insert(il); 
 mn.maxStack += 4; 
 } 
 int acc = ACC_PUBLIC + ACC_STATIC; 
 cn.fields.add(new FieldNode(acc, "timer", "J", null, null)); 
 super.transform(cn); 
 } 
}
```
在这里可以看出上一节讨论的用于在指令列表中插入若干指令的模式，其中包含了使用临时
指令列表。这个示例还表明，有可能在迭代一个指令表的时候向当前指令之前插入指令。注意，
在使用核心 API 和树 API 时，实现这一适配器所需要的代码数量大体相同。

基于访问器和基于树的实现都可以在被检测序列的中部检测到标记和帧，在
这种情况下，不要删除它。但要忽略序列中的行号（见 getNext 方法），使用基于树的 API 时
的代码数量要多于使用核心 API 的情况。但是，这两种实现之间的主要区别是：在使用树 API
时，不需要状态机。特别是有三个或更多个连续 ALOAD 0 指令的特殊情景（它很容易被忽视），
不再成为问题了。

#### 全局转换
到目前为止，我们看到的所有方法转换都是局部的，甚至有状态的转换也是如此，所谓“局
部”是指，一条指令 i 的转换仅取决于与 i 有固定距离的指令。但还存在一些全局转换，在这种
转换中，指令 i 的转换可能取决于与 i 有任意距离的指令。对于这些转换，树 API 真的很有帮助，
也就是说，使用核心 API 实现它们将会非常非常复杂。

下面的转换就是这样一个例子：用向 label 的跳转代替向 GOTO label 指令的跳转，然后
用一个 RETURN 指令代替指向这个 RETURN 指令的 GOTO。实际中，一个跳转指令的目标与这条
指令的距离可能为任意远，可能在它的前面，也可能在其之后。这样一个转换可实现如下：
```java
public class OptimizeJumpTransformer extends MethodTransformer { 
 public OptimizeJumpTransformer(MethodTransformer mt) { 
 super(mt); 
 } 
 @Override public void transform(MethodNode mn) { 
 InsnList insns = mn.instructions; 
 Iterator<AbstractInsnNode> i = insns.iterator(); 
 while (i.hasNext()) { 
 AbstractInsnNode in = i.next(); 
 if (in instanceof JumpInsnNode) { 
 LabelNode label = ((JumpInsnNode) in).label; 
 AbstractInsnNode target; 
 // 当 target == goto l，用 l 代替 label 
 while (true) { 
 target = label; 
 while (target != null && target.getOpcode() < 0) { 
 target = target.getNext(); 
 } 
 if (target != null && target.getOpcode() == GOTO) { 
 label = ((JumpInsnNode) target).label; 
 } else {
    break; 
 } 
 } 
 // 更新目标
 ((JumpInsnNode) in).label = label; 
 // 在可能时，用目标指令代替跳转
 if (in.getOpcode() == GOTO && target != null) { 
 int op = target.getOpcode(); 
 if ((op >= IRETURN && op <= RETURN) || op == ATHROW) { 
 // replace ’in’ with clone of ’target’ 
 insns.set(in, target.clone(null)); 
 } 
 } 
 } 
 } 
 super.transform(mn); 
 } 
}
```
此代码的工作过程如下：当找到一条跳转指令 in 时，它的目标被存储在 label 中。然后
用最内层的 while 循环查找紧跟在这个标记之后出现的指令（不代表实际指令的
AbstractInsnNode 对象，比如 FrameNode 或 LabelNode，其“操作码”为负）。只要这条
指令是 GOTO，就用这条指令的目标代替 label，然后重复上述步骤。最后，用这个更新后的
label值来代替in的目标标记，如果in本身是一个GOTO，并且其更新后的目标是一条RETURN
指令，则 in 用这个返回指令的克隆副本代替（回想一下，一个指令对象在一个指令列表中不能
出现一次以上）

注意，尽管这个转换改变了跳转指令（更正式地说，是改变了控制流图），但它不需要更新
方法的帧。事实上，在每条指令处，执行帧的状态保持不变，而且由于没有引用新的跳转目标，
所以并不需要访问新的帧。但是，可能会出现不再需要某个帧的情况。例如在上面的例子中，转
换后不再需要 end 标记，它后面的 F_SAME 帧和 RETURN 指令也是如此。幸好，访问帧数超出
必需数量是完全合法的，在方法中包含未被使用的代码（称为死代码或不可及代码）也是合法的。
因此，上述方法适配器是正确的，尽管可对其进行改进，删除死代码和帧。

### 组件合成
到目前为止，我们仅看到了如何创建和转换 MethodNode 对象，却还没有看到与类的字节
数组表示进行链接。和类的情景一样，这一链接过程也是通过合成核心 API 和树 API 组件完成
的

#### 介绍
MethodNode 类扩展了 MethodVisitor 类，还ᨀ供了两个
accept 方法，它以一个 MethodVisitor 或一个 ClassVisitor 为参数。accept 方法基于
MethodNode 字段值生成事件，而 MethodVisitor 方法执行逆操作，即根据接收到的事件设
定 MethodNode 字段。

#### 模式
和类的情景一样，有可能与核心 API 使用一个基于树的方法转换器，比如一个方法适配器。
用于类的两种模式实际上对于方法也是有效的，其工作方式完全相同。基于继承的模式如下：
```java
public class MyMethodAdapter extends MethodNode { 
 public MyMethodAdapter(int access, String name, String desc, 
 String signature, String[] exceptions, MethodVisitor mv) { 
 super(ASM4, access, name, desc, signature, exceptions); 
 this.mv = mv; 
 } 
 @Override public void visitEnd() { 
 // 将你的转换代码放在这儿
 accept(mv); 
 } 
}
```
而基于委托的模式为：
```java
public class MyMethodAdapter extends MethodVisitor { 
 MethodVisitor next; 
 public MyMethodAdapter(int access, String name, String desc, 
 String signature, String[] exceptions, MethodVisitor mv) { 
 super(ASM4, 
 new MethodNode(access, name, desc, signature, exceptions)); 
 next = mv; 
 } 
 @Override public void visitEnd() { 
 MethodNode mn = (MethodNode) mv; 
 //将你的转换代码放在这儿
 mn.accept(next); 
 } 
} 
```
第一种模式的一种变体是直接在 ClassAdapter 的 visitMethod 中将它与一个匿名内部
类一起使用：
```java
 String desc, String signature, String[] exceptions) { 
 return new MethodNode(ASM4, access, name, desc, signature, exceptions) 
 { 
 @Override public void visitEnd() { 
 //将你的转换代码放在这儿
 accept(cv); 
 } 
 }; 
}
```
这些模式表明，可以将树 API 仅用于方法，将核心 API 用于类。在实践中经常使用这一策
略。

## 方法分析
代码分析是一个很大的主题，存在许多代码分析算法。我们不可能在这里介绍所有这些算法，
也超出了本文档的范围。事实上，这一节的目的只是概述 ASM 中使用的算法。关于这一主题的
更好介绍，可以在有关编译器的书中找到。接下来的几节将介绍代码分析技术的两个重要类型，
即数据流和控制流分析：
- 数据流分析包括：对于一个方法的每条指令，计算其执行帧的状态。这一状态可能采用
一种多少有些抽象的方式来表示。例如，引用值可能用一个值来表示，可以每个类一
个值，可以是{null, 非 null，可为 null}集合中的三个可能值表示，等等。
- 控制流分析包括计算一个方法的控制流图，并对这个图进行分析。控制流图中的节点为
指令，如果指令 j 可以紧跟在 i 之后执行，则图的有向边将连接这两条指令 i→j。

#### 数据流分析
有两种类型的数据流分析可以执行：
- 正向分析是指对于每条指令，根据执行帧在执行此指令之前的状态，计算执行帧在这一
指令之后的状态。
- 反向分析是指对于每条指令，根据执行帧在执行此指令之后的状态，计算执行帧在这一
指令之前的状态。

正向数据流分析的执行是对于一个方法的每个字节代码指令，模拟它在其执行帧上的执行，
通常包括：
- 从栈中弹出值，
- 合并它们，
- 将结果压入栈中。
这看起来似乎就是解释器或 Java 虚拟机做的事情，但事实上，它是完全不同的，因为其目
标是对于所有可能出现的参数值，模拟一个方法中的所有可能执行路径，而不是由某一组特定
方法参数值所决定的单一执行路径。一个结果就是，对于分支指令，两个路径都将被模拟（而实
际解释器将会根据实际条件值，仅沿一条分支执行）

另一个结果是，所处理的值实际上是由可能取值组成的集合。这些集合可能非常大，比如“所
有可能值”，“所有整数”，“所有可能对象”或者“所有可能的 String 对象”，在这些情况下，
可以将它们称为类型。它们也可能更为准确，比如“所有正整数”，“所有介于 0 到 10 之间的整
数”，或者“所有不为 null 的可能对象”。要模拟指令 i 的执行，就是要对于其操作数取值集合
中的所有组合形式，找出 i 的所有可能结果集。例如，如果整数由以下三个集合表示：P=“正整
数或 null”，N=“负整数或 null”，A=“所有整数”，要模拟 IADD 指令，就意味着当两个操作
数均为 P 时返回 P，当两个操作数均为 N 时返回 N，在所有其他情况下返回 A。

最后一个后果是需要计算取值的并集：例如，与(b ? e1 : e2)对应的可能值集是 e1 的
可能值与 e2 的可能值的并集。更一般地说，每当控制流图包含两条或多条具有同一目的地的边
时，就需要这一操作。在上面的例子中，整数由三个集合 P、N 和 A 表示，可以很容易地计算出
这些集合中两个集合的并集：除非这两个集合相等，否则总是 A。

#### 控制流分析
控制流分析的基础是方法的控制流图。

### 接口与组件
用于代码分析的 ASM API 在 org.objectweb.asm.tree.analysis 包中。由包的名字
可以看出，它是基于树 API 的。事实上，这个包ᨀ供了一个进行正向数据流分析的框架。

为了能够以准确度不一的取值进行各种数据流分析，数据流分析算法分为两部分：一种是固
定的，由框架ᨀ供，另一种是变化的，由用户ᨀ供。更准确地说：
- 整体数据流分析算法、将适当数量的值从栈中弹出和压回栈中的任务仅实现一次，用于
Analyzer 和 Frame 类中的所有内容。
- 合并值的任何和计算值集并集的任务由用户定义的 Interpreter 和 Value 抽象类的
子类ᨀ供。

尽管框架的主要目的是执行数据流分析，但 Analyzer 类也可构造所分析方法的控制流图。
为此，可以重写这个类的newControlFlowEdge和newControlFlowExceptionEdge方法，
它们默认情况下不做任何事情。其结果可用于进行控制流分析。

#### 基本数据流分析
Interpreter 类是抽象类中预定义的 Interpreter 子类之一。它利用在 BasicValue
类中定义的七个值集来模拟字节代码指令的效果：
- UNINITIALIZED_VALUE 指“所有可能值”。 
- INT_VALUE 指“所有 int、short、byte、boolean 或 char 值”。 
- FLOAT_VALUE 指“所有 float 值”。 
- LONG_VALUE 指“所有 long 值”。 
- DOUBLE_VALUE 指“所有 double 值”。 
- REFERENCE_VALUE 指“所有对象和数组值”。 
- RETURNADDRESS_VALUE 用于子例程

这个解释器本身不是非常有用,但它可以用作一个“空的”Interpreter 实现，以构建一个 Analyzer。这个分析器可
用于检测方法中的不可及代码。事实上，即使是沿着跳转指令的两条分支，也不可能到达那些不
能由第一条指令到达的代码。其结果是：在分析之后，无论什么样的 Interpreter 实现，由
Analyzer.getFrames 方法返回的计算帧，对于不可到达的指令都是 null。这一特性可用于
非常轻松地实现一个 RemoveDeadCodeAdapter 类（还有一些更高效的方法，但它们需要编
写的代码也更多）：
```java
public class RemoveDeadCodeAdapter extends MethodVisitor { 
 String owner; 
 MethodVisitor next; 
 public RemoveDeadCodeAdapter(String owner, int access, String name, 
 String desc, MethodVisitor mv) { 
 super(ASM4, new MethodNode(access, name, desc, null, null)); 
 this.owner = owner; 
 next = mv; 
 } 
 @Override public void visitEnd() { 
 MethodNode mn = (MethodNode) mv; 
 Analyzer<BasicValue> a = 
 new Analyzer<BasicValue>(new BasicInterpreter()); 
 try { 
 a.analyze(owner, mn);
 Frame<BasicValue>[] frames = a.getFrames(); 
 AbstractInsnNode[] insns = mn.instructions.toArray(); 
 for (int i = 0; i < frames.length; ++i) { 
 if (frames[i] == null && !(insns[i] instanceof LabelNode)) { 
 mn.instructions.remove(insns[i]); 
 } 
 } 
 } catch (AnalyzerException ignored) { 
 } 
 mn.accept(next); 
 } 
}
```
注意，死标记未被移除。这是故意的：它实际上没有改变最终代码，但避免删除一个尽管不
可及但可能会在比如 LocalVariableNode 中引用的标记。

#### 基本数据流验证器
BasicVerifier 类扩展 BasicInterpreter 类。它使用的事件集相同，但不同于
BasicInterpreter 的是，它会验证对指令的使用是否正确。例如，它会验证 IADD 指令的操
作数为 INTEGER_VALUE 值（而 BasicInterpreter 只是返回结果，即 INTEGER_VALUE）。
这个类可在开发类生成器或适配器时进行调试。例如，这个类可以检测出
ISTORE 1 ALOAD 1 序列是无效的。它可以包含在像下面这样一个实用工具适配器中（在实践
中，使用 CheckMethodAdapter 类要更简单一些，可以将其配置为使用 BasicVerifier）：
```java
public class BasicVerifierAdapter extends MethodVisitor { 
 String owner; 
 MethodVisitor next; 
 public BasicVerifierAdapter(String owner, int access, String name, 
 String desc, MethodVisitor mv) { 
 super(ASM4, new MethodNode(access, name, desc, null, null)); 
 this.owner = owner; 
 next = mv; 
 } 
 @Override public void visitEnd() {
     MethodNode mn = (MethodNode) mv; 
 Analyzer<BasicValue> a = 
 new Analyzer<BasicValue(new BasicVerifier()); 
 try { 
 a.analyze(owner, mn); 
 } catch (AnalyzerException e) { 
 throw new RuntimeException(e.getMessage()); 
 } 
 mn.accept(next); 
 } 
}
```

#### 简单的数据流验证器
SimpleVerifier 类扩展了 BasicVerifier 类。它使用更多的集合来模拟字节代码指令
的执行：事实上，每个类都由它自己的集合表示，这个集合表示了这个类的所有可能对象。因此，
它可以检测出更多的错误，比如如下情况：一个对象的可能值为“所有 Thread 类型的对象”，
却对这个对象调用在 String 类中定义的方法。

这个类使用 Java 反射 API，以执行与类层次结构有关的验证和计算。然后，它将一个方法
引用的类加载到 JVM 中。这一默认行为可以通过重写这个类的受保护方法来改变。

和 BasicVerifier 一样，这个类也可以在开发类生成器或适配器时使用，以便更轻松地
找出 Bug。但它也可以用于其他目的。下面这个转换就是一个例子，它会删除方法中不必要的类
型转换：如果这个分析器发现 CHECKCAST to 指令的操作数是“所有 from 类型的对象”值集，
如果 to 是 from 的一个超类，那 CHECKCAST 指令就是不必要的，可以删除。这个转换的实现
如下：
```java
public class RemoveUnusedCastTransformer extends MethodTransformer { 
 String owner; 
 public RemoveUnusedCastTransformer(String owner, 
 MethodTransformer mt) { 
 super(mt); 
 this.owner = owner; 
 } 
 @Override public MethodNode transform(MethodNode mn) { 
 Analyzer<BasicValue> a = 
 new Analyzer<BasicValue>(new SimpleVerifier()); 
 try { 
 a.analyze(owner, mn); 
 Frame<BasicValue>[] frames = a.getFrames(); 
 AbstractInsnNode[] insns = mn.instructions.toArray(); 
 for (int i = 0; i < insns.length; ++i) { 
 AbstractInsnNode insn = insns[i]; 
 if (insn.getOpcode() == CHECKCAST) { 
 Frame f = frames[i]; 
 if (f != null && f.getStackSize() > 0) { 
 Object operand = f.getStack(f.getStackSize() - 1); 
 Class<?> to = getClass(((TypeInsnNode) insn).desc); 
 Class<?> from = getClass(((BasicValue) operand).getType()); 
 if (to.isAssignableFrom(from)) { 
 mn.instructions.remove(insn); 
 } 
 } 
 } 
 } 
 } catch (AnalyzerException ignored) { 
 } 
 return mt == null ? mn : mt.transform(mn); 
 } 
 private static Class<?> getClass(String desc) { 
 try { 
 return Class.forName(desc.replace(’/’, ’.’)); 
 } catch (ClassNotFoundException e) { 
 throw new RuntimeException(e.toString()); 
 } 
 } 
 private static Class<?> getClass(Type t) { 
 if (t.getSort() == Type.OBJECT) { 
 return getClass(t.getInternalName()); 
 } 
 return getClass(t.getDescriptor()); 
 } 
}
```
但对于 Java 6 类（或者用 COMPUTE_FRAMES 升级到 Java 6 的类），用 AnalyzerAdapter
以核心 API 来完成这一任务要更简单一些，效率要高得多：
```java
public class RemoveUnusedCastAdapter extends MethodVisitor { 
 public AnalyzerAdapter aa; 
 public RemoveUnusedCastAdapter(MethodVisitor mv) { 
 super(ASM4, mv); 
 } 
 @Override public void visitTypeInsn(int opcode, String desc) { 
 if (opcode == CHECKCAST) { 
 Class<?> to = getClass(desc); 
 if (aa.stack != null && aa.stack.size() > 0) { 
 Object operand = aa.stack.get(aa.stack.size() - 1); 
 if (operand instanceof String) { 
 Class<?> from = getClass((String) operand); 
 if (to.isAssignableFrom(from)) { 
 return; 
 } 
 } 
 } 
 } 
 mv.visitTypeInsn(opcode, desc); 
 } 
 private static Class getClass(String desc) { 
 try { 
 return Class.forName(desc.replace(’/’, ’.’)); 
 } catch (ClassNotFoundException e) { 
 throw new RuntimeException(e.toString()); 
 } 
 } 
}
```
#### 用户定义的数据流分析
假定我们希望检测出一些字段访问和方法调用的对象可能是 null，比如在下面的源代码段
中（其中，第一行防止一些编译器检测 Bug，否则它可能会被认作一个“o 可能尚未初始化”错
误）：
```java
Object o = null; 
while (...) { 
o = ...; 
} 
o.m(...); // 潜在的 NullPointerException！
```
于是我们需要一个数据流分析，它能告诉我们，在对应于最后一行的 INVOKEVIRTUAL 指
令处，与 o 对应的底部栈值可能为 null。为此，我们需要为引用值区分三个集合：包含 null
值的 NULL 集，包含所有非 null 引用值的 NONNULL 集，以及包含所有引用值的 MAYBENULL
集。于是，我们只需要考虑 ACONST_NULL 将 NULL 集压入操作数栈，而所有其他在栈中压入引
用值的指令将压入 NONNULL 集（换句话说，我们考虑任意字段访问或方法调用的结果都不是
null，如果不对程序的所有类进行全局分析，那就不可能得到更好的结果）。为表示 NULL 和
NONNULL 集的并集，MAYBENULL 集合是必需的。

上述规则必须在一个自定义的 Interpreter 子类中实现。完全可以从头实现它，但也可
以通过扩展 BasicInterpreter 类来实现它，而且这种做法要容易得多。事实上，如果我们
考虑 BasicValue.REFERENCE_VALUE 对应于 NONNULL 集，那只需重写模拟 ACONST_NULL
执行的方法，使它返回 NULL，还有计算并集的方法：
```java
class IsNullInterpreter extends BasicInterpreter { 
 public final static BasicValue NULL = new BasicValue(null); 
 public final static BasicValue MAYBENULL = new BasicValue(null); 
 public IsNullInterpreter() { 
 super(ASM4); 
 } 
 @Override public BasicValue newOperation(AbstractInsnNode insn) { 
 if (insn.getOpcode() == ACONST_NULL) { 
 return NULL; 
 } 
 return super.newOperation(insn); 
 } 
 @Override public BasicValue merge(BasicValue v, BasicValue w) { 
 if (isRef(v) && isRef(w) && v != w) { 
 return MAYBENULL; 
 } 
 return super.merge(v, w); 
 } 
 private boolean isRef(Value v) { 
 return v == REFERENCE_VALUE || v == NULL || v == MAYBENULL; 
 } 
}
```
于是，可以很容易地利用这个 IsNullnterpreter 来检测那些可能导致潜在 null 指针异
常的指令：
```java
public class NullDereferenceAnalyzer { 
 public List<AbstractInsnNode> findNullDereferences(String owner, 
 MethodNode mn) throws AnalyzerException { 
 List<AbstractInsnNode> result = new ArrayList<AbstractInsnNode>(); 
 Analyzer<BasicValue> a = 
 new Analyzer<BasicValue>(new IsNullInterpreter()); 
 a.analyze(owner, mn); 
 Frame<BasicValue>[] frames = a.getFrames(); 
 AbstractInsnNode[] insns = mn.instructions.toArray(); 
 for (int i = 0; i < insns.length; ++i) { 
 AbstractInsnNode insn = insns[i]; 
 if (frames[i] != null) {
    Value v = getTarget(insn, frames[i]); 
 if (v == NULL || v == MAYBENULL) { 
 result.add(insn); 
 } 
 } 
 } 
 return result; 
 }

 private static BasicValue getTarget(AbstractInsnNode insn, 
 Frame<BasicValue> f) { 
 switch (insn.getOpcode()) { 
 case GETFIELD: 
 case ARRAYLENGTH: 
 case MONITORENTER: 
 case MONITOREXIT: 
 return getStackValue(f, 0); 
 case PUTFIELD: 
 return getStackValue(f, 1); 
 case INVOKEVIRTUAL: 
 case INVOKESPECIAL: 
 case INVOKEINTERFACE: 
 String desc = ((MethodInsnNode) insn).desc; 
 return getStackValue(f, Type.getArgumentTypes(desc).length); 
 } 
 return null; 
 } 
 private static BasicValue getStackValue(Frame<BasicValue> f, 
 int index) { 
 int top = f.getStackSize() - 1; 
 return index <= top ? f.getStack(top - index) : null; 
 } 
}
```
findNullDereferences 方法用一个 IsNullInterpreter 分析给定方法节点。然后，
对于每条指令，检测其引用操作数（如果有的话）的可能值集是不是 NULL 集或 NONNULL 集。
若是，则这条指令可能导致一个 null 指针异常，将它添加到此类指令的列表中，该列表由这一
方法返回。
getTarget 方法在帧 f 中返回与 insn 对象操作数相对应的 Value，如果 insn 没有对象
操作数，则返回 null。它的主要任务就是计算这个值相对于操作数栈顶端的偏移量，这一数量
取决于指令类型。

#### 控制流分析
控制流分析可以有许多应用。一个简单的例子就是计算方法的“圆复杂度”。这一度量定义
为控制流图的边数减去节点数，再加上 2。

用于计算这一度量的算法可以用 ASM 分析框架来实现（还有仅基于核心 API 的更高效方法，
只是它们需要编写更多的代码）。第一步是构建控制流图。可以通过
重写 Analyzer 类的 newControlFlowEdge 方法来构建。这个类将节点表示为 Frame 对象。
如果希望将这个图存储在这些对象中，则需要扩展 Frame 类：
```java
class Node<V extends Value> extends Frame<V> { 
 Set< Node<V> > successors = new HashSet< Node<V> >(); 
 public Node(int nLocals, int nStack) { 
 super(nLocals, nStack); 
 } 
 public Node(Frame<? extends V> src) { 
 super(src); 
 } 
}
```
随后，可以ᨀ供一个 Analyzer 子类，用来构建控制流图，并用它的结果来计算边数、节
点数，最终计算出圈复杂度：
```java
public class CyclomaticComplexity { 
 public int getCyclomaticComplexity(String owner, MethodNode mn) 
 throws AnalyzerException { 
 Analyzer<BasicValue> a = 
 new Analyzer<BasicValue>(new BasicInterpreter()) { 
 protected Frame<BasicValue> newFrame(int nLocals, int nStack) { 
 return new Node<BasicValue>(nLocals, nStack); 
 } 
 protected Frame<BasicValue> newFrame( 
 Frame<? extends BasicValue> src) { 
 return new Node<BasicValue>(src); 
 } 
 protected void newControlFlowEdge(int src, int dst) { 
 Node<BasicValue> s = (Node<BasicValue>) getFrames()[src]; 
 s.successors.add((Node<BasicValue>) getFrames()[dst]); 
 } 
 }; 
 a.analyze(owner, mn); 
 Frame<BasicValue>[] frames = a.getFrames(); 
 int edges = 0; 
 int nodes = 0; 
 for (int i = 0; i < frames.length; ++i) { 
 if (frames[i] != null) { 
 edges += ((Node<BasicValue>) frames[i]).successors.size(); 
 nodes += 1; 
 } 
 } 
 return edges - nodes + 2; 
 } 
}
```

## 元数据

### 泛型
Tree API 没有ᨀ供对泛型的任何支持！事实上，它用签名表示泛型，这一点与核心 API 中一
样，但却没有ᨀ供与 SignatureVisitor 对应的 SignatureNode 类，尽管这也是可能的（事
实上，至少使用几个 Node 类来区分类型、方法和类签名会很方便）。

### 注释
注释的树 API 都基于 AnnotationNode 类，它的公共 API 如下：
```java
public class AnnotationNode extends AnnotationVisitor { 
 public String desc; 
 public List<Object> values; 
 public AnnotationNode(String desc); 
 public AnnotationNode(int api, String desc); 
 ... // AnnotationVisitor 接口的方法
 public void accept(AnnotationVisitor av); 
}
```
desc 字段包含了注释类型，而 values 字段包含了名称/值对，其中每个名字后面都跟有相
关联的值（值的表示在 Javadoc 中描述）

可以看出，AnnotationNode 类扩展了 AnnotationVisitor 类，还ᨀ供了一个 accept
方法，它以一个这种类型的对象为参数，比如具有这个类和方法访问器类的 ClassNod 和
MethodNode 类。我们前面已经看到用于类和方法的模式也可用于合成处理注释的核心与树 API
组件。例如，对于基于继承的模式，可进行“匿名内部类”的变体，使其适用于注
释，给出如下：
```java
public AnnotationVisitor visitAnnotation(String desc, boolean visible) { 
 return new AnnotationNode(ASM4, desc) { 
 @Override public void visitEnd() { 
 // 将注释转换代码放在这里
 accept(cv.visitAnnotation(desc, visible)); 
 } 
 };
}
```

### 调试
作为被编译类来源的源文件存储在 ClassNode 中的 sourceFile 字段中。关于源代码行
号的信息存储在 LineNumberNode 对象中，它的类继承自 AbstractInsnNode。在核心 API
中，关于行号的信息是与指令同时受访问的，与此类似，LineNumberNode 对象是指令列表的
一部分。最后，源局部变量的名字和类型存储在 MethodNode 的 localVariables 字段中，
它是 LocalVariableNode 对象的一个列表。

## 后向兼容
与核心 API 的情景一样，在 ASM 4.0 的树 API 中已经引入了一种新机制，用于确保未来
ASM 版本的后向兼容性。但要再次强调，仅靠 ASM 自身不能保证这一性质。它要求用户在编写
代码时遵循一些简单的规则。

### 规则

首先，如果使用树 API 编写一个类生成器，那就不需要遵循什么规则（和核心 API 一样）。
可以用任意构造器创建 ClassNode 和其他元素，可以使用这些类的任意方法。

另一方面，如果要用树 API 编写类分析器或类适配器，也就是说，如果使用 ClassNode
或其他直接或间接地通过 ClassReader.accept()填充的类似类，或者如果重写这些类中的
一个，则必须遵循下面给出的规则。

#### 基本规则

1. 创建类节点

考虑这样一种情景，我们创建一个 ClassNode，通过一个 ClassReader 填充它，然后分
析或转换它，最终根据需要用 ClassWriter 写出结果（这一讨论及相关规则同样适用于其他
节点类）。在这种情况下，仅有一条规则：
```
规则 3：要用 ASM 版本 X 的树 API 编写类分析器或适配器，则使用以这一确切版本为参数
的构造器创建 ClassNode（而不是使用没有参数的默认构造器）。
```
本规则的目的是在通过一个 ClassReader 填充 ClassNode 时，如果遇到未知特性，则抛
出一个错误（根据后向兼容性约定的定义）。如果不遵循这一规则，在以后遇到未知元素时，你
的分析或转换代码可能会失败，也许能够成功运行，但却因为没有忽略这些未知元素而给出错误
结果。换言之，如果不遵循这一规则，可能无法保证约定的最后一项条款。

如何做到呢？ASM 4.0 内部对 ClassNode 的实现如下
```java
public class ClassNode extends ClassVisitor { 
 public ClassNode() { 
 super(ASM4, null); 
 } 
 public ClassNode(int api) { 
 super(api, null); 
 } 
 ... 
 public void visitSource(String source, String debug) { 
 // 将 source 和 debug 存储在局部字段中... 
 } 
}
```
 ASM 5.0 中，这一代码变为：
 ```java
 public class ClassNode extends ClassVisitor { 
 ... 
 public void visitSource(String source, String debug) { 
 if (api < ASM5) { 
 // 将 source 和 debug 存储在局部字段中... 
 } else { 
 visitSource(null, source, debug); 
 } 
 } 
 public void visitSource(Sring author, String source, String debug) { 
 if (api < ASM5) { 
 if (author == null) 
 visitSource(source, debug); 
 else 
 throw new RuntimeException(); 
 } else { 
 // 将 author、source 和 debug 存储在局部字段中... 
 } 
 } 
 public void visitLicense(String license) { 
 if (api < ASM5) throw new RuntimeException(); 
 // 将 license 存储在局部字段中
 } 
}
 ```
 如果使用 ASM 4.0，那创建 ClassNode(ASM4)没有什么特别之处。但如果升级到 ASM
5.0，但不修改代码，那就会得到一个 ClassNode 5.0，它的 api 字段将为 ASM4 < ASM5。于
是容易看出，如果输入类包含一个非 null 作者或许可属性，那通过 ClassReader 填充
ClassNode 时将会失败，如约定中的定义。如果还升级你的代码，将 api 字段改为 ASM5，并
升级剩余代码，将这些新属性考虑在内，那在填充代码时就不会抛出错误。

注意，ClassNode 5.0 代码非常类似于 ClassVisitor 5.0 代码。这是为了确保在定义
ClassNode 的子类时能够拥有正确的语义


2. 使用现有类代码
如果你的类分析器或适配器收到别人创建的 ClassNode，那你就不能肯定在创建它时传送
给其构造器的 ASM 版本。当然可以自行检查 api 字段，但如果发现这个版本高于你支持的版本，
直接拒绝这个类可能太过保守了。事实上，这个类中可能没有包含任何未知特性。另一方面，你
不能检查是否存在未知特性（在我们的示例情景中，在为 ASM 4.0 编写代码时，你如何判断你
的 ClassNode 中不存在未知的 license 字段呢？因为你在这里还不知道未来会添加这样一个
字段）。于是设计了 ClassNode.check()方法来解决这个问题。这就引出了以下规则：
```
规则 4：要用 ASM 版本 X 的树 API 编写一个类分析器或适配器，使用别人创建的
ClassNode，在以任何方式使用这个 ClassNode 之前，都要以这个确切版本号为参数，调用
它的 check()方法。
```
其目的与规则 3 相同：如果不遵循这一规则，可能无法保证约定的最后一项条款。如何做到
的呢？这个检查方法在 ASM 4.0 内部的实现如下：
```java
public class ClassNode extends ClassVisitor { 
 ... 
 public void check(int api) { 
 // 不做任何事
 } 
}
```
在 ASM 5.0 中，这一代码变为：
```java
public class ClassNode extends ClassVisitor { 
 ... 
 public void check(int api) { 
 if (api < ASM5 && (author != null || license != null)) { 
 throw new RuntimeException(); 
 } 
 } 
}
```
如果你的代码是为 ASM 4.0 编写的，而且如果得到一个 ClassNode 4.0，它的 api 字段
将为 ASM4，这样不会有问题，check 也不做任何事情。但如果你得到一个 ClassNode 5.0，如
果这个节点实际上包含了非 null author 或 license，也就是说，它包含了 ASM 4.0 中未知
的新特性，那 check(ASM4)方法将会失败。

> 注意：如果你自己创建 ClassNode，也可以使用这一规则。那就不需要遵循规则 3，也就是说，不需要在
ClassNode 构造器中指明 ASM 版本。这一检查将在 check 方法中进行（但在填充 ClassNode 时，这
种做法的效率要低于在之前进行检查）。

#### 继承规则
如果希望ᨀ供 ClassNode 的子类或者其他类似节点类，那么规则 1 和 2 都是适用的。注意，
在一个 MethodNode 匿名子类的一个常用特例中，visitEnd()方法被重写：
```java
class MyClassVisitor extends ClassVisitor { 
 ... 
 public MethodVisitor visitMethod(...) { 
 final MethodVisitor mv = super.visitMethod(...);
 if (mv != null) { 
 return new MethodNode(ASM4) { 
 public void visitEnd() { 
 // perform a transformation 
 accept(mv); 
 } 
 } 
 } 
 return mv; 
 } 
}
```
那就自动适用规则 2（匿名类不能被重写，尽管没有明确将它声明为 final 的）。你只需要遵循
规则 3，也就是说，在 MehtodNode 构造器中指定 ASM 版本（或者遵循规则 4，也就是在执行
转换之前调用 check(ASM4)）。

#### 其他包
asm.util 和 asm.commons 中的类都有两个构造函数变体：一个有 ASM 版本参数，一个
没有。

如果只是希望像 asm.util 中的 ASMifier、Textifier 或 CheckXxx Adapter 类或者
asm.commons 包中的任意类一样，加以实例化和应用，那可以用没有 ASM 版本参数的构造器
来实例化它们。也可以使用带有 ASM 版本参数的构造器，那就会不必要地将这些组件限制于特
定的 ASM 版本（而使用无参数构造器相当于在说“使用最新的 ASM 版本”）。这就是为什么使
用 ASM 版本参数的构造器被声明为 protected。

另一方面，如果希望重写 asm.util 中的 ASMifier、Textifier 或 CheckXxx Adapter
类或者 asm.commons 包中的任意类，那适用规则 1 和 2。具体来说，你的构造器必须以你希望
用作参数的 ASM 版本来调用 super(…)

最后，如果希望使用或重写 asm.tree.analysis 中的 Interpreter 类或其子类，必须
做出同样的区分。还要注意，在使用这个分析包之前，创建一个 MethodNode 或者从别人那里
获取一个，那在将这一代码传送给 Analyzer 之前必须使用规则 3 和 4。