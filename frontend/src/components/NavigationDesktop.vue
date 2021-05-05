<template>
    <div class="page-wrap">

        <!-- --------------- main  ----------------- -->

        <main class="page-main">
          <slot></slot>    
        </main>

        <!-- --------------- aside  ----------------- -->
        <aside class="page-sidebar ">
            <!-- NAV HEADER -->
            <section class="header">
              <h1 class="width7">mp<br>pngfst
                  <br>vl</h1>

              <h1 class="margin-top1" v-html="t(config.landing.title1)"/>
            </section>

            <!-- NAV PRIMARY CONTENT -->
            <div class="item" v-for="menu in primaryMenu" :key="menu.link">
                <RouterLink :to="menu.link">{{t(menu.name)}}</RouterLink>
            </div>
            <br>
            <!-- NAV SECONDARY CONTENT -->
            <br>
            <br>
            <div class="item" v-for="menu in secondaryMenu" :key="menu.link">
                <RouterLink :to="menu.link">{{t(menu.name)}}</RouterLink>
            </div>
            <br>
            <br>

            <!-- NAV ACTIONS CONTENT -->
            <div class="item">
              <language-selector class=""/>
            </div>
            <div class="item hide">Français/English</div>
            <div class="item" @click="onDark"><i class="fas fa-moon "></i> Night mode</div>


            <br>
            <br>
            <!-- NAV FOOTER CONTENT -->
            <div class="item" v-for="menu in footerMenu" :key="menu.link">
                <RouterLink :to="menu.link">{{t(menu.name)}}</RouterLink>
            </div>
        </aside>
    </div>
</template>


<style lang="scss" scoped>
.page-main-desktop{
  overflow-y: scroll;
}

.page-main {
  grid-column: 2/2;
  background:none;
  @media (max-width:476px) {
    grid-column: 1/3;    
  }

}

.page-sidebar {
    @media (max-width:476px) {
      display: none;
    }

    section.header {
      height: var(--nav-header-height);
      display: block;
      border-bottom: 1px solid var(--font-color);      
      margin-bottom: 50px;
    }
    grid-column: 1/2;
    grid-row: 1/2;
    background:transparent;
    padding-top: var(--gutter-width);
    position: fixed;
    height: 100vh;
    width: 25%;
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

  onDark(){
    $config.toggleDarkMode();
  }
}
</script>
