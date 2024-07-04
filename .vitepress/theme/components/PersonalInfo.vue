<template>
  <div class="scroll-background">
    <div class="scroll">
      <video autoplay muted loop playsinline class="painting-video">
        <source src="../../public/intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="video-button">
        <a class="btn" href="#aboutSection">探索</a>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="introduction">
      <div class="language-stats">
        <img
          id="profile-img"
          src="../../public/favicon.ico"
          alt="BinaryCoder777"
          @mouseenter="startRotation"
          @mouseleave="stopRotation"
          :style="{ transform: rotation }"
        />
      </div>
      <h1 id="aboutSection" style="text-align: center">关于我</h1>
      <br />
      <p>
        👋
        一名软件开发工程师，专业领域涵盖了后端开发、数据库设计和系统架构，专注于将复杂的问题转化为简单而直观的设计。
      </p>
      <br />
      <p>
        💻
        坚信技术的价值在于为用户创造价值，努力构建出简洁、高效且易于维护的代码，以提供出色的用户体验。
      </p>
      <br />
      <p>
        🚀
        注重团队协作，喜欢和团队成员分享经验、学习新技术，并持续关注行业的最新动态，以确保我的技术栈始终保持更新。
      </p>
      <br />
      <p>
        🌐
        当不在编写代码的时候，热衷于探索互联网世界。可能在学习新的编程语言，研究新的技术趋势，或者在个人项目上挥洒创意。
      </p>
      <br />
      <div class="social-links">
        <a
          href="https://github.com/binarycoder777"
          target="_blank"
          class="tooltip"
          data-title="GitHub"
        >
          <font-awesome-icon :icon="['fab', 'github']" />
        </a>
        <a href="mailto:atao67276@gmail.com" class="tooltip" data-title="Email">
          <font-awesome-icon :icon="['fas', 'envelope']" />
        </a>
        <a
          href="https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/vx.jpg"
          target="_blank"
          class="tooltip"
          data-title="微信"
        >
          <font-awesome-icon :icon="['fab', 'weixin']" />
        </a>
      </div>
    </div>
    <div class="features-section">
      <div class="language-stats">
        <h2>Most Used Languages</h2>
        <img
          src="https://github-readme-stats.vercel.app/api/top-langs/?username=BinaryCoder777&layout=donut&langs_count=10"
          alt="Most Used Languages"
        />
      </div>
      <h2 class="features-title">当前正在做的...</h2>
      <p class="features-subtitle">
        探索创新的技术解决方案，让编程之旅更加有趣。
      </p>
      <div class="features-cards">
        <div class="feature-card">
          <div class="card-icon">
            <!-- 假设您使用的是图像文件 -->
            <!-- <img src="/path-to-your-icon-1.png" alt="文档解析"> -->
          </div>
          <h3 class="card-title">系统解析方案</h3>
          <p class="card-detail">
            为客户提供定制化的专业解决方案，以满足特定行业的独特需求。
          </p>
        </div>
        <div class="feature-card">
          <div class="card-icon">
            <!-- <img src="/path-to-your-icon-2.png" alt="软件开发"> -->
          </div>
          <h3 class="card-title">软件开发</h3>
          <p class="card-detail">
            承诺提供卓越的软件开发服务，确保每一次交付都是高效和高质量的。
          </p>
        </div>
        <div class="feature-card">
          <div class="card-icon">
            <!-- <img src="/path-to-your-icon-3.png" alt="数据分析"> -->
          </div>
          <h3 class="card-title">数字创新</h3>
          <p class="card-detail">
            挖掘生活中的创新灵感，将酷炫的想法转化为实际可行的数字产品。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "PersonalInfoWithStats",
  data() {
    return {
      rotation: "rotate(0deg)", // 初始角度为0度
    };
  },
  methods: {
    startRotation() {
      this.rotation = "rotate(360deg)"; // 鼠标移入时，设置角度为360度
    },
    stopRotation() {
      this.rotation = "rotate(0deg)"; // 鼠标移出时，恢复初始角度为0度
    }
  },
};
</script>


<style scoped>

#profile-img {
  width: 60%;
  height: 60%;
  transition: transform 0.5s ease; /* 添加过渡效果 */
}

.scroll-background {
  background-image: url("../../public/juanzhou.png"); /* 卷轴背景图片路径 */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center bottom;
  padding: 4% 12%; /* 上方留出20%的空间，左右各留出10%的空间 */
  position: relative;
  overflow: hidden; /* 隐藏超出部分 */
  z-index: -1; /* 设置较低的层叠顺序 */
}

.scroll {
  position: relative;
  height: 100%;
  width: 85%; /* 卷轴宽度 */
  margin: 0% auto; /* 居中卷轴 */
  margin-bottom: 18%;
  z-index: 1; /* 设置较高的层叠顺序，确保卷轴在上方内容之上 */
}

.painting-video {
  width: 100%; /* 视频宽度与卷轴宽度一致 */
  height: 100%; /* 根据宽度自动调整高度 */
  display: block;
  object-fit: cover; /* 确保视频充满卷轴 */
  z-index: 1; /* 设置较低的层叠顺序，确保视频位于卷轴下方 */
}

.video-button {
  position: absolute;
  bottom: 20%; /* 距离底部的距离 */
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 100%; /* 让按钮宽度充满父容器 */
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 18px;
  transition: transform 0.3s ease; /* 添加 transform 的过渡效果 */
}

.btn:hover {
  transform: scale(5); /* 悬停时放大按钮 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
}

.container {
  position: relative;
  display: flex;
  max-width: 80%;
  margin: auto;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 50px;
  margin-top: -10%;
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

.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip::after,
.tooltip::before {
  content: "";
  position: absolute;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease;
}

.tooltip::after {
  content: attr(data-title);
  bottom: 120%; /* 调整这个值来改变工具提示与图标的距离 */
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background-color: #555; /* 工具提示的背景色 */
  color: #fff; /* 文字颜色 */
  padding: 8px 12px; /* 内边距 */
  border-radius: 6px; /* 圆角 */
  font-size: 14px; /* 文字大小 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  z-index: 1000;
}

.tooltip::before {
  content: "";
  bottom: 110%; /* 箭头与图标的距离 */
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent; /* 箭头颜色 */
}

.tooltip:hover::after,
.tooltip:hover::before {
  visibility: visible;
  opacity: 1;
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

.lastes-news {
  padding: 2rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 60%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}

.lastes-news h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.features-section {
  text-align: center;
  padding: 2rem;
  /* background-color: #f9f9f9; 根据实际需求调整 */
  /* box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1); */
  max-width: 60%;
  margin-bottom: 50px;
  margin-left: auto;
  margin-right: auto;
}

.features-title {
  margin-top: 10%;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.features-subtitle {
  margin-bottom: 2rem;
  color: #666;
}

.features-cards {
  display: flex;
  justify-content: space-around;
}

.feature-card {
  width: 300px;
  /* 根据实际需求调整 */
  padding: 1rem;
  /* background: #ffffff; */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 0 1rem;
}

.card-icon {
  margin-bottom: 1rem;
}

.card-icon img {
  width: 50px;
  /* 根据实际需求调整 */
}

.card-title {
  font-size: 1.2rem;
  /* color: #333; */
  margin-bottom: 0.5rem;
}

.card-detail {
  /* color: #666; */
  font-size: 0.9rem;
}
/* Add more styles as necessary */
</style>
