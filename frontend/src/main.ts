

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
import "@/styles/dd_baseline_v04.css"; /* Typographic styles */
import "@/styles/specific_v01.css";    /* Waiting page specific styles */

import { $config, $user, $cms } from '@/services';
const load = [$config.get(), $cms.loadAll(), $user.get()];

Promise.all(load).
then(() => {
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
