// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

import MNavLinks from './components/MNavLinks.vue'
import About from './components/About.vue'
import GiscusComment from './components/GiscusComment.vue'

import { inBrowser } from 'vitepress'
import busuanzi from 'busuanzi.pure.js'


import './style.css'
import './custom.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import CustomHomePage from './components/CustomHomePage.vue';


library.add(fas, fab);


/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {

    })
  },
  async enhanceApp({ app, router, siteData }) {
    // ...
    app.component('font-awesome-icon', FontAwesomeIcon);
    app.component('MNavLinks', MNavLinks);
    app.component('About',About);
    app.component('CustomHomePage',CustomHomePage);
    app.component('GiscusComment',GiscusComment);
    if (inBrowser) {
      router.onAfterRouteChanged = () => {
        busuanzi.fetch()
      }
    }
    if (!import.meta.env.SSR) {
      const { loadOml2d } = await import('oh-my-live2d');
      loadOml2d({
        models: [
          {
            path: 'https://raw.githubusercontent.com/iCharlesZ/vscode-live2d-models/master/model-library/hijiki/hijiki.model.json'
          }
        ],
        dockedPosition: "right",
        menus: {
          disable: true,
        },
      });
    }
  }
}
