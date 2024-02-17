<template>
    <div class="features-section">
        <h2 class="features-title">当前正在做的...</h2>
        <p class="features-subtitle">探索创新的技术解决方案，让编程之旅更加有趣。</p>
        <div class="features-cards">
            <div class="feature-card">
                <div class="card-icon">
                    <!-- 假设您使用的是图像文件 -->
                    <!-- <img src="/path-to-your-icon-1.png" alt="文档解析"> -->
                </div>
                <h3 class="card-title">系统解析方案</h3>
                <p class="card-detail">为客户提供定制化的专业解决方案，以满足特定行业的独特需求。</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">
                    <!-- <img src="/path-to-your-icon-2.png" alt="软件开发"> -->
                </div>
                <h3 class="card-title">软件开发</h3>
                <p class="card-detail">承诺提供卓越的软件开发服务，确保每一次交付都是高效和高质量的。</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">
                    <!-- <img src="/path-to-your-icon-3.png" alt="数据分析"> -->
                </div>
                <h3 class="card-title">数字创新</h3>
                <p class="card-detail">挖掘生活中的创新灵感，将酷炫的想法转化为实际可行的数字产品。</p>
            </div>
        </div>
    </div>
    <div class="lastes-news">
        <h1>近期动态</h1>
        <a href="/markdown-examples">阅览更多...</a>
        <div class="features-cards">
           
            <div class="feature-card">
                <div class="card-icon">
                    <!-- 假设您使用的是图像文件 -->
                    <!-- <img src="/path-to-your-icon-1.png" alt="文档解析"> -->
                </div>
                <h3 class="card-title">系统解析方案</h3>
                <p class="card-detail">为客户提供定制化的专业解决方案，以满足特定行业的独特需求。</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">
                    <!-- <img src="/path-to-your-icon-2.png" alt="软件开发"> -->
                </div>
                <h3 class="card-title">软件开发</h3>
                <p class="card-detail">承诺提供卓越的软件开发服务，确保每一次交付都是高效和高质量的。</p>
            </div>
            <div class="feature-card">
                <div class="card-icon">
                    <!-- <img src="/path-to-your-icon-3.png" alt="数据分析"> -->
                </div>
                <h3 class="card-title">数字创新</h3>
                <p class="card-detail">挖掘生活中的创新灵感，将酷炫的想法转化为实际可行的数字产品。</p>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    mounted() {
        console.log(111);

    console.log(this);

    console.log(222);

  },
    name: 'FeaturesSection'
}
</script>
  
<style scoped>
.lastes-news {
    padding: 2rem;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 90%;
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
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    max-width: 90%;
    margin-bottom: 50px;
    margin-left: auto;
    margin-right: auto;
}

.features-title {
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
    background: #ffffff;
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
    color: #333;
    margin-bottom: 0.5rem;
}

.card-detail {
    color: #666;
    font-size: 0.9rem;
}
</style>
  