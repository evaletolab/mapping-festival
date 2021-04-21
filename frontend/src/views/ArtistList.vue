<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="artist spiegel margin-top1">
    <!-- TOOLBAR -->
    <Toolbar />
    
    <div style="height:80px" />

    <ul>
      <li v-for="artist in sortedArtists" :key="artist._id">
        <router-link :to="`/artists/${artist.slug}`">{{ artist.firstname }} {{ artist.lastname }}</router-link>
      </li>
    </ul>
  </div>
</template>

<style >
 :root{
    --main-font-color: white;
 }
</style>

<style lang="scss" scoped>
  .artist{
    // position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    z-index: 2;
    height: 100vh;
    width: 100vw;    
    padding-top:0;    
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $artist } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';


@Component({
  components: {
    CMSIcons, Toolbar, 
  }
})
export default class ArtistList extends Vue {
  get config(){
    return $config.store.config;
  }

  get sortedArtists(): CMS.Artist[] {
    const result = $artist.all.sort((a, b) =>{
      const aName = a.lastname || a.firstname || "";
      const bName = b.lastname || b.firstname || "";
      return aName.localeCompare(bName);
    });
    console.log("sorted artists", result);
    return result;
  }

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    next()
  }

  mounted(){
    document.body.classList.add('body-scroll');
  }

  beforeDestroy() {
    document.body.classList.remove('body-scroll');
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
