import fs from 'node:fs';
import path from 'node:path';

// const fs = require('fs');
// const path = require('path');
/**
 * 获取指定目录下的所有 Markdown 文件，并根据文件名生成侧边栏配置。
 * @param {string} dirPath - 目录路径
 * @param {string} baseDir - 基础目录名称，用于生成相对路径
 * @returns {Array} 侧边栏项目列表
 */
function getSidebarItems(dirPath, baseDir = '') {
  const files = fs.readdirSync(dirPath);
  const sidebarItems = [];

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !file.startsWith("image")) {
      // 递归获取子目录
      sidebarItems.push({
        text: file,
        collapsed: true,
        items: getSidebarItems(fullPath, path.join(baseDir, file)),
      });
    } else if (file.endsWith('.md') && !file.startsWith("index")) {
      const name = path.basename(file, '.md');
      const item = {
        text: name,
        link: `/docs/article/${path.join(baseDir, name)}`,
      };
      sidebarItems.push(item);
    }
  });

  return sidebarItems;
}

const docsDir = path.resolve(__dirname, 'docs/article');

const sidebar_article = getSidebarItems(docsDir);

// console.log(JSON.stringify(sidebar_article, null, 2));


module.exports = sidebar_article;
