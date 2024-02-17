// import { defineConfig } from 'vitepress'

// import getLatestArticles from './theme/scripts/getLatestArticles.js';

// export default async () => {
//   const latestArticles = getLatestArticles();

//   return {
//     // ...其他配置...
//     themeConfig: {
//       title: "My Awesome Project",
//       description: "A VitePress Site",
//       themeConfig: {
//         logo: "https://binarycoder777-site.oss-cn-chengdu.aliyuncs.com/21707272915_.pic.jpg",
//         siteTitle: 'BinaryCoder777',
//         search: {
//           provider: 'local'
//         },
//         nav: [
//           { text: '主页', link: '/' },
//           { text: '日常随笔', link: '/markdown-examples' },
//           { text: '个人书库', link: '/markdown-examples' },
//           { text: '项目开发', link: '/markdown-examples' },
//           { text: '其他', link: '/markdown-examples' }
//         ],
    
//         footer: {
//           message: 'Released under the MIT License.',
//           copyright: 'Copyright © 2019-present BinaryCoder777'
//         },
    
//         sidebar: {
//           '/article/': [
//               {
//                 text: 'Examples',
//                 items: [
//                   { text: 'Markdown Examples', link: '/markdown-examples' },
//                   { text: 'Runtime API Examples', link: '/api-examples' }
//                 ]
//               },
//           ],
//           '/book/': [
//             {
//               text: 'Examples',
//               items: [
//                 { text: 'Markdown Examples', link: '/markdown-examples' },
//                 { text: 'Runtime API Examples', link: '/api-examples' }
//               ]
//             },
//           ],
//           '/project/': [
//             {
//               text: 'Examples',
//               items: [
//                 { text: 'Markdown Examples', link: '/markdown-examples' },
//                 { text: 'Runtime API Examples', link: '/api-examples' }
//               ]
//             },
//           ]
//         },
    
//         socialLinks: [
//           { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
//         ]
//       },
//       latestArticles:latestArticles
//     }
//   };
// };

// // https://vitepress.dev/reference/site-config
// // export default defineConfig({
// //   title: "My Awesome Project",
// //   description: "A VitePress Site",
// //   themeConfig: {
// //     logo: "https://binarycoder777-site.oss-cn-chengdu.aliyuncs.com/21707272915_.pic.jpg",
// //     siteTitle: 'BinaryCoder777',
// //     search: {
// //       provider: 'local'
// //     },
// //     nav: [
// //       { text: '主页', link: '/' },
// //       { text: '日常随笔', link: '/markdown-examples' },
// //       { text: '个人书库', link: '/markdown-examples' },
// //       { text: '项目开发', link: '/markdown-examples' },
// //       { text: '其他', link: '/markdown-examples' }
// //     ],

// //     footer: {
// //       message: 'Released under the MIT License.',
// //       copyright: 'Copyright © 2019-present BinaryCoder777'
// //     },

// //     sidebar: {
// //       '/article/': [
// //           {
// //             text: 'Examples',
// //             items: [
// //               { text: 'Markdown Examples', link: '/markdown-examples' },
// //               { text: 'Runtime API Examples', link: '/api-examples' }
// //             ]
// //           },
// //       ],
// //       '/book/': [
// //         {
// //           text: 'Examples',
// //           items: [
// //             { text: 'Markdown Examples', link: '/markdown-examples' },
// //             { text: 'Runtime API Examples', link: '/api-examples' }
// //           ]
// //         },
// //       ],
// //       '/project/': [
// //         {
// //           text: 'Examples',
// //           items: [
// //             { text: 'Markdown Examples', link: '/markdown-examples' },
// //             { text: 'Runtime API Examples', link: '/api-examples' }
// //           ]
// //         },
// //       ]
// //     },

// //     socialLinks: [
// //       { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
// //     ]
// //   }
// // })


// .vitepress/config.js
import getLatestArticles from './theme/scripts/getLatestArticles.js';

export default async () => {
  const latestArticles = await getLatestArticles();

  return {
    title: "My Awesome Project",
    description: "A VitePress Site",
    logo: "https://binarycoder777-site.oss-cn-chengdu.aliyuncs.com/21707272915_.pic.jpg",
    siteTitle: 'BinaryCoder777',
    search: {
      provider: 'local'
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '日常随笔', link: '/markdown-examples' },
      { text: '个人书库', link: '/markdown-examples' },
      { text: '项目开发', link: '/markdown-examples' },
      { text: '其他', link: '/markdown-examples' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present BinaryCoder777'
    },

    sidebar: {
      '/article/': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        },
      ],
      '/book/': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        },
      ],
      '/project/': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        },
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    // 注意：这里没有再次嵌套 themeConfig
    latestArticles: latestArticles
  };
};
