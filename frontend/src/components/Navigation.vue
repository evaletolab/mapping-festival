<template>
    <div class="page-wrap">


        <header class="page-header">
            <!-- --------------- Header  ----------------- -->

            <!-- Visual Column guides helpers -->
            <div class="column-guides-wrapper">
                <div class="column-display">1</div>
                <div class="gutter-display">.</div>
                <div class="column-display">2</div>
                <div class="gutter-display">.</div>
                <div class="column-display">3</div>
                <div class="gutter-display">.</div>
                <div class="column-display">4</div>
                <div class="gutter-display">.</div>
                <div class="column-display">5</div>
                <div class="gutter-display">.</div>
                <div class="column-display">6</div>
                <div class="gutter-display">.</div>
                <div class="column-display">7</div>
                <div class="gutter-display">.</div>
                <div class="column-display">8</div>
            </div>

            <h2>mppngfstvl<br>2051<br></h2>

        </header>

            <!-- --------------- sub-nav  ----------------- -->

        <nav class="page-sub-nav">
            <!-- <div class="item">[Current view] / [otherview1 / otherview2] —— filtres</div> -->
            <PrimaryMenu i18n="true" />
        </nav>

            <!-- --------------- main  ----------------- -->

        <main class="page-main">
            <slot></slot>    
        </main>

            <!-- --------------- aside  ----------------- -->
        <aside class="page-sidebar" :class="{'sticky': (stickyNav > 0)}">
            [Main navigation menu]
            <br>
            <br>
            <div class="item" v-for="menu in primaryMenu" :key="menu.link">
                <RouterLink :to="menu.link">{{t(menu.name)}}</RouterLink>
            </div>
            <br>
            <br>[Other pages and links]
            <br>
            <br>
            <div class="item" v-for="menu in secondaryMenu" :key="menu.link">
                <RouterLink :to="menu.link">{{t(menu.name)}}</RouterLink>
            </div>
            <br>
            <br>

            <div class="item">
              <language-selector class=""/>
            </div>
            <div class="item hide">Français/English</div>
            <div class="item">Night mode</div>


            <br>
            <br>
            <div class="item" v-for="menu in footerMenu" :key="menu.link">
                <RouterLink :to="menu.link">{{t(menu.name)}}</RouterLink>
            </div>
        </aside>
    </div>
</template>


<style lang="scss" scoped>
.page-sidebar {
    &.sticky{
        position: fixed;
        top: 0px;
        min-height: 100vh;
        width: 25%;        
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

import PrimaryMenu from './PrimaryMenu.vue';
import LanguageSelector from './LanguageSelector.vue';

@Component({
  components: { PrimaryMenu, LanguageSelector }
})
export default class Navigation extends mixins(Translatable) {

  private lastScrollTop = 85;
  stickyNav = 0;

  get config(){
    return $config.store.config;
  }

  get primaryMenu(){
    const layout = "primary";
    let menu = [... $config.getMenu(layout)];
    const path = this.$router.currentRoute.fullPath;
    console.log("full path", path);
    menu.forEach(item => item.selected = false);

    return menu;
  }

  get secondaryMenu(){
      return $page.pageLinks;
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
