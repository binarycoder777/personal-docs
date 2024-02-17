// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import PersonalInfo from './components/PersonalInfo.vue'
import CurrentDo from './components/CurrentDo.vue'


import './style.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fas, fab);


/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'home-hero-after': () => h(PersonalInfo),
      'home-features-before': () => h(CurrentDo)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('font-awesome-icon', FontAwesomeIcon);

  }
}
