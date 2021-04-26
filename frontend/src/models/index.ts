/* eslint-disable */

import { LatLng } from 'leaflet';

import { t } from '../services/i18n';
import { $config } from '../services/config-service';

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

  
  export type mediaPlatformType = ("youtube"|"video"|"img"|"audio"|"soundCloud"|"vimeo");
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
    name:{
      fr:string,
      en:string
    }
    cover: LocalMedia | null,
    active:boolean,
    street: string,
    website: string,
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
    cover: LocalMedia | null,
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
    cover: LocalMedia | null,
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
      fr: string,
      en: string
    },  
    year: number,
    when: When[],
    price: number,
    limit: number,
    artists:[{
      lastname: string,
      slug: string,
      _id: string
    }],
    localMedias: LocalMedia[],
    externalMedias: ExternalMedia[],
    // published: Date,
    created: Date,
    // signature:string,
    // creator:string,    
  }

  export interface Caldendar {
    when: When;
    event: Event;
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

  export class When
  {
    constructor(
      private _id:number,
      private _start: Date, 
      private _end: Date, 
      private _cancel: boolean, 
      private _eventLocation: EventLocation | null) 
    {}

    public get id(): number {
      return this._id;
    }

    public get start(): Date{
      return this._start;
    }

    public get end(): Date{
      return this._end;
    }

    public get eventLocation(): CMS.EventLocation | null {
      return this._eventLocation; 
    }

    // returns duration in minutes
    public get duration(): number{
      const duration = (this.end.getTime() - this.start.getTime()) / 1000 / 60;
      return duration;
    }

    public get dayOfWeek(): string{
      const dayIndex = this.start.getDay();
      return t($config.store.config.time.days[dayIndex]);
    }

    public get date(): string {
      return this.start.getDate().toString();
    }
    
    public get month(): string{
      const monthIndex = this.start.getMonth();
      return t($config.store.config.time.months[monthIndex]);
    }

    public get startTime(): string{
      const hours = this.start.getHours().toString().padStart(2, "0");
      const minutes = this.start.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    public get endTime(): string{
      const hours = this.end.getHours().toString().padStart(2, "0");
      const minutes = this.end.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;

    }
  }
}

