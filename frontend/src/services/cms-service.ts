import { CMS } from "@/models";

import { Vue } from 'vue-property-decorator';

import { $config } from "./config-service";
import { $user } from "./user-service";


import axios from 'axios';

const authToken = "690a8296407bdd55ae785e519d02fe";

const defaultAxios = {
  headers: { 
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  }
};


interface CMS_Map{
  events: CMS.Event[];
  artists: CMS.Artist[];
  eventLocations: CMS.EventLocation[];
}

class CMSService {
  public STORAGE_KEY = "cms-progression";

  cms: CMS_Map = {
    events: [],
    artists: [],
    eventLocations: [],
  };

  constructor() {
    this.cms = Vue.observable(this.cms);
  }

  extractTranslation(map, key){
    const en = map[key];
    const fr = map[`${key}_fr`];

    return {
      fr,
      en,
    };
  }

  formatEvent(event){

  }

  async loadAll(){
    console.log("cms-service load all");
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
      this.cms.events: CMS.Event[] = events.entries.map(entry => fixTranslations(entry, localizedKeys)).map(formatEvents);
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