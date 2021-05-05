import { CMS } from "@/models";
import { Vue } from 'vue-property-decorator';
import { $config } from "./config-service";
import { $cockpit } from "./cockpit-service";
import axios from 'axios';


function getAxiosOptions(){

  const authToken = $config.store.config.cms.authToken;
  return {
    headers: { 
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    }
  };
}


interface CMS_Map{
  events: CMS.Event[];
  artists: CMS.Artist[];
  eventLocations: CMS.EventLocation[];
  pages: CMS.Page[];
}



class CMSService {
  public STORAGE_KEY = "cms-progression";

  cms: CMS_Map = {
    events: [],
    artists: [],
    eventLocations: [],
    pages: [],
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

  public get pages(): CMS.Page[]{
    return this.cms.pages;
  }

  public getCalendarFrom(events?: CMS.Event[]): CMS.Calendar[] {
    const calendar = {};
    let counter = 10;    

    (events||this.events).forEach(event =>{      
      const times = (event.when||[]).slice();
      times.forEach(when => {
        const date: string = when.date;
        const month = when.month;
        const key = date+'.'+month;
        const _id = when._id + (counter);
        const time = when.startTime;
        const ms = when._id;
        const selector = date + '.' + month;
        if(!calendar[key]) {
          calendar[key] = {_id,selector,time,date,month,events:[]};          
        }
        //
        // only one time per event
        event._id = ''+(counter++);
        event.when = [when];
        calendar[key].events.push(event);
      });        
    })
    const keys = Object.keys(calendar);
    return keys.map(key => {
      calendar[key].events = calendar[key].events.sort((a,b)=>{
        return a.when[0].startTimeWeight - b.when[0].startTimeWeight;
      });
      return calendar[key] as CMS.Calendar;
    })
  }


  public async loadAll(force?: boolean){
    if(!force && this.cms.events.length) {
      return;
    } 
    console.log("cms-service load all");
    const config = Object.assign({}, getAxiosOptions()) as any;

    const baseUrl = $config.store.config.cms.baseUrl;
    
    // load eventLocations
    {
      const eventsUrl = `${baseUrl}/api/collections/get/localisations`;
      const eventLocations = (await axios.get(eventsUrl, config)).data;
      const localizedKeys = ["name", "content"];
      this.cms.eventLocations = eventLocations.entries
        .map(entry => $cockpit.formatTranslations(entry, localizedKeys))
        .map(entry => $cockpit.formatEventLocation(entry))
        .filter(item => item.active);
      //console.log("eventLocations", this.cms.eventLocations);
    }
    
    // load artists
    {
      const eventsUrl = `${baseUrl}/api/collections/get/artists`;
      const artists = (await axios.get(eventsUrl, config)).data;
      const localizedKeys = ["content"];
      this.cms.artists = artists.entries
        .map(entry => $cockpit.formatTranslations(entry, localizedKeys))
        .map(entry => $cockpit.formatArtist(entry))
        .filter(item => item.active);
      // console.log("artists", this.cms.artists);
    }
    
    // load pages
    {
      const eventsUrl = `${baseUrl}/api/collections/get/pages`;
      const events = (await axios.get(eventsUrl, config)).data;
      const localizedKeys = ["title", "header", "content"];
      this.cms.pages = events.entries
        .map(entry => $cockpit.formatTranslations(entry, localizedKeys))
        .map(entry => $cockpit.formatPage(entry))
        .filter(item => item.active);
      // console.log("pages", this.cms.pages);
    }

    // load events (must be loaded last)
    {
      const eventsUrl = `${baseUrl}/api/collections/get/events`;
      const events = (await axios.get(eventsUrl, config)).data;
      const localizedKeys = ["title", "header", "content", "hardware", "notes"]
      this.cms.events = events.entries
        .map(entry => $cockpit.formatTranslations(entry, localizedKeys))
        .map(entry => $cockpit.formatEvent(this.eventLocations,this.artists,entry))
        .filter(item => !!item.when) // events with no when are invalid
        .filter(item => item.active);
      //console.log("events", this.cms.events);
    }
  }

}

//
// services start with $
export const $cms = new CMSService();