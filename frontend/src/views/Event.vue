<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="event spiegel margin-top1">
    <!-- TOOLBAR -->
    <Toolbar/>

    <div style="height: 80px" />

    <h1>{{t(event.title)}} ({{event.type}} / {{event.subType}})</h1>


    <div v-html="t(event.header)"></div>
   
    <div v-html="t(event.content)"></div>
    <ul>
      <li v-if="event.price">{{t({fr:"prix", en:"price"})}}: {{event.price}}</li>
      <li v-if="event.limit">{{t({fr:"limite", en:"limit"})}}: {{event.limit}}</li>
    </ul>

  </div>
</template>

<style lang="scss" scoped>
  .event{
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $event } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons, Toolbar
  }
})
export default class Event extends mixins(Translatable) {
  get config(){
    return $config.store.config;
  }


  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  // *this* does not exist at this point
  beforeRouteEnter(to: Route, from: Route, next: any) {
    const slug = to.params.event;
    const eventExists = !!$event.eventWithSlug(slug);
    if(!eventExists){
      next({name:'NotFound'});
    }else{
      next();
    }
  }
  
  // *this* does not exist at this point
  beforeRouteUpdate(to: Route, from: Route, next: any) {
    const slug = to.params.event;
    const eventExists = !!$event.eventWithSlug(slug);
    if(!eventExists){
      next({name:'NotFound'});
    }else{
      next();
    }
  }
  
  get event(): CMS.Event {
    return $event.eventWithSlug(this.$route.params.event) as CMS.Event;
  }

  mounted(){
  }


  async onLoad(slug: string) {
    //
  }

  async onSave() {
    //
  }
}
</script>
