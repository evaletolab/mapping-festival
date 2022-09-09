import { CMS } from "@/models";
import { $config } from "./config-service";
import DiagnosticsLogger from "../helpers/DiagnosticsLogger";
import { t } from './i18n';


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



class CockpitService {

  private _artistSlugs: Set<string> = new Set<string>();
  private _diagnosticsLogger: DiagnosticsLogger = new DiagnosticsLogger();

  constructor() {
  }

  public get diagnostics(): string[]{
    return this._diagnosticsLogger.messages;
  }

  extractTranslation(map, key){
    const _en = map[key];
    const _fr = map[`${key}_fr`];

    return {
      fr: _fr || _en,
      en: _en || _fr,
    };
  }

  absolutePathForLocalMedia(relPath){
    if(!relPath) return null;

    const baseUrl = $config.store.config.cms.baseUrl;
    const uploadsPath = $config.store.config.cms.uploadsPath;
    const result =`${baseUrl}${uploadsPath}${relPath}`;
    return result;
  }

  formatNews(obj: any): CMS.News{
    obj.created = new Date(obj._created * 1000);
    this.formatSlugFromCMS(obj);
    this.formatLocalMedia(obj.featuredImage);
    return obj;
  }

  formatLocalMedia(obj:any): CMS.LocalMedia{

    obj.path = this.absolutePathForLocalMedia(obj.path);

    if(obj.sizes){
      for(const prop in obj.sizes){
        const path = obj.sizes[prop].path;
        obj.sizes[prop].path = this.absolutePathForLocalMedia(path);
      }
    }

    obj.created = new Date(obj.created * 1000);
    obj.modified = new Date(obj.modified * 1000);
    return obj;
  }

