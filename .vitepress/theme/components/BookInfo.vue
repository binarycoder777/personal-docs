<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div class="book-info">
    <div class="book-cover">
      <img :src="frontmatter.cover" :alt="frontmatter.bookTitle || frontmatter.title">
    </div>
    <div class="book-details">
      <div class="book-title">
        <h1>{{ frontmatter.bookTitle || frontmatter.title }}</h1>
        <a :href="frontmatter.readLink" class="read-link">阅读</a>
      </div>
      <div class="author-info">
        <h2>作者信息</h2>
        <p><strong>作者</strong>: {{ frontmatter.author || '佚名' }}</p>
      </div>
      <div class="book-intro">
        <h2>内容简介</h2>
        <div class="intro-content">
          <p v-for="paragraph in String(frontmatter.intro || '').split(/\n+/)" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

@media (max-width: 768px) {
  .book-info {
    flex-direction: column;
    padding: 1rem;
  }

  .book-cover img {
    max-width: 100%;
  }
}
</style>
