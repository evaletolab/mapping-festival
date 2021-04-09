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
  
  formatSlug(obj:any): void{
    const parts = obj.slug.split('/');
    obj.slug = parts[parts.length - 1];
  }

  addMeta(obj:any){
    obj.meta = {
      _mby: obj._mby,
      _by: obj._by,
      _modified: obj._modified,
      _created: obj._created,
    };
    delete obj._mby;
    delete obj._by;
    delete obj._modified;
    delete obj._created;

    delete obj._o;
    delete obj._pid;

    return obj;
  }

  formatEvent(event: any): CMS.Event{

    this.formatSlug(event);

    // TODO: evil bad 
    const geoId = event.when[0].value.localisation.id;
    const geo: any = this.cms.eventLocations.find(el => el._id === geoId) || null; 
    event.geo = geo; 

    event.when = event.when.map (w => {
      const v = w.value;
      const start = new Date(`${v.startDate} ${v.startHour}`);
      const end = new Date(`${v.endDate} ${v.endHour}`);
      const duration = (end.getTime() - start.getTime()) / 1000 / 60;
      const cancel = v.cancel;
      return { start, end, duration, cancel, };
    });

    event.medias = null; // TODO handle this

    event.artists = event.artists.map(a =>{
      const artist = this.cms.artists.find(artst => artst._id === a._id);
      const lastname = artist?.lastname || "";
      const slug = artist?.slug || "";
      const _id = a._id;

      return {
        lastname, slug, _id
      };
    });

    event.created = event._created;

    event = this.addMeta(event);

    return event as CMS.Event;
  }


  formatEventLocation(eventLocation:any): CMS.EventLocation{

    this.formatSlug(eventLocation);

    const geo = eventLocation.geo;
    eventLocation.street = geo.street;
    eventLocation.postalcode = geo.postalcode;
    eventLocation.city = geo.city;
    eventLocation.tag = geo.tag;
    eventLocation.coordinates = [geo.location.lng, geo.location.lat];


    delete eventLocation.geo;
    eventLocation = this.addMeta(eventLocation);

    return eventLocation as CMS.EventLocation;
  }

  formatArtist(artist:any): CMS.Artist{
    
    this.formatSlug(artist);

    artist.created = artist._created;
    artist = this.addMeta(artist);
    return artist as CMS.Artist;
  }

  async loadAll(force?: boolean){
    if(!force && this.cms.events.length) {
      return;
    }
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

    
    // load eventLocations
    {
      const eventsUrl = `${baseUrl}/collections/get/localisations`;
      const eventLocations = (await axios.get(eventsUrl, config)).data;
      const localizedKeys = ["name", "content"];
      this.cms.eventLocations = eventLocations.entries
        .map(entry => fixTranslations(entry, localizedKeys))
        .map(this.formatEventLocation.bind(this));
      console.log("eventLocations", this.cms.eventLocations);
    }
    
    // load artists
    {
      const eventsUrl = `${baseUrl}/collections/get/artists`;
      const artists = (await axios.get(eventsUrl, config)).data;
      const localizedKeys = ["content"];
      this.cms.artists = artists.entries
        .map(entry => fixTranslations(entry, localizedKeys))
        .map(this.formatArtist.bind(this));
      console.log("artists", this.cms.artists);
    }

    // load events (must be loaded last)
    {
      const eventsUrl = `${baseUrl}/collections/get/events`;
      const events = (await axios.get(eventsUrl, config)).data;
      const localizedKeys = ["title", "header", "content", "hardware", "notes"]
      this.cms.events = events.entries
        .map(entry => fixTranslations(entry, localizedKeys))
        .map(this.formatEvent.bind(this));
      console.log("events", this.cms.events);
    }
  }

  get events(): CMS.Event[]{
    return this.cms.events;
  }

  get eventLocations(): CMS.EventLocation[]{
    return this.cms.eventLocations;
  }

  get artists(): CMS.Artist[]{
    return this.cms.artists;
  }

}

//
// service start with $
export const $cms = new CMSService();