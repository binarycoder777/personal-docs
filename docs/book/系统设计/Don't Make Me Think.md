---
title: Don't Make Me Think
layout: page
---
<div class="book-info">
  <div class="book-cover">
    <img src="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250225085609.png" alt="Don't Make Me Think">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>Don't Make Me Think</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/Dont%20Make%20Me%20Think%20A%20Common%20Sense%20Approach%20to%20Web%20Usability%2C%202nd%20Edition%20(Steve%20Krug)%20.pdf" class="read-link">阅读</a>
    </div>
    <div class="author-info">
      <h2>作者信息</h2>
      <p><strong>作者</strong>: Steve Krug</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>这是一本简单而有趣的读物。写得很好，对网页设计提出了不同的观点。一个必须有与网页设计工作的任何人。</p>
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
