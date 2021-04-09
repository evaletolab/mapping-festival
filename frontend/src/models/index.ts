/* eslint-disable */
// TODO: discuss i18n with client
export namespace CMS {
  
  export enum AssetType
  {
      PNG = 'image/png',
      SVG = 'image/svg+xml',
      JPG = 'image/jpeg',
      MP4 = 'video/mp4',
      MP3 = 'audio/mpeg'
  }

  export interface Asset {
      type: AssetType;
      url: string;
  }

  export interface Config {
    version: string;
    themes: any;
  }

  //
  // user
  export interface User {
    id: string | false;
    name: string;
    created: Date;
    updated?: Date;
  }

  export type mediaType = ("video"|"image"|"audio"|"soundcloud"|"vimeo");
  export type eventType = ("emission"|"workshop"|"masterclass"|"table-ronde"|"concert"|"performance"|"nightclubbing");

  type Lat = number;
  type Lng = number;

  export interface EventLocation {
    _id:string
    slug:string,
    active:boolean,
    street: string,
    postalcode: string,
    city: string,
    tag: string,
    coordinates: [Lng, Lat], 
    content: {
      fr:string,
      en:string,
    }
  }

  export interface Artist {
    _id: string,
    slug:string,
    active: boolean,
    firstname:string,
    lastname:string,
    artistWebsite: string,
    content:{
      fr:string,
      en:string
    },  
    medias:{label:string,url:string,type:mediaType}[],  
    links:{url:string,label:string,css:string}[],  
    // published: Date,
    created: Date,
    // signature:string,
    // creator:string,
  }
  export interface Event {
    _id: string,
    slug: string,
    active: boolean,
    type: eventType,
    title:{
      fr:string,
      en:string
    },
    header:{
      fr:string,
      en:string
    },
    content:{
      fr:string,
      en:string
    },  
    hardware:{
      fr:string,
      en:string
    },  
    notes:{
      fr:string,
      en:string
    },  
    year:number,
    when:[{
      start:Date,
      end:Date,
      duration: number,
      cancel: boolean
    }],
    price: number,
    limit: number,
    geo: EventLocation | null,
    medias:[
      { label: string, url: string,type:mediaType }
    ],
    artists:[{
      lastname:string,
      slug:string,
      _id: string
    }],
    // published: Date,
    created: Date,
    // signature:string,
    // creator:string,    
  }

  export type Content = (Artist) ;

  // export interface Editor {
  //   id?:number;
  //   meta_title: string;
  //   meta_type: string;
  //   meta_tags: string;
  //   slug: string;
  //   content: Content;
  //   version: string;
  //   time: Date|number;
  //   published: boolean;
  // }
  
}

