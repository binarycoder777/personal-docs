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

        <div class="projects-section">
            
            <div class="project-showcase">
                <!-- 左箭头 -->
                <button class="nav-button nav-button-left" @click="scroll('left')" :disabled="isAtStart">
                    <svg viewBox="0 0 24 24" class="arrow-icon">
                        <path d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <!-- 右箭头 -->
                <button class="nav-button nav-button-right" @click="scroll('right')" :disabled="isAtEnd">
                    <svg viewBox="0 0 24 24" class="arrow-icon">
                        <path d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <!-- 卡片容器 -->
                <div class="cards-container" ref="scrollContainer" @scroll="checkScrollPosition">
                    <div class="cards-wrapper" :style="{ transform: `translateX(${scrollPosition}px)` }">
                        <!-- 项目卡片 -->
                        <template v-for="project in projects" :key="project.id">
                            <!-- 有链接的卡片 -->
                            <a v-if="project.link"
                               :href="project.link"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="project-card">
                                <div class="project-info">
                                    <div class="project-header">
                                        <h3 class="project-title">{{ project.title }}</h3>
                                        <span class="project-status" :class="project.status">
                                            {{ project.status === 'completed' ? '已完成' : '进行中' }}
                                        </span>
                                    </div>
                                    <p class="project-description">{{ project.description }}</p>
                                    <div class="project-tags">
                                        <span v-for="tag in project.tags" :key="tag" class="project-tag">
                                            {{ tag }}
                                        </span>
                                    </div>
                                </div>
                            </a>
                            
                            <!-- 没有链接的卡片 -->
                            <div v-else class="project-card no-link">
                                <div class="project-info">
                                    <div class="project-header">
                                        <h3 class="project-title">{{ project.title }}</h3>
                                        <span class="project-status" :class="project.status">
                                            {{ project.status === 'completed' ? '已完成' : '进行中' }}
                                        </span>
                                    </div>
                                    <p class="project-description">{{ project.description }}</p>
                                    <div class="project-tags">
                                        <span v-for="tag in project.tags" :key="tag" class="project-tag">
                                            {{ tag }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
    name: 'CustomHomePage',
    setup() {
        const scrollContainer = ref(null);
        const scrollPosition = ref(0);
        const isAtStart = ref(true);
        const isAtEnd = ref(false);
        const loading = ref(true);

        const projects = [
            {
                id: 1,
                title: 'LobChat',
                status: 'completed',
                description: '一个开源、现代设计的 AI 聊天框架。',
                tags: ['OpenAI', 'Claude 3', 'DeepSeek'],
                link: 'https://lobe-chat-eight-virid-32.vercel.app/chat'
            },
            {
                id: 2,
                title: 'weekly-report',
                status: 'completed',
                description: '一个记录互联网上实时发生的科技新闻和奇闻趣事的站点，项目保持每周六或周日更新，喜欢的朋友可以免费订阅，不错过每周发生的科技奇闻趣事～',
                tags: ['周刊', '科技', '前沿'],
                link: 'https://binarycoder777.com/'
            },
            {
                id: 3,
                title: 'News Now',
                status: 'completed',
                description: '优雅阅读实时最热门新闻',
                tags: ['新闻', '热门', '阅读'],
                link: 'https://newsnow.binarycoder.org/'
            },
            {
                id: 4,
                title: 'CodeAtlas',
                status: 'completed',
                description: '一个收录了笔者平时遇见的工具、资源、站点导航站，方便笔者自己使用，也分享给有需要的朋友。',
                tags: ['工具', '资源', '导航'],
                link: 'https://personal-k7of91wlx-binarycoder777s-projects.vercel.app/'
            },
            {
                id: 5,
                title: '礼尚往来',
                status: 'in-progress',
                description: '生活中记录人情往来，婚礼酒宴，生日宴会，满月酒，乔迁之喜，升学宴，寿宴等的一款小程序',
                tags: ['小程序', '记录', '人情往来'],
                // link: '#'
            },
            {
                id: 6,
                title: '酒桌欢乐局',
                status: 'in-progress',
                description: '一款适合聚会、饭局、朋友局的拼酒小程序，让你和朋友边玩边喝，挑战喝酒极限！支持多种玩法，快速开局，让酒局更有趣！',
                tags: ['小程序', '拼酒', '聚会'],
                // link: '#'
            },

            // 添加更多项目...
        ];

        const checkScrollPosition = () => {
            if (!scrollContainer.value) return;
            
            const container = scrollContainer.value;
            isAtStart.value = scrollPosition.value >= 0;
            isAtEnd.value = scrollPosition.value <= -(container.scrollWidth - container.clientWidth);
        };

        const scroll = (direction) => {
            if (!scrollContainer.value) return;
            
            const container = scrollContainer.value;
            const cardWidth = 320; // 卡片宽度
            const gap = 24; // 卡片间距
            const scrollAmount = cardWidth + gap; // 每次滚动的距离
            const containerWidth = container.clientWidth;
            const totalWidth = container.scrollWidth;
            
            if (direction === 'left') {
                scrollPosition.value = Math.min(0, scrollPosition.value + scrollAmount);
            } else {
                // 计算最大滚动距离，确保最后一张卡片能完全显示
                const maxScroll = -(Math.ceil((totalWidth - containerWidth) / scrollAmount) * scrollAmount);
                scrollPosition.value = Math.max(maxScroll, scrollPosition.value - scrollAmount);
            }
            
            // 更新滚动状态
            isAtStart.value = scrollPosition.value >= 0;
            isAtEnd.value = scrollPosition.value <= -(totalWidth - containerWidth);
        };

        const getStatusClass = (status) => {
            return {
                'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                'in-progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
            }[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        };

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

            checkScrollPosition();
            window.addEventListener('resize', checkScrollPosition);

            // 模拟加载
            setTimeout(() => {
                loading.value = false;
            }, 1000);
        });

        return {
            scrollContainer,
            scrollPosition,
            isAtStart,
            isAtEnd,
            projects,
            checkScrollPosition,
            scroll,
            getStatusClass,
            loading
        };
    },
};
</script>

