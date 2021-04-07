
import Vue from "vue";

export enum Lang {
    fr = 'fr', 
    en = 'en',
}

export const currentLangStore = Vue.observable({ lang: Lang.fr });

export function setLang(lang: Lang): void {
    currentLangStore.lang = lang;
}

export function t(obj){
    const value = obj[currentLangStore.lang];
    return value || "";
}

