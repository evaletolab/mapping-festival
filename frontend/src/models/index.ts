/* eslint-disable */

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
  export const eventTypeLabel = ["Installation", "Performance", "Workshop", "Masterclass"] as const;
  export type eventType = typeof eventTypeLabel[number];

  export const eventSubTypeLabel = ["Parcours urbain", "Exposition", "Performance", "Nighclubbing", "Concert", "Workshop", "Table ronde", "Masterclass", "mappingTV"] as const;
  export type  eventSubType = typeof eventSubTypeLabel[number];

  export type EventLocationType = "Standard" | "Parcours Urbain";
  
  type Lat = number;
  type Lng = number;

  export type Coordinate = [Lng, Lat];

  export interface EventLocation {
    _id:string
    slug:string,
    name:{
      fr:string,
      en:string
    },
    type: EventLocationType,
    cover: LocalMedia | null,
    active:boolean,
    street: string,
    website: string,
    postalcode: string,
    city: string,
    tag: string,
    coordinates: Coordinate, 
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
    country: string,
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

  export class ArtistWrap{
    constructor(private _artist: Artist){

    }
    get _id(): string{
      return this._artist._id;
    }
    get slug(): string{
      return this._artist.slug;
    }
    get active(): boolean{
      return this._artist.active;
    }
    get cover(): LocalMedia | null{
      return this._artist.cover;
    }
    get firstname(): string{
      return this._artist.firstname;
    }
    get lastname(): string{
      return this._artist.lastname;
    }
    get artistName(): string{
      return this._artist.artistName;
    }
    get artistWebsite(): string{
      return this._artist.artistWebsite;
    }
    get country(): string {
      return this._artist.country;
    }
    get content(): {fr: string, en: string} {
      return this._artist.content;
    }
    get localMedias(): LocalMedia[] {
      return this._artist.localMedias;
    }
    get externalMedias(): ExternalMedia[] {
      return this._artist.externalMedias;
    }
    get socialMedias(): SocialMedia[] {
      return this._artist.socialMedias;
    }
    get created(): Date {
      return this._artist.created;
    }

    get fullname(): string{
        const artistName = this.artistName ? `${this.artistName} ` : "";
        const firstname = this.firstname ? `${this.firstname}` : "";
        const lastname = this.lastname ? ` ${this.lastname}` : "";

        return `${artistName}${firstname}${lastname}`;
    }

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
    ticketUrl: string | null,
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

  export class Time{
    constructor(
      public readonly hours: number,
      public readonly minutes:number){}

    public static NewFromDate(date:Date): Time {
      return new Time(date.getHours(), date.getMinutes());
    }

    public equals(other: Time): boolean{
      return this.hours === other.hours && this.minutes === other.minutes;
    }

    public toString(): string{
      return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}`;
    }
  }

  export class DailySchedule{
    constructor(public from: Time, public to: Time) {}

    public static NewFromWhen(when: When): DailySchedule{
      return new DailySchedule(
        Time.NewFromDate(when.start),
        Time.NewFromDate(when.end),
      );
    }

    public equals(other: DailySchedule): boolean{
      return this.from.equals(other.from) && this.to.equals(other.to);
    }
  }

  export class Interval{
    public readonly fromDate: Date;
    public toDate: Date;
    public readonly dailySchedule: DailySchedule;
    public readonly eventLocation: EventLocation | null;

    constructor(
      _fromDate: Date,
      _toDate: Date,
      _dailySchedule: DailySchedule,
      _eventLocation: EventLocation | null)
    {
        this.fromDate = new Date(_fromDate.getTime());
        this.toDate = new Date(_toDate.getTime());
        this.dailySchedule = _dailySchedule;
        this.eventLocation = _eventLocation;
    }

    get startTimeAsStr(): string{
      return this.dailySchedule.from.toString(); 
    }
    
    get endTimeAsStr(): string{
      return this.dailySchedule.to.toString(); 
    }

    get shortDate(): string{
      const toShortDate = (value) =>{
        const d = new Date(value);
        const result = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
        return result;
      }

      if(this.fromDate.getDate() == this.toDate.getDate() && 
        this.fromDate.getMonth() == this.toDate.getMonth() &&
        this.fromDate.getFullYear() == this.toDate.getFullYear()){
          return `${toShortDate(this.fromDate)}`;
        }else{
          return `${toShortDate(this.fromDate)}-${toShortDate(this.toDate)}`;
        }
    }
  }

  export class EventWrap
  {
    constructor(private _event: CMS.Event){}
    get id(): string{
      return this._event._id;
    }
    get slug(): string{
      return this._event.slug;
    }
    get active(): boolean{
      return this._event.active;
    }
    get cover(): LocalMedia | null{
      return this._event.cover;
    }
    get type(): eventType{
      return this._event.type;
    }
    get subType(): eventSubType{
      return this._event.subType;
    }
    get title(): {fr: string, en: string} {
      return this._event.title;
    }
    get header(): {fr: string, en: string} {
      return this._event.header;
    }
    get content(): {fr: string, en: string} {
      return this._event.content;
    }
    get hardware(): {fr: string, en: string} {
      return this._event.hardware;
    }
    get notes(): {fr: string, en: string} {
      return this._event.notes;
    }
    get year(): number {
      return this._event.year;
    }
    get when(): When[] {
      return this._event.when;
    }
    get price(): number{
      return this._event.price;
    }
    get limit(): number{
      return this._event.limit;
    }
    get artists(): { lastname: string, slug: string, _id: string }[] {
      return this._event.artists;
    }
    get localMedias(): LocalMedia[]{
      return this._event.localMedias;
    }
    get externalMedias(): ExternalMedia[]{
      return this._event.externalMedias;
    }
    get created(): Date{
      return this._event.created;
    }

    get eventLocation(): EventLocation | null{
      for(const w of this.when){
        if(w.eventLocation){
          return w.eventLocation;
        }
      }

      return null;
    }

    get location(): {fr: string, en:string} | null{
      if(this.eventLocation) {
        return this.eventLocation.name;
      }else{
        return null;
      }
    }

    get intervals(): Interval[]{
      let result: Interval[] = [];

      if(this.when.length < 1) return result;

      // assumes this.when is sorted
      let currentWhen = this.when[0];
      const fromDate = currentWhen.start;
      const toDate = currentWhen.end;
      const dailySchedule = DailySchedule.NewFromWhen(currentWhen);
      let currentInterval = new Interval(fromDate, toDate, dailySchedule, currentWhen.eventLocation);

      const computeNextDay = (date: Date) =>{
        const result = new Date(date.getTime());
        result.setDate(date.getDate() + 1);
        return result;
      }

      
      // console.log("current", currentInterval);
      for(let i = 1; i < this.when.length; i++){
        currentWhen = this.when[i];

        // check if nextWhen belongs to currentInterval
        // is next when the day after currentWhen ?
        const nextDay = computeNextDay(currentInterval.toDate);
        
        // console.log("currentWhen", currentWhen, nextDay);
        
        if(nextDay.getDate() == currentWhen.start.getDate() && 
          nextDay.getMonth() == currentWhen.start.getMonth() &&
          nextDay.getFullYear() == currentWhen.start.getFullYear())
        {
          // we have asserted that nextWhen is one day after currentInterval.toDate

          // check if nextWhen has the same DailySchedule
          const nextWhenDailySchedule = DailySchedule.NewFromWhen(currentWhen);
          // console.log("nextWhenDS", nextWhenDailySchedule, "currentinterval.ds", currentInterval.dailySchedule);
          if(nextWhenDailySchedule.equals(currentInterval.dailySchedule) && currentWhen.eventLocation === currentInterval.eventLocation){
            // we are in a continuation of interval
            // we extend currentInterval.toDate
            currentInterval.toDate = new Date(currentWhen.start.getTime());
            // console.log("extend interval, currentInterval.toDate = ", currentInterval.toDate);

            
            // we must still check if we are the last day of the collection
            if(i == this.when.length - 1){
              // console.log("end of collection");
              result.push(currentInterval);
            }
          }else{
            // start A new Interval
            // 1 push currentInterval in result
            // console.log("continuation broken", currentWhen);
            result.push(currentInterval);

            // 2 define new currentInterval
            const fromDate = currentWhen.start;
            const toDate = currentWhen.end;
            const dailySchedule = DailySchedule.NewFromWhen(currentWhen);
            currentInterval = new Interval(fromDate, toDate, dailySchedule, currentWhen.eventLocation);
            // we must still check if we are the last day of the collection
            if(i == this.when.length - 1){
              // console.log("end of collection");
              result.push(currentInterval);
            }
          }
        }else{
          // start A new Interval
          // 1 push currentInterval in result
          // console.log("continuation broken", currentWhen);
          result.push(currentInterval);

          // 2 define new currentInterval
          const fromDate = currentWhen.start;
          const toDate = currentWhen.end;
          const dailySchedule = DailySchedule.NewFromWhen(currentWhen);
          currentInterval = new Interval(fromDate, toDate, dailySchedule, currentWhen.eventLocation);
          // we must still check if we are the last day of the collection
          if(i == this.when.length - 1){
            // console.log("end of collection");
            result.push(currentInterval);
          }
        }

        console.log("----------------------------");
      }

      return result;
    }

    getFirstWhenForDate(date: Date): When | null{
      if(!date) return null;
      if(isNaN(date.getTime())) return null;

      const targetYear = date.getFullYear();
      const targetMonth = date.getMonth();
      const targetDate = date.getDate();

      const whens = this.when.filter(w => {
        if(w.start.getFullYear() == targetYear &&
          w.start.getMonth() == targetMonth &&
          w.start.getDate() == targetDate ){
            return true;
          }else{
            return false;
          }
      });

      if(whens.length > 0){
        return whens.sort((a: When,b: When) => a.start.getTime() - b.start.getTime())[0];

      }else{
        return null;
      }
    }

  }

  export interface Calendar {
    day: string;
    month: string;
    __date: Date;
    event: Event[];
    _id: number; // copied from When id
  }

  export interface ArtistSetByLetter
  {
    letterId: string;
    artists: Artist[];
  }
  
  export interface EventSetByType
  {
    type: string;
    events: Event[];
  }

  export interface Page {
    _id: string,
    slug: string,
    active: boolean,
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

  export class When {
    _id;
    year;
    constructor(
      private _start: Date, 
      private _end: Date, 
      private _cancel: boolean, 
      private _eventLocation: EventLocation | null) 
    {
      const _1970 = new Date(0);
      if(isNaN(_start.getTime())){
        this._start = _1970;
      }
      if(isNaN(_end.getTime())){
        this._end = _1970;
      }

      const dayStartingHour = 6; // not 00 hours but 6 in the morning
      
      const start = new Date(this._start.getTime());
      const end = new Date(this._end.getTime());

      this._start = this.__computeDayIfDayStartsAt(this._start, dayStartingHour);
      this._end = this.__computeDayIfDayStartsAt(this._end, dayStartingHour);
      // console.log("raw start and end", start, end);
      // console.log("computed start and end", this._start, this._end);
      // console.log("---------------------");
      
      this._id = this._start.getTime();
      this.year = this._start.getFullYear();
    }

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
      // 2 digits
      return ("0" + this.start.getDate()).slice(-2);
      //return this.start.getDate().toString();
    }
    
    public get month(): string{      
      const monthIndex = this.start.getMonth();
      return t($config.store.config.time.months[monthIndex]);
    }

    public get startTimeWeight(): number{
      const hours = this.start.getHours();
      const minutes = this.start.getMinutes();
      return hours * 60 + minutes;
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
    
    private __computeDayIfDayStartsAt(date: Date, startingHour: number): Date{

      if(date.getHours() >= startingHour || date.getHours() == 0 && date.getMinutes() == 0){
        return date;
      }else{
        const oneDayMillis =  60 * 60 * 24 * 1000;
        let result = new Date(date.getTime() - oneDayMillis);
        return result;
      }
    }
  }
}

