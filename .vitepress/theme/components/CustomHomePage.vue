<template>
    <div id="home-page">
        <!-- 背景 GIF -->
        <div id="background-gif"></div>

        <!-- 粒子效果 -->
        <div id="particles-js"></div>

        <!-- 主内容 -->
        <div class="content">
            <h1 class="title">代码江湖</h1>
            <p class="subtitle">行走江湖，指尖生风；编程世界，快意人生。</p>

            <div class="actions">
                <a class="btn" href="/docs/book">踏入江湖</a>
                <a class="btn btn-secondary" href="/docs/about">了解更多</a>
            </div>
        </div>


    </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
    name: 'CustomHomePage',
    setup() {
        onMounted(() => {
            // 动态加载 particles.js 脚本
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
            script.onload = () => {
                particlesJS('particles-js', {
                    particles: {
                        number: { value: 20, density: { enable: true, value_area: 800 } },
                        color: { value: ['#000000', '#4a4a4a', '#7f7f7f'] },
                        shape: { type: 'circle' },
                        opacity: { value: 0.6, random: true },
                        size: { value: 10, random: true },
                        move: { enable: true, speed: 1 },
                    },
                    interactivity: {
                        detect_on: 'canvas',
                        events: {
                            onhover: { enable: true, mode: 'grab' },
                            onclick: { enable: true, mode: 'push' },
                        },
                    },
                    retina_detect: true,
                });
            };
            document.body.appendChild(script);
        });
    },
};
</script>

<style scoped>
/* 页面容器 */
#home-page {
    height: 800px;
    width: 100vw;
    position: relative;
    overflow: hidden;
    /* 防止内容超出页面 */
    font-family: 'Liu Jian Mao Cao', cursive;
    /* 使用水墨风格字体 */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* 确保主内容和评论组件分布合理 */
}

/* 背景 GIF 样式 */
#background-gif {
    position: fixed;
    /* 背景固定，不随页面滚动 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://binarycoder777-site.oss-cn-chengdu.aliyuncs.com/demo.gif?Expires=1739514924&OSSAccessKeyId=TMP.3KiwYeoFmCv4ZYY81Pxtd8sQCrHPetjh6A3FJoRqDvvjGEULvX1Nczt9unPaHMbztDJYsyZNU9s5GMChZSs71MbgAiS8Sk&Signature=WHSk%2FlLaXSAf%2FtgIu40sehpKpjw%3D') no-repeat center center;
    background-size: cover;
    /* 确保背景图片覆盖整个页面 */
    z-index: -2;
    /* 在粒子效果后面 */
}

/* 粒子效果容器 */
#particles-js {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    /* 在内容后面但在背景前面 */
}

/* 主内容样式 */
.content {
    position: relative;
    text-align: center;
    color: #333;
    z-index: 1;
    margin-top: 20%;
}

.title {
    font-size: 4rem;
    margin-bottom: 2rem;
    color: #000;
}

.subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.btn {
    padding: 10px 20px;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background-color: #0056b3;
}

.btn-secondary {
    background-color: #6c757d;
}

.btn-secondary:hover {
    background-color: #545b62;
}

/* 评论组件样式 */
.comments {
    position: relative;
    z-index: 1;
    /* 确保评论在背景层之上 */
    padding: 20px;
    background: rgba(255, 255, 255, 0.8);
    /* 给评论区加一个半透明背景，保证可读性 */
    border-top: 1px solid #ddd;
    /* 分隔线 */
}
</style>