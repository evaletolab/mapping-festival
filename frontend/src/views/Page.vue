<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="page spiegel margin-top1">
    <!-- TOOLBAR -->
    <Toolbar />

    <div style="height:100px" />

    <PrimaryMenu />

    <h1>{{t(page.title)}}</h1>

    <div v-html="t(page.header)"></div>
    
    <div v-html="t(page.content)"></div>

  </div>
</template>

<style lang="scss" scoped>
  .page{
    // top: 0;
    // right: 0;
    // bottom: 0;
    // margin: 0;
    // z-index: 2;
    // height: 100vh;
    // width: 100vw;    
    // padding-top:0;    
  }
  img{
    width:100%;
  }
  .social-media{
    display: inline-block;
    margin-right: 20px;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $page } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import PrimaryMenu from '../components/PrimaryMenu.vue';

import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons, Toolbar, PrimaryMenu,
  }
})
export default class Page extends mixins(Translatable) {

  get config(){
    return $config.store.config;
  }

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  // *this* does not exist at this point
  beforeRouteEnter(to: Route, from: Route, next: any) {
    const slug = to.params.pageslug;
    const pageExists = !!$page.pageWithSlug(slug);
    if(!pageExists){
      next({name:'NotFound'});
    }else{
      next();
    }
  }
  
  // *this* does not exist at this point
  beforeRouteUpdate(to: Route, from: Route, next: any) {
    const slug = to.params.pageslug;
    const pageExists = !!$page.pageWithSlug(slug);
    if(!pageExists){
      next({name:'NotFound'});
    }else{
      next();
    }
  }

  mounted(){
    document.body.classList.add('body-scroll');
  }

  beforeDestroy() {
    document.body.classList.remove('body-scroll');
  }

  get page(): CMS.Page {
    return $page.pageWithSlug(this.$route.params.pageslug) as CMS.Page;
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
