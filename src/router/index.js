import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import Editor from '@/components/Editor'

Vue.use(Router)
Vue.use(Vuex)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Editor',
      component: Editor
    }
  ]
})
