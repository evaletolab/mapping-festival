<template>
  <div class="calendar">
    <section class="secondary">
        <a class="fas fa-sliders-h" :class="{'fa-selected':isAll}" @click="onAll"></a> 
        <a v-for="(menu,index) in eventTypes" 
          :class="{'selected':menu.selected}" 
          :key="index"
          @click="onEventCategory(menu.name)" >{{(menu.name)}}</a>
        <a class="today" @click="onToday">today</a>          
    </section>
    <section v-if="gotop" class="top" @click="onTop"
            :class="{'exited': (scrollDirection > 0) }">
      <button >
        <i class="fas fa-arrow-up fa-2x"></i>
      </button>
    </section>


    <div class="day-wrapper width8" v-for="elem in calendar" :key="elem._id" :id="elem._id">

      <div class="day-title">
        {{elem.date}}.{{elem.month}}
      </div><!-- day-title -->

      <div class="grid-container grid-container--fit">
        <div class="grid-element" 
            :style="{ backgroundImage: 'url(' + ((event.cover && event.cover.path) || defaultCover) + ')' }"
            v-for="(event,index) in elem.events" 
            :key="index" 
            @click="onEvent(event)">
          <div class="title">{{ t(event.title) }} </div>      
          <div class="when">{{ event.when[0].startTime }} </div>
          <div class="type">{{ (event.type) }} </div>      
        </div>
      </div> <!-- grid-container -->
    </div> <!-- day-wrapper -->
  </div>

</template>

<style lang="scss">
  section.secondary{
    display: flex;
    width: 100%;
    height: 70px;
    border-top: 1px solid #666;
    border-bottom: 1px solid #666;
    overflow: hidden;
    overflow-x: auto;    
    font-size: 17px;
    align-content: center;
    align-items: center;
    justify-content: flex-start;

    a{
      cursor: pointer;
      text-transform: lowercase;
      color: var(--font-color);
      margin: 0 3px ;
      padding: 10px 0px;
      padding-bottom: 0;
      text-decoration: none;
      line-height: 40px;
      border-bottom: 4px solid transparent;
      letter-spacing: -.4px;

      -align-self: flex-end;

      &.selected{
        font-weight: 700;
        border-bottom: 4px solid var(--font-color);
      }

      &.fas:not(.fa-selected){
        color: #777!important;
      }

    }
  }

  section.top{
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
    &:first-child{
    }
    .event {
      cursor: pointer;
      background: url(https://via.placeholder.com/150) no-repeat, #ddd;
      background-size: cover;
      background-position: center;
      overflow: hidden;
      position: relative;

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
import { $config, $cms } from '../services';
import { CMS } from "../models";
import { Translatable } from '../mixins';

@Component({
  components: {}
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
    if(this.cache['events_'+label]){
      return this.cache['events_'+label]
    }

    return this.cache['events_'+label] = $cms.cms.events.filter(event => {
      if(!label || label == '' || label == 'all'){
        return event;
      }
      return (event.type||'').toLowerCase() == this.selected;
    })
  }

  get calendar(): CMS.Calendar[] {
    const label = this.selected||'all';

    //
    // local cache
    if(this.cache['calendar_'+label]){
      return this.cache['calendar_'+label]
    }

    this.cache['calendar_'+label] = $cms.getCalendarFrom(this.events).sort((a: any,b: any)=>{
      return a._id - b._id;
    });

    //
    // only display events after now
    if (this.limit) {
      this.cache['calendar_'+label] = this.cache['calendar_'+label].filter(cal=> {
        return cal._id>=this.now;
      });
    }
    return this.cache['calendar_'+label];
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
  

  getRandomId(event){
    return Math.random()*10000|0;
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
    }
    this.isAll = !this.eventTypes.some(type => type.selected==true);
  }

}
</script>
