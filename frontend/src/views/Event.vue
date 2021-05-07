<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="event">
    <!-- TOOLBAR -->
    <Toolbar/>

    <!-- HEADER -->
    <section class="header spiegel" :style="backgroundImage">    
      <p class="ui-font big align-right ">{{when|shortdate}}</p>    <br><br> 
      <p class="ui-font big ">{{t(event.title)}}</p>  <br>
      <p class="ui-font align-center">
        <!-- {{event.type}} / --> {{event.subType}} <!-- {{t(event.header)}} --> </p>    
    </section>

    <!-- ABOUT -->
    <div class="spiegel">
    <h4 class="width5 indent1 margin-top1">
      <div class="item" v-for="(when,index) in event.when" :key="index">{{when.start|shortdate}} / {{when.startTime}} — {{when.endTime}}</div>
      <!--
      <div class="item"></div> -->
      <div class="item">{{t({fr:"Prix", en:"Price"})}}: CHF {{event.price || '--'}}.–</div>
      <div class="item">{{t({fr:"Limite", en:"Limit"})}}: {{event.limit || '--'}} personnes</div>
    </h4>
    </div>

    <div class="spiegel" v-html="t(event.content)"></div>

    <div class="spiegel">
      <h2>Artists</h2>
      <div v-for="artist in artists" :key="artist._id">
        <img class="image image-align-left width7 height14 shift-left" :src="artist.cover ? artist.cover.path: 'https://via.placeholder.com/450'">
        <h2>{{artist.fullname}}<sup>{{artist.country}}</sup></h2>
        <div v-html="t(artist.content)" />
      </div>

      <p v-if="!!when.eventLocation"> 
          <router-link :to="`/map/${when.eventLocation.slug}`">{{t(when.eventLocation.name)}}</router-link> 
      </p>

  <!--
      <h2>{{t({fr:"Horaires", en:"Timetable"})}}</h2>

      <div v-for="when in whens" :key="when.id">
        <p>{{when.dayOfWeek}} {{when.date}} {{when.month}}</p>
        <p>{{when.startTime}} - {{when.endTime}}</p>
        <p v-if="!!when.eventLocation"> 
          <router-link :to="`/map/${when.eventLocation.slug}`">{{t(when.eventLocation.name)}}</router-link> 
        </p>
        <br>
      </div>

      -->

      <div v-if="mediaCount > 0">
        <h4>Medias</h4>
        <div v-for="media in externalVideos" :key="media.url">
          <VideoPlayer :externalMedia="media" />
      </div>

      <div v-for="media in externalSoundCloud" :key="media.url">
        <SoundCloud :track="media.url" :mini="true" />
      </div>
        
      <div v-for="image in localImages" :key="image._id">
        <img :src="image.sizes.headerimage.path" /> 
      </div>

      <div v-for="image in externalImages" :key="image._id">
        <img :src="image.url" /> 
      </div>

      </div>
    </div>
      <br><br><br><br>
  </div>
  
</template>

<style lang="scss" scoped>

  .header{
    position: relative;
    height: calc( 100vh / 2 );
    padding: var(--gutter-width);
    padding-top:  calc(var(--gutter-width)*1.5);
    color: white;


  .when{
    position: absolute;
    right: 30px;
    top: 20px;
    font-size: 40px;
    font-weight: 600;      
  }
  .title{
    position: absolute;
    left: 20px;
    top: 70px;
    font-size: 40px;
    font-weight: 500;      
  }
  .type{
    position: absolute;
    bottom: 50px;
    text-align: center;
    left: 30%;
  }

  }

  .event{
    margin-top: 60px;
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
import PrimaryMenu from '../components/PrimaryMenu.vue';

import SoundCloud from 'vue-soundcloud-player';

import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons, Toolbar, PrimaryMenu, VideoPlayer, SoundCloud
  }
})
export default class Event extends mixins(Translatable) {
  get config(){
    return $config.store.config;
  }

  get backgroundImage(){
    const defaultImg = 'https://via.placeholder.com/450';
    const cover = this.event.cover as any;
    const image = (cover &&  cover.sizes) ? cover.sizes.headerimage.path:defaultImg;
    return {
      backgroundImage:  'url(' + image + ') ',
      backgroundRepeat: 'no-repeat',
      backgroundSize :'cover'
    };
  }

  //
  // get first available date after now
  get when(){
    const now = Date.now();
    const find = (this.event.when||[]).find(when => when._id > now );
    return find ? find.start:null;
  }

  mounted(){
    document.body.classList.add('body-scroll');
    document.body.scrollTop = 0;
    try{window.scrollTo(0,0);}catch(e){
      //
    }
    

  }

  beforeDestroy() {
    document.body.classList.remove('body-scroll');
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

  get artists(): CMS.ArtistWrap[]{
    return $event.artistsForEvent(this.event).map(a => new CMS.ArtistWrap(a))
  }

  get whens(): CMS.When[]{
    const result = this.event.when;
    console.log("whens", result);
    return result;
  }

  get mediaCount(): number {
    return this.externalVideos.length + this.externalSoundCloud.length + this.localImages.length + this.externalImages.length;
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
