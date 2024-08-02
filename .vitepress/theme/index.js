// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import PersonalInfo from './components/PersonalInfo.vue'
import MNavLinks from './components/MNavLinks.vue'
import About from './components/About.vue'
import GiscusComment from './components/GiscusComment.vue'




import './style.css'
import './custom.css'
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
      // 'home-features-after': () => h(PersonalInfo)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('font-awesome-icon', FontAwesomeIcon);
    app.component('MNavLinks', MNavLinks);
    app.component('About',About);
    app.component('PersonalInfo',PersonalInfo);
    app.component('GiscusComment',GiscusComment);
  }
}
