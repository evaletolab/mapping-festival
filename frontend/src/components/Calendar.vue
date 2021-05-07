<template>
  <div class="calendar">
    <section class="secondary filters">
        <a class="fas" :class="{'fa-selected fa-times':!isAll, 'fa-selected fa-sliders-h':isAll }" @click="onAll"></a> 
        <a v-for="(menu,index) in eventTypes" 
          :class="{'selected':menu.selected}" 
          :key="index"
          @click="onEventCategory(menu.name)" >{{getTypeLabel(menu.name)}}</a>
        <!-- <a class="today" @click="onToday">today</a>           -->
    </section>
    <section v-if="gotop" class="gotop" @click="onTop"
            :class="{'exited': (scrollDirection > 0) }">
      <button >
        <i class="fas fa-arrow-up fa-2x"></i>
      </button>
    </section>

    <div class="grid day-wrapper " v-for="elem in calendar" :key="elem._id" :id="elem._id">

      <div class="day-title">
        {{elem.date}}.{{elem.month}}
      </div><!-- day-title -->

      <!-- <div class="grid-container grid-container--fit">
        <div class="grid-element event" 
            v-for="(event,index) in elem.events" 
            :key="index" 
            @click="onEvent(event)">
          <lazy-img :src="getBackground(event)" />

          <div class="title">{{ t(event.title) }} </div>      
          <div class="when">{{ event.when[0].startTime }} </div>
          <div class="type">{{ (event.type) }} </div>      
        </div>
      </div>  -->
      <div class="grid-container grid-container--fit">
        <event-card v-for="(event, index) in elem.events" :key="index" :event="event" :date="elem.__date" />
      </div> 
    </div> 
  </div>

</template>

<style lang="scss" scoped>
  section.secondary.filters{
    display: flex;
    width: 100%;
    height: 70px;
    border-top: 1px solid var(--font-color);
    border-bottom: 1px solid var(--font-color);
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

    @media (max-width:426px) {
      box-shadow: 0 4px 5px 0 rgb(0 0 0 / 14%);      
    }

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    a{
      cursor: pointer;
      text-transform: lowercase;
      color: var(--font-color);
      margin: 0 8px ;
      padding: 10px 0px;
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
      background: url(https://via.placeholder.com/150) no-repeat, #ddd;
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
  //
  // "emission"|"workshop"|"masterclass"|"table-ronde"|"concert"|"performance"|"nightclubbing");
  private selected = '';
  private cache = {};
  private now = Date.now();
  private isAll = true;
  private lastScrollTop = 0;
  scrollDirection = 0;

  
  @Prop() readonly limit!: boolean;
  @Prop() readonly gotop!: boolean;

  defaultCover = "https://via.placeholder.com/150";


  get events() {
    const label = (this.selected||'').toLowerCase();

    const key = `events_${label}`;

    if(this.cache[key]){
      console.log("returning cached data", `events_${label}`);
      return this.cache[key]
    }

    return this.cache[key] = $cms.cms.events.filter(event => {
      // if "all"
      // all now defaults to Live (temp solution) i.e. all categies except Pacours Urbain, Collection virt and Installation 
      if(!label || label == '' || label == 'all' && $event.eventIsOfSpecialTypeLive(event)){
        return event;
      }

      const filterPredicate = (event.type||'').toLowerCase() == this.selected;

      // console.log("event type", event.type.toLowerCase(), "selected", this.selected);
      // console.log("filterPredicate", filterPredicate);
      return filterPredicate;
    });
  }

  get calendar(): CMS.Calendar[] {
    const label = this.selected||'all';

    const key = `calendar_${label}`

    //
    // local cache
    if(this.cache[key]){
      return this.cache[key]
    }

    // console.log("compute calendar for", label, "and events", this.events);
    this.cache[key] = $cms.getCalendarFrom(this.events).sort((a: any,b: any)=>{
      return a._id - b._id;
    });

    //
    // only display events after now
    if (this.limit) {
      this.cache[key] = this.cache[key].filter(cal=> {
        return cal._id>=this.now;
      });
    }

    console.log("final calendar collection", this.cache[key].length);

    return this.cache[key];
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
    
    return this.cache['eventTypes'] = Object.keys(elems).map(cat => (elems[cat]));
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

  async mounted(){
    this.selected = this.$route.query.selected as string;
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
    this.$router.replace({ query: { selected: 'all' }}).catch(()=>{});    
  }
  
  async onEventCategory(name) {
    const label = (name||'all').toLowerCase();
    this.$router.replace({ query: { selected: label }}).catch(()=>{});    
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

  async onToday($event) {
    $event.stopPropagation();
    //
    // FIXME, for testing only
    const dest = this.calendar[3] || this.calendar[0];
    const element = document.getElementById(dest._id.toString());
    if(!element) {
      return;
    }
    element.scrollIntoView({ behavior: 'smooth' });
  }  

  @Watch('$route', { immediate: true, deep: true })
  async onRouteUpdate(to) {
    const label = this.$route.query.selected as string;
    if(label) {
      this.eventTypes.forEach(cat => {
        cat.selected = (cat.name.toLowerCase() === label);
      });     
      this.selected = label;
      console.log("selected has changed to ", this.selected);
    }else{
      this.selected = 'all';
    }
    this.$emit('calendar-update',this.selected);
    this.isAll = !this.eventTypes.some(type => type.selected==true);
  }

}
</script>
