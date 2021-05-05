

import '@fortawesome/fontawesome-free/css/all.css'

import Vue from 'vue';
import './registerServiceWorker';

import './registerServiceWorker';
import App from './App.vue';
import './ts/class-component-hooks.ts';
import router from './router';

Vue.config.productionTip = false



import "@/styles/reset.css";
import "@/styles/page.css";
import "@/styles/cardsgrid.css";
import "@/styles/dd_baseline.css"; 


import { $config, $user, $cms } from '@/services';

//
// filters
Vue.filter('shortdate', function(value) {
  const d = new Date(value);
  const result = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  return result;
});

const load = [$config.get(), $user.get()];

Promise.all(load)
.then(() => $cms.loadAll())
.then(() => {
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
