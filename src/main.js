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

new Vue({
  el:'#app',
  vuetify,
  router,
  store,
  render: h => h(App)
})
