<template>
  <div class="container">
    <div class="container-top">
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
      <!-- <h1 id="aboutSection" style="text-align: center">关于我</h1> -->
      <h2 class="features-title" style="text-align: center">关于我</h2>
      <p class="features-subtitle" style="text-align: center">
        <!-- 🥚 | 🏀 | 💻 | 🎵 | 📚 -->
      </p>
      <!-- <br /> -->
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
      <section class="timeline">
        <div class="title-wrapper">
          <div class="icon-box">
            <svg t="1722936475509" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4302" width="32" height="32"><path d="M959.288674 828.030723c0 0-76.276221-61.033052-213.678614-61.033052-137.363508 0-213.677591 61.033052-213.677591 61.033052L531.93247 273.696546c0 0 64.400752-77.727269 215.798904-77.727269 151.362336 0 211.556277 77.727269 211.556277 77.727269L959.287651 828.030723z" fill="#F9BE00" p-id="4303"></path><path d="M492.102323 828.030723c0 0-76.350922-61.033052-213.677591-61.033052-137.364531 0-213.71443 61.033052-213.71443 61.033052L64.710302 273.696546c0 0 64.438615-77.727269 215.836767-77.727269 151.361313 0 211.555254 77.727269 211.555254 77.727269L492.102323 828.030723z" fill="#F9BE00" p-id="4304"></path></svg>
          </div>
          <div style="display: flex;flex-direction:column;justify-content: center;justify-items: center;margin-left:37%;">
            <h2 class="features-title" style="text-align: center">成长经历</h2>
      <!-- <p class="features-subtitle">对行动要有耐心，对结果要有信心...</p> -->
          </div>
        </div>

        <ol class="timeline-list">
          <li class="timeline-item">
            <!-- <h4 class="h4 timeline-item-title">Creative director</h4> -->

            <span>2019</span>

            <p class="timeline-text">
              步入大学校园，为"计算机科学与技术"的学士学位🎓努力着，并于2020年期间加入了学院的创新实验室AC&Lab💻，开启了后端开发的学习旅程📚...
            </p>
          </li>

          <li class="timeline-item">
            <!-- <h4 class="h4 timeline-item-title">Art director</h4> -->

            <span>2022</span>

            <p class="timeline-text">
              纸上得来终觉浅，绝知此事要躬行🖊。在大三期间独自去往杭州某互联网公司实习，从理论到实际，抽象到具体的蜕变，此时真正体会到了知识与实际的应用...
            </p>
          </li>

          <li class="timeline-item">
            <!-- <h4 class="h4 timeline-item-title">Web designer</h4> -->

            <span>2023 — 至今</span>
            <p class="timeline-text">
              毕业啦🍻，编码🖱是工作的主旋律。面对各种各样的挑战与机遇⛰，梦想指引着每一步的坚定前行🍃，年轻人，加油吧💪🏻...
            </p>
          </li>
        </ol>
      </section>

      <section class="skill">
        <h2 class="features-title" style="text-align: center">个人技能</h2>
        <p class="features-subtitle">学习是一辈子的事儿，活到老，学到老...</p>
        <ul class="skills-list content-card">
          <li class="skills-item">
            <div class="title-wrapper">
              <h5 class="h5">后端开发</h5>
              <data value="80">90%</data>
            </div>

            <div class="skill-progress-bg">
              <div class="skill-progress-fill" style="width: 90%"></div>
            </div>
          </li>

          <li class="skills-item">
            <div class="title-wrapper">
              <h5 class="h5">系统优化</h5>
              <data value="70">70%</data>
            </div>

            <div class="skill-progress-bg">
              <div class="skill-progress-fill" style="width: 70%"></div>
            </div>
          </li>

          <li class="skills-item">
            <div class="title-wrapper">
              <h5 class="h5">数据设计</h5>
              <data value="90">80%</data>
            </div>

            <div class="skill-progress-bg">
              <div class="skill-progress-fill" style="width: 80%"></div>
            </div>
          </li>

          <li class="skills-item">
            <div class="title-wrapper">
              <h5 class="h5">架构设计</h5>
              <data value="50">50%</data>
            </div>

            <div class="skill-progress-bg">
              <div class="skill-progress-fill" style="width: 50%"></div>
            </div>
          </li>
        </ul>
      </section>
    </div>

    </div>

    <h2 class="features-title" style="text-align: center;margin-top: 0px">当前正在做的...</h2>
      <p class="features-subtitle" style="text-align: center;">
        探索创新的技术解决方案，让编程之旅更加有趣。
      </p>
      <div class="features-cards">
        <div class="feature-card">
          <div class="card-icon">
            <!-- 假设您使用的是图像文件 -->
            <img src="../../public/icon-app.svg" alt="文档解析">
            <h3 class="card-title">解决方案</h3>
          </div>
          <p class="card-detail">
            为客户提供定制化的专业解决方案，以满足特定行业的独特需求。
          </p>
        </div>
        <div class="feature-card">
          <div class="card-icon">
            <img src="../../public/icon-dev.svg" alt="文档解析">
            <h3 class="card-title">软件开发</h3>
          </div>
          <p class="card-detail">
            承诺提供卓越的软件开发服务，确保每一次交付都是高效和高质量的。
          </p>
        </div>
        <div class="feature-card">
          <div class="card-icon">
            <img src="../../public/icon-design.svg" alt="文档解析">
            <h3 class="card-title">数字创新</h3>

          </div>
          <p class="card-detail">
            挖掘生活中的创新灵感，将酷炫的想法转化为实际可行的数字产品。
          </p>
        </div>
      </div>
  </div>

