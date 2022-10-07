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
    },
    {
      path: "/register",
      component: AppRegister,
    },
    {
      path: "/conference/:id",
      component: AppDetails,
    },
    {
      path: "/conference/:id/edit",
      component: AppEdit,
    },
    {
      path: "/add",
      component: AppAdd,
    },
  ],
  mode: "history",
});
