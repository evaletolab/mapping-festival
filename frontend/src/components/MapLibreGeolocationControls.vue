<template>
  <div v-if="mapIsReady" v-bind:class="{ open: isOpen }" class="container">
    <toggle class="toggle" :value="geolocationActive" v-on:change="gpsToggle" />
    <p class="label">GPS</p>
    <img v-if="centerIconVisible && isOpen" class="center-icon" src="/img/svg/center_me_inactive.svg" @click="onCenterClick" />
  </div>
</template>

<style lang="scss" scoped>
  .container{
    background-color: rgba(0,0,0,.24);
    height: 80px;
    padding: .5rem;
    border-radius: 6%;
    overflow: hidden;
    
    transition: height 1s;
    -webkit-transition: height 1s;
    -moz-transition: height 1s;
    -ms-transition: height 1s;
    -o-transition: height 1s;
  }

  .container.open{
    height: 120px;
  }

  .label{
    margin:auto;
    width: 100%;
    text-align: center;
  }

  .center-icon{
    display: block;
    margin: auto;
    height:48px;
  }
</style>

<script lang="ts">
/* eslint-disable */

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Toggle from './Toggle.vue';
import { $geoLocation } from '@/services';
import { GeolocationEventType } from '@/services/geoLocation-service';
import mapboxgl, { Map } from "maplibre-gl";

@Component({
  components:{ Toggle, }
})
export default class MapLibreGeolocationControls extends Vue {
  @Prop({default: false}) mapIsReady!: boolean;
  @Prop({default: true}) private centerIconVisible!: boolean;

  geolocationActive: boolean = false;
  visible: boolean = false;

  get isOpen(): boolean{
    return this.geolocationActive && this.centerIconVisible;
  }

  mounted(){
    this.geolocationActive = $geoLocation.isStarted;

    $geoLocation.addEventListener(GeolocationEventType.started, this.onGeoLocationStarted);
    $geoLocation.addEventListener(GeolocationEventType.significantCoords, this.onGeoLocationUpdate);
    $geoLocation.addEventListener(GeolocationEventType.locationError, this.onGeoLocationError);
    $geoLocation.addEventListener(GeolocationEventType.stopped, this.onGeoLocationStopped);
  }

  beforeDestroy(){
    $geoLocation.removeEventListener(GeolocationEventType.started, this.onGeoLocationStarted);
    $geoLocation.removeEventListener(GeolocationEventType.significantCoords, this.onGeoLocationUpdate);
    $geoLocation.removeEventListener(GeolocationEventType.stopped, this.onGeoLocationStopped);
    $geoLocation.removeEventListener(GeolocationEventType.locationError, this.onGeoLocationError);
  }

  gpsToggle(e){
    const toggled = e.value;
    console.log("got toggle status", toggled);
    if(toggled){
      $geoLocation.start();
    }else{
      $geoLocation.stop();
    }
  }

  onGeoLocationStarted(){
    console.log("geolocation service started");
    this.geolocationActive = true;
  }

  onGeoLocationUpdate(event){
    this.geolocationActive = true;
  }

  onGeoLocationError(event){
    console.log("got error", event);
    this.geolocationActive = false;
  }

  onGeoLocationStopped(){
    console.log("geolocation service stopped");
    this.geolocationActive = false;
  }

  onCenterClick(){
    this.$emit("centerRequest", {});
  }
}
</script>