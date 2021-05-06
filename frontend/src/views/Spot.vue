<template>
  <div class="spot spiegel margin-top1">
    <!-- <Toolbar />
    <div style="height:80px" />
    <PrimaryMenu /> -->
    
    <h1>{{t(eventLocation.name)}}</h1>
    <ul>
      <li v-if="eventLocation.street">{{eventLocation.street}}</li>
      <li v-if="eventLocation.postalcode">
        {{eventLocation.postalcode}} <span v-if="eventLocation.city"> {{eventLocation.city}}</span>
      </li>
      <li v-if="eventLocation.website">
        <a :href="eventLocation.website" target="_blank" rel="noopener noreferrer">
          {{eventLocation.website}}
        </a>
      </li>
    </ul>
    <p v-html="t(eventLocation.content)"></p>


    <img v-if="eventLocation.cover" :src="eventLocation.cover.sizes.headerimage.path" /> 

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

    <div v-if="events.length > 0">
      <h4>Events</h4>
      <div class="grid-container grid-container--fit">
        <div class="grid-element event" 
          v-for="event in events" :key="event._id">
          <event-card :event="event" />
        </div>
      </div> 
    </div>

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
import EventCard from '../components/EventCard.vue';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons,Toolbar, PrimaryMenu, MapLibre, MapLibreMarker, EventCard
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
