<template>
  <div class="calendar">
    <section class="secondary filters">
        <a class="fas" :class="{'fa-selected fa-times':!isAll, 'fa-selected fa-sliders-h':isAll }" @click="onAll"></a> 
        <!-- <a v-for="(menu,index) in eventTypes" 
          :class="{'selected':menu.selected}" 
          :key="index"
          @click="onEventCategory(menu.name)" >{{getTypeLabel(menu.name)}}</a> -->
        <a v-for="(datePickerItem,index) in datePickerItems" 
          :class="{'selected':datePickerItem.selected}" 
          :key="index"
          @click="onDatePicked(datePickerItem)">{{datePickerItem.day}}/{{datePickerItem.month}}</a>
    </section>
    <section v-if="gotop" class="gotop" @click="onTop"
            :class="{'exited': (scrollDirection > 0) }">
      <button >
        <i class="fas fa-arrow-up fa-2x"></i>
      </button>
    </section>

    <div class="grid day-wrapper" v-for="elem in filteredCalendar" :key="elem._id" :id="elem._id">

      <h1 class="capitalize margin-top1" v-if="currentLang=='fr'">
        {{t(elem.dayname)}} {{elem.date}} {{t(elem.monthname)}}
      </h1>      
      <h1 class="capitalize" v-else>
        {{t(elem.dayname)}} {{t(elem.monthname)}} {{elem.date}}th
      </h1>
      
      <div class="prule "/>

      <div class="grid-container grid-container--fill">
        <event-card v-for="(event, index) in elem.events" :key="index" :event="event" :date="elem.__date" />
      </div> 
    </div> 
  </div>

</template>

