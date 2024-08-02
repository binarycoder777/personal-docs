<template>
  <div class="scroll-background">
    <div class="scroll">
      <video autoplay loop playsinline class="painting-video">
        <source src="../../public/intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
  <div class="video-button">
        <a class="btn" href="/docs/about">探索</a>
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
  z-index: -2; /* 设置较高的层叠顺序，确保卷轴在上方内容之上 */
  margin-top:2.5%;
}

.scroll {
  position: relative;
  height: 100%;
  width: 85%; /* 卷轴宽度 */
  margin: 0% auto; /* 居中卷轴 */
  margin-bottom: 18%;
  z-index: -2; /* 设置较高的层叠顺序，确保卷轴在上方内容之上 */
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
  bottom: 45%; /* 距离底部的距离 */
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


</style>
