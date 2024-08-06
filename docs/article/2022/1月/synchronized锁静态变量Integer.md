---

title: synchronized锁静态变量Integer
author: John Doe
tags:
  - synchronized
categories:
  - juc
date: 2022-01-25 10:18:00
---
当我尝试用synchronized去锁一个Integer的静态变量时，在多线程下发生了线程不安全问题，原因是synchronized锁住的Integer静态变量在不断发生变化，即i++会不断创建新的Integer，然后致使多线程下锁的不是一个对象，锁无效（以下代码在-128~127之间是有效的，因为存在Integer缓存问题）。

    public class Main {
        private static Integer i = 0;
        public static void main(String[] args) throws InterruptedException {
            List<Thread> list = new ArrayList<>();
            for (int j = 0; j < 2; j++) {
                Thread thread = new Thread(() -> {
                    for (int k = 0; k < 127; k++) {
                        synchronized (i) {
                            i++;
                        }
                    }
                }, "" + j);
                list.add(thread);
            }
            list.stream().forEach(t -> t.start());
            list.stream().forEach(t -> {
                try {
                    t.join();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
            System.out.println(i);
        }
    }