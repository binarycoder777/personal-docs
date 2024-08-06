import fs from 'node:fs';
import path from 'node:path';


// 月份名称到数字的映射
const monthMap = {
  '1月': 1,
  '2月': 2,
  '3月': 3,
  '4月': 4,
  '5月': 5,
  '6月': 6,
  '7月': 7,
  '8月': 8,
  '9月': 9,
  '10月': 10,
  '11月': 11,
  '12月': 12,
};

// const fs = require('fs');
// const path = require('path');
/**
 * 获取指定目录下的所有 Markdown 文件，并根据文件名生成侧边栏配置。
 * @param {string} dirPath - 目录路径
 * @param {string} baseDir - 基础目录名称，用于生成相对路径
 * @returns {Array} 侧边栏项目列表
 */
function getSidebarItems(dirPath, baseDir = '',deep = 0) {
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
        items: getSidebarItems(fullPath, path.join(baseDir, file),deep+1),
      });
    } else if (file.endsWith('.md') && !file.startsWith("index")) {
      const name = path.basename(file, '.md');
      const item = {
        text: name,
        link: `/docs/article/${path.join(baseDir, name)}`,
      };
      sidebarItems.push(item);
    }
    if(deep == 1) {
      sidebarItems.sort((a, b) => {
        const aOrder = monthMap[a.text] || Infinity;
        const bOrder = monthMap[b.text] || Infinity;
        return aOrder - bOrder;
      });
    }
  });
  return sidebarItems;
}

const docsDir = path.resolve(__dirname, 'docs/article');

const sidebar_article = getSidebarItems(docsDir);

// console.log(JSON.stringify(sidebar_article, null, 2));


module.exports = sidebar_article;
