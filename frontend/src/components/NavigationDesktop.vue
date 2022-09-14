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
            <section class="header pointer" @click="onHome">
              
              <!-- <h1 class="width7" v-html="config.landing.title1"></h1> -->
              <div v-if="!isMobileView">
                <h2 class="black" v-html="config.landing.title1"/> 
                <div class="black">Visual audio and<br>deviant electronics</div>

                <div class="margin-top1 black">3 &#8239; — &#8239; 13.11.2022</div>
                <div class="black">Geneva</div>
              </div>
              <div v-else>
                <h2 class="black" v-html="config.landing.title1"/> 
                <div class="black">Visual audio and<br>deviant electronics<br>3 &#8239; — &#8239; 13.11.2022</div>
              </div>


              <!-- <h1 class="margin-top1" v-html="t(config.landing.title1)"/> -->
            </section>

            <!-- NAV PRIMARY CONTENT -->
            <a v-for="menu in primaryMenu" :key="menu.link"  @click="onRoute($event,menu.link)" >
              <div class="ui-button height3 width8 menu"> 
                <p class="vcenter">{{t(menu.name)}}</p> 
                <div class="ui-icon vcenter align-right">
                  <img class="inverted" src="/img/svg/dot.svg" alt=""> <!-- class "inverted" -->
                </div>
              </div>
            </a>

<br>
            <!-- NAV SECONDARY CONTENT -->
            <div class="menu-item-xs" v-for="menu in secondaryMenu" :key="menu.link"  >
              <RouterLink @click.native="onClose()" :to="menu.link"> {{t(menu.name)}}</RouterLink>
            </div>
<br>
            <div class="prule"></div>
            

            <!-- NAV ACTIONS CONTENT -->
            <div class="menu-item-xs">
              <language-selector class=""/>
            </div>
<br>
            <div class=""></div>

            <!-- <div class="menu-item-xs" @click="onDark"><i class="fas fa-moon "></i> Night mode</div> -->

            <!-- NAV FOOTER CONTENT -->
            <span class="menu-item-xs" v-for="menu in footerMenu" :key="menu.link">
                <a class="button" v-if="externalLink(menu.link)" @click="onClose()" :href="menu.link" target="_blank" rel="noopener noreferrer">{{t(menu.name)}}</a>
                <RouterLink v-else @click.native="onClose()" :to="menu.link" target="_blank" rel="noopener noreferrer">{{t(menu.name)}}</RouterLink>
            </span>
        </aside>
    </div>
</template>


<style lang="scss" scoped>

  .inverted{
    filter: invert(100%);
  }

  .pointer{
    cursor: pointer;
  }

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
  z-index: 15;
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
      // background-color: black;
      height: var(--nav-header-height);
      display: block;
      // border-bottom: 1px solid var(--font-color);      
      @media (max-width:476px) {
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

  screenWidth = 0;

  get isMobileView(){
    return this.screenWidth <= 476;
  }

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
    window.addEventListener("scroll", this.onScroll, false);


    window.addEventListener('resize', this.onResize);
    this.computeScreenWidth();

  }

  onScroll(){
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
  }

  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll, false);
    window.removeEventListener('resize', this.onResize);
  }
  
  computeScreenWidth(){
    this.screenWidth = window.innerWidth;
  }

  onResize(){
    this.computeScreenWidth();
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
  onRoute($event,link) {
    document.body.classList.remove('menu-open');
    if(this.externalLink(link)) {
      window.open(link,'_blank');
    }else {
      this.$router.push(link).catch(() => {});
    }
  }
  onClose() {
    document.body.classList.remove('menu-open');
  }

  onHome(){
    this.$router.push('/').catch(() => {});
  }
}
</script>
