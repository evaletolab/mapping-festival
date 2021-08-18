<template>
  <div class="container">
    <toggle class="toggle" :value="geolocationActive" v-on:change="gpsToggle" />
  </div>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
/* eslint-disable */

import { Component, Prop, Vue } from 'vue-property-decorator';
import Toggle from './Toggle.vue';
import { $geoLocation } from '@/services';
import { GeolocationEventType } from '@/services/geoLocation-service';

@Component({
  components:{ Toggle, }
})
export default class MapLibreGeolocationControls extends Vue {
  geolocationActive: boolean = false;

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
      this.geolocationActive = true;
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


}
</script>