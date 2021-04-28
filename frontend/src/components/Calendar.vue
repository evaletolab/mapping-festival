<template>
  <div class="calendar">
    <section class="secondary">
        <a v-for="(menu,index) in eventTypes" 
          :class="{'selected':menu.selected}" 
          :key="index"
          @click="onEventCategory(menu.name)" >{{(menu.name)}}</a>
        <a class="today" @click="onToday">today</a>          
    </section>
    <section v-if="gotop" class="top">
      <button >
        <i class="fas fa-arrow-up fa-2x"></i>
      </button>
    </section>


    <div class="grid" v-for="elem in calendar" :key="elem._id" :id="elem._id">
      <h1>{{elem.date}}.{{elem.month}}</h1>
      <div class="event" 
           :style="{ backgroundImage: 'url(' + (event.cover || defaultCover) + ')' }"
           v-for="event in elem.events" 
           :key="getRandomId(event)" 
           @click="onEvent(event)">
        <div class="when">{{ event.when[0].startTime }} </div>
        <div class="title">{{ t(event.title) }} </div>      
        <div class="type">{{ (event.type) }} </div>      
      </div>
    </div>
  </div>

</template>

<style lang="scss">
  @import "../styles/event-list.scss";
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
    const elems = {'all':{selected:(!this.selected),name:'all'}};
    CMS.eventTypeLabel.forEach(label => {
      (elems[label.toLowerCase()] = {selected:(label.toLowerCase() === this.selected),name:label})
    });
    
    return this.cache['eventTypes'] = Object.keys(elems).map(cat => (elems[cat]));
  }
  

  getRandomId(event){
    return Math.random()*10000|0;
  }

  async mounted() {
    this.selected = this.$route.query.selected as string;
  }

  async onEventCategory(name) {
    const label = (name||'all').toLowerCase();
    this.$router.replace({ query: { selected: label }}).catch(()=>{});    
  }

  async onEvent(event: CMS.Event) {
    this.$router.push({ path: `/events/${event.slug}` });
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
  }

}
</script>
