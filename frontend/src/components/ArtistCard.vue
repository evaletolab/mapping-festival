<template>
  <div class="artist-card" @click="navigateToArtist">
    <img class="portrait" :src="cover" />

    <div class="artist-name">
      <span v-if="artist.artistName">{{artist.artistName}}</span>
      <span v-if="artist.lastname">{{artist.lastname}}</span> {{artist.firstname}}<sup>{{artist.country}}</sup>
    </div> 

    <div class="dot">•</div>
  </div>    
</template>

<style scoped>
  .artist-card
  {
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    cursor: pointer;
    height: 70px;
    border-top: 1px solid var(--font-color);
  }

  .portrait
  {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }

  .artist-name{
    margin-left: 20px;
  }

  .dot{
    margin-left: auto; /* https://stackoverflow.com/questions/33924655/position-last-flex-item-at-the-end-of-container */
  }
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CMS } from "../models";
import { $config } from '../services';

@Component({
  components: { }
})
export default class ArtistCard extends Vue {
  @Prop() artist!: CMS.Artist;

  get config(){
    return $config.store.config;
  }

  get cover(): string {
    if(this.artist.cover){
      return this.artist.cover.sizes.thumbs.path;
    }else{
      return "https://via.placeholder.com/80";
    }
  }

  navigateToArtist(){
    this.$router.push({path: `/artists/${this.artist.slug}`});
  }
}
</script>
