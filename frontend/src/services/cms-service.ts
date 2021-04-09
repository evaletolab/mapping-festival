import { CMS } from "@/models";

import { Vue } from 'vue-property-decorator';

import { $config } from "./config-service";
import { $user } from "./user-service";


import axios from 'axios';

const baseUrl = "https://iziapi.ch/mappingDev/index/api";
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

  public get events(): CMS.Event[]{
    return this.cms.events;
  }

  public get eventLocations(): CMS.EventLocation[]{
    return this.cms.eventLocations;
  }

  public get artists(): CMS.Artist[]{
    return this.cms.artists;
  }

  public async loadAll(force?: boolean){
    if(!force && this.cms.events.length) {
      return;
    } 
    console.log("cms-service load all");
    const user = await $user.get();
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

  private extractTranslation(map, key){
    const en = map[key];
    const fr = map[`${key}_fr`];

    return {
      fr,
      en,
    };
  }

  private formatLocalMedias(obj:any){
    if(!obj.localMedias){
      obj.localMedias = [];
      return;
    }

    obj.localMedias = obj.localMedias.map(localMedia => {
      const lm = localMedia.value;
      
      let result: any = {
        name: lm.name,  
      };

      [
        "_id", "path", "title", "mime", "description",
        "tags", "size", "image", "video", "audio",
        "archive", "document", "code", "created", "modified",
        "width", "height", "colors", "sizes"
      ].forEach(attr => {
        result[attr] = lm[""][attr];
      })

      result.created = new Date(result.created * 1000);
      result.modified = new Date(result.modified * 1000);
      return result;
    });
  }

  private formatExternalMedias(obj:any){
    if(!obj.externalMedias){
      obj.externalMedias = [];
      return;
    }

    obj.externalMedias = obj.externalMedias.map(externalMedia => {
      const name = externalMedia.value.name; 
      const platform = externalMedia.value.platform;
      const url = externalMedia.value.url;
      return { name, platform, url };
    });
  }

  private formatSocialMedias(obj:any){
    if(!obj.socialMedias){
      obj.socialMedias = [];
      return;
    }
    
    obj.socialMedias = obj.socialMedias.map(socialMedia => {
      const platform = socialMedia.value.platform;
      const url = socialMedia.value.url;
      return { platform, url };
    });
  }
  
  private formatSlug(obj:any): void{
    const parts = obj.slug.split('/');
    obj.slug = parts[parts.length - 1];
  }

  private addMeta(obj:any){
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

  private formatEvent(event: any): CMS.Event{

    this.formatSlug(event);
    
    this.formatLocalMedias(event);
    this.formatExternalMedias(event);

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


  private formatEventLocation(eventLocation:any): CMS.EventLocation{

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

  private formatArtist(artist:any): CMS.Artist{
    
    this.formatSlug(artist);

    this.formatLocalMedias(artist);
    this.formatExternalMedias(artist);
    this.formatSocialMedias(artist);

    artist.created = artist._created;
    artist = this.addMeta(artist);
    return artist as CMS.Artist;
  }
}

//
// services start with $
export const $cms = new CMSService();