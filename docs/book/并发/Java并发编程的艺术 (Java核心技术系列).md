---
title: Java并发编程的艺术
layout: page
---
<div class="book-info">
  <div class="book-cover">
    <img src="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250301163655.png" alt="Java并发编程的艺术">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>Java并发编程的艺术</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E7%9A%84%E8%89%BA%E6%9C%AF%20(Java%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E7%B3%BB%E5%88%97)%20(%E6%96%B9%E8%85%BE%E9%A3%9E%2C%E9%AD%8F%E9%B9%8F%2C%E7%A8%8B%E6%99%93%E6%98%8E%20%E8%91%97)%20.azw3" class="read-link">阅读</a>
    </div>
    <div class="author-info">s
      <h2>作者信息</h2>
      <p><strong>作者</strong>: 方腾飞, 魏鹏, 程晓明 著</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>《Java并发编程的艺术》是一本深入探讨Java并发编程的技术书籍。本书从并发编程的底层原理到实践应用，全面介绍了Java并发编程的核心概念、原理与实践。书中详细讲解了Java内存模型、synchronized的实现原理、volatile的内存语义、原子操作的实现原理、CAS、AQS、线程池等核心技术。</p>
        <p>作者结合多年的技术研发经验，通过大量的案例分析和源码解读，帮助读者深入理解Java并发编程的底层实现原理。书中不仅介绍了并发编程中的各种核心技术，还总结了大量的并发编程最佳实践，是一本非常实用的Java并发编程指南。对于想要提升并发编程能力的Java开发者来说，这是一本不可多得的学习资料。</p>
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
