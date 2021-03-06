import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import proxy from './proxy';
import webpackPlugin from './plugin.config';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV } = process.env;
const plugins: IPlugin[] = [
  ['umi-plugin-antd-icon-config', {}],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];
export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  routes: [
    // 管理页
    {
      path: '/admin',
      component: '../layouts/SecurityLayout',
      authority: ['admin'],
      routes: [
        {
          path: '/admin',
          redirect: '/admin/login',
        },
        {
          path: '/admin/login',
          component: '../layouts/UserLayout',
          routes: [
            {
              name: 'login',
              path: '/admin/login',
              component: './user/login',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/admin/blog',
              name: 'blogManage',
              icon: 'smile',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/blog',
                  redirect: '/admin/blog/list',
                },
                {
                  path: '/admin/blog/list',
                  name: 'articleList',
                  icon: 'smile',
                  component: './admin/Blog/ArticleList',
                },
                {
                  path: '/admin/blog/creat',
                  name: 'articleCreate',
                  icon: 'smile',
                  component: './admin/Blog/ArticleCreate',
                },
              ],
            },
            {
              path: '/admin/photo',
              name: 'photoManage',
              icon: 'smile',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/photo',
                  redirect: '/admin/photo/list',
                },
                {
                  path: '/admin/photo/list',
                  name: 'photoList',
                  icon: 'smile',
                  component: './admin/Photo/List',
                },
                {
                  path: '/admin/photo/upload',
                  name: 'photoUpload',
                  icon: 'smile',
                  component: './admin/Photo/Upload',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    // 浏览页
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        // 首页
        {
          path: '/',
          component: './Home',
        },
        // 内容
        {
          path: '/',
          component: '../layouts/GuestLayout',
          routes: [
            {
              path: '/',
              name: 'home',
              icon: 'table',
              component: './Home',
            },
            {
              path: '/blog',
              name: 'blog',
              icon: 'table',
              component: './Blog',
            },
            {
              path: '/photo',
              name: 'photo',
              icon: 'table',
              component: './Photo',
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
} as IConfig;
