import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify'
import router from './plugins/router';
import store from './plugins/store';
import VueAxios from 'vue-axios';
import axios from 'axios';
import VueSocialSharing from 'vue-social-sharing'
import * as VueGoogleMaps from 'vue2-google-maps';
import wysiwyg from "vue-wysiwyg";
import VueCookies from 'vue-cookies'

axios.defaults.baseURL= process.env.VUE_APP_API_URL;
axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest'
};
axios.defaults.withCredentials = 'true';
axios.defaults.headers.common['Content-Type'] = 'application/json';
Vue.use(VueAxios, axios);

Vue.use(VueSocialSharing);

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GMAP_KEY,
    libraries: 'places', 
  },
})

Vue.use(wysiwyg, {hideModules: { "image": true }});

Vue.use(VueCookies);

new Vue({
  el:'#app',
  vuetify,
  router,
  store,
  render: h => h(App)
})
