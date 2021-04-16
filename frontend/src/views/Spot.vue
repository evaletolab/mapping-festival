<template>
  <div class="spot spiegel margin-top1">
    <Toolbar />
    <div style="height:80px" />
    <h1>{{t(eventLocation.name)}}</h1>
    <p v-html="t(eventLocation.content)"></p>

    <div v-if="!!eventLocation.coordinates" class="map-container">
      <l-map ref="myMap"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        style="height: 80%"
        :interactive="false"
        @update:zoom="zoomUpdate"
      > 
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        />
        <l-marker :lat-lng="center">
          <l-icon
            :icon-size="[84, 146]"
            :icon-anchor="[42, 73]"
            icon-url="/map/SpotMarker.svg"
          />
        </l-marker>
      </l-map>
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
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';

import  { LatLng, latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet';

@Component({
  components: {
    CMSIcons,Toolbar, LMap, LTileLayer, LMarker, LIcon,
  }
})
export default class Spot extends mixins(Translatable) {

  zoom = 14;
  currentZoom = 14;
  url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  mapOptions = {
    zoomSnap: 0.5,
    dragging: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    scrollWheelZoom: "center",
    touchZoom: "center",
    minZoom: 10,
  };

  get config(){
    return $config.store.config;
  }

  get center(): LatLng {
    return this.eventLocation.coordinates;
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

  zoomUpdate(zoom: number) {
    this.currentZoom = zoom;
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
