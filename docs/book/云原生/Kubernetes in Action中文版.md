---
title: Kubernetes in Action中文版
layout: page
---
<div class="book-info">
  <div class="book-cover">
    <img src="https://github.com/binarycoder777/personal-pic/blob/main/pic/Xnip2025-02-21_08-54-37.jpg?raw=true" alt="Kubernetes in Action中文版">
  </div>
  <div class="book-details">
    <div class="book-title">
      <h1>Kubernetes in Action中文版</h1>
      <a href="https://github.com/binarycoder777/perosonal-book/blob/main/book/Kubernetes%20in%20Action%E4%B8%AD%E6%96%87%E7%89%88%EF%BC%88%E5%8D%9A%E6%96%87%E8%A7%86%E7%82%B9%E5%9B%BE%E4%B9%A6%EF%BC%89%20(%E4%B8%83%E7%89%9B%E5%AE%B9%E5%99%A8%E4%BA%91%E5%9B%A2%E9%98%9F)%20(Z-Library).pdf.zip" class="read-link">阅读</a>
    </div>
    <div class="author-info">
      <h2>作者信息</h2>
      <p><strong>作者</strong>: 七牛容器云团队 译</p>
    </div>
    <div class="book-intro">
      <h2>内容简介</h2>
      <div class="intro-content">
        <p>本书主要讲解如何在 Kubernetes 中部署分布式容器应用。本书开始部分概要介绍了 Docker 和Kubernetes 的由来和发展，然后通过在 Kubernetes 中部署一个应用程序，一点点增加功能，逐步加深我们对于Kubernetes架构的理解和操作的实践。在本书的后面部分，也可以学习一些高阶的主题，比如监控、调试及伸缩。Kubernetes是希腊文，意思是“舵手”，带领我们安全地到达未知水域。Kubernetes这样的容器编排系统，会帮助我们妥善地管理分布式应用的部署结构和线上流量，高效地组织容器和服务。Kubernetes 作为数据中心操作系统，在设计软件系统时，能够尽量降低在底层网络和硬件设施上的负担。</p>
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
