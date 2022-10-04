import Vue from 'vue';
import VueRouter from 'vue-router'
//import App from '../App.vue'

import appConferences from '../components/AppConferences';
Vue.use(VueRouter);
export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/conferences/1'
    },
    {
      path: '/conferences/:page',
      component: appConferences,
    }
  ],
  mode:'history'
})