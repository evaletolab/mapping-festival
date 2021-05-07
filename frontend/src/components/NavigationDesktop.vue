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
              <h1 class="width7">mp<br>pngfst<br>vl<br>2051</h1>

              <!-- <h1 class="margin-top1" v-html="t(config.landing.title1)"/> -->
            </section>

            <!-- NAV PRIMARY CONTENT -->
            <RouterLink v-for="menu in primaryMenu" :key="menu.link"  @click.native="onClose()" :to="menu.link">
              <div class="ui-button height3 width8 menu"> 
                <p class="vcenter">{{t(menu.name)}}</p> 
                <div class="ui-icon vcenter align-right">
                  <img src="/img/svg/dot.svg" alt="">
                </div>
              </div>
            </RouterLink>

            <!-- SHOULD NEVER USE -->
            <br/>

            <!-- NAV SECONDARY CONTENT -->
            <div class="menu-item-xs" v-for="menu in secondaryMenu" :key="menu.link"  >
              <RouterLink @click.native="onClose()" :to="menu.link"> {{t(menu.name)}}</RouterLink>
            </div>


            <!-- NAV ACTIONS CONTENT -->
            <div class="menu-item-xs">
              <language-selector class=""/>
            </div>
            <div class="menu-item-xs" @click="onDark"><i class="fas fa-moon "></i> Night mode</div>

            <!-- NAV FOOTER CONTENT -->
            <div class="menu-item-xs" v-for="menu in footerMenu" :key="menu.link">
                <a v-if="externalLink(menu.link)" @click="onClose()" :href="menu.link" target="_blank" rel="noopener noreferrer">{{t(menu.name)}}</a>
                <RouterLink v-else @click.native="onClose()" :to="menu.link" target="_blank" rel="noopener noreferrer">{{t(menu.name)}}</RouterLink>
            </div>
        </aside>
    </div>
</template>


<style lang="scss" scoped>

  .menu-item-xs {
    font-size: calc(var(--font-size) * .75);
    line-height: calc(var(--line-height) * .75);    
    padding: 4px 2px;
    font-weight: 550;
    cursor: pointer;
    i{
      float: right;
      margin-right: 5px;
    }
    a {
      text-decoration: none;      
    }
  }

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
      @media (max-width:426px) {
      height: 110px;
      h1{
        font-size: 22px;
        line-height: 25px;
      }
        
      }
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
import CMSIcons from '../components/CMSIcons.vue';
import { $config, $page } from '../services';

import Toolbar from './Toolbar.vue';
import PrimaryMenu from './PrimaryMenu.vue';
import LanguageSelector from './LanguageSelector.vue';

@Component({
  components: { 
    PrimaryMenu, LanguageSelector, Toolbar, CMSIcons 
  }
})
export default class NavigationDesktop extends mixins(Translatable) {

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
  externalLink(link){
    return link.indexOf('http') === 0 || link.indexOf('mailto') === 0 ;
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
  onClose() {
    document.body.classList.remove('menu-open');
  }
}
</script>
