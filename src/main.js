import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify'
import router from './plugins/router';
import store from './plugins/store';
import VueAxios from 'vue-axios';
import axios from 'axios';



Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  el:'#app',
  vuetify,
  router,
  store,
  render: h => h(App)
})
