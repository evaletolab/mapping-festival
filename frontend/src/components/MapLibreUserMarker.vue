
<template>
  <div ref="markerElement"/>
</template>

<style scoped>
  div {
    background: #6289f5f6;
    border-radius: 50%;
    border: 2px solid #fff;
    width: 24px;
    height: 24px;
    z-index: 100;
    filter: drop-shadow(0 0 0.65rem #11111155);
  }
</style>

<script lang="ts">
/* eslint-disable */
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import { $geoLocation } from '@/services';

import mapboxgl, { LngLatLike, Map, Marker, MarkerOptions, Popup } from "maplibre-gl";
// @ts-ignore
import { genevaCoords } from '../lib/geoUtils';
// @ts-ignore

import { CMS } from "@/models";
import { GeolocationEventType, LocationServiceState } from '@/services/geoLocation-service';

@Component
export default class MapLibreUserMarker extends Vue {

  // @InjectReactive() map!: Map;
  @Prop() map!: Map;
  @Prop({default: false}) mapIsReady!: boolean;

  marker!: Marker;

  get markerElement(): HTMLElement{
    return this.$refs.markerElement as HTMLElement;
  }

  mounted(){
    this.hideMarker(); 
  }

  @Watch('map')
  onMapChanged(val: Map, oldVal: Map) {
    // console.log("onmap changed", val, oldVal);
    // console.log("map = ", this.map);
    // console.log(this.coordinates);


    const options: MarkerOptions = {
      element: this.markerElement,
      anchor: 'center',
    };

    const startLocation = genevaCoords as LngLatLike;

    this.marker = new mapboxgl.Marker(options)
        .setLngLat(startLocation)
        .addTo(this.map);
    

    $geoLocation.addEventListener(GeolocationEventType.started, this.onGeoLocationStarted);
    $geoLocation.addEventListener(GeolocationEventType.significantCoords, this.onGeoLocationFirstValue);
    $geoLocation.addEventListener(GeolocationEventType.coords, this.onGeoLocationUpdate);
    $geoLocation.addEventListener(GeolocationEventType.locationError, this.onGeoLocationError);
    $geoLocation.addEventListener(GeolocationEventType.stopped, this.onGeoLocationStopped);

    console.log("user marker created");

    if($geoLocation.isStarted && $geoLocation.currentCoords){
        this.marker.setLngLat($geoLocation.currentCoords as LngLatLike);
        this.showMarker();
    }else{
        this.hideMarker();
    }
  }

  showMarker(){
   if(this.markerElement){
      // console.log("show marker");
      this.markerElement.style.visibility = "visible";
    }
  }

  hideMarker(){
    if(this.markerElement){
      this.markerElement.style.visibility = "hidden";
    }
  }


  beforeDestroy() {
    if(this.marker){
        // console.log("removing marker with id", id);
        this.marker.remove();
    }
    $geoLocation.removeEventListener(GeolocationEventType.started, this.onGeoLocationStarted);
    $geoLocation.removeEventListener(GeolocationEventType.significantCoords, this.onGeoLocationFirstValue);
    $geoLocation.removeEventListener(GeolocationEventType.coords, this.onGeoLocationUpdate);
    $geoLocation.removeEventListener(GeolocationEventType.locationError, this.onGeoLocationError);
    $geoLocation.removeEventListener(GeolocationEventType.stopped, this.onGeoLocationStopped);
  }


  onGeoLocationStarted(){
    // console.log("UserMarker: on geoLocation started --------------------");
    if($geoLocation.currentCoords){
        this.marker.setLngLat($geoLocation.currentCoords);
        this.showMarker();
    }
  }

  onGeoLocationFirstValue(event){
    // console.log("UserMarker: on geoLocation update --------------------", event.value);
    if(this.marker){
        this.marker.setLngLat(event.value.coords);
        this.showMarker();
    }else{
        this.hideMarker();
    }
  }

  onGeoLocationUpdate(event){
    // console.log("UserMarker: on geoLocation update --------------------", event.value);

    if(this.marker && event.value.coords){
      this.marker.setLngLat(event.value.coords);
      this.showMarker();
    }else{
      this.hideMarker();
    }
  }

  onGeoLocationError(event){
    // console.log("on error ---------------------------");
    if($geoLocation.serviceState == LocationServiceState.PERMISSION_DENIED || 
      $geoLocation.serviceState == LocationServiceState.UNSUPPORTED_DEVICE){
      this.hideMarker();
    }
  }

  onGeoLocationStopped(){
    // console.log("on stopppedd ---------------------------");
    this.hideMarker();
  }
}
</script>
