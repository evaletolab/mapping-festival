import Vue from "vue";
import axios from 'axios';

const defaultAxios = {
  headers: { 'Cache-Control': 'no-cache' }
};




class ConfigService {
  // More about store
  // https://fr.vuejs.org/v2/guide/reactivity.html
  private _store: any;
  // private _baseUrl = process.env.BASE_URL;
  private _cmsBaseUrl = "https://iziapi.ch/mappingDev/index";

  private _lang = 'fr';
 
  constructor() {
    this._store = Vue.observable({
      config: {}
    });

    //
    // i18n init, default is FR
    const lang = navigator.language || navigator['userLanguage'];   
    if (/^en\b/.test(lang)) {
      this._lang = "fr";
    }
    if (/^fr\b/.test(lang)) {
      this._lang = "fr";
    }
    if (/^de\b/.test(lang)) {
      this._lang = "de";
    }

  }

  get config() {
    return this._store.config;
  }

  get store() {
    return this._store;
  }

  get lang() {
    return this._lang;
  }

  i18n(key) {
    if(!this.config.i18n) {
      return '';
    }
    return this.config.i18n[this._lang][key];
  }  

  async get(force?: boolean){
    if(!this._store.config.done && !force) {
      const url = `${this._cmsBaseUrl}/api/singletons/get/config`;
      const res = await axios.get(url ,defaultAxios);
      this._store.config = res.data.content;
      this._store.config.cms.baseUrl = this._cmsBaseUrl; // sanity check!
      console.log('--',this._store.config);
      this._store.config.done = true;

      // console.log('---DBG', JSON.stringify(this._store,null,2))
      //
      // generate root colors
      this.generateColors(this._store.config.themes);
    }

    console.log("config loaded");
    return this._store.config;
  }  

  getMenu(layout) {
    const menu = this._store.config.menu || [];
    return menu.filter(menu => menu.layout == layout && menu.active); 
  }

  generateColors(themes){
    const root = document.documentElement;
    Object.keys(themes).forEach(theme => {
      const primary = themes[theme].primary
      root.style.setProperty('--theme-'+theme+'-primary',primary);

      const secondary = themes[theme].secondary
      root.style.setProperty('--theme-'+theme+'-secondary',secondary);

      const tertiary = themes[theme].tertiary
      root.style.setProperty('--theme-'+theme+'-tertiary',tertiary);
    });
  }

  //
  // Detects if device is on iOS
  isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent ) ;
  }

  //
  // is Safari
  isSafari() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /^((?!chrome|android).)*safari/i.test(userAgent);
  }

  isAndroid() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android/i.test(userAgent);
  }

  //
  // Detects if device is in standalone mode
  isInStandaloneMode(){ 
    const $window = window as any;    
    const standalone = (window.matchMedia('(display-mode: standalone)').matches);
    return ($window.navigator.standalone) || standalone;
  }

  //
  // Detects if device is in standalone mode
  isMobile(){ 
    const $window = window as any;    
    const mobile = (window.matchMedia('(max-width: 426px)').matches);
    return mobile;
  }


  storageGet(key: string) {
    try {
      const item = localStorage.getItem(key);
      const parsed = JSON.parse(item as string);
      return parsed;
    } catch (err) {
      return null;
    }
  }

  storageSet(key: string, value: any) : boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }
  
}

//
// service start with $
export const $config = new ConfigService();