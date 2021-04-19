

import '@fortawesome/fontawesome-free/css/all.css'

import Vue from 'vue';
import './registerServiceWorker';

import './registerServiceWorker';
import App from './App.vue';
import './ts/class-component-hooks.ts';
import router from './router';

Vue.config.productionTip = false


import '@/main.scss'
import "@/styles/dd_baseline_v04.css"; /* Typographic styles */
import "@/styles/specific_v01.css";    /* Waiting page specific styles */

// leaflet css
import 'leaflet/dist/leaflet.css';


import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';

import { $config, $user, $cms } from '@/services';

//
// filters
Vue.filter('shortdate', function(value) {
  const d = new Date(value);
  return d.getDate()+'.'+d.getMonth()+'.'+d.getFullYear();
});

const load = [$config.get(), $user.get()];

Promise.all(load)
.then(() => $cms.loadAll())
.then(() => {
  Vue.use(VuePlyr);

  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})
.catch(e => {
  console.log("error", e);
})

//
// Init CABLES
//const CABLES  is loaded on index.html;
declare const CABLES; 

document.addEventListener('CABLES.jsLoaded', function(event) {
  const showError = (id,msg) => alert('An error occured: ' + id + ', ' + msg);
  CABLES.patch = new CABLES.Patch({
      patch: CABLES.exportedPatch,
      prefixAssetPath: '',
      glCanvasId: 'glcanvas',
      glCanvasResizeToWindow: false,
      onError: showError,
      onPatchLoaded: () => {},
      onFinishedLoading: () =>{},
  });
});
