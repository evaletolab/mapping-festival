<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="artist" id="artists-top">

    
    <!-- ************************ -->
    <!-- ******** Header ******** -->
    <!-- ************************ -->

    <div class="header-wrapper hide-sm">
      <header-info/>
    </div>

    <!-- ************************ -->
    <!-- ******* /Header ******** -->
    <!-- ************************ -->


  <div class="spiegel margin-top1">
      <div class="ui-font big destination">
        Artists
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

    <div class="content spiegel margin-top1" >
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
import HeaderInfo from '../components/HeaderInfo.vue';


@Component({
  components: {
    CMSIcons, Toolbar, PrimaryMenu, ArtistCard, VueCable, HeaderInfo,
  }
})
export default class ArtistList extends mixins(Translatable)  {
  private lastScrollTop = 0;
  scrollDirection = 0;

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

  async onTop($event) {
    const element = document.getElementById('artists-top');
    if(!element) {
      return;
    }
    element.scrollIntoView({ behavior: 'smooth' });
  }



  async onSave() {
    //
  }
}
</script>
