---

title: elementData设置成了transient，那ArrayList是怎么把元素序列化的呢？
author: John Doe
tags:
  - transient
categories:
  - 集合
  - ArrayList
date: 2022-03-05 13:00:00
---
查看writeObject()方法可知，先调用s.defaultWriteObject()方法，再把size写入到流中，再把元素一个一个的写入到流中。

一般地，只要实现了Serializable接口即可自动序列化，writeObject()和readObject()是为了自己控制序列化的方式，这两个方法必须声明为private，在java.io.ObjectStreamClass#getPrivateMethod()方法中通过反射获取到writeObject()这个方法。

在ArrayList的writeObject()方法中先调用了s.defaultWriteObject()方法，这个方法是写入非static非transient的属性，在ArrayList中也就是size属性。同样地，在readObject()方法中先调用了s.defaultReadObject()方法解析出了size属性。

elementData定义为transient的优势，自己根据size序列化真实的元素，而不是根据数组的长度序列化元素，减少了空间占用。

源码如下：
    
    
    private void writeObject(java.io.ObjectOutputStream s)
                    throws java.io.IOException{
                // 防止序列化期间有修改
                int expectedModCount = modCount;
                // 写出非transient非static属性（会写出size属性）
                s.defaultWriteObject();
        
            // 写出元素个数
            s.writeInt(size);
        
            // 依次写出元素
            for (int i=0; i<size; i++) {
                s.writeObject(elementData[i]);
            }
        
            // 如果有修改，抛出异常
            if (modCount != expectedModCount) {
                throw new ConcurrentModificationException();
            }
        }
        
        private void readObject(java.io.ObjectInputStream s)
                throws java.io.IOException, ClassNotFoundException {
            // 声明为空数组
            elementData = EMPTY_ELEMENTDATA;
        
            // 读入非transient非static属性（会读取size属性）
            s.defaultReadObject();
        
            // 读入元素个数，没什么用，只是因为写出的时候写了size属性，读的时候也要按顺序来读
            s.readInt();
        
            if (size > 0) {
                // 计算容量
                int capacity = calculateCapacity(elementData, size);
                SharedSecrets.getJavaOISAccess().checkArray(s, Object[].class, capacity);
                // 检查是否需要扩容
                ensureCapacityInternal(size);
        
                Object[] a = elementData;
                // 依次读取元素到数组中
                for (int i=0; i<size; i++) {
                    a[i] = s.readObject();
                }
            }
        }
        
    