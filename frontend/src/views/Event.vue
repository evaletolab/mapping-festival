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
   
    <ul>
      <li v-if="event.price">{{t({fr:"prix", en:"price"})}}: {{event.price}}</li>
      <li v-if="event.limit">{{t({fr:"limite", en:"limit"})}}: {{event.limit}}</li>
    </ul>
    <div v-html="t(event.content)"></div>

    <h2>Artists</h2>
    <ul v-for="artist in artists" :key="artist._id">
      <li>
        <router-link :to="`/artists/${artist.slug}`">{{artist.firstname}} {{artist.lastname}} {{artist.artistName}}</router-link>
      </li>
    </ul>

    <h2>{{t({fr:"Horaires", en:"Timetable"})}}</h2>

    <div v-for="when in whens" :key="when.id">
      <p>{{when.dayOfWeek}} {{when.date}} {{when.month}}</p>
      <p>{{when.startTime}} - {{when.endTime}}</p>
      <p v-if="!!when.eventLocation"> 
        <router-link :to="`/spot/${when.eventLocation.slug}`">{{t(when.eventLocation.name)}}</router-link> 
      </p>
      <br>
    </div>


    <h4>Media</h4>
    <h5>Videos</h5>
    <div v-for="media in externalVideos" :key="media.url">
      <VideoPlayer :externalMedia="media" />
    </div>

    <h5>Audio</h5>
    <div v-for="media in externalSoundCloud" :key="media.url">
      <SoundCloud :track="media.url" :mini="true" />
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
  .event{
  }
  img{
    width:100%;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $event } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import VideoPlayer from '../components/VideoPlayer.vue';
import SoundCloud from 'vue-soundcloud-player';

import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons, Toolbar, VideoPlayer, SoundCloud
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

  get artists(): CMS.Artist[]{
    return $event.artistsForEvent(this.event);
  }

  get whens(): CMS.When[]{
    const result = this.event.when;
    console.log("whens", result);
    return result;
  }
  
  get externalVideos(): CMS.ExternalMedia[] {
    return this.event.externalMedias.filter(m => m.platform == "youtube" || m.platform == "vimeo");
  }

  get externalSoundCloud(): CMS.ExternalMedia[]{
    return this.event.externalMedias.filter(m => m.platform == "soundCloud");
  }

  get localImages(): CMS.LocalMedia[]{
    const result = this.event.localMedias.filter(m => m.image);
    return result;
  }

  get externalImages(): CMS.ExternalMedia[]{
    const result = this.event.externalMedias.filter(m => m.platform === "img");
    return result;
  }

  async onLoad(slug: string) {
    //
  }

  async onSave() {
    //
  }
}
</script>
