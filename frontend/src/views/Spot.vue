<template>
  <div class="spot spiegel margin-top1">
    <Toolbar />
    <div style="height:80px" />
    <PrimaryMenu />
    <h1>{{t(eventLocation.name)}}</h1>
    <p v-html="t(eventLocation.content)"></p>

    <div v-if="!!eventLocation.coordinates" class="map-container">
      <MapLibre 
        :startCoordinates="eventLocation.coordinates"
        :interactive="false"
      >
        <template slot-scope="{map}">
          <MapLibreMarker 
            :map="map" 
            :eventLocation="eventLocation"
            :coordinates="eventLocation.coordinates"
          />
        </template>
      </MapLibre>
    </div>

    <h2>Events</h2>
    <ul v-for="event in events" :key="event._id">
      <li>
        <router-link :to="`/events/${event.slug}`">{{t(event.title)}}</router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  .spot{
  }

  .map-container{
    width: 100%;
    height: 70vh;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $eventLocation } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import PrimaryMenu from '../components/PrimaryMenu.vue';
import MapLibre from '../components/MapLibre.vue';
import MapLibreMarker from '../components/MapLibreMarker.vue';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons,Toolbar, PrimaryMenu, MapLibre, MapLibreMarker 
  }
})
export default class Spot extends mixins(Translatable) {

  get config(){
    return $config.store.config;
  }

  get events(): CMS.Event[]{
    const result = $eventLocation.eventsForEventLocation(this.eventLocation);
    console.log("events", result);
    return result;
  }
  
  mounted(){
    document.body.classList.add('body-scroll');
  }

  beforeDestroy() {
    document.body.classList.remove('body-scroll');
  }

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }
  
  // *this* does not exist at this point
  beforeRouteEnter(to: Route, from: Route, next: any) {
    const slug = to.params.spotslug;
    const eventLocationExists = !!$eventLocation.eventLocationWithSlug(slug);
    if(!eventLocationExists){
      next({name:'NotFound'});
    }else{
      next();
    }
  }
  
  // *this* does not exist at this point
  beforeRouteUpdate(to: Route, from: Route, next: any) {
    const slug = to.params.spotslug;
    const eventLocationExists = !!$eventLocation.eventLocationWithSlug(slug);
    if(!eventLocationExists){
      next({name:'NotFound'});
    }else{
      next();
    }
  }
  
  get eventLocation(): CMS.EventLocation {
    return $eventLocation.eventLocationWithSlug(this.$route.params.spotslug) as CMS.EventLocation;
  }

  async onBack() {
    this.$router.go(-1);
  }

  async onLoad(slug: string) {
    //
  }

  async onSave() {
    //
  }
}
</script>
