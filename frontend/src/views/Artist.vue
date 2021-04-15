<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="artist spiegel margin-top1">
    <!-- TOOLBAR -->
    <Toolbar />

    <div style="height:100px" />
    <ul>
      <li>{{artist.firstname}} {{artist.lastname}} <span v-if="artist.artistName">aka {{artist.artistName}}</span> </li>
      <li><a href="artist.artistWebsite">{{artist.artistWebsite}}</a></li>
    </ul>

    <h4>Bio</h4>
    <div v-html="t(artist.content)" />

    <h4>Events</h4>
    <ul v-for="event in events" :key="event._id">
      <li> 
        <router-link :to="`/events/${event.slug}`">{{ t(event.title) }}</router-link>
      </li>
    </ul>

    <h4>Media</h4>
    <h5>Videos</h5>
    <div v-for="media in externalMedias" :key="media.url">
      <VideoPlayer :externalMedia="media" />
    </div>
    
    <h5>images local (on cms with size variants)</h5>
    <div v-for="image in localImages" :key="image._id">
      <img :src="image.sizes.headerimage.path" /> 
    </div>
    <h5>images external</h5>
    <div v-for="image in externalImages" :key="image._id">
      <img :src="image.url" /> 
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .artist{
    // top: 0;
    // right: 0;
    // bottom: 0;
    // margin: 0;
    // z-index: 2;
    // height: 100vh;
    // width: 100vw;    
    // padding-top:0;    
  }
  img{
    width:100%;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $artist } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import VideoPlayer from '../components/VideoPlayer.vue';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons, Toolbar, VideoPlayer  
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

  get externalMedias(): CMS.ExternalMedia[] {
    return this.artist.externalMedias;
  }

  get localImages(): CMS.LocalMedia[]{
    const result = this.artist.localMedias.filter(m => m.image);
    return result;
  }

  get externalImages(): CMS.ExternalMedia[]{
    const result = this.artist.externalMedias.filter(m => m.platform === "img");
    return result;
  }

  get events(): CMS.Event[]{
    const result = $artist.eventsForArtist(this.artist);
    console.log("events for artist", result);
    return result;
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
