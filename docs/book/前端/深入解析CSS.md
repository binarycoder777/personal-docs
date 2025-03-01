---
title: 深入解析CSS
layout: page
---

<div class="book-info">
  <div class="book-cover">
    <img src="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250301172436.png" alt="深入解析CSS">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>深入解析CSS</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/%E6%B7%B1%E5%85%A5%E8%A7%A3%E6%9E%90CSS%20(%E5%9F%BA%E6%80%9D%C2%B7%20J%C2%B7%E6%A0%BC%E5%85%B0%E7%89%B9)%20(Z-Library).pdf" class="read-link">阅读</a>
    </div>
    <div class="author-info">
      <h2>作者信息</h2>
      <p><strong>作者</strong>: 基思· J·格兰特</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>CSS入门容易，但精通不易。学习CSS并不是学习一两个小技巧，而是要理解这门语言的方方面面，并知道如何将其搭配使用。不管你是入行不久的新手，还是有一定经验但需要提升CSS技能的开发人员，这本书都能帮助你紧跟CSS发展的步伐。</p>
        <p>本书旨在帮你深度掌握CSS语言，并快速了解CSS的新进展和新特性。书中不仅有讲解透彻的概念介绍，而且还有详细的分步示例，能够帮助你提升Web开发技能，并激发设计灵感，让你成为真正的Web开发高手。</p>
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
