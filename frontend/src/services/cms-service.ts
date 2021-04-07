import { CMS } from "@/models";

import { Vue } from 'vue-property-decorator';

import { $config } from "./config-service";
import { $user } from "./user-service";


import axios from 'axios';

const defaultAxios = {
  headers: { 
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer abcd'
  }
};



class CMSService {
  public STORAGE_KEY = "cms-progression";

  public cms: any = {};

  constructor() {
    this.cms = Vue.observable({});
  }

  extractTranslation(map, key){
    const en = map[key];
    const fr = map[`${key}_fr`];

    return {
      fr,
      en,
    };
  }

  async loadAll(){
    const user = await $user.get();
    const baseUrl = "https://iziapi.ch/mappingDev/index/api";
    const config = Object.assign({},defaultAxios) as any;

    const fixTranslations = (entry, keys) => {
      for(const key of keys){
        if(key in entry){
          entry[key] = this.extractTranslation(entry, key);
          delete entry[`${key}_fr`];
        }else{
          console.warn("object", entry, "does not contain key", key);
        }
      }

      return entry;
    }

    // load events
    {
      const eventsUrl = `${baseUrl}/collections/get/events`;
      const events = (await axios.get(eventsUrl, config)).data;
      const localizedKeys = ["title", "header", "content", "hardware", "notes"]
      this.cms.events = events.entries.map(entry => fixTranslations(entry, localizedKeys));
      console.log(this.cms.events);
    }
    
    // load eventLocations
    {
      const eventsUrl = `${baseUrl}/collections/get/localisations`;
      const eventLocations = (await axios.get(eventsUrl, config)).data;
      const localizedKeys = ["name", "content"];
      this.cms.eventLocations = eventLocations.entries.map(entry => fixTranslations(entry, localizedKeys));
      console.log(this.cms.eventLocations);
    }
    
    // load artists
    {
      const eventsUrl = `${baseUrl}/collections/get/artists`;
      const artists = (await axios.get(eventsUrl, config)).data;
      const localizedKeys = ["content"];
      this.cms.artists = artists.entries.map(entry => fixTranslations(entry, localizedKeys));
      console.log(this.cms.artists);
    }
  }

  get events(){
    return this.cms.events;
  }

  get eventLocations(){
    return this.cms.eventLocations;
  }

  get artists(){
    return this.cms.artists;
  }

}

//
// service start with $
export const $cms = new CMSService();