<template>
  <div id="app">
    <!--------------- Backdrop + Canvas ---------------->
    <!-- <div class="backdrop"></div> -->
    <!-- <div class="shade"></div> -->
    <Navigation >
      <router-view/>
    </Navigation>

  </div>
</template>

<style lang="scss">

// 
// global style
@import "./styles/app.scss";
</style>


<script lang="ts">
import { Route } from 'vue-router';
import { Component, Vue } from 'vue-property-decorator';
import { $config, $eventLocation } from './services';
import Navigation from './components/Navigation.vue';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    Navigation
  }
})
export default class App extends mixins(Translatable) {

  get config(){
    return $config.store.config;
  }
  
  mounted(){
  }

  beforeDestroy() {
  }

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }
  
  // *this* does not exist at this point
  beforeRouteEnter(to: Route, from: Route, next: any) {
  }
  
  // *this* does not exist at this point
  beforeRouteUpdate(to: Route, from: Route, next: any) {
  }
  

}
</script>
