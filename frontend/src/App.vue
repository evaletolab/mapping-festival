<template>
  <div id="app">
    <!--------------- Backdrop + Canvas ---------------->
    <!-- <div class="backdrop"></div> -->
    <!-- <div class="shade"></div> -->
    <!--
    <NavigationDesktop v-if="!isMobileView" >
      <router-view/>
    </NavigationDesktop>
    <NavigationMobile v-else >
      <router-view/>
    </NavigationMobile>
    -->
    <NavigationDesktop>
      <router-view/>
    </NavigationDesktop>
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
import NavigationDesktop from './components/NavigationDesktop.vue';
import NavigationMobile from './components/NavigationMobile.vue';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    NavigationDesktop, NavigationMobile,
  }
})
export default class App extends mixins(Translatable) {

  screenWidth = 0;
  
  get config(){
    return $config.store.config;
  }
  
  get isMobileView(){
    console.log("screen width", this.screenWidth);
    return this.screenWidth < 800;
  }

  mounted(){
    addEventListener('resize', this.onResize);
    this.computeScreenWidth();
  }

  beforeDestroy() {
    removeEventListener('resize', this.onResize);
  }
  computeScreenWidth(){
    this.screenWidth = window.innerWidth;
  }

  onResize(){
    this.computeScreenWidth();
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
