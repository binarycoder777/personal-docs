---
title: Kafka源码解析与实战 (王亮)
layout: page
---
<div class="book-info">
  <div class="book-cover">
    <img src="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250223154416.png" alt="Kafka源码解析与实战 (王亮)">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>Kafka源码解析与实战 (王亮)</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/Kafka%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98%20(%E7%8E%8B%E4%BA%AE).epub" class="read-link">阅读</a>
    </div>
    <div class="author-info">
      <h2>作者信息</h2>
      <p><strong>作者</strong>: 王亮</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>本书深入剖析了Kafka的架构设计与核心实现原理。通过对Kafka的源码分析和实践经验总结，详细讲解了消息队列的基本概念、Kafka的整体架构、核心组件以及各个模块的设计思想和实现细节。</p>
        <p>全书共分为多个章节，涵盖了Kafka的ZooKeeper协调服务、Broker消息存储、Producer消息发送、Consumer消息消费、主题与分区、事务消息、高可用机制、集群部署等重要内容。同时还介绍了Kafka在性能优化、消息可靠性保证、负载均衡等方面的解决方案。本书既适合想要深入了解Kafka内部实现原理的开发者，也适合想要在实际项目中使用Kafka的架构师和技术负责人参考。</p>
      </div>
    </div>
  </div>
</div>

<style>
.book-info {
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
  background-color: var(--vp-c-bg-soft);
  padding: 2rem;
  border-radius: 8px;
}

.book-cover img {
  max-width: 300px;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.book-details {
  flex: 2;
}

.book-details h2 {
  margin-top: 0;
  color: var(--vp-c-text-1);
  font-size: 1.5rem;
  border-bottom: 2px solid var(--vp-c-divider);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.author-info {
  margin-bottom: 2rem;
}

.author-info p {
  margin: 0.5rem 0;
  color: var(--vp-c-text-2);
}

.intro-content {
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.intro-content p {
  margin: 1rem 0;
  text-align: justify;
}

@media (max-width: 768px) {
  .book-info {
    flex-direction: column;
    padding: 1rem;
  }

  .book-cover img {
    max-width: 100%;
  }
}

.book-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.book-title h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 2rem;
}

.read-link {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: var(--vp-c-brand);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.read-link:hover {
  background-color: var(--vp-c-brand-dark);
}
</style>
