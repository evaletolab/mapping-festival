import { $config } from './config-service';
import Vue from "vue";

export enum Lang {
    fr = 'fr', 
    en = 'en',
}

function initialLang() {
    //
    // i18n init, default is FR
    const lang = navigator.language || navigator['userLanguage'];   
    if (/^en\b/.test(lang)) {
      return Lang.en;
    }
    if (/^fr\b/.test(lang)) {
      return Lang.fr;
    }
    return Lang.en;
}

//
// check if currentLang is set in storage
const langStorageKey = "mapping-lang";
let currentLang = $config.storageGet(langStorageKey);
if(!currentLang || (currentLang.lang != Lang.fr && currentLang.lang != Lang.en)){
    // else assume we want english
    currentLang = {
        lang: initialLang(),
    };
}

export const currentLangStore = Vue.observable(currentLang);

export function setLang(lang: Lang): void {
    currentLangStore.lang = lang;
    let newLang = {
        lang,
    };
    $config.storageSet(langStorageKey, newLang);
}

export function t(obj){
    const value = obj[currentLangStore.lang];
    return value || "";
}

class i18nService {
    constructor() {
    }
    get lang() {
        return currentLangStore.lang;
    }

    set lang(value: Lang) {
        setLang(value);
    }

    t(key) {
        if(!$config.config.i18n || !$config.config.i18n[key]) {
            return key;
        }
        return $config.config.i18n[key][currentLangStore.lang];
    }
}

export const $i18n = new i18nService();