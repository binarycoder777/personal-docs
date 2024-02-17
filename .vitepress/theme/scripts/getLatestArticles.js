// scripts/getLatestArticles.js
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export default async function getLatestArticles() {
  const articlesDir = path.join(__dirname, '../../../docs/article');
  const files = await fs.readdir(articlesDir);

  // 这里假设您的文章都有 frontmatter 并且其中包含 title 和 subtitle
  const articles = await Promise.all(files.map(async file => {
    const fullPath = path.join(articlesDir, file);
    const content = await fs.readFile(fullPath, 'utf-8');
    const { data } = matter(content);
    return {
      title: data.title,
      subtitle: data.subtitle,
      // ...其他数据...
    };
  }));
  console.log(articles)
  // 根据日期或其他标准排序文章，并返回前三篇文章
  return articles.slice(0, 3);
}
