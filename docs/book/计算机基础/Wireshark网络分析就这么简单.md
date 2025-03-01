---
title: Wireshark网络分析就这么简单
layout: page
---
<div class="book-info">
  <div class="book-cover">
    <img src="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20250220083753.png" alt="Wireshark网络分析就这么简单">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>Wireshark网络分析就这么简单</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/Wireshark%E7%BD%91%E7%BB%9C%E5%88%86%E6%9E%90%E5%B0%B1%E8%BF%99%E4%B9%88%E7%AE%80%E5%8D%95%20(%E6%9E%97%E6%B2%9B%E6%BB%A1)%20.pdf" class="read-link">阅读</a>
    </div>
    <div class="author-info">
      <h2>作者信息</h2>
      <p><strong>作者</strong>: 林沛满</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>本书详细介绍了使用 Wireshark 进行网络分析的方法和技巧。Wireshark 是世界上最广泛使用的网络协议分析器，它可以让你看到网络上发生的一切。</p>
        <p>书中从 Wireshark 的基础知识开始，包括软件的安装和使用方法，然后深入讲解了各种网络协议的分析方法，包括 TCP/IP、HTTP、DNS 等常见协议。通过大量的实际案例和详细的操作步骤，读者可以快速掌握使用 Wireshark 进行网络故障排查、安全分析和性能优化的技能。</p>
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
