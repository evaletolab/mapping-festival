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
  allEvents: CMS.Event[];
  allArtists: CMS.Artist[];
  allEventLocations: CMS.EventLocation[];
  events: CMS.Event[];
  artists: CMS.Artist[];
  eventLocations: CMS.EventLocation[];
  pages: CMS.Page[];  
  news: CMS.News [];
}



class CMSService {
  public STORAGE_KEY = "cms-progression";

  private activesLocations:string[] = []; 
  private activesArtists:string[] = []; 

  cms: CMS_Map = {
    allEvents: [],
    allArtists: [],
    allEventLocations: [],
    events: [],
    artists: [],
    eventLocations: [],
    pages: [],
    news: [],
  };

  constructor() {
    this.cms = Vue.observable(this.cms);
  }

  public get allEvents(): CMS.Event[]{
    return this.cms.allEvents;
  }

  public get allEventLocations(): CMS.EventLocation[] {
    return this.cms.allEventLocations;
  }

  public get allArtists(): CMS.Artist[]{
    return this.cms.allArtists;
  }

  public get events(): CMS.Event[]{
    return this.cms.events;
  }

  public get news(): CMS.News[]{
    return this.cms.news;
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

  public calendarContainsDatePickerItem(selectedDatePickerItem: CMS.CalendarDatePickerItem|null): boolean {
    if(!selectedDatePickerItem){
      return false;
    }
    const calendarItems = this.getCalendarFrom(this.events);
    return !!calendarItems.find((cal: CMS.Calendar) =>{
      const calDate = new Date(cal.moment);
      const dayIsTheSame = parseInt(selectedDatePickerItem.day) == parseInt(cal.date);
      const monthIsTheSame = parseInt(selectedDatePickerItem.month) == parseInt(`${calDate.getMonth() + 1}`); 
      return dayIsTheSame && monthIsTheSame;
    });
  }

  public getFestivalDatePickerItems(): CMS.CalendarDatePickerItem[]{
    const calendarItems = this.getCalendarFrom(this.events).sort((a: any, b: any)=>{
      return a._id - b._id;
    });

    const result = calendarItems.map((cal: CMS.Calendar, index: number) => {
      const date = new Date(cal.moment);
      return {
        day: `${cal.date}`.padStart(2, '0'),
        month: `${date.getMonth() + 1}`.padStart(2, '0'),
        selected: false,
      };
    });

    return result;
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
        const eventType = event.typology;
        if(!calendar[key]) {
          calendar[key] = {_id,selector,time,date,month,events:[],dayname, monthname, moment, eventType};          
        }
        event.when = [when];
        calendar[key].events.push(event);
      });        
    });
    const keys = Object.keys(calendar);
    return keys.map(key => {
      calendar[key].events = calendar[key].events.sort((a: CMS.Event, b: CMS.Event)=>{
        const currentDate = key.split(".")[0];

        // fully non trimmed events
        const eventA: CMS.Event = this.events.find(event => event._id == a._id)!;
        const eventB: CMS.Event = this.events.find(event => event._id == b._id)!;

        // FIX: improve date search (this will fail if event has 2 whens with same dayNumber, 
        // ex: when 13.april and when 13.may)
        const whenA = eventA.when.find(when => when.date == currentDate)!; 
        const whenB = eventB.when.find(when => when.date == currentDate)!; 

        return whenA.startTimeWeight - whenB.startTimeWeight;
      });
      return calendar[key] as CMS.Calendar;
    });
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
      this.cms.eventLocations = this.cms.allEventLocations = eventLocations.entries
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
      this.cms.artists = this.cms.allArtists = artists.entries
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
    
    // load news
    {
      const newsUrl = `${baseUrl}/api/collections/get/news`;
      const news = (await axios.get(newsUrl, config)).data;
      const localizedKeys = ["title", "abstract", "content"]
      this.cms.news = news.entries
        .map(entry => $cockpit.formatTranslations(entry, localizedKeys))
        .map(entry => $cockpit.formatNews(entry));
    }

    // load events (must be loaded last)
    {
      const eventsUrl = `${baseUrl}/api/collections/get/events`;
      const events = (await axios.get(eventsUrl, config)).data;
      const localizedKeys = ["title", "header", "content", "hardware", "notes"]
      this.cms.events = this.cms.allEvents = events.entries
        .map(entry => $cockpit.formatTranslations(entry, localizedKeys))
        .map(entry => $cockpit.formatEvent(this.eventLocations,this.artists,entry))
        .filter(item => !!item.when) // events with no when are invalid
        .filter(item => item.active);
      //console.log("my events", this.cms.events.filter(e => e.title.fr =="Lotus"));
    }


    const range = $config.config.landing.range;
    // console.log('---- loaded',range,this.cms.allEvents.length,this.cms.allArtists.length,this.cms.allEventLocations.length)

    //
    // not in range ?
    if(!range){
      return;  
    }

    this.cms.events = this.filterEventsByRange(range, this.cms.allEvents);
    this.cms.artists = this.filterArtistsByRange(range, this.cms.allArtists);
    this.cms.eventLocations = this.filterLocationsByRange(range, this.cms.allEventLocations);
    this.cms.news = this.filterNewsByRange(range, this.cms.news);
  }

  private filterArtistsByRange(range, artists) {
    this.activesArtists = this.events.map(event => event.artists).flat().map(artist => artist._id);
    // console.log('---- artistsByRange',this.activesArtists);
    return artists.filter(artist => this.activesArtists.indexOf(artist._id)>-1);

  }

  private filterLocationsByRange(range, locations:CMS.EventLocation[]) {
    this.activesLocations = this.events.map(event => event.when).flat().filter(when => when && when.eventLocation).map((when:any) => when.eventLocation._id)
    // console.log('---- locationsByRange',this.activesLocations);
    return locations.filter(location => this.activesLocations.indexOf(location._id)>-1);
  }

  private filterEventsByRange(range, events) {
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
    // console.log('---- eventsByRange',_events);
    return _events;

  }
  
  private filterNewsByRange(range, news) {
    // TODO: how should we handle this, there is no date associated to the news itself
    // for the time being we do nothing
    return news;
  }
}


//
// services start with $
export const $cms = new CMSService();