</template>



<style scoped>
/* 1. 组织样式结构，添加注释分类 */
/* Base styles
-------------------------- */
.container {
  position: relative;
  display: flex;
  max-width: 90%;
  margin: 2rem auto;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  flex-direction: column;
}

.container-top {
  position: relative;
  display: flex;
  max-width: 90%;
  margin: 2rem auto 10px;
}

/* Profile section
-------------------------- */
.introduction {
  flex: 1;
  padding: 20px;
}

.introduction h1 {
  font-size: 24px;
  color: var(--vp-c-text-1);
}

.introduction p {
  font-size: 16px;
  line-height: 1.6;
  /* color: var(--vp-c-text-2); */
}

/* Social links
-------------------------- */
.social-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  margin-top: 20px;
}

.social-links a {
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  color: #fff;
  background-color: hsl(45, 68%, 54%);
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.social-links a:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Timeline section
-------------------------- */
.timeline { 
  margin-bottom: 30px; 
}

.timeline .title-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.timeline-list {
  font-size: 14px;
  margin-left: 45px;
}

.timeline-item { 
  position: relative; 
}

.timeline-item:not(:last-child) { margin-bottom: 20px; }

.timeline-item-title {
  font-size: 14px;
  line-height: 1.3;
  margin-bottom: 7px;
}

.timeline-list span {
  color:hsl(45, 54%, 58%);
  font-weight: 1000;
  line-height: 1.6;
}

.timeline-item:not(:last-child)::before {
  content: "";
  position: absolute;
  top: -25px;
  left: -30px;
  width: 1px;
  height: calc(100% + 50px);
  background: hsl(0, 0%, 22%);
}

.timeline-item::after {
  content: "";
  position: absolute;
  top: 5px;
  left: -33px;
  height: 6px;
  width: 6px;
  background: linear-gradient(
    to right, 
    hsl(45, 100%, 72%), 
    hsl(45, 100%, 68%)
  );
  border-radius: 50%;
  box-shadow: 0 0 0 4px hsl(0, 0%, 22%);
}

.timeline-text {
  /* color: hsl(0, 0%, 84%); */
  font-weight: 300px;
  line-height: 1.6;
}


/* Skills section
-------------------------- */
.skills-title {
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.skills-list {
  padding: 20px;
}

.skills-item:not(:last-child) {
  margin-bottom: 15px;
}

.skill .title-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
}

.skill .title-wrapper data {
  /* color: hsl(0, 0%, 84%); */
  font-size: 13px;
  font-weight: 300;
}

.skill-progress-bg {
  background: var(--vp-c-bg-soft);
  width: 100%;
  height: 8px;
  border-radius: 10px;
  overflow: hidden;
}

.skill-progress-fill {
  background: linear-gradient(to right, hsl(45, 53%, 50%), hsl(45, 100%, 68%));
  height: 100%;
  border-radius: inherit;
  transition: width 0.8s ease-in-out;
}

/* Feature cards
-------------------------- */
.features-cards {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2%;
  gap: 2rem;
}

.feature-card {
  width: 300px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-icon {
  margin-bottom: 0.5rem;
  display: flex;justify-content: center;justify-items: center;
}

.card-icon img {
  width: 50px;
  /* 根据实际需求调整 */
}

.card-title {
  font-size: 1.2rem;
  /* color: #333; */
  align-content: center;
}

.card-detail {
  /* color: #666; */
  font-size: 0.9rem;
  text-align: center;
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
  margin-top: 5%;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.features-subtitle {
  margin-bottom: 1rem;
  /* color: #666; */
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
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
  border-color: var(--vp-c-bg-soft) transparent transparent transparent; /* 箭头颜色 */
}

.tooltip:hover::after,
.tooltip:hover::before {
  visibility: visible;
  opacity: 1;
}

.language-stats img {
  max-width: 50%;
  height: auto;
  transition: transform 0.3s ease-in-out; /* 平滑过渡效果 */
}

.language-stats img:hover {
  transform: scale(1.2); /* 鼠标悬停时放大 1.2 倍 */
}

/* Responsive design
-------------------------- */
@media (max-width: 768px) {
  .container-top {
    flex-direction: column;
  }

  .features-cards {
    flex-direction: column;
    align-items: center;
  }

  .feature-card {
    width: 100%;
    max-width: 300px;
  }

  .features-section {
    max-width: 100%;
  }
}

/* Animations
-------------------------- */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

#profile-img {
  transition: transform 0.6s ease-in-out;
}

#profile-img:hover {
  animation: rotate 1s linear;
}

/* Tooltip enhancements
-------------------------- */
.tooltip::after {
  transition: all 0.3s ease;
  z-index: 1000;
  font-size: 14px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>

<script setup>
import { ref } from 'vue'

// State management
const rotation = ref('rotate(0deg)')

// Animation handlers
const startRotation = () => {
  rotation.value = 'rotate(360deg)'
}

const stopRotation = () => {
  rotation.value = 'rotate(0deg)'
}
</script>
  