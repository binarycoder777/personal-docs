import fs from 'node:fs';
import path from 'node:path';

const sortRules = {
    '系统设计': 1,
    'Java字节码编程': 2,
    'ElasticSearch系列': 3,
    'Go语言系列':4,
    '服务器':5,
    '数据库':6,
    'MQ':7,
    'RPC':8,
    '网络编程':9,
    'Java虚拟机':10,
    '云原生':11,
    'Java JNI':12,
    '并发':13,
    '框架':14,
    '其他':15
    // 可以根据需要添加更多分类
};

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

    if (stat.isDirectory()) {
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
        link: `/docs/book/${path.join(baseDir, name)}`,
      };
      sidebarItems.push(item);
    }
  });
  // 对二级目录进行排序
// 使用 sortRules 对 sidebarItems 进行排序
sidebarItems.sort((a, b) => {
    const aOrder = sortRules[a.text] || Infinity;
    const bOrder = sortRules[b.text] || Infinity;
    return aOrder - bOrder;
  });
  return sidebarItems;
}

const docsDir = path.resolve(__dirname, 'docs/book');

const sidebar_book = getSidebarItems(docsDir);

// console.log(JSON.stringify(sidebar_book, null, 2));


module.exports = sidebar_book;
