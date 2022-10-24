import Vue from "vue";
import VueRouter from "vue-router";
//import App from '../App.vue'

import AppConferences from "../components/AppConferences";
import AppLogin from "../components/AppLogin";
import AppRegister from "../components/AppRegister";
import AppDetails from "../components/AppDetails";
import AppEdit from "../components/AppEdit";
import AppAdd from "../components/AppAdd";
import AppReportAdd from "../components/AppReportAdd";
import AppReports from "../components/AppReports";
import AppReportDetails from "../components/AppReportDetails";
import AppReportEdit from "../components/AppReportEdit";

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
    {
      path: "/reports/:page",
      component: AppReports,
      meta:{
        requireAuth:true
      }
    },
    {
      path: "/addReport/:confId",
      component: AppReportAdd,
      meta:{
        requireAuth:true
      }
    },
    {
      path: "/report/:repId",
      component: AppReportDetails,
      meta:{
        requireAuth:true
      }
    },
    {
      path: "/report/:repId/edit",
      component: AppReportEdit,
      meta:{
        requireAuth:true
      }
    },
  ],
  mode: "history",
});
