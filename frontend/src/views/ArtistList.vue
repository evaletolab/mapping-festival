<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="artist">
    <!-- TOOLBAR -->
    <Toolbar />
    
  </div>
</template>

<style lang="scss" scoped>
  .artist{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    background: white;
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
import { $config } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';


@Component({
  components: {
    CMSIcons, Toolbar
  }
})
export default class ArtistList extends Vue {
  get config(){
    return $config.store.config;
  }


  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    next()
  }

  mounted(){
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