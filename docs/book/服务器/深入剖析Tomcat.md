---
title: 深入剖析 Tomcat
layout: page
---
<div class="book-info">
  <div class="book-cover">
    <img src="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250219210233.png" alt="深入剖析Tomcat">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>深入剖析 Tomcat</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/%E6%B7%B1%E5%85%A5%E5%89%96%E6%9E%90Tomcat%20(Budi%20Kurniawan%20%20Paul%20Deck%20%E8%AF%91%E8%80%85%20%E6%9B%B9%E6%97%AD%E4%B8%9C)%20(Z-Library).pdf" class="read-link">阅读</a>
    </div>
    <div class="author-info">
      <h2>作者信息</h2>
      <p><strong>作者</strong>: Budi Kurniawan / Paul Deok</p>
      <p><strong>译者</strong>: 曹旭东</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>本书深入剖析 Tomcat 4 和 Tomcat 5 中的每个组件，并揭示其内部工作原理。通过学习本书，你将可以自行开发 Tomcat 组件，或者扩展已有的组件。</p>
        <p>Tomcat 是目前比较流行的 Web 服务器之一。作为一个开源和小型的轻量级应用服务器，Tomcat 易于使用，便于部署，但 Tomcat 本身是一个非常复杂的系统，包含了很多功能模块。这些功能模块构成了 Tomcat 的核心结构。本书从最基本的 HTTP 请求开始，直至使用 JMX 技术管理 Tomcat 中的应用程序，逐一剖析 Tomcat 的基本功能模块，并配以示例代码，使读者可以逐步实现自己的 Web 服务器。</p>
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