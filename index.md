---
layout: page
---



<script setup>
import CustomHomePage from '/.vitepress/theme/components/CustomHomePage.vue'
import GiscusComment from '/.vitepress/theme/components/GiscusComment.vue'
</script>

<CustomHomePage/>

<GiscusComment/>

<style scoped>

.giscus-frame .mx-auto {
    display: flex !important;
    justify-content: center !important;
}

.giscus-frame .gsc-main {
    width:80% !important;
}

</style>
