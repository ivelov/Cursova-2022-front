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
import AppCategoryAdd from "../components/AppCategoryAdd";
import AppCategoryEdit from "../components/AppCategoryEdit";
import AppCategories from "../components/AppCategories";


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
      path: "/conferences/:page/:category",
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
      path: "/reports/:page/:category",
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
    {
      path: "/categories",
      component: AppCategories,
      meta:{
        requireAuth:true
      }
    },
    {
      path: "/addCategory",
      component: AppCategoryAdd,
      meta:{
        requireAuth:true
      }
    },
    {
      path: "/editCategory/:id",
      component: AppCategoryEdit,
      meta:{
        requireAuth:true
      }
    },
    
    
  ],
  mode: "history",
});
