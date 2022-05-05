<template>
  <div class="landing">
    <div class="header ">
      <div class="title">
        <h1 class="width7" v-html="config.landing.title1"></h1>
          <!-- <p class="">mp<br>pngfst<br>vl</p> -->
          <!-- <h1 class="margin-top1" v-html="t(config.landing.title1)"/> -->
      </div>


    <div class="spiegel">
        <!--super-->
        <img class="header-image" src="../images/mapping_header1.png">
    </div>




      <h4 class="spiegel align-right">
          <div  v-for="(title,index) in t(config.landing.title2).split('\n')" :key="index">
            <!-- {{title}} -->
                        Mapping 2022<br><br>
                        Visual audio and <br>deviant electronics festival

            </div>
         <!--  <div  v-html="t(config.landing.title3)"  class="hide-sm"/> -->
      </h4>
  
      <!-- EXTRA MENU SHORTCUT  -->
      <div class="menu-short hide">
          <router-link v-for="(menu) in menuCollection"  :key="menu.link" :to="menu.link" >{{t(menu.name)}}</router-link>
      </div>

      <div class="destination hide-sm">
      </div>

    </div>


<div class="spiegel">
    <h1 class="margin-top1">News</h1>
    <news-card-list />
</div>
<div class="spiegel">
  <h1  class="margin-top2">Events</h1>
</div>

    <!--------------- Main wrapper --------------------->
    <calendar limit="yes" gotop="yes" />

    <!--------------------- Social links --------------------------->
    <div class="sociallinks hide" >
      <p>
        <a v-for="(menu) in cfg.getMenu('social')" :key="menu.link" :href="menu.link" target="_new">{{t(menu.name)}}</a>           
      </p>
    </div>
    <!--------------------- Footer --------------------------->
    <footer class="hide">
      <p>
        <router-link v-for="menu in cfg.getMenu('footer')" :key="menu.link" :to="menu.link" >{{t(menu.name)}}</router-link>
        
      </p>
    </footer>



    <!-- MENU LINKS -->
    <!-- <ul class="navigation">
      <li v-for="menu in cfg.getMenu('landing')" :key="menu.link">
        <router-link :to="menu.link">{{ t(menu.name) }}</router-link>
      </li>
    </ul> -->


  </div>
</template>

<style lang="scss" scoped>
  @import "../styles/landing.scss";
</style>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

import { $config, $cms } from '../services';
import { Translatable } from '../mixins';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import Calendar from '../components/Calendar.vue';
import PrimaryMenu from '../components/PrimaryMenu.vue';
import NewsCardList from '../components/NewsCardList.vue'


@Component({
  components: {
    CMSIcons,
    PrimaryMenu,
    Toolbar,
    Calendar,
    NewsCardList,
  },
})
export default class Landing extends mixins(Translatable) {
  cfg = $config;

  destination:{name: {fr: string, en: string}} = {name: {fr:"Live",en: "Live"}};
  //
  // return not active menu items
  get menuCollection() {
    //const page = $page.pageWithSlug(this.$router.currentRoute.params.pageslug) as CMS.Page;
    //newMenuItem.name = page.title;

    // FIXME, use this.key to force update content
    const layout = "primary";
    let menu = [... $config.getMenu(layout)];
    const path = this.$router.currentRoute.path.toLowerCase();

    menu.forEach(item => {      
      // root case
      if(path.length == 1) {
         return item.selected = (item.link == path);
      }
      item.selected = item.link.indexOf(path) > -1;
    });
    
    const menuItem = menu.find(item => item.selected);
    if(menuItem){
      this.destination = menuItem;
    }

    return menu.filter(item => !item.selected);
  }

  async mounted(){
  }

  get config(){
    return $config.store.config;
  }

  get events(){
    return $cms.events;
  }

}
</script>
