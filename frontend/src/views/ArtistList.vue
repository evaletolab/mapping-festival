<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="artist">
    <div class="header hide-sm">
      <h4 class="tagline  align-right">
          <div  v-for="(title,index) in t(config.landing.title2).split('\n')" :key="index">{{title}}</div>
          <div  v-html="t(config.landing.title3)"  class="hide-sm"/>
      </h4>

      <div class="destination">
        Artists
      </div>
    </div>

    <!-- TOOLBAR -->
    <toolbar class="hide-lg hide-md" />
    <div class="content spiegel margin-top1">
      <div v-if="isMobileView">
        <ArtistCard v-for="artist in sortedArtists" :key="artist._id" 
        :artist="artist"
        :mobileView="true" 
        />
      </div>
      <div v-else>
        <div v-for="artistSet in groupedArtists" :key="artistSet.letterId" >
          <p class="letter-key">{{artistSet.letterId}}</p>
          <ArtistCard v-for="artist in artistSet.artists" :key="artist._id" 
          :artist="artist"
          :mobileView="false" 
          />
          <hr>
        </div>
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
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $artist } from '../services';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import PrimaryMenu from '../components/PrimaryMenu.vue';
import ArtistCard from '../components/ArtistCard.vue';
import VueCable from '../components/VueCable.vue';


@Component({
  components: {
    CMSIcons, Toolbar, PrimaryMenu, ArtistCard, VueCable
  }
})
export default class ArtistList extends mixins(Translatable)  {
  screenWidth = 0;
  get config(){
    return $config.store.config;
  }

  get sortedArtists(): CMS.Artist[] {
    return $artist.sorted;
  }

  get groupedArtists(): CMS.ArtistSetByLetter[] {
    return $artist.setsByLetter;
  }

  get isMobileView(){
    console.log("screen width", this.screenWidth);
    return this.screenWidth < 500;
  }

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    next()
  }

  mounted(){
    console.log("artist list mounted")
    document.body.classList.add('body-scroll');
    addEventListener('resize', this.onResize);
    this.computeScreenWidth();

    console.log($artist.setsByLetter);
  }

  beforeDestroy() {
    console.log("artist list removed")
    document.body.classList.remove('body-scroll');
    removeEventListener('resize', this.onResize);
  }

  computeScreenWidth(){
    this.screenWidth = window.innerWidth;
  }

  onResize(){
    this.computeScreenWidth();
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
