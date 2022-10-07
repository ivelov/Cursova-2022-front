import Vue from "vue";
import VueRouter from "vue-router";
//import App from '../App.vue'

import AppConferences from "../components/AppConferences";
import AppLogin from "../components/AppLogin";
import AppRegister from "../components/AppRegister";
import AppDetails from "../components/AppDetails";
import AppEdit from "../components/AppEdit";
import AppAdd from "../components/AppAdd";

Vue.use(VueRouter);
export default new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/conferences/1",
    },
    {
      path: "/conferences/:page",
      component: AppConferences,
    },
    {
      path: "/login",
      component: AppLogin,
      meta:{
        hideForAuth:true
      }
    },
    {
      path: "/register",
      component: AppRegister,
      meta:{
        hideForAuth:true
      }
    },
    {
      path: "/conference/:id",
      component: AppDetails,
      meta:{
        requireAuth:true
      }
    },
    {
      path: "/conference/:id/edit",
      component: AppEdit,
      meta:{
        requireEdit:true
      }
    },
    {
      path: "/add",
      component: AppAdd,
      requireAdd:true
    },
  ],
  mode: "history",
});
