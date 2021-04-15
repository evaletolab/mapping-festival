/* eslint-disable */

import { LatLng } from 'leaflet';

export namespace CMS {
  
  export enum MimeType
  {
      PNG = 'image/png',
      SVG = 'image/svg+xml',
      JPG = 'image/jpeg',
      MP4 = 'video/mp4',
      MP3 = 'audio/mpeg'
  }

  export interface Config {
    version: string;
    themes: any;
  }

  export type socialPlatformType = ("facebook"|"twitter"|"instagram"|"linkedin");
  export interface SocialMedia {
    platform: socialPlatformType,
    url:string,
  }

  
  export type mediaPlatformType = ("youtube"|"video"|"img"|"audio"|"soundcloud"|"vimeo");
  export interface ExternalMedia {
    name: string,
    platform: mediaPlatformType,
    url:string,
  }

  export interface SizeVariant {
    path: string,
    width: number,
    height: number,
    size: number,
  }

  export interface LocalMedia{
    _id: string,
    name: string,
    path: string,
    title: string,
    mime: string,
    description: string,
    tags: string[],
    size: number
    image: boolean,
    video: boolean,
    audio: boolean,
    archive: boolean,
    document: boolean,
    code: boolean,
    created: Date,
    modified: Date,
    width: number,
    height: number,
    colors: string[],

    sizes:{
      small: SizeVariant,
      thumbs: SizeVariant,
      headerimage: SizeVariant,
      full: SizeVariant,
    },
  
  }

  //
  // user
  export interface User {
    id: string | false;
    name: string;
    created: Date;
    updated?: Date;
  }

  // export type eventType = ("emission"|"workshop"|"masterclass"|"table-ronde"|"concert"|"performance"|"nightclubbing");
  const _eventType = ["Installation", "Live", "Masterclass", "Collection"] as const;
  export type eventType = typeof _eventType[number];

  const _eventSubType = ["Parcours urbain", "Exposition", "Performance", "Nighclubbing", "Concert", "Workshop", "Table ronde", "Masterclass", "mappingTV"] as const;
  export type  eventSubType = typeof _eventSubType[number];
  
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
    coordinates: LatLng, 
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
    artistName:string,
    artistWebsite: string,
    content:{
      fr:string,
      en:string
    },  
    localMedias: LocalMedia[],
    externalMedias: ExternalMedia[],
    socialMedias: SocialMedia[],

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
    subType: eventSubType,
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
    artists:[{
      lastname:string,
      slug:string,
      _id: string
    }],
    localMedias: LocalMedia[],
    externalMedias: ExternalMedia[],
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

