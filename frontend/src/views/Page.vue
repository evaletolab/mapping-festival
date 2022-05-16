<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->    
  <div class="page">
    <div class="header hide-sm">

    <!-- ************************ -->
    <!-- ******** Header ******** -->
    <!-- ************************ -->

    <div class="header-wrapper hide-sm">
      <header-info />

    </div>

    <!-- ************************ -->
    <!-- ******* /Header ******** -->
    <!-- ************************ -->


      <!-- <h4 class="tagline  align-right">
          <div  v-for="(title,index) in t(config.landing.title2).split('\n')" :key="index">{{title}}</div>
          <div  v-html="t(config.landing.title3)"  class="hide-sm"/>
      </h4> -->

    </div>

    <!-- TOOLBAR -->
    <toolbar class="hide-lg hide-md" />
    <div class="content spiegel margin-top1">

            <div class="ui-font big destination">
        {{t(page.title)}}
      </div>

      <p class="margin-top1" v-html="t(page.header)"></p>
      
      <p v-html="t(page.content)"></p>

    </div>

<div class="prule margin-top5"></div>


  </div>
</template>



<style lang="scss" scoped>

  .page{
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    color: var(--font-color);
    margin: 0;
    z-index: 2;
    height: 100vh;
    width: 100%;    
    margin-top: 0px;

    .content{
      @media (max-width: var(--mobile-breakpoint)) {
        margin-top: 80px;        
      }
    }
  }

  img{
    width:100%;
  }


  .social-media{
    display: inline-block;
    margin-right: 20px;
  }
</style>

<style>
.page p img{
  width: 100%;
  height: auto;
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
import HeaderInfo from '../components/HeaderInfo.vue';

import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons, Toolbar, PrimaryMenu, HeaderInfo,
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
