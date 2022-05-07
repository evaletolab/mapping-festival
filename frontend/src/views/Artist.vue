<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="artist">

    <!-- <div class="header hide-sm">
      <h4 class="tagline  align-right">
          <div  v-for="(title,index) in t(config.landing.title2).split('\n')" :key="index">{{title}}</div>
          <div  v-html="t(config.landing.title3)"  class="hide-sm"/>
      </h4>

    </div> -->

    <!-- ************************ -->
    <!-- ******** Header ******** -->
    <!-- ************************ -->

    <div class="header-wrapper hide-sm">
      <header-info />

    </div>
    <!-- ************************ -->
    <!-- ******* /Header ******** -->
    <!-- ************************ -->








    <!-- TOOLBAR -->
    <toolbar class="hide-lg hide-md" />
    <div class="content spiegel margin-top1">

      <!-- ARTIST CONTENT -->

            <h1 class="">
        {{artist.fullname}}
      </h1>
      
      <h1 class="indent1 margin-top2">Bio</h1>
      <br>
      <div class="indent1 width6" v-html="t(artist.content)" />

      <ul class="indent1">
        <li v-if="artist.artistWebsite" >
          <a :href="artist.artistWebsite" target="_blank" rel="noopener noreferrer">
            {{artist.artistWebsite}}
          </a>
        </li>
      </ul>

      <h1 class="margin-top1">Events</h1>
      <div class="grid-container grid-container--fit">
        <div class="grid-element event" 
            v-for="event in events" :key="event._id">
          <event-card :event="event" />
        </div>
      </div> 

      <!-- <event-card v-for="event in events" :key="event._id" :event="event" /> -->

<!--
      <img v-if="artist.cover" :src="artist.cover.path" /> -->


      <div v-if="mediaCount > 0">
        <h1 class="margin-top2 align-center">Medias</h1>
        <div class="margin-top2" v-for="media in externalVideos" :key="media.url">
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

      <div v-if="socialMedia.length > 0">
        <h2 class="margin-top1 align-center">Social media</h2>

      <div class="social-icons-wrapper">
        <div class="social-media image" v-for="media in socialMedia" :key="media.platform">
          <SocialIcons :name="media.platform" :url="media.url"/> 
        </div>
      </div>

      </div>

    </div>

<div class="prule margin-top5"></div>

  </div>
</template>

<style lang="scss" scoped>
  .artist{
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    color: var(--font-color);
    margin: 0;
    z-index: 2;
    height: 100vh;
    width: 100%;    
    margin-top: 0px;

    .content{
      @media (max-width:425px) {
        margin-top: 80px;        
      }
    }

  }
  // img{
  //   width:100%;
  // }

  .social-icons-wrapper{
  display: flex;
  }

  .social-media{
    // background-color: aqua;
    // display: inline-block;
    // margin-right: var(--gutter-width);
    margin: auto;
    -webkit-filter: invert(100%);
    filter: invert(100%);
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $artist } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import PrimaryMenu from '../components/PrimaryMenu.vue';
import VideoPlayer from '../components/VideoPlayer.vue';
import SoundCloud from 'vue-soundcloud-player';
import SocialIcons from '../components/SocialIcons.vue';
import EventCard from '../components/EventCard.vue';
import HeaderInfo from '../components/HeaderInfo.vue';

import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons, Toolbar, PrimaryMenu, VideoPlayer, SoundCloud, SocialIcons, EventCard, HeaderInfo,
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
    document.body.classList.add('body-scroll');
    try{window.scrollTo(0,0);}catch(e){
      //
    }
  }

  beforeDestroy() {
    document.body.classList.remove('body-scroll');
  }

  get artist(): CMS.ArtistWrap {
    const artist = $artist.artistWithSlug(this.$route.params.artist) as CMS.Artist;
    return new CMS.ArtistWrap(artist);
  }

  get mediaCount(): number {
    return this.externalVideos.length + this.externalSoundCloud.length + this.localImages.length + this.externalImages.length;
  }
  
  get externalVideos(): CMS.ExternalMedia[] {
    return this.artist.externalMedias.filter(m => m.platform == "youtube" || m.platform == "vimeo");
  }

  get externalSoundCloud(): CMS.ExternalMedia[]{
    return this.artist.externalMedias.filter(m => m.platform == "soundCloud");
  }

  get localImages(): CMS.LocalMedia[]{
    const result = this.artist.localMedias.filter(m => m.image);
    return result;
  }

  get externalImages(): CMS.ExternalMedia[]{
    const result = this.artist.externalMedias.filter(m => m.platform === "img");
    return result;
  }

  get socialMedia(): CMS.SocialMedia[]{
    const result = this.artist.socialMedias;
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
