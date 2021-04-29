<template>
  <div class="map">
    <Toolbar />
    <div style="height:80px" />
    <PrimaryMenu />
    <div class="map-container">

      <MapLibre 
        :bounds="bounds"
        v-on:loaded="onMapLoaded"
      >
        <template slot-scope="{map}">
          <MapLibreMarker v-for="evtLocation in eventLocationsForMarkers" :key="evtLocation.id"  
            :map="map" 
            :eventLocation="evtLocation"
            :coordinates="evtLocation.coordinates"
            v-on:selectionRequest="onMarkerClick"
          />
          <MapLibrePopup
            :map="map"
            :visible="showPopup"
            v-on:selectionRequest="onPopupSelectionRequest" 
            v-on:closeRequest="onPopupCloseRequest"
            :eventLocation="selectedEventLocation"
          />
        </template>
      </MapLibre>

    </div>
    <h2>{{t({fr:"Lieux", en:"Spots"})}}</h2>

    <ul v-for="evtLocation in eventLocationsForList" :key="evtLocation._id" >
      <li><router-link :to="`/map/${evtLocation.slug}`" >{{t(evtLocation.name)}}</router-link></li>
    </ul>
  </div>
</template>


<style lang="scss" scoped>
  .map {
    width: 100vw;
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
import MapLibrePopup from '../components/MapLibrePopup.vue';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';

import { getBbox } from '../lib/geoUtils';
import { mapEventProvider } from '../lib/mapEventProvider';

import { currentLangStore, Lang } from '../services/i18n';


@Component({
  components: {
    CMSIcons,Toolbar, PrimaryMenu, MapLibre, MapLibreMarker, MapLibrePopup,
  }
})
export default class Map extends mixins(Translatable) {
  startZoom = 12;
  center = [6.140561571463678, 46.203032099805];

  selectedEventLocation: CMS.EventLocation | null = null;

  showPopup = false;

  get config(){
    return $config.store.config;
  }

  get bounds(): any[]{
    const coordinates = this.eventLocationsForMarkers.map(evtLocation => evtLocation.coordinates);
    console.log("coordinates", coordinates);
    const result = getBbox(coordinates);
    console.log("bounds", result);
    return result;
  }

  get eventLocationsForMarkers(): CMS.EventLocation[]{
    const result = $eventLocation.all().filter(evtLocation => !!evtLocation.coordinates);
    return result;
  }

  get eventLocationsForList(): CMS.EventLocation[]{
    const result = $eventLocation.all().sort((a, b) => {
      return a.name[currentLangStore.lang].localeCompare(b.name[currentLangStore.lang])
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
    document.body.classList.add('body-scroll');
  }

  beforeDestroy() {
    document.body.classList.remove('body-scroll');
  }

  onMapLoaded(map:Map){
    console.log("map is loaded");
    // mapEventProvider.addListener(this.onMapEvent);
  }

  onMapEvent(evt: any){
    console.log(evt);
  }

  onMarkerClick(eventLocation: CMS.EventLocation){
    console.log("onMarkerClick", eventLocation._id);

    if(this.selectedEventLocation && this.selectedEventLocation._id === eventLocation._id){
      this.navigateToSelectedEventLocation();
    }else{
      this.selectedEventLocation = eventLocation;
      this.showPopup = true;
    }
  }

  navigateToSelectedEventLocation(){
    this.$router.push({path:`/map/${(this.selectedEventLocation as CMS.EventLocation).slug}`});
  }

  onPopupSelectionRequest(){
    console.log("popup selection request");
    this.navigateToSelectedEventLocation();
  }

  onPopupCloseRequest(){
    console.log("popup close request");
    this.showPopup = false;
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
