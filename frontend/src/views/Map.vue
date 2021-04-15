<template>
  <div class="map">
    <Toolbar />
    <div class="map-container">

      <l-map ref="myMap"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        style="height: 80%"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate"
      > 
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        />
        <l-marker 
          v-for="evtLocation in eventLocationsForMarkers" :key="evtLocation._id" 
          :lat-lng="evtLocation.coordinates" 
          @click="markerClick(evtLocation._id)">
           <l-icon
            :icon-size="[84, 146]"
            :icon-anchor="[42, 73]"
            icon-url="/map/SpotMarker.svg"
          />
        </l-marker>
      </l-map>

      <h2>{{t({fr:"Lieux", en:"Spots"})}}</h2>

      <ul v-for="evtLocation in eventLocationsForList" :key="evtLocation._id" >
        <li><router-link :to="`/spot/${evtLocation.slug}`" >{{t(evtLocation.name)}}</router-link></li>
      </ul>

    </div>
  </div>
</template>


<style lang="scss" scoped>
  .map {
    width: 100vw;
  }
  .map-container{
    padding-top: 80px;
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
import { currentLangStore, Lang } from '../services/i18n';


@Component({
  components: {
    CMSIcons,Toolbar, LMap, LTileLayer, LMarker, LIcon,
  }
})
export default class Map extends mixins(Translatable) {
  zoom = 14;
  currentZoom = 14;
  center = latLng(46.2044, 6.1432);
  currentCenter = latLng(46.2044, 6.1432);
  url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  mapOptions = {
    zoomSnap: 0.5
  };

  get config(){
    return $config.store.config;
  }

  get eventLocationsForMarkers(): CMS.EventLocation[]{
    const result = $eventLocation.all().filter(evtLocation => !!evtLocation.coordinates);
    return result;
  }

  get eventLocationsForList(): CMS.EventLocation[]{
    const result = $eventLocation.all().sort((a, b) => {
      return b.name[currentLangStore.lang].localeCompare(a.name[currentLangStore.lang])
    });

    return result;
  }

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    next();
  }

  mounted(){
  }

  zoomUpdate(zoom: number) {
    this.currentZoom = zoom;
  }

  centerUpdate(center: LatLng) {
    this.currentCenter = center;
  }

  markerClick(markerId){
    const eventLocation = $eventLocation.eventLocationWithId(markerId) as CMS.EventLocation;
    this.$router.push({path: `/spot/${eventLocation.slug}`});
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
