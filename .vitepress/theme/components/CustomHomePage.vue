<template>
    <div id="custom-homepage">
        <!-- 水墨视频背景 -->
        <div class="video-container">
            <video autoplay loop muted playsinline class="background-video">
                <!-- <source src="/background.mp4" type="video/mp4" /> -->
                <!-- 如果视频加载失败，显示静态图片 -->
                <img src="../../public/background-fallback.jpg" alt="水墨背景" />
            </video>

        </div>

        <!-- 内容层 -->
        <div class="content">
            <h1 class="title">江湖墨韵</h1>
            <p class="subtitle">人在江湖，快意恩仇</p>
            <div class="buttons">
                <a class="btn" href="/docs/guide">开始探索</a>
                <a class="btn btn-secondary" href="/docs/about">了解更多</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 视频背景容器 */
.video-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;
}

.background-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 内容样式 */
#custom-homepage {
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-family: 'Liu Jian Mao Cao', cursive;
    /* 水墨字体 */
}

.title {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
}

.buttons {
    display: flex;
    gap: 1rem;
}

.btn {
    padding: 10px 20px;
    font-size: 1rem;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    border: 2px solid #fff;
    border-radius: 5px;
    text-decoration: none;
    transition: background 0.3s ease;
}

.btn:hover {
    background: rgba(255, 255, 255, 0.8);
    color: #000;
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.7);
    color: #000;
}

.btn-secondary:hover {
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
}
</style>