<style lang="scss" scoped>
  section.secondary.filters{
    display: flex;
    width: 100%;
    // height: 70px;
    height: calc(var(--line-height)*2.5);
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    margin-bottom: var(--gutter-width);
    margin-top: -1px;
    overflow: hidden;
    overflow-x: auto;    
    font-size: 17px;
    
    align-content: center;
    align-items: center;
    justify-content: flex-start;

    position: sticky;
    top: -1px;
    z-index: 1;
    background: var(--body-color);

    @media (max-width:var(--mobile-breakpoint)) {
      box-shadow: 0 4px 5px 0 rgb(0 0 0 / 14%);      
    }

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    a{
      cursor: pointer;
      // text-transform: lowercase;
      color: var(--font-color);
      margin: 0 8px ;
      padding: 6px 0px 10px 0px;
      padding-bottom: 0;
      text-decoration: none;
      line-height: 30px;
      border-bottom: 3px solid transparent;
      letter-spacing: -.4px;
      white-space: nowrap;
      
      -align-self: flex-end;

      &.selected{
        font-weight: 700;
        border-bottom: 3px solid var(--font-color);
      }

      &.fas:not(.fa-selected){
        color: #777!important;
        
      }

    }
  }

  section.gotop{
    position: fixed;
    bottom: -60px; 
    left: calc( 50% - 16px );       


    transform: translateY(0);
    transition: all 200ms;      

    z-index: 2;

    &.exited {
      transform: translateY(-70px);            
    }

    button{
      padding: 2px 2px;
      width: 36px;
      height: 36px;
      background-color: transparent;
      border: none;
      cursor: pointer;
      outline: 0;
      background: var(--font-color);
      color: var(--body-color);
      border-radius: 50%;
    }
  }
    
  .grid {
    width: calc(100% - 1em);
    margin-left: 0.5em;
    border-bottom: 1px solid black;
    padding-bottom: 1em;        

    &:first-child{
    }
    .event {
      cursor: pointer;
      background: url(https://via.placeholder.com/150/000000/000000) no-repeat, #ddd;
      background-size: cover;
      background-position: center;
      overflow: hidden;
      position: relative;
      padding: 0;
      img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .type {
      }
      .when{
      }
    }
  }

</style>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { $config, $cms, $event, $i18n } from '../services';
import { CMS } from "../models";
import { Translatable } from '../mixins';
import LazyImg from './LazyImg.vue';
import EventCard from './EventCard.vue';

@Component({
  components: { LazyImg, EventCard }
})
export default class Calendar extends mixins(Translatable)  {
  private selected = '';
  private cache = {};
  private now = Date.now();
  private isAll = true;
  private lastScrollTop = 0;

  private datePickerItems: CMS.CalendarDatePickerItem[] = [];

  scrollDirection = 0;

  timeoutID = -1;

  selectedDate: CMS.CalendarDatePickerItem | null = null;

  
  @Prop() readonly limit!: boolean;
  @Prop() readonly gotop!: boolean;

  defaultCover = "https://via.placeholder.com/150/000000/000000";


  get events() {
    const label = (this.selected||'').toLowerCase();

    const key = `events_${label}`;

    if(this.cache[key]){
      return this.cache[key]
    }

    // return this.cache[key] = $cms.cms.events.filter(event => {
    //   // if "all"
    //   // all now defaults to Live (temp solution) i.e. all categies except Pacours Urbain, Collection virt and Installation       
    //   if(!label || label == '' || label == 'all'){
    //     return true;
    //   }


    //   const filterPredicate = (event.typology || '').toLowerCase() == this.selected;
    //   return filterPredicate;
    // });
    
    return this.cache[key] = $cms.cms.events;
  }

  get currentLang(): string{
    const result = $i18n.lang;
    return result;
  }

  get calendar(): CMS.Calendar[] {
    const label = this.selected||'all';

    // const key = `calendar_${label} ${this.mppngTVFilter}`;
    const key = `calendar_${label}`;

    //
    // local cache
    if(this.cache[key]){
      return this.cache[key]
    }


    // create local cache
    // console.log("compute calendar for", label, "and events", this.events);
    this.cache[key] = $cms.getCalendarFrom(this.events).sort((a: any, b: any)=>{
      return a._id - b._id;
    });


    // DEPRECATED, david ? 
    // if all events in the past show all events
    // else
    // only display events that have date now or later
    {
      // filter events with date of now or later
      // const eventsNowOrInTheFuture = this.cache[key].filter(cal=> {
      //   const calDate = new Date(cal._id);
      //   const today = new Date();
      //   return calDate.getDate() >= today.getDate() && calDate.getMonth() >= today.getMonth() && calDate.getFullYear() >= today.getFullYear();
      // });

      // // do we have events now or in the future?
      // if(eventsNowOrInTheFuture.length > 0){
      //   this.cache[key] = eventsNowOrInTheFuture;
      // }
    }

    return this.cache[key];
  }

  get filteredCalendar(): CMS.Calendar[]{
    
    if(!this.selectedDate){
      return this.calendar;
    }else{
      // only select entry for selected date
      const result = this.calendar.filter((cal: CMS.Calendar) => {
        const calDate = new Date(cal.moment);
        return calDate.getDate() == parseInt(this.selectedDate!.day) && (calDate.getMonth() + 1) == parseInt(this.selectedDate!.month);
      });

      return result;
    }
  }

  get eventTypes() {
    //
    // local cache
    if(this.cache['eventTypes']){
      return this.cache['eventTypes'];
    }    
    const elems = {};
    CMS.eventTypeLabel.forEach(label => {
      (elems[label.toLowerCase()] = {selected:(label.toLowerCase() === this.selected),name:label})
    });
    

    this.cache['eventTypes'] = Object.keys(elems)
    .map(cat => (elems[cat]));

    return this.cache['eventTypes'];
  }

  getTypeLabel(type) {
    return $i18n.t(type);
  }
  
  getBackground(event) {

    //{ backgroundImage: 'url(' + ((event.cover && event.cover.sizes.small.path) || defaultCover) + ')' }
    const defaultImg = 'https://via.placeholder.com/450';
    const cover = event.cover as any;

    //
    // with cover
    return (cover &&  cover.sizes) ? cover.sizes.small.path:defaultImg;    

    // // with colors
    // // -- linear-gradient(#e66465, #9198e5);
    // const colors = (cover && cover.colors) ? cover.colors : ['']
    // return {
    //   backgroundImage:  'url(' + image + ') ',
    //   backgroundRepeat: 'no-repeat',
    //   backgroundSize :'cover',
    // };
  }


  scrollToTargetAdjusted(element){
      const headerOffset = 65;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
          top: offsetPosition,
          behavior: "auto"
      });
  }  

  async mounted(){
    // this.selected = this.$route.query.selected as string;

    {
      // order important in this block
      this.datePickerItems = $cms.getFestivalDatePickerItems();
      this.checkSelectedDateQueryParam();
    }

    window.addEventListener("scroll", () => { 
      const st = window.pageYOffset || document.documentElement.scrollTop;
      //
      // downscroll code
      if (st > this.lastScrollTop){
        this.scrollDirection = 1;
      } 
      //
      // upscroll code
      else {          
        this.scrollDirection = -1;
      }

      //
      // For Mobile or negative scrolling
      this.lastScrollTop = st <= 0 ? 0 : st; 
    }, false);

  }

  async onAll(){
    // this.$router.replace({ query: { selected: 'all' }}).catch(()=>{}); 
    this.$router.replace({ query: { selectedDate: 'all' }}).catch(()=>{}); 
  }
  
  // async onEventCategory(name) {
  //   const label = (name||'all').toLowerCase();
  //   // this.mppngTVFilter = false;
  //   this.$router.replace({ query: { selected: label }}).catch(()=>{});    
  // }

  async onDatePicked(datePickerItem: CMS.CalendarDatePickerItem){
    const queryParamValue = encodeURIComponent(`${datePickerItem.day}-${datePickerItem.month}`);
    this.$router.replace({ query: { selectedDate: queryParamValue }}).catch(()=>{});    
  }

  async onEvent(event: CMS.Event) {
    this.$router.push({ path: `/events/${event.slug}` });
  }

  async onTop($event) {
    const dest = this.calendar[0];
    const element = document.getElementById(dest._id.toString());
    if(!element) {
      return;
    }
    element.scrollIntoView({ behavior: 'smooth' });
  }


  async onToday($event?) {
    $event && $event.stopPropagation();
    let today = new Date();

    const findIndex = (today:Date) =>{
      return (this.calendar||[]).findIndex(cal => {
        const calDate = new Date(cal.moment);
        return calDate.getDate() == today.getDate() && calDate.getMonth() == today.getMonth() && calDate.getFullYear() && today.getFullYear();
      });
    }    

    // const destIdx = (this.calendar||[]).findIndex(cal => cal.moment >  now);
    const destIdx = findIndex(today);
    const dest = (destIdx == -1)? this.calendar[0]:this.calendar[destIdx];
    const element = document.getElementById(dest._id.toString());
    if(!element) {
      return;
    }
    this.scrollToTargetAdjusted(element);
  }  

  checkSelectedDateQueryParam(){

    // a func to parse a selectedDate in query param form
    const parseSelectedDate = (queryParamValue:string) : CMS.CalendarDatePickerItem | null => {
      if(!queryParamValue){
        return null;
      }
      const regex = /(\d\d)-(\d\d)/;

      const match = queryParamValue.match(regex);
      if(!match){
        return null;
      }

      return {
        day: match[1],
        month: match[2],
        selected: true,
      };
    }
    
    const selectedDateQueryStr = this.$route.query.selectedDate as string;
    const selectedDatePickerItem = parseSelectedDate(selectedDateQueryStr);
    if($cms.calendarContainsDatePickerItem(selectedDatePickerItem)) {
      this.selectedDate = selectedDatePickerItem;
      this.datePickerItems.forEach(item =>{
        item.selected = false;
        if(item.day == this.selectedDate!.day && item.month == this.selectedDate!.month){
          item.selected = true;
        }
      });  
    }else{
      this.selectedDate = null;
      this.datePickerItems.forEach(item => item.selected = false);  
    }
    this.isAll = !this.datePickerItems.some(item => item.selected==true);
  }

  @Watch('$route', { immediate: true, deep: true })
  async onRouteUpdate(to) {
    // const label = this.$route.query.selected as string;
    // if(label) {
    //   this.eventTypes.forEach(cat => {
    //     cat.selected = (cat.name.toLowerCase() === label);
    //   });     
    //   this.selected = label;
    //   // console.log("selected has changed to ", this.selected);
    // }else{
    //   // console.log("selected not set --------------------- ");
    //   this.selected = 'all';
    //   this.eventTypes.forEach(type => type.selected = false);   
    // }
    // this.$emit('calendar-update',this.selected);
    // this.isAll = !this.eventTypes.some(type => type.selected==true);
    this.checkSelectedDateQueryParam();
  }
}
</script>
