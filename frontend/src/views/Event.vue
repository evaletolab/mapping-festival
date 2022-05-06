<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="event">

    <div class="header hide-sm">

    <!-- ************************ -->
    <!-- ******** Header ******** -->
    <!-- ************************ -->

    <div class="header-wrapper">

      <div class="header-info">
      <!-- 
      config.landing.title1 : Mapping festival
      config.landing.title2 : Visual audio…
      config.landing.title3 : Geneva
      -->
      
      <!------------->
      <!-- Title 1 -->
      <!------------->
        <h2 class="white" v-html="config.landing.title1"/> 
        <!-- <h1 class="" v-html="t(config.landing.title1)"/> -->
      
      <!------------->
      <!-- Title 2 -->
      <!------------->
        <!-- <div  v-for="(title,index) in t(config.landing.title2).split('\n')" :key="index">
          {{title}}</div> -->
        <div class="white">Visual audio and<br>deviant electronics</div>

      <!------------->
      <!--- Dates --->
      <!------------->
        <div class="margin-top1 white">19 &#8239; — &#8239; 29.5.2022</div>
      
      <!------------->
      <!-- Title 3 -->
      <!------------->
      
        <!--  <div  v-html="t(config.landing.title3)"  class="hide-sm"/> -->
        <div  class="white" v-for="(title,index) in t(config.landing.title3).split('\n')" :key="index">
        {{title}}</div>
        
      </div>

      <!---------------------->
      <!-- Background image -->
      <!---------------------->

      <div class="header-image"></div>

    </div>

    <!-- ************************ -->
    <!-- ******* /Header ******** -->
    <!-- ************************ -->

      <!-- <h4 class="tagline align-right">
          <div  v-for="(title,index) in t(config.landing.title2).split('\n')" :key="index">{{title}}</div>
          <div  v-html="t(config.landing.title3)"  class="hide-sm"/>
      </h4> -->

      <div class="destination hide">
        {{t(event.title)}}
      </div>
    </div>

    <!-- TOOLBAR -->
    <toolbar class="hide-lg hide-md" />

    <div class="content spiegel margin-top1">

      <!-- HEADER -->
      <section class="header-event spiegel text-shadow" :style="backgroundImage">    
       
        <!-- <p v-if="date" class="ui-font big align-right text-shadow">{{date|shortdate}}</p> -->



          <!------------- Nice dates ----------->
          <div v-if="event.when.length < 2" >
            <div class="ui-font big align-right text-shadow" v-for="(when,index) in event.when" :key="index">
            {{when.start|shortdate}} / {{when.startTime}} — {{when.endTime}}
            </div>
          </div>
          <div v-else>
            <div class="interval ui-font big align-right text-shadow" v-for="(interval, index) in intervals" :key="index">
              {{interval.shortDate}} / {{interval.startTimeAsStr}} — {{interval.endTimeAsStr}}
            </div>
          </div>
          <!-- ------------------------------- -->


        <br>
        <h1>{{t(event.title)}}</h1><br>
        <div v-for="artist in artists" :key="artist._id">
          <p class="ui-font big">
            {{artist.fullname}} <sup>{{artist.country}}</sup></p>
        </div>


        <p class="ui-font align-center">
          <br><br>
          {{getTypeLabel(event.typology)}} / {{event.thematic}} </p>    
      </section>


      <!-- ABOUT -->
      <div class="spiegel">
      <h4 class="width6 indent2 margin-top1">

        <!-- Price and public admittance limit -->

        <!-- <div class="item"></div> -->
        <div class="item">{{t({fr:"Prix", en:"Price"})}}: CHF {{event.price || '--'}}.–</div>
        <!-- <div class="item">{{t({fr:"Limite", en:"Limit"})}}: {{event.limit || '--'}} personnes</div> -->

        <div class="item" v-if="event.ticketUrl">
          <!-- {{t({fr:"Prix", en:"Price"})}}: CHF {{event.price || '--'}}.– -->
        <a :href="event.ticketUrl" target="_blank">---> {{t({fr: "Billetterie", en:"Ticketing"})}}</a>
      </div>
      </h4>

