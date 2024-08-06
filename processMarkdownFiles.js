const fs = require('fs');
const path = require('path');

// 指定目录路径
const markdownDir = path.resolve(__dirname, 'docs/article/2023/1月'); // 修改为你的目录路径

// 处理文件
function processMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processMarkdownFiles(fullPath); // 递归处理子目录
    } else if (file.endsWith('.md')) {
      processMarkdownFile(fullPath);
    }
  });
}

// 处理单个 Markdown 文件
function processMarkdownFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 添加 '---' 到文件开头
  if (!content.startsWith('---')) {
    content = `---\n\n${content}`;
  }

  // 替换图片路径
  content = content.replace(/\/images\/pasted-[\w-]+\.(png|jpg|jpeg|gif)/g, (match) => {
    return `..${match}`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed: ${filePath}`);
}

// 开始处理
processMarkdownFiles(markdownDir);
