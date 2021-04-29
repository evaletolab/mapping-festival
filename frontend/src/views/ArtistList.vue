<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="artist">
    <!-- TOOLBAR -->
    <Toolbar />
    
    <PrimaryMenu i18n="on"/>

    <div class="flex-grid">
      <div class="col-one">
        <ul>
          <li>menu item 1</li>
          <li>menu item 2</li>
          <li>menu item 3</li>
          <li>menu item 4</li>
        </ul>
      </div>
      <div class="col-two">
        <ArtistCard v-for="artist in sortedArtists" :key="artist._id" :artist="artist" />
      </div>
    </div>

  </div>
</template>

<style >
</style>

<style lang="scss" scoped>
  .artist{
    margin-top: 69px;
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
import ArtistCard from '../components/ArtistCard.vue';


@Component({
  components: {
    CMSIcons, Toolbar, PrimaryMenu, ArtistCard,
  }
})
export default class ArtistList extends Vue {
  get config(){
    return $config.store.config;
  }

  get sortedArtists(): CMS.Artist[] {
    const result = $artist.all.sort((a, b) =>{
      const aName = a.artistName || a.lastname || a.firstname || "";
      const bName = b.artistName || b.lastname || b.firstname || "";
      return aName.localeCompare(bName);
    });
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
