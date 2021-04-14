<template>
  <div class="not-found">
    <Toolbar />

    <div style="height:100px" />
    <h2>{{t(config.notFound.message)}}</h2>
  </div>
    
</template>

<style lang="scss" scoped>
  .not-found{
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
import { $config } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons, Toolbar
  }
})
export default class NotFound extends mixins(Translatable) {
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
