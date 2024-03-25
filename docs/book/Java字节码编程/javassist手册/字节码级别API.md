---

---

# 字节码级别API

Javassist还提供了用于直接编辑类文件的低级API。要使用这个级别的API，您需要详细了解Java字节码和类文件格式，而这个级别的API允许您对类文件进行任何类型的修改。

如果您只想生成一个简单的类文件，javassist.bytecode.ClassFileWriter可能会为您提供最好的API。它比javassist.bytecode.ClassFile快得多，尽管它的API是最小的。

## 获取一个ClassFile对象

classfile对象表示一个类文件。要获取该对象，需要调用CtClass中的getClassFile()。否则，您可以直接从类文件构造javassist.bytecode.ClassFile。例如,
```java
BufferedInputStream fin
    = new BufferedInputStream(new FileInputStream("Point.class"));
ClassFile cf = new ClassFile(new DataInputStream(fin));
```
上面面的代码片段从Point.class创建了一个ClassFile对象。ClassFile对象可以被写回一个类文件。ClassFile中的write()将类文件的内容写入给定的DataOutputStream。您可以从头开始创建一个新的类文件。例如,
```java
ClassFile cf = new ClassFile(false, "test.Foo", null);
cf.setInterfaces(new String[] { "java.lang.Cloneable" });
 
FieldInfo f = new FieldInfo(cf.getConstPool(), "width", "I");
f.setAccessFlags(AccessFlag.PUBLIC);
cf.addField(f);

cf.write(new DataOutputStream(new FileOutputStream("Foo.class")));
```
这段代码生成一个类文件Foo.class，其中包含以下类的实现:
```java
package test;
class Foo implements Cloneable {
    public int width;
}
```

## 添加和删除成员
ClassFile提供addField()和addMethod()用于添加字段或方法(注意构造函数在字节码级别被视为方法)。它还提供addAttribute()，用于向类文件添加属性。

注意，FieldInfo、MethodInfo和AttributeInfo对象包括一个ConstPool(常量池表)对象的链接。ConstPool对象必须与ClassFile对象和添加到该ClassFile对象的FieldInfo(或MethodInfo等)对象相同。换句话说，一个FieldInfo(或MethodInfo等)对象不能在不同的ClassFile对象之间共享。

要从ClassFile对象中删除字段或方法，必须首先获得一个包含该类所有字段的java.util.List对象。getFields()和getMethods()返回列表。可以通过调用List对象上的remove()来删除字段或方法。可以用类似的方式删除属性。调用FieldInfo或MethodInfo中的getAttributes()来获取属性列表，并从列表中删除一个属性。

## 遍历方法体
要检查方法体中的每个字节码指令，CodeIterator很有用。要实现此目标，请执行以下操作:
```java
ClassFile cf = ... ;
MethodInfo minfo = cf.getMethod("move");    // we assume move is not overloaded.
CodeAttribute ca = minfo.getCodeAttribute();
CodeIterator i = ca.iterator();
```
CodeIterator对象允许您从头到尾逐个访问每个字节码指令。以下方法是CodeIterator中声明的方法的一部分:
```java
void begin()
Move to the first instruction.
void move(int index)
Move to the instruction specified by the given index.
boolean hasNext()
Returns true if there is more instructions.
int next()
Returns the index of the next instruction.
Note that it does not return the opcode of the next instruction.
int byteAt(int index)
Returns the unsigned 8bit value at the index.
int u16bitAt(int index)
Returns the unsigned 16bit value at the index.
int write(byte[] code, int index)
Writes a byte array at the index.
void insert(int index, byte[] code)
Inserts a byte array at the index. Branch offsets etc. are automatically adjusted.
```
下面的代码片段显示了方法体中包含的所有指令:
```java
CodeIterator ci = ... ;
while (ci.hasNext()) {
    int index = ci.next();
    int op = ci.byteAt(index);
    System.out.println(Mnemonic.OPCODE[op]);
}
```
## 生成字节码序列
字节码对象表示字节码指令序列。它是一个可增长的字节码数组。下面是一个示例代码片段:
```java
ConstPool cp = ...;    // constant pool table
Bytecode b = new Bytecode(cp, 1, 0);
b.addIconst(3);
b.addReturn(CtClass.intType);
CodeAttribute ca = b.toCodeAttribute();
```
这会产生code属性，表示以下序列:
```bash
iconst_3
ireturn
```
您也可以通过在Bytecode中调用get()来获取包含该序列的字节数组。获得的数组可以插入到另一个代码属性中。

虽然Bytecode提供了许多将特定指令添加到序列的方法，但它提供了用于添加8位操作码的addOpcode()和用于添加索引的addIndex()。每个操作码的8位值在操作码接口中定义。

addOpcode()和其他用于添加特定指令的方法自动保持最大堆栈深度，除非控制流不包括分支。这个值可以通过在Bytecode对象上调用getMaxStack()来获得。它也反映在由Bytecode对象构造的CodeAttribute对象上。要重新计算方法体的最大堆栈深度，请调用CodeAttribute中的computeMaxStack()。

字节码可用于构造方法。例如,
```java
ClassFile cf = ...
Bytecode code = new Bytecode(cf.getConstPool());
code.addAload(0);
code.addInvokespecial("java/lang/Object", MethodInfo.nameInit, "()V");
code.addReturn(null);
code.setMaxLocals(1);

MethodInfo minfo = new MethodInfo(cf.getConstPool(), MethodInfo.nameInit, "()V");
minfo.setCodeAttribute(code.toCodeAttribute());
cf.addMethod(minfo);
```
此代码生成默认构造函数并将其添加到cf指定的类中。Bytecode对象首先转换为CodeAttribute对象，然后添加到minfo指定的方法中。该方法最后被添加到类文件cf中。

## Annotations (Meta tags)
注释作为运行时不可见(或可见)注释属性存储在类文件中。这些属性可以从ClassFile、MethodInfo或FieldInfo对象中获得。在这些对象上调用getAttribute(AnnotationsAttribute.invisibleTag)。详细信息请参见javassist.bytecode.AnnotationsAttribute类的javadoc手册和javassist.bytecode.annotation包。

Javassist还允许您通过更高级的API访问注释。如果你想通过CtClass访问注释，调用CtClass或CtBehavior中的getAnnotations()。



