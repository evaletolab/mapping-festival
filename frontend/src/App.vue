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
import { $config } from './services';
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

  registration:any = null;
  updateExists = false;
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

    //
    // update app
    addEventListener('swUpdated', this.onUpdateAvailable, { once: true })

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

  onUpdateAvailable(event){
      this.registration = event.detail
      this.updateExists = true;
      console.log('---DBG',this.registration);
      this.onRefreshApp();
  }


  onRefreshApp() {
    this.updateExists = false
    // Make sure we only send a 'skip waiting' message if the SW is waiting
    if (!this.registration || !this.registration.waiting) return
    // Send message to SW to skip the waiting and activate the new SW
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    //
    //refresh content from registerServiceWorker.ts
    setTimeout(()=> window.location.reload(true),3000);
  }  


  // *this* does not exist at this point
  beforeRouteEnter(to: Route, from: Route, next: any) {
  }
  
  // *this* does not exist at this point
  beforeRouteUpdate(to: Route, from: Route, next: any) {
  }
  

}
</script>
