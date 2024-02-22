---
layout: doc
---

<script setup>
import MNavLinks from '/.vitepress/theme/components/MNavLinks.vue'

import { NAV_DATA } from '/.vitepress/theme/programData.ts'
</script>

<style scoped>

 /* 覆盖全局的 vp-layout-max-width（仅当前页面使用） */

  /* 修改 layout 最大宽度 */
  .container {
    max-width: 70% !important;
  }
</style>

# 编程旅程

<MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>