<!-- 
      <p class="indent2" v-if="event.ticketUrl">
        <a :href="event.ticketUrl" target="_blank">{{t({fr: "Billetterie", en:"Ticketing"})}}</a>
      </p> -->
      </div>

      
      <div class="spiegel margin-top1">
        <p class="indent2 width5" v-html="t(event.header)"></p> 
        <div v-html="t(event.content)"/>
      </div>

      <!--
      <p v-if="event.notes" v-html="t(event.notes)" />
      -->

      <!-- Dates -->

      <div class="spiegel">

        <h5 class="indent2 width6 margin-top1">
          <div v-if="event.when.length < 2" >
            <div class="" v-for="(when,index) in event.when" :key="index">

            {{when.start|shortdate}} / {{when.startTime}} — {{when.endTime}}
            <span v-if="eventLocation" >  --->  </span>
            <router-link v-if="eventLocation" class="simple-link" :to="`/map/${eventLocation.slug}`">
              {{t(eventLocation.name)}}
            </router-link>
            </div>
          </div>
          <div v-else>
            <div class="interval" v-for="(interval, index) in intervals" :key="index">

              {{interval.shortDate}} / {{interval.startTimeAsStr}} — {{interval.endTimeAsStr}}
              <span v-if="eventLocation" >  --->  </span>
              <router-link v-if="eventLocation" class="simple-link" :to="`/map/${eventLocation.slug}`">
                {{t(eventLocation.name)}}
              </router-link>
            </div>
          </div>
        </h5>
      </div>


      <div class="spiegel">
        <!-- <h2>{{ t({fr: "Lieu", en: "Location"}) }}</h2>
        <div class="grid">
          <spot-card v-if="eventLocation" :eventLocation="eventLocation" />
        </div> -->
        
        <div v-if="artists.length > 0">
          <h1 class="margin-top3">Artists</h1>
          <div v-for="artist in artists" :key="artist._id">
            <br>
            <img class="image image-align-left width8 height14 shift-left" :src="artist.cover ? artist.cover.path: 'https://via.placeholder.com/450/000000/000000'">
            <h2>{{artist.fullname}}<!--<sup>{{artist.country}}</sup>--></h2>
            <br>
            <div v-html="t(artist.content)" />
          </div>
        </div>

        <!-- <p v-if="!!when.eventLocation"> 
            <router-link :to="`/map/${when.eventLocation.slug}`">{{t(when.eventLocation.name)}}</router-link> 
        </p> -->

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
      <br><br><br><br><br><br>
    </div>
  </div>
  
</template>

<style lang="scss" scoped>

  .event{
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


    .header-event{
      position: relative;
      height: calc( 100vh / 2 );
      padding: var(--gutter-width);
      padding-top:  calc(var(--gutter-width)*1.25);
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

    .simple-link{
      text-decoration: none;
    }

  }


</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $event, $i18n } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import VideoPlayer from '../components/VideoPlayer.vue';
import PrimaryMenu from '../components/PrimaryMenu.vue';
import SoundCloud from 'vue-soundcloud-player';
import SpotCard from '../components/SpotCard.vue';

import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons, Toolbar, VideoPlayer, SoundCloud, SpotCard
  }
})
export default class Event extends mixins(Translatable) {

  date: Date | null = null;

  get config(){
    return $config.store.config;
  }

  get backgroundImage(){
    const defaultImg = 'https://via.placeholder.com/450/000000/000000';
    const cover = this.event.cover as any;
    const image = (cover &&  cover.sizes) ? cover.sizes.headerimage.path:defaultImg;
    return {
      backgroundImage:  'url(' + image + ') ',
      backgroundRepeat: 'no-repeat',
      backgroundSize :'cover',
      backgroundPosition: '50%'
    };
  }

  get intervals(): CMS.Interval[]{
    const intervals = new CMS.EventWrap(this.event).intervals;
    console.log("intevals", intervals);
    return intervals;
  }


  getTypeLabel(type) {
    return $i18n.t(type);
  }
  
  // //
  // // get first available date after now
  // get when(){
  //   const now = Date.now();
  //   const find = (this.event.when||[]).find(when => when._id > now );
  //   return find ? find.start:null;
  // }

  mounted(){
    document.body.classList.add('body-scroll');
    document.body.scrollTop = 0;
    try{window.scrollTo(0,0);}catch(e){
      //
    }
    
    if(this.$router.currentRoute.query.when){
      const split = (this.$router.currentRoute.query.when as string).split("-");
      if(split.length == 3){
        const y = parseInt(split[0]);
        const m = parseInt(split[1]);
        const d = parseInt(split[2]);

        if(m >0 && m <= 12){
          const aDate = new Date(y, m - 1, d);
          if(!isNaN(aDate.getTime())){
            this.date = aDate;
          }
        }
      }
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

  get eventLocation(): CMS.EventLocation | null{
    return new CMS.EventWrap(this.event).eventLocation;
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
