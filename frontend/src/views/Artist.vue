<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="artist">
    <!-- TOOLBAR -->
    <Toolbar />

    <div style="height:100px" />
    <ul>
      <li>{{artist.firstname}} {{artist.lastname}}</li>
      <li><a href="artist.artistWebsite">{{artist.artistWebsite}}</a></li>
    </ul>

    <h4>Bio</h4>
    <div v-html="t(artist.content)" />
    
  </div>
</template>

<style lang="scss" scoped>
  .artist{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    background: white;
    margin: 0;
    z-index: 2;
    height: 100vh;
    width: 100vw;    
    padding-top:0;    
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $artist } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons, Toolbar
  }
})
export default class Artist extends mixins(Translatable) {

  get config(){
    return $config.store.config;
  }


  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  // *this* does not exist at this point
  beforeRouteEnter(to: Route, from: Route, next: any) {
    const slug = to.params.artist;
    const artistExists = !!$artist.artistWithSlug(slug);
    if(!artistExists){
      next({name:'NotFound'});
    }else{
      next();
    }
  }
  
  // *this* does not exist at this point
  beforeRouteUpdate(to: Route, from: Route, next: any) {
    const slug = to.params.artist;
    const artistExists = !!$artist.artistWithSlug(slug);
    if(!artistExists){
      next({name:'NotFound'});
    }else{
      next();
    }
  }

  mounted(){
  }

  get artist(): CMS.Artist {
    return $artist.artistWithSlug(this.$route.params.artist) as CMS.Artist;
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
