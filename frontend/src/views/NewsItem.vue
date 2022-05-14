<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="news-item">

    <div class="header hide-sm">
      <div class="header-wrapper hide-sm">
        <header-info />
      </div>
    </div>
    <div class="spiegel">


      <img class="width8 margin-top2" :src="newsItem.featuredImage.path" alt="">

          <h1 class="margin-top2">
          {{t(newsItem.title)}}
      </h1>

      <!-- TOOLBAR -->
      <toolbar class="hide-lg hide-md" />

      <div class=" spiegel margin-top2 width7 indent1">
        <div v-html="t(newsItem.content)"/>
      </div>

      <div class="prule margin-top3"></div>
      <div class=" margin-top4"></div>

    </div>
  </div>

  
</template>

<style lang="scss" scoped>

  .news{
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


    .header-event{
      position: relative;
      height: calc( 100vh / 2 );
      padding: var(--gutter-width);
      padding-top:  calc(var(--gutter-width)*1.25);
      color: red;


    .when{
      position: absolute;
      right: 30px;
      top: 20px;
      font-size: 40px;
      font-weight: 600;      
    }
    .title{
      position: absolute;
      left: 20px;
      top: 70px;
      font-size: 40px;
      font-weight: 500;      
    }
    .type{
      position: absolute;
      bottom: 50px;
      text-align: center;
      left: 30%;
    }
    }

    .simple-link{
      text-decoration: none;
    }

  }


</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $news, $i18n } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import HeaderInfo from '../components/HeaderInfo.vue';

import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


@Component({
  components: {
    CMSIcons, Toolbar, HeaderInfo, 
  }
})
export default class NewsItem extends mixins(Translatable) {

  get config(){
    return $config.store.config;
  }

  mounted(){
    document.body.classList.add('body-scroll');
    document.body.scrollTop = 0;
    try{window.scrollTo(0,0);}catch(e){
      //
    }
  }

  beforeDestroy() {
    document.body.classList.remove('body-scroll');
  }

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  // *this* does not exist at this point
  beforeRouteEnter(to: Route, from: Route, next: any) {
    const slug = to.params.news;
    const itemExists = !!$news.newsWithSlug(slug);
    if(!itemExists){
      next({name:'NotFound'});
    }else{
      next();
    }
  }
  
  // *this* does not exist at this point
  beforeRouteUpdate(to: Route, from: Route, next: any) {
    const slug = to.params.news;
    const itemExists = !!$news.newsWithSlug(slug);
    if(!itemExists){
      next({name:'NotFound'});
    }else{
      next();
    }
  }
  
  get newsItem(): CMS.News {
    return $news.newsWithSlug(this.$route.params.news) as CMS.News;
  }

  async onLoad(slug: string) {
    //
  }

  async onSave() {
    //
  }
}
</script>
