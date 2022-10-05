import Vue from 'vue';
import VueRouter from 'vue-router'
//import App from '../App.vue'

import AppConferences from '../components/AppConferences';
import AppLogin from '../components/AppLogin';
import AppRegister from '../components/AppRegister';
import AppDetails from '../components/AppDetails';


Vue.use(VueRouter);
export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/conferences/1'
    },
    {
      path: '/conferences/:page',
      component: AppConferences,
    },
    {
      path: '/login',
      component: AppLogin,
    },
    {
      path: '/register',
      component: AppRegister,
    },
    {
      path: '/conference/:id',
      component: AppDetails,
    },
  ],
  mode:'history'
})