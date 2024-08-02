<template>
    <div style="display: flex;justify-content: center;">
      <div class="comment" style="margin-top: 24px;width: 80%;">
        <Giscus
            id="comments"
            repo="binarycoder777/personal-docs"
            repoid="R_kgDOLTw5lA"
            category="Announcements"
            categoryid="DIC_kwDOLTw5lM4ChWtz"
            mapping="title"
            reactionsenabled="1"
            emitmetadata="0"
            inputposition="top"
            loading="lazy"
            :theme="isDark ? 'dark' : 'light'"
            :key="route.path"
        ></Giscus>
    </div>
    </div>
</template>

<script setup>
import Giscus from '@giscus/vue';
import { useRoute, useData } from 'vitepress';

const route = useRoute();
const { isDark } = useData();
</script>