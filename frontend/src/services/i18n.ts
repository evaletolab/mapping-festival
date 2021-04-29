import { $config } from './config-service';
import Vue from "vue";

export enum Lang {
    fr = 'fr', 
    en = 'en',
}

// check if currentLang is set in storage
const langStorageKey = "mapping-lang";
let currentLang = $config.storageGet(langStorageKey);
if(!currentLang || (currentLang.lang != Lang.fr && currentLang.lang != Lang.en)){
    // else assume we want english
    currentLang = {
        lang: Lang.en,
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

