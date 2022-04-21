<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="artist" id="artists-top">
    <div class="header hide-sm">
      <h4 class="tagline  align-right">
          <div  v-for="(title,index) in t(config.landing.title2).split('\n')" :key="index">{{title}}</div>
          <div  v-html="t(config.landing.title3)"  class="hide-sm"/>
      </h4>

      <div class="ui-font big destination">
        {{t(title)}}
      </div>
    </div>

    <!-- TOOLBAR -->
    <toolbar class="hide-lg hide-md" />

    <section class="gotop" @click="onTop"
            :class="{'exited': (scrollDirection > 0) }">
      <button >
        <i class="fas fa-arrow-up fa-2x"></i>
      </button>
    </section>


    <!-- <router-link to="/program/Collection%20virtuelle">test</router-link> -->

    <div v-if="filter == 'Collection virtuelle'" class="content spiegel margin-top1" >
      <div class="grid day-wrapper " v-for="event in events" :key="event._id" :id="event._id">
        <div class="grid-container grid-container--fit">
          <event-card :event="event" />
        </div> 
      </div> 
    </div>
    <div v-else class="content spiegel margin-top1" >
      <div v-for="eventSet in sortedEventSets" :key="eventSet.typology">
        <h1 class="letter-key">{{t(computeEventTypeTranslation(eventSet.typology))}}</h1>
        <event-card v-for="event in eventSet.events" :key="event._id" :event="event" />
        <hr>
      </div>
    </div>

  </div>
</template>

<style >
</style>

<style lang="scss" scoped>
  .artist{
    .content{
      @media (max-width:425px) {
        margin-top: 80px;        
      }
      .letter-key{
        font-weight: 700;        
      }
    }

  }


  section.gotop{
    position: fixed;
    bottom: -60px; 
    left: calc( 50% - 16px );       


    transform: translateY(0);
    transition: all 200ms;      

    z-index: 2;

    &.exited {
      transform: translateY(-70px);            
    }

    button{
      padding: 2px 2px;
      width: 36px;
      height: 36px;
      background-color: transparent;
      border: none;
      cursor: pointer;
      outline: 0;
      background: var(--font-color);
      color: var(--body-color);
      border-radius: 50%;
    }
  }  

  .flex-grid {
    display: flex;
    justify-content: flex-start;
    max-width: 1024px;
  }
  .col-one {
    flex: 1;
    max-width: 180px;
  }
  .col-two{
    flex: 2;
    margin-right: 20px;
    margin-left: 20px;
  }
  @media (max-width: 414px) {
  .flex-grid {
    display: block;
  }

  hr{
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ccc;
    margin: 1em 0;
    padding: 0;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $event, $i18n } from '../services';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import EventCard from '../components/EventCard.vue';

type FilterType = "all" | "Collection virtuelle";

@Component({
  components: {
    CMSIcons, Toolbar, EventCard,
  }
})
export default class Program extends mixins(Translatable)  {
  private lastScrollTop = 0;
  scrollDirection = 0;

  filter: FilterType = "all";

  screenWidth = 0;
  get config(){
    return $config.store.config;
  }

  get title() : { fr: string, en: string } {

    if(this.filter == 'Collection virtuelle'){
      return {
        fr: "Collection virtuelle",
        en: "Virtual collection",
      };
    } else{
      return {
        fr: 'Événements',
        en: "Events",
      };
    }
  }

  get currentLang(): string{
    const result = $i18n.lang;
    return result;
  }

  get sortedEventSets(): CMS.EventSetByType[] {
    return $event.getSetsByLetter(this.currentLang);
  }

  get events(): CMS.Event[]{
    let result = $event.all;

    console.log("route", this.$router.currentRoute.params);
    if(this.filter == 'Collection virtuelle'){
      result = result.filter(e => e.typology as string == 'Collection virtuelle')
      .sort((a, b) => a.title[this.currentLang].localeCompare(b.title[this.currentLang]));
    }

    return result;
  }

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    next()
  }

  mounted(){
    try{window.scrollTo(0,0);}catch(e){
      //
    }

    window.addEventListener("scroll", () => { 
      const st = window.pageYOffset || document.documentElement.scrollTop;
      //
      // downscroll code
      if (st > this.lastScrollTop){
        this.scrollDirection = 1;
      } 
      //
      // upscroll code
      else {          
        this.scrollDirection = -1;
      }

      //
      // For Mobile or negative scrolling
      this.lastScrollTop = st <= 0 ? 0 : st; 
    }, false);

  }

  beforeDestroy() {
    console.log("artist list removed")
    document.body.classList.remove('body-scroll');
  }

  computeEventTypeTranslation(eventType: string){
    if(eventType == 'Collection virtuelle'){
      return{
        fr: 'Collection virtuelle',
        en: 'Virtual Collection',
      };
    }else{
      return {
        fr: eventType,
        en: eventType,
      }
    }
  }

  async onBack() {
    this.$router.go(-1);
  }

  async onLoad(slug: string) {
    //
  }

  async onTop($event) {
    const element = document.getElementById('artists-top');
    if(!element) {
      return;
    }
    element.scrollIntoView({ behavior: 'smooth' });
  }

  @Watch('$route', { immediate: true, deep: true })
  async onRouteUpdate(to) {

    if(this.$router.currentRoute.params.selected == 'Collection virtuelle'){
      this.filter = 'Collection virtuelle';
    }else{
      this.filter = 'all';
    }
  }
}
</script>
