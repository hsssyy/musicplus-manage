import { listenerCount } from 'node-notifier'
import { compare } from 'semver'
import Vue from 'vue'
import Router from 'vue-router'
//import { component } from 'vue/types/umd'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   component: resolve =>require(['../pages/Login.vue'],resolve)
    // },
    {
      path: '/',
      component: resolve => require(['../components/Home.vue'], resolve),
      children: [
        {
          path: '/Info',
          component: resolve => require(['../pages/InfoPage.vue'], resolve)
        },
        {
          path: '/Consumer2',
          component: resolve => require(['../pages/ConsumerPage.vue'], resolve),
        },
        {
          path: '/VipConsumer',
          component: resolve => require(['../pages/user/VipUser.vue'], resolve),
          
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
          path: '/SongList',
          component: resolve => require(['../pages/SongListPage.vue'], resolve)
        },
        {
          path: '/ListSong',
          component: resolve => require(['../pages/ListSongPage.vue'], resolve)
        },
        ,
        {
          path: '/Auth',
          component: resolve => require(['../pages/auth/index.vue'], resolve),
          redirect: '/Auth/Roles',
          children: [
            {
              path: 'Roles-List',
              component: resolve => require(['../pages/auth/RolesList.vue'], resolve)
            },
            {
              path: 'Auth-List',
              component: resolve => require(['../pages/auth/AuthList.vue'], resolve)
            },
          ]
        },
      ]
    }
  ]
})
