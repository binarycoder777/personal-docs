---
title: Docker源码分析 (容器技术系列)
layout: page
---

<div class="book-info">
  <div class="book-cover">
    <img src="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250223160554.png" alt="Docker源码分析 (容器技术系列)">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>Docker源码分析 (容器技术系列)</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/Docker%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90%20(%E5%AE%B9%E5%99%A8%E6%8A%80%E6%9C%AF%E7%B3%BB%E5%88%97)%20(%E5%AD%99%E5%AE%8F%E4%BA%AE).mobi" class="read-link">阅读</a>
    </div>
    <div class="author-info">
      <h2>作者信息</h2>
      <p><strong>作者</strong>: 孙宏亮</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>本书以Docker 1.13版本源码为基础，深入剖析了Docker的架构设计和实现原理。全书共分为十章，首先介绍了Docker的基础知识和核心概念，然后详细分析了Docker daemon的启动流程、Docker Client的命令处理机制、容器创建与运行原理、镜像构建过程等核心功能的源码实现。书中还深入探讨了Docker网络模型、存储机制、安全特性等关键技术，并对Docker的插件化架构和扩展机制进行了全面讲解。通过阅读本书，读者可以深入理解Docker的内部工作机制，掌握容器技术的核心原理，对于从事容器化应用开发和运维的技术人员具有重要的参考价值。</p>
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
