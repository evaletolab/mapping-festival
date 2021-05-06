<template>
    <div class="page-wrap">
        <button class="icon hide-lg hide-md" @click="onMenu">
          <i class="fas fa-bars fa-2x"></i>
        </button>          

        <!-- --------------- main  ----------------- -->

        <main class="page-main">
          <slot></slot>    
        </main>

        <!-- --------------- aside  ----------------- -->
        <aside class="page-sidebar ">
            <!-- NAV EXIT -->
            <button class="icon hide-lg hide-md" @click="onMenu">
              <i class="fas fa-times fa-2x"></i>
            </button>          

            <!-- NAV HEADER -->
            <section class="header">
              <h1 class="width7">mp<br>pngfst
                  <br>vl</h1>

              <h1 class="margin-top1" v-html="t(config.landing.title1)"/>
            </section>

            <!-- NAV PRIMARY CONTENT -->
            <div class="item" v-for="menu in primaryMenu" :key="menu.link">
                <RouterLink @click.native="onMenu" :to="menu.link">{{t(menu.name)}}</RouterLink>
            </div>
            <br>
            <!-- NAV SECONDARY CONTENT -->
            <br>
            <br>
            <div class="item" v-for="menu in secondaryMenu" :key="menu.link">
                <RouterLink @click.native="onMenu" :to="menu.link">{{t(menu.name)}}</RouterLink>
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
                <RouterLink @click.native="onMenu" :to="menu.link">{{t(menu.name)}}</RouterLink>
            </div>
        </aside>
    </div>
</template>


<style lang="scss" scoped>
  button.icon {
    padding: 2px 2px;
    width: 36px;
    height: 36px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: 0;
    color: var(--font-color);      
    position: absolute;
    right: 15px;
    top: 15px;    
    z-index: 1;
  }

.page-main {
  grid-column: 2/2;
  background:none;
  @media (max-width:476px) {
    grid-column: 1/3;    
  }
}

body.menu-open .page-sidebar {
  transform: translateX(0);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--body-color);
  display: block;     
  z-index: 2;
  .header{
    border:none;
  }
}

.page-sidebar {
  @media (max-width:476px) {
    transition: all 200ms;      
    transform: translateX(- 100vw);
    width: 100vw;
    background-color: var(--body-color);
    &.display{
      transform: translateX(0);
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: var(--body-color);
      display: block;     
      z-index: 2;
      .header{
        border:none;
      }
    }

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

import Toolbar from './Toolbar.vue';
import PrimaryMenu from './PrimaryMenu.vue';
import LanguageSelector from './LanguageSelector.vue';

@Component({
  components: { PrimaryMenu, LanguageSelector, Toolbar }
})
export default class Navigation extends mixins(Translatable) {

  private lastScrollTop = 85;
  stickyNav = 0;
  displayMenu = false;

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

  //
  // toggle menu when:
  // - click on burger
  // - click on close
  // - click on action
  onMenu() {
    document.body.classList.toggle('menu-open');
  }
}
</script>
