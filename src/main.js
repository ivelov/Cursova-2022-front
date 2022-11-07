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
import Pusher from "pusher-js";
import Echo from "laravel-echo";

Pusher.logToConsole = true;

    var pusher = new Pusher('4906f8eefb961b37dc0e', {
      cluster: 'eu'
    });

    var channel = pusher.subscribe('my-channel');
    channel.bind('ExportEvent', function(data) {
      //app.messages.push(JSON.stringify(data));
      console.log(data);
    });

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: '4906f8eefb961b37dc0e',
  cluster: 'eu',
  encrypted: true,
  host: "127.0.0.1:8000",
});

/*import Echo from "laravel-echo"

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'xxxxxxxxxxxxxxxxxxxx',
    cluster: 'eu',
    encrypted: true
});*/
/*
Pusher.logToConsole = true;

    var pusher = new Pusher('4906f8eefb961b37dc0e', {
      cluster: 'eu'
    });

    var channel = pusher.subscribe('my-channel');
    channel.bind('my-event', function(data) {
      app.messages.push(JSON.stringify(data));
    });
*/
axios.defaults.baseURL='/V1';
//axios.defaults.baseURL='http://ivelov-vm-api.groupbwt.com';
axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest'
};
axios.defaults.withCredentials = 'true';
axios.defaults.headers.common['Content-Type'] = 'application/json';
Vue.use(VueAxios, axios)
Vue.use(VueSocialSharing)

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDvKC-wRgTVGX1cu1h7PKlfqb6eF4SIDp0',
    libraries: 'places', 
  },
})

Vue.use(wysiwyg, {hideModules: { "image": true }});

Vue.use(VueCookies);

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

new Vue({
  el:'#app',
  vuetify,
  router,
  store,
  render: h => h(App)
})
