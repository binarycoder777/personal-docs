---
title: Effective Java
layout: page
---
<div class="book-info">
  <div class="book-cover">
    <img src="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250225091004.png" alt="Effective Java">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>Effective Java</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/Effective%20Java%E4%B8%AD%E6%96%87%E7%89%88%EF%BC%88%E5%8E%9F%E4%B9%A6%E7%AC%AC3%E7%89%88%EF%BC%89%20(Joshua%20Bloch%2C%20%E4%BF%9E%E9%BB%8E%E6%95%8F)%20(Z-Library).pdf" class="read-link">阅读</a>
    </div>
    <div class="author-info">
      <h2>作者信息</h2>
      <p><strong>作者</strong>: Joshua Bloch, 俞黎敏</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>本书一共包含90个条目，每个条目讨论Java程序设计中的一条规则。这些规则反映了最有经验的优秀程序员在实践中常用的一些有益的做法。</p>
        <p>全书以一种比较松散的方式将这些条目组织成11章，每一章都涉及软件设计的一个主要方面。因此，本书并不一定需要按部就班地从头读到尾，因为每个条目都有一定程度的独立性。这些条目相互之间经常交叉引用，因此可以很容易地在书中找到自己需要的内容。</p>
        <p>本书的目标是帮助读者更加有效地使用Java编程语言及其基本类库：java.lang、java.util和java.io，以及子包，如java.util.concurrent和java.util.function。本书时不时地也会讨论其他的类库。</p>
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
