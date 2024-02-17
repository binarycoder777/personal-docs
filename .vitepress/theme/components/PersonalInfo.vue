<template>
  <div class="container">
    <div class="introduction">
      <h1>关于我</h1>
      <br />

      <p>
        👋 一名软件开发工程师，专业领域涵盖了后端开发、数据库设计和系统架构，专注于将复杂的问题转化为简单而直观的设计。
      </p>
      <br />
      <p>
        💻 坚信技术的价值在于为用户创造价值，努力构建出简洁、高效且易于维护的代码，以提供出色的用户体验。
      </p>
      <br />
      <p>
        🚀 注重团队协作，喜欢和团队成员分享经验、学习新技术，并持续关注行业的最新动态，以确保我的技术栈始终保持更新。
      </p>
      <br />
      <p>
        🌐 当不在编写代码的时候，热衷于探索互联网世界。可能在学习新的编程语言，研究新的技术趋势，或者在个人项目上挥洒创意。
      </p>
      <br />
      <div class="social-links">
        <a href="https://github.com/yourusername" target="_blank">
          <font-awesome-icon :icon="['fab', 'github']" /> 
        </a>
        <a href="mailto:your@email.com">
          <font-awesome-icon :icon="['fas', 'envelope']" /> 
        </a>
        <a href="your-wechat-url">
          <font-awesome-icon :icon="['fab', 'weixin']" /> 
        </a>
      </div>
    </div>
    <div class="language-stats">
      <h2>Most Used Languages</h2>
      <img src='https://github-readme-stats.vercel.app/api/top-langs/?username=BinaryCoder777&layout=donut&langs_count=10'
        alt="Most Used Languages" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalInfoWithStats'
}
</script>

<style scoped>
.container {
  display: flex;
  max-width: 90%;
  margin: auto;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 50px;
  border: none;
}

.introduction {
  flex: 1;
  padding: 20px;
}

.introduction h1 {
  font-size: 24px;
  color: #333;
}

.introduction p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
}

.social-links {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  gap: 25px;
  /* 设置链接之间的间隔 */
  margin-top: 20px;
}

.social-links a {
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  color: #fff;
  background-color: #007bff;
  /* 以下是新增样式，用于提升可读性和美观 */
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex; /* 使图标和文本水平对齐 */
  align-items: center; /* 居中对齐图标和文本 */
}

.social-links i {
  margin-right: 8px; /* 图标和文本之间的间隔 */
}

.language-stats {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.language-stats h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.language-stats img {
  max-width: 100%;
  height: auto;
}

/* Add more styles as necessary */</style>
