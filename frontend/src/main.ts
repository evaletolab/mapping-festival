

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import Vue from 'vue';
import './registerServiceWorker';

import './registerServiceWorker';
import App from './App.vue';
import './ts/class-component-hooks.ts';
import router from './router';


Vue.config.productionTip = false


import '@/main.scss'
import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';


import { $config, $user, $cms } from '@/services';
const load = [$config.get(), $cms.loadAll(), $user.get()];

Promise.all(load).
then(() => {
  Vue.use(VuePlyr);

  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})
.catch(e => {
  console.log("error", e);
})

