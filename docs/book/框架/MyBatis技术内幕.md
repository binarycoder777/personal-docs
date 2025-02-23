---
title: MyBatis技术内幕
layout: page
---

<div class="book-info">
  <div class="book-cover">
    <img src="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250223160336.png" alt="MyBatis技术内幕">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>MyBatis技术内幕</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/MyBatis%E6%8A%80%E6%9C%AF%E5%86%85%E5%B9%95%20(%E5%BE%90%E9%83%A1%E6%98%8E%20%E7%BC%96%E8%91%97).epub" class="read-link">阅读</a>
    </div>
    <div class="author-info">
      <h2>作者信息</h2>
      <p><strong>作者</strong>: 徐郡明 编著</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>本书以MyBatis 3.4版本源码为基础，针对MyBatis的架构设计和实现细节进行了详细分析，其中穿插介绍了相关的基础知识、设计模式以及笔者的自身思考。本书分为四章内容，从MyBatis快速入门开始，逐步分析了MyBatis的应用场景、整体架构以及核心概念，对MyBatis的基础层、核心层中各个模块的功能和实现细节进行了深入的剖析，最后介绍了以插件方式扩展MyBatis的原理以及与Spring集成的原理。 本书旨在为读者阅读MyBatis源码、扩展MyBatis提供帮助和指导，让读者更加深入的了解MyBatis的运行原理、设计理念。希望本书能够帮助读者全面提升自己的技术能力，让读者在设计系统时可以参考MyBatis的优秀设计。</p>
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