  formatLocalMediaCollection(obj:any){
    if(!obj.localMedias){
      obj.localMedias = [];
      return;
    }

    obj.localMedias = obj.localMedias.filter(media => media.value[""]).map(localMedia => {
      // f33up format support
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
      });

      result.path = this.absolutePathForLocalMedia(result.path);

      for(const prop in result.sizes){
        const path = result.sizes[prop].path;
        result.sizes[prop].path = this.absolutePathForLocalMedia(path);
      }
      // console.log("path", result.path);

      result.created = new Date(result.created * 1000);
      result.modified = new Date(result.modified * 1000);
      return result;
    });
  }

  formatExternalMediaCollection(obj:any){
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

  formatSocialMediaCollection(obj:any){
    if(!obj.socialMedias){
      obj.socialMedias = [];
      return;
    }
    
    obj.socialMedias = obj.socialMedias.map(socialMedia => {
      const platform = socialMedia.value.platform;
      const url = socialMedia.value.url;
      return { platform, url };
    }).sort((a, b) => {
      // sort social media according to hypeness
      const sortOrder = ["instagram", "facebook", "twitter", "linkedin"];
      const indexA = sortOrder.indexOf(a.platform);
      const indexB = sortOrder.indexOf(b.platform);
      if(indexA < 0 || indexB < 0){
        return 0;
      }
      return indexA - indexB; 
    });
  }
  
  formatSlugFromCMS(obj:any): void{
    if(!obj.slug) {
      this._diagnosticsLogger.log(`this object should have a slug ${JSON.stringify(obj)}` );
      return;
    }
    const parts = obj.slug.split('/');
    obj.slug = parts[parts.length - 1];
  }

  generateSlugForArtist(obj:any): void{
    const convertToSlug = (text) => text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
    let slug = "";
    if(obj.artistName){
      slug = obj.artistName;
    }else if(obj.firstname){
      slug = obj.firstname;
      if(obj.lastname){
        slug = `${obj.lastname}-${slug}`;
      }
    }

    if(!slug){
      this._diagnosticsLogger.log(`this artist has no valid slug ${JSON.stringify(obj)}`);
      return;
    }

    while(this._artistSlugs.has(slug)){
      this._diagnosticsLogger.log(`generating unduplicated slug for artist ${JSON.stringify(obj)}`);
      slug += obj._id;
    }
    this._artistSlugs.add(slug);

    obj.slug = convertToSlug(slug.trim());
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

  handleSpecialCaseCollectionVirtuelle(event: any){
    const startDate = 13;
    const endDate = 23;
    const month = 4; // 5 - 1
    let day = new Date(2021, 4, startDate);
    event.when = [];
    while(day.getDate() <= endDate){
      const start = new Date(day.getTime());
      start.setHours(6);
      const end = new Date(day.getTime());
      end.setHours(23);
      end.setMinutes(59);
      const when = new CMS.When(start, end, false, null);
      event.when.push(when);
      day.setDate(day.getDate() + 1);
    }

    return event;
  }

  formatEvent(locations, artists, event: any): CMS.Event{

    this.formatSlugFromCMS(event);
    this.formatLocalMediaCollection(event);
    this.formatExternalMediaCollection(event);

    if(event.type == 'Collection virtuelle'){
      this.handleSpecialCaseCollectionVirtuelle(event);
    }else{
      // if no whens we are invalid
      if (!event.when || event.when.length == 0) {
        const errorMsg = `event with title <strong>${t(event.title)}</strong> is invalid (has zero whens);`
        this._diagnosticsLogger.log(errorMsg);
      }

      // build **when** array
      event.when = (event.when || []).map((w, index) => {
        const v = w.value;
        // new Date("2021-05-06T16:25:00+02:00");

        const start = new Date(`${v.startDate}T${v.startHour}`);
        const end = new Date(`${v.endDate}T${v.endHour}`);
        const cancel = v.cancel;
        // console.log(v.startDate, v.startHour, start);
        // console.log(v.endDate, v.endHour, end);
        // console.log("-------------------------");

        // extract eventLocation if present
        let eventLocation: CMS.EventLocation | null = null;
        if (v.localisation) {
          const geoId = v.localisation[0]._id;
          eventLocation = locations.find(e => e._id === geoId) as CMS.EventLocation;
        }

        const id = index;
        {
          // date validation

          // start is present
          if (isNaN(start.getTime())) {
            this._diagnosticsLogger.log(`event with title ${t(event.title)} has invalid start date and/or invalid start time`);
            // console.log('---FIXME invalid date',event,w)
          }

          // end is present
          if (isNaN(end.getTime())) {
            this._diagnosticsLogger.log(`event with title ${t(event.title)} has invalid end date and/or invalid end time`);
          }

          // end is after start 
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            if (start.getTime() >= end.getTime()) {
              this._diagnosticsLogger.log(`event with title ${t(event.title)} has ends before is starts`);
            }
          }
        }

        return new CMS.When(start, end, cancel, eventLocation);
      }).filter(w => {
        //////////////////
        // remove multiday whens 
        // i.e. when lasting more than 24 hours
        const aDayInMinutes = 24 * 60;
        if (w.duration >= aDayInMinutes) {
          this._diagnosticsLogger.log(`event with title ${t(event.title)} has multi day when (was rejected)`);
        }
        return w.duration < aDayInMinutes;
      });

    }


    event.when.sort((a, b) => a.start.getTime() - b.start.getTime());

    event.medias = null; // TODO handle this

    event.artists = (event.artists||[]).map(a =>{
      const artist = artists.find(artst => artst._id === a._id);
      const lastname = artist?.lastname || "";
      const slug = artist?.slug || "";
      const _id = a._id;

      return {
        lastname, slug, _id
      };
    });

    event.created = event._created;
    event.cover = event.cover ? this.formatLocalMedia(event.cover) : null;

    event.subType = event.subType || null;
    
    if(event.notes){
      if(event.notes.fr){
        event.notes.fr = event.notes.fr.replace(/\n/g, "<br>");
      }
      if(event.notes.en){
        event.notes.en = event.notes.en.replace(/\n/g, "<br>");
      }
    }

    if(event.header){
      if(event.header.fr){
        event.header.fr = event.header.fr.replace(/\n/g, "<br>");
      }
      if(event.header.en){
        event.header.en = event.header.en.replace(/\n/g, "<br>");
      }
    }


    event = this.addMeta(event);

    return event as CMS.Event;
  }

  formatEventLocation(eventLocation:any): CMS.EventLocation{

    this.formatSlugFromCMS(eventLocation);

    const geo = eventLocation.geo;
    eventLocation.street = geo.street || "";
    eventLocation.postalcode = geo.postalcode || "";
    eventLocation.city = geo.city || "";
    eventLocation.tag = geo.tag || "";
    eventLocation.coordinates = geo.location ? [geo.location.lng, geo.location.lat] : null;
    eventLocation.type = eventLocation.type || "Standard";

    if(!eventLocation.street){
      this._diagnosticsLogger.log(`eventlocation with name ${t(eventLocation.name)} has no street address`);
    }
    if(!eventLocation.coordinates){
      this._diagnosticsLogger.log(`eventlocation with name ${t(eventLocation.name)} has no coordinates`);
    }

    eventLocation.cover = eventLocation.cover ? this.formatLocalMedia(eventLocation.cover) : null;
    eventLocation.website = eventLocation.website || null;
    
    delete eventLocation.geo;
    eventLocation = this.addMeta(eventLocation);

    return eventLocation as CMS.EventLocation;
  }

  formatArtist(artist:any): CMS.Artist{
    
    this.generateSlugForArtist(artist);
    this.formatLocalMediaCollection(artist);
    this.formatExternalMediaCollection(artist);
    this.formatSocialMediaCollection(artist);

    artist.created = artist._created;
    artist = this.addMeta(artist);
    artist.firstname = artist.firstname || "";
    artist.lastname = artist.lastname || "";
    artist.artistname = artist.artistname || null;
    artist.cover = artist.cover ? this.formatLocalMedia(artist.cover) : null;
    artist.country = artist.country || "";
    return artist as CMS.Artist;
  }

  formatPage(page: any): CMS.Page{
    this.formatSlugFromCMS(page);
    return page as CMS.Page;
  }

  formatTranslations (entry, keys){
    if(!entry) return;

    for(const key of keys){
      if(key in entry){
        entry[key] = this.extractTranslation(entry, key);
        delete entry[`${key}_fr`];
      }else{
        const errorMsg = `object ${entry._id} does not contain key ${key}`; 
        this._diagnosticsLogger.log(errorMsg);
      }
    }

    return entry;
  }

}

//
// services start with $
export const $cockpit = new CockpitService();