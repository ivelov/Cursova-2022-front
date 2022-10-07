import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify'
import router from './plugins/router';
import store from './plugins/store';
import VueAxios from 'vue-axios';
import axios from 'axios';
import VueSocialSharing from 'vue-social-sharing'
import * as VueGoogleMaps from 'vue2-google-maps';


Vue.use(VueAxios, axios)
Vue.use(VueSocialSharing)

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDvKC-wRgTVGX1cu1h7PKlfqb6eF4SIDp0',
    libraries: 'places', // This is required if you use the Autocomplete plugin
  },
})

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
        next({ path: '/' });
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

new Vue({
  el:'#app',
  vuetify,
  router,
  store,
  render: h => h(App)
})