<style scoped>
/* 页面容器 */
#home-page {
    min-height: 100vh; /* 改为最小高度，允许内容自然延伸 */
    width: 100%;  /* 改为 100% 而不是 100vw 避免水平滚动条 */
    position: relative;
    font-family: 'Liu Jian Mao Cao', cursive;
    display: flex;
    flex-direction: column;
    overflow-x: hidden; /* 只隐藏水平溢出 */
    overflow-y: visible; /* 允许垂直方向内容显示 */
}

/* 背景 GIF 样式 */
#background-gif {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://binarycoder777-site.oss-cn-chengdu.aliyuncs.com/demo.gif') no-repeat center center;
    background-size: cover;
    z-index: -2;
}

/* 粒子效果容器 */
#particles-js {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

/* 主内容样式 */
.content {
    position: relative;
    text-align: center;
    color: #333;
    z-index: 1;
    padding-top: 15vh; /* 使用 vh 单位替代百分比 */
    padding-bottom: 10vh; /* 使用 vh 单位替代百分比 */
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

.projects-section {
    max-width: 1200px;
    width: 90%; /* 添加宽度控制 */
    margin: 0 auto 5vh auto; /* 添加底部间距 */
    padding: 40px 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    position: relative; /* 确保位置正确 */
    z-index: 1; /* 确保在背景之上 */
}

.projects-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 32px;
    color: var(--vp-c-text-1);
}

.project-showcase {
    position: relative;
    padding: 20px 0;
    margin-top: 20px; /* 增加顶部间距 */
}

/* 添加项目展示区域的标题样式 */
.projects-section::before {
    content: "个人部署";
    display: block;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 32px;
    color: #333;
}

/* 暗色模式适配 */
:root.dark .projects-section {
    background: rgba(0, 0, 0, 0.2);
}

:root.dark .projects-section::before {
    color: #fff;
}

/* 导航按钮样式 */
.nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    cursor: pointer;
    z-index: 2;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.nav-button:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
}

.nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.nav-button-left {
    left: -20px;
}

.nav-button-right {
    right: -20px;
}

.arrow-icon {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* 卡片容器样式 */
.cards-container {
    overflow: hidden;
    margin: 0 20px;
    padding-bottom: 20px; /* 添加底部内边距，防止阴影被裁剪 */
}

.cards-wrapper {
    display: flex;
    gap: 24px;
    transition: transform 0.5s ease;
    padding-right: 20px; /* 添加右侧内边距，确保最后一张卡片完全显示 */
}

/* 项目卡片基础样式 */
.project-card {
    flex: 0 0 320px;
    min-width: 320px;
    background: var(--vp-c-bg-soft);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    padding: 20px;
}

/* 有链接的卡片样式 */
a.project-card {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
}

a.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

a.project-card:active {
    transform: translateY(-2px);
}

/* 无链接的卡片样式 */
.project-card.no-link {
    cursor: default;
}

.project-card.no-link:hover {
    transform: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 新增项目头部样式 */
.project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.project-status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

.project-status.completed {
    background: rgba(72, 187, 120, 0.1);
    color: #48bb78;
}

.project-status.in-progress {
    background: rgba(236, 201, 75, 0.1);
    color: #ecc94b;
}

.project-title {
    font-size: 18px;
    font-weight: bold;
    color: var(--vp-c-text-1);
}

.project-description {
    font-size: 14px;
    color: var(--vp-c-text-2);
    margin-bottom: 16px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.project-tag {
    padding: 4px 12px;
    background: var(--vp-c-bg-mute);
    color: var(--vp-c-text-2);
    border-radius: 16px;
    font-size: 12px;
}

/* 暗色模式适配 */
:root.dark .nav-button {
    background: rgba(0, 0, 0, 0.6);
}

:root.dark .nav-button:hover {
    background: rgba(0, 0, 0, 0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .content {
        padding-top: 15vh;
        padding-bottom: 10vh;
    }

    .projects-section {
        padding: 20px 12px;
    }

    .nav-button {
        width: 32px;
        height: 32px;
    }

    .nav-button-left {
        left: -16px;
    }

    .nav-button-right {
        right: -16px;
    }

    .project-card {
        flex: 0 0 280px;
    }
}
</style>