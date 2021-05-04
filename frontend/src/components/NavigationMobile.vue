<template>
    <div class="">



            <!-- --------------- sub-nav  ----------------- -->

        <Toolbar />

        <!-- <nav class="page-sub-nav stick-it">
            <PrimaryMenu i18n="true" />
        </nav> -->

            <!-- --------------- main  ----------------- -->

        <main>
            <slot></slot>    
        </main>
    </div>
</template>


<style lang="scss" scoped>
.stick-it{
  position:sticky;
  top:0;
  z-index: 2;
}
.page-sidebar {
    &.sticky{
        position: fixed;
        top: 0px;
        min-height: 100vh;
        // width: 25%;        
        width: auto;        
    }
    .item{
      a{
        width: 100%;
        display: block;
        text-decoration: none;  
      }
    }
}

</style>


<script lang="ts">
import { Translatable } from '@/mixins';
import { mixins } from 'vue-class-component';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CMS } from "../models";
import { $config, $page } from '../services';

import Toolbar from './Toolbar.vue';
import PrimaryMenu from './PrimaryMenu.vue';
import LanguageSelector from './LanguageSelector.vue';

@Component({
  components: { PrimaryMenu, LanguageSelector, Toolbar }
})
export default class NavigationMobile extends mixins(Translatable) {

  private lastScrollTop = 85;
  stickyNav = 0;

  get config(){
    return $config.store.config;
  }

  get footerMenu() {
    const layout = "footer";
    let menu = [... $config.getMenu(layout)];
    const path = this.$router.currentRoute.fullPath;
    console.log("nav full path", path);
    menu.forEach(item => item.selected = false);

    return menu;

  }

  mounted(){
    window.addEventListener("scroll", () => { 
      const isMobile = $config.isMobile();
      const st = window.pageYOffset || document.documentElement.scrollTop;
      //
      // downscroll code
      if (st > this.lastScrollTop && !isMobile){
        this.stickyNav = 1;
      } 
      //
      // upscroll code
      else {          
        this.stickyNav = -1;
      }

      //
      // For Mobile or negative scrolling
      // this.lastScrollTop = st <= 0 ? 0 : st; 
    }, false);

  }

}
</script>
