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

  private activesLocations:string[] = []; 
  private activesArtists:string[] = []; 

  cms: CMS_Map = {
    events: [],
    artists: [],
    eventLocations: [],
    pages: [],
  };

  constructor() {
    this.cms = Vue.observable(this.cms);
  }

  // public get events(): CMS.Event[]{
  //   return this.cms.events;
  // }

  //
  // FIXME, currently events are filtered by Festival.Range
  public get events(): CMS.Event[]{
    return this.cms.events;
  }

  public get eventLocations(): CMS.EventLocation[] {
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

    (events||this.events).forEach(source =>{
      const event = Object.assign({},source);
      const times = (event.when||[]).slice();
      times.forEach(when => {
        const date: string = when.date;
        const month = when.month;
        const key = date+'.'+month;
        const _id = when._id + (counter);
        const time = when.startTime;
        const moment =  new Date(when.start.getTime());
        const selector = date + '.' + month;
        const dayname = $config.store.config.time.days[when.start.getDay()];
        const monthname = $config.store.config.time.months[when.start.getMonth()];         
        const eventType = event.type;
        if(!calendar[key]) {
          calendar[key] = {_id,selector,time,date,month,events:[],dayname, monthname, moment, eventType};          
        }
        event.when = [when];
        calendar[key].events.push(event);
      });        
    });
    const keys = Object.keys(calendar);
    return keys.map(key => {
      calendar[key].events = calendar[key].events.sort((a,b)=>{

        // ensure performance is shown first
        // presentation order
        // lowest valid weight is 1
        const sortWeigths = {
            "Performance": 1,
            "Installation": 8,
            "Collection virtuelle": 3,
            "Masterclass": 4,
            "mppngTV": 5,
            "Parcours urbain": 6,
            "Workshop": 7,
        };
        const weightA = sortWeigths[a.type] || 10;
        const weightB = sortWeigths[b.type] || 10;
        const result = weightA - weightB;
        if(result == 0){
          // we are in same category so we want to "sub"sort on title
          return a.title.fr.toLowerCase().localeCompare(b.title.fr.toLowerCase());
        }else{
          return result;
        }
        // return a.when[0].startTimeWeight - b.when[0].startTimeWeight;
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
      //console.log("my events", this.cms.events.filter(e => e.title.fr =="Lotus"));
    }

    //
    // FIXME: constraint by range
    this.cms.events = this.filterEventsByRange(this.cms.events);
    this.cms.artists = this.filterArtistsByRange(this.cms.artists);
    this.cms.eventLocations = this.filterLocationsByRange(this.cms.eventLocations);
  }

  private filterArtistsByRange(artists) {
    this.activesArtists = this.events.map(event => event.artists).flat().map(artist => artist._id);
    //console.log('---- artistsByRange',this.activesArtists);
    return this.cms.artists.filter(artist => this.activesArtists.indexOf(artist._id)>-1);

  }

  private filterLocationsByRange(locations:CMS.EventLocation[]) {
    this.activesLocations = this.events.map(event => event.when).flat().filter(when => when && when.eventLocation).map((when:any) => when.eventLocation._id)
    //console.log('---- locationsByRange',this.activesLocations);
    return locations.filter(location => this.activesLocations.indexOf(location._id)>-1);
  }

  private filterEventsByRange(events) {
    const range = $config.config.landing.range;
    //
    // not in range ?
    if(!range){
      return events  
    }

    const _events = this.events.filter(event => {
      // FIXME, this should never happen!
      if(!event.when||!event.when.length) {
        return false;
      }
      //
      // read the first should be enough
      const date = event.when[0];
      return date.start >= range.from && date.start <= range.to;
    });
    //console.log('---- eventsByRange',_events);
    return _events;

  }
}

//
// services start with $
export const $cms = new CMSService();