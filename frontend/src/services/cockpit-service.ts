import { CMS } from "@/models";
import { Vue } from 'vue-property-decorator';
import { $config } from "./config-service";
import axios from 'axios';
import { latLng } from 'leaflet';
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
  private _diagnostics: string[] = [];

  constructor() {
  }

  public get diagnostics(): string[]{
    return this._diagnostics;
  }

  logError(error){
    console.warn(error);
    this._diagnostics.push(error);
  }  

  extractTranslation(map, key){
    const _en = map[key];
    const _fr = map[`${key}_fr`];

    return {
      fr: _fr || _en,
      en: _en || _fr,
    };
  }

  formatLocalMedias(obj:any){
    if(!obj.localMedias){
      obj.localMedias = [];
      return;
    }

    obj.localMedias = obj.localMedias.filter(media => media.value[""]).map(localMedia => {
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

      const baseUrl = $config.store.config.cms.baseUrl;
      const uploadsPath = $config.store.config.cms.uploadsPath;
      result.path = `${baseUrl}${uploadsPath}${result.path}`;

      for(const prop in result.sizes){
        const path = result.sizes[prop].path;
        result.sizes[prop].path = `${baseUrl}${uploadsPath}${path}`;
      }
      // console.log("path", result.path);

      result.created = new Date(result.created * 1000);
      result.modified = new Date(result.modified * 1000);
      return result;
    });
  }

  formatExternalMedias(obj:any){
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

  formatSocialMedias(obj:any){
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
      this.logError(`this object should have a slug ${JSON.stringify(obj)}` );
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
      this.logError(`this artist has no valid slug ${JSON.stringify(obj)}`);
      return;
    }

    while(this._artistSlugs.has(slug)){
      this.logError(`generating unduplicated slug for artist ${JSON.stringify(obj)}`);
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

  formatEvent(locations, artists, event: any): CMS.Event{

    this.formatSlugFromCMS(event);
    this.formatLocalMedias(event);
    this.formatExternalMedias(event);


    // if no whens we are invalid
    if(!event.when || event.when.length == 0){
      const errorMsg = `event with title <strong>${t(event.title)}</strong> is invalid (has zero whens);`
      this.logError(errorMsg);
    }

    // build **when** array
    event.when = (event.when||[]).map ((w, index) => {
      const v = w.value;
      const start = new Date(`${v.startDate} ${v.startHour}`);
      const end = new Date(`${v.endDate} ${v.endHour}`);
      const cancel = v.cancel;
      
      // extract eventLocation if present
      let eventLocation:CMS.EventLocation | null = null;
      if(v.localisation){
        const geoId = v.localisation[0]._id;
        eventLocation = locations.find(e => e._id === geoId) as CMS.EventLocation;
      }

      const id = index;
      if(isNaN(start.getTime())) {
        console.log('---FIXME invalid date',event,w)
      }
      return new CMS.When(start, end, cancel, eventLocation);
    });

    event.when.sort((a, b) => a.start - b.start);

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
    event.cover = event.cover || null;

    event.subType = event.subType || null;

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
    eventLocation.coordinates = geo.location ? latLng(geo.location.lat, geo.location.lng) : null;

    if(!eventLocation.street){
      this.logError(`eventlocation with name ${t(eventLocation.name)} has no street address`);
    }
    if(!eventLocation.coordinates){
      this.logError(`eventlocation with name ${t(eventLocation.name)} has no coordinates`);
    }

    eventLocation.cover = eventLocation.cover || null;
    eventLocation.website = eventLocation.website || null;
    
    delete eventLocation.geo;
    eventLocation = this.addMeta(eventLocation);

    return eventLocation as CMS.EventLocation;
  }

  formatArtist(artist:any): CMS.Artist{
    
    this.generateSlugForArtist(artist);
    this.formatLocalMedias(artist);
    this.formatExternalMedias(artist);
    this.formatSocialMedias(artist);

    artist.created = artist._created;
    artist = this.addMeta(artist);
    artist.firstname = artist.firstname || "";
    artist.lastname = artist.lastname || "";
    artist.artistname = artist.artistname || null;
    artist.cover = artist.cover || null;
    return artist as CMS.Artist;
  }

  formatTranslations (entry, keys){
    if(!entry) return;

    for(const key of keys){
      if(key in entry){
        entry[key] = this.extractTranslation(entry, key);
        delete entry[`${key}_fr`];
      }else{
        const errorMsg = `object ${entry._id} does not contain key ${key}`; 
        this.logError(errorMsg);
      }
    }

    return entry;
  }

}

//
// services start with $
export const $cockpit = new CockpitService();