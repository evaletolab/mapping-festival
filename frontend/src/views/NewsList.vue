<template>
    <div class="newsList">
        <div class="spiegel">
            <h1 class="margin-top1">News</h1>
            <news-card-list />
        </div>

        <!-- TOOLBAR -->
        <toolbar class="hide-lg hide-md" />
    </div>
    
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $news } from '../services';
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';


import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import PrimaryMenu from '../components/PrimaryMenu.vue';
import NewsCard from '../components/NewsCard.vue';
import NewsCardList from '../components/NewsCardList.vue';


@Component({
  components: {
    CMSIcons, Toolbar, PrimaryMenu, NewsCard, NewsCardList,
  }
})
export default class NewsList extends mixins(Translatable)  {
  private lastScrollTop = 0;
  scrollDirection = 0;

  screenWidth = 0;
  get config(){
    return $config.store.config;
  }


  beforeRouteEnter(to: Route, from: Route, next: any) {
    next()
  }

  mounted(){
    console.log("news list mounted")
    document.body.classList.add('body-scroll');

    window.addEventListener("scroll", () => { 
      const st = window.pageYOffset || document.documentElement.scrollTop;
      //
      // downscroll code
      if (st > this.lastScrollTop){
        this.scrollDirection = 1;
      } 
      //
      // upscroll code
      else {          
        this.scrollDirection = -1;
      }

      //
      // For Mobile or negative scrolling
      this.lastScrollTop = st <= 0 ? 0 : st; 
    }, false);

  }

  beforeDestroy() {
    console.log("artist list removed")
    document.body.classList.remove('body-scroll');
  }


  async onBack() {
    this.$router.go(-1);
  }

}
</script>
