---
title: MySQL技术内幕
layout: page
---
<div class="book-info">
  <div class="book-cover">
    <img src="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250225092156.png" alt="MySQL技术内幕：InnoDB存储引擎">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>MySQL技术内幕：InnoDB存储引擎</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/MySQL%E6%8A%80%E6%9C%AF%E5%86%85%E5%B9%95%EF%BC%9AInnoDB%E5%AD%98%E5%82%A8%E5%BC%95%E6%93%8E(%E7%AC%AC2%E7%89%88)%20(%E6%95%B0%E6%8D%AE%E5%BA%93%E6%8A%80%E6%9C%AF%E4%B8%9B%E4%B9%A6)%20(%E5%A7%9C%E6%89%BF%E5%B0%A7)%20(Z-Library).epub" class="read-link">阅读</a>
    </div>
    <div class="author-info">
      <h2>作者信息</h2>
      <p><strong>作者</strong>: 姜承尧</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>《MySQL技术内幕:InnoDB存储引擎(第2版)》由国内资深MySQL专家亲自执笔，国内外多位数据库专家联袂推荐。作为国内唯一一本关于InnoDB的专著，《MySQL技术内幕:InnoDB存储引擎(第2版)》的第1版广受好评，第2版不仅针对最新的MySQL 5.6对相关内容进行了全面的补充，还根据广大读者的反馈意见对第1版中存在的不足进行了完善，《MySQL技术内幕:InnoDB存储引擎(第2版)》大约重写了50％的内容。《MySQL技术内幕:InnoDB存储引擎(第2版)》从源代码的角度深度解析了InnoDB的体系结构、实现原理、工作机制，并给出了大量最佳实践，能帮助你系统而深入地掌握InnoDB，更重要的是，它能为你设计管理高性能、高可用的数据库系统提供绝佳的指导。</p>
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
