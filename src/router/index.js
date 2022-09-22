import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: resolve =>require(['../pages/Login.vue'],resolve)
    },
    {
      path: '/Home',
      component: resolve => require(['../components/Home.vue'], resolve),
      children: [
        {
          path: '/Info',
          component: resolve => require(['../pages/InfoPage.vue'], resolve)
        },
        {
          path: '/index',
          component: resolve => require(['../pages/index.vue'], resolve)
        },
        {
          path: '/Consumer',
          component: resolve => require(['../pages/ConsumerPage.vue'], resolve),
        },
        {
          path: '/VipConsumer',
          component: resolve => require(['../pages/VipUser.vue'], resolve),
          
        },
        {
          path: '/Singer',
          component: resolve => require(['../pages/SingerPage.vue'], resolve)
        },
        {
          path: '/Song',
          component: resolve => require(['../pages/SongPage.vue'], resolve)
        }, 
        {
          path: '/Collect',
          component: resolve => require(['../pages/Collect.vue'], resolve)
        },
        {
          path: '/Comment',
          component: resolve => require(['../pages/Comment.vue'], resolve)
        },
        {
          path: '/SongList',
          component: resolve => require(['../pages/SongListPage.vue'], resolve)
        },
        {
          path: '/ListSong',
          component: resolve => require(['../pages/ListSongPage.vue'], resolve)
        },
        {
          path: '/Vip',
          component: resolve => require(['../pages/VipPage.vue'], resolve)
        },
      ]
    }
  ]
})
