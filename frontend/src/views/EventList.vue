<template>
  <div class="events">
    <!-- TOOLBAR -->
    <Toolbar />
    <section class="primary">
      <p>
        <router-link v-for="(menu) in getMenu('primary')" :class="{'selected':menu.selected}" :key="menu.link" :to="menu.link" >{{t(menu.name)}}</router-link>
      </p>
    </section>

    <section class="secondary">
        <a v-for="(menu,index) in categories" 
          :class="{'selected':menu.selected}" 
          :key="index"
          @click="onEventCategory(menu.name)" >{{(menu.name)}}</a>
        <a class="today" @click="onToday">today</a>          
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $cms } from '../services';
import { Translatable } from '../mixins';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';


@Component({
  components: {
    CMSIcons, Toolbar
  }
})
export default class EventList extends mixins(Translatable) {
  //
  // "emission"|"workshop"|"masterclass"|"table-ronde"|"concert"|"performance"|"nightclubbing");
  private selected = '';
  private cache = {};

  defaultCover = "https://via.placeholder.com/150";

  get events() {
    if(this.cache['events_'+this.selected]){
      return this.cache['events_'+this.selected]
    }

    return this.cache['events_'+this.selected] = $cms.cms.events.filter(event => {
      if(!this.selected || this.selected == '' || this.selected == 'all'){
        return event;
      }
      return event.type == this.selected;
    })
  }

  get calendar(): CMS.Calendar[] {
    if(this.cache['calendar_'+this.selected]){
      return this.cache['calendar_'+this.selected]
    }
    return this.cache['calendar_'+this.selected] = $cms.getCalendarFrom(this.events).sort((a: any,b: any)=>{
      return a._id - b._id;
    });
  }

  get categories() {
    if(this.cache['categories']){
      return this.cache['categories'];
    }
    const elems = {'all':{selected:true,name:'all'}};
    this.events.forEach(event => elems[event.type] = {name:event.type});

    return this.cache['categories'] = Object.keys(elems).map(cat => (elems[cat]));
  }

  get config(){
    return $config.store.config;
  }

  getRandomId(event){
    return Math.random()*10000|0;
  }


  getMenu(layout) {
    const menu = [... $config.getMenu(layout)];
    const path = this.$router.currentRoute.fullPath;
    const itemIdx = menu.findIndex(item => item.link.indexOf(path)>-1);
    menu.forEach(item => item.selected = false);
    menu[(itemIdx == -1)? 0:itemIdx].selected = true;
    return menu;
  }


  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    next();
  }

  beforeDestroy() {
    document.body.classList.remove('body-scroll');
  }



  async mounted(){
    this.selected = this.$route.query.selected as string;
    document.body.classList.add('body-scroll');
  }

  async onBack() {
    // this.$router.go(-1);
    this.$router.push({ path: '/' });
  }

  async onEventCategory(name) {
    this.categories.forEach(cat => {
      cat.selected = false;
      if(cat.name === name) {
        cat.selected = true;
      }
    });
    this.selected = name;
    this.$forceUpdate();

  }

  async onEvent(event: CMS.Event) {
    this.$router.push({ path: `/events/${event.slug}` });
  }

  async onLoad(slug: string) {
    //
  }

  async onSave() {
    //
  }

  async onToday($event) {
    $event.stopPropagation();
    const dest = this.calendar[3];
    const element = document.getElementById(dest._id.toString());
    if(!element) {
      return;
    }
    element.scrollIntoView({ behavior: 'smooth' });

  }

  @Watch('$route', { immediate: true, deep: true })
  async onRouteUpdate(to) {
    this.selected = this.$route.query.selected as string;
  }

}
</script>
