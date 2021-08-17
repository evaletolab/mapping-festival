<template>
  <div v-if="mobileView" class="artist-card-mobile" @click="navigateToArtist">
    <LazyImg class="portrait-mobile" :src="coverMobile" />

    <div class="artist-name-mobile">
      <span v-if="artist.artistName">{{artist.artistName}}</span>
      <span v-if="artist.lastname">{{artist.lastname}}</span> {{artist.firstname}}<sup>{{artist.country}}</sup>
    </div> 

    <div class="dot">•</div>
  </div>    
  <div v-else class="artist-card-desktop" @click="navigateToArtist">
    <LazyImg class="portrait-desktop" :src="coverDesktop" />

    <div v-html="artistNameDesktop" class="artist-name-desktop">

      <!-- <span v-if="artist.artistName">{{artist.artistName}}</span>
      <br>
      <span v-if="artist.lastname">{{artist.lastname}}</span> {{artist.firstname}}<sup>{{artist.country}}</sup> -->
    </div> 

  </div>
</template>

<style scoped>
  .artist-card-mobile
  {
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 70px;
    border-top: 1px solid var(--font-color);
  }

  .portrait-mobile
  {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }

  .artist-name-mobile{
    margin-left: 20px;
  }

  .dot{
    margin-left: auto; /* https://stackoverflow.com/questions/33924655/position-last-flex-item-at-the-end-of-container */
  }
  
  /* desktop */
  
  .artist-card-desktop
  {
    display: inline-block;
    cursor: pointer;
    width:280px;
    height: 120px;
    position:relative;
    margin-top: 10px;
    margin-right: 10px;
  }

  .portrait-desktop
  {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .artist-name-desktop{
    position: absolute;
    top: 5px;
    left: 5px;
  }
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CMS } from "../models";
import { $config } from '../services';
import LazyImg from './LazyImg.vue';

@Component({
  components: { LazyImg }
})
export default class ArtistCard extends Vue {
  @Prop() artist!: CMS.Artist;
  @Prop() mobileView!: boolean;

  get config(){
    return $config.store.config;
  }

  get coverMobile(): string {
    if(this.artist.cover){
      return this.artist.cover.sizes.thumbs.path;
    }else{
      return "https://via.placeholder.com/80/000000/000000";
    }
  }
  
  get coverDesktop(): string {
    if(this.artist.cover){
      return this.artist.cover.sizes.headerimage.path;
    }else{
      return "https://via.placeholder.com/150/000000/000000";
    }
  }

  get artistNameDesktop(): string{
    let firstLine = ""
    if(this.artist.artistName || this.artist.lastname){
      // we are on two lines
      firstLine = `<span>${this.artist.artistName || this.artist.lastname}</span><br>`;
    }

    let secondLine = "";
    if(this.artist.artistName){
      secondLine = `${this.artist.lastname} ${this.artist.firstname} <sup>${this.artist.country}</sup>`;
    }else{
      const lastName = (this.artist.lastname && this.artist.artistName) ? `${this.artist.lastname} ` : "";
      secondLine = `${lastName}${this.artist.firstname} <sup>${this.artist.country}</sup>`;
    }

    return `${firstLine} ${secondLine}`;

  }

  navigateToArtist(){
    console.log("on click----------------------------");
    this.$router.push({path: `/artists/${this.artist.slug}`});
  }
}
</script>
