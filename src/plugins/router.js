import Vue from "vue";
import VueRouter from "vue-router";
import store from './store';

import AppConferences from "../pages/AppConferences";
import AppLogin from "../pages/AppLogin";
import AppRegister from "../pages/AppRegister";
import AppDetails from "../pages/AppDetails";
import AppEdit from "../pages/AppEdit";
import AppAdd from "../pages/AppAdd";
import AppReportAdd from "../pages/AppReportAdd";
import AppReports from "../pages/AppReports";
import AppReportDetails from "../pages/AppReportDetails";
import AppReportEdit from "../pages/AppReportEdit";
import AppAccountEdit from "../pages/AppAccountEdit";

Vue.use(VueRouter);
const router = new VueRouter({
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
    },
    {
      path: "/account/favorites/reports/:favPage",
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
      path: "/account/edit",
      component: AppAccountEdit,
      meta:{
        requireAuth:true
      }
    }
  ],
  mode: "history",
  
});

router.beforeEach((to, from, next) => {

  if (to.meta.hideForAuth) {
      if (store.getters.isAuth) {
        next({ path: '/' });
      } else {
        next();
      }

  } else if (to.meta.requireAuth){
    if (store.getters.isAuth) {
        next();
    } else {
        next({ path: '/login' });
    }

  } else if (to.meta.requireEdit){
    if (store.getters.getCurrentConferenceData.canUpdate) {
        next();
    } else {
        next({ path: '/' });
    }
  } else if (to.meta.requireAdd){
    if (store.getters.canAdd) {
      next();
    } else {
        next({ path: '/' });
    }
  }
  next();
});

export default router;