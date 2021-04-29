<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="artist spiegel margin-top1">
    <!-- TOOLBAR -->
    <Toolbar />
    
    <div style="height:80px" />

      <div v-if="diagnostics.length == 0"><p>No errors found</p></div>
      <div v-else v-for="(msg, index) in diagnostics" :key="index">
        <p v-html="msg" />
        <p>------------------------------------------------------</p>
        <br>
      </div>
  </div>
</template>

<style >
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
import { $config, $cms, $cockpit } from '../services';

import Toolbar from '../components/Toolbar.vue';


@Component({
  components: {
    Toolbar, 
  }
})
export default class Diagnostics extends Vue {
  get config(){
    return $config.store.config;
  }

  get diagnostics(): string[]{
    return $cockpit.diagnostics;
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

}
</script>
