---
title: Vue.js设计与实现
layout: page
---

<div class="book-info">
  <div class="book-cover">
    <img src="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250301172159.png" alt="Vue.js设计与实现">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>Vue.js设计与实现</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/Vue.js%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0%20(%E9%9C%8D%E6%98%A5%E9%98%B3%EF%BC%88HcySunYang))%20(Z-Library).pdf" class="read-link">阅读</a>
    </div>
    <div class="author-info">
      <h2>作者信息</h2>
      <p><strong>作者</strong>: 霍春阳</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>《Vue.js设计与实现》是一本深入解析Vue.js源码的技术书籍，由Vue.js核心团队成员霍春阳撰写。本书详细介绍了Vue.js 3的实现原理，包括响应系统、渲染器、组件化、编译器等核心概念的设计思想和实现方式。</p>
        <p>本书分为多个部分，首先介绍了框架设计的核心要素，包括权衡取舍、框架的产出以及框架的特性；其次深入讲解了响应系统的实现原理，从最简单的响应式数据实现开始，循序渐进地介绍了Vue.js 3响应系统的设计与实现；然后详细阐述了渲染器的实现原理，包括挂载、更新、卸载等基本操作的实现方式；最后介绍了编译器的实现原理，包括解析器、转换器和生成器等核心概念。</p>
        <p>无论你是Vue.js开发者、前端工程师，还是对框架设计感兴趣的程序员，都能从本书中学习到Vue.js的设计思想和实现原理，提升框架设计能力和源码阅读能力。</p>
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
