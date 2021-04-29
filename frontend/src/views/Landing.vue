<template>
  <div class="landing">
    <toolbar tiny="true" />
    <!--------------- Main wrapper --------------------->

    <div class="header spiegel margin-top1">
        <h1 class="width7">mp<br>pngfst
            <br>vl</h1>
        <h2 class="width6 indent3" v-html="t(config.landing.title3)"/>

        <h1 class="margin-top1 indent1" v-html="t(config.landing.title1)"/>

        <h4 class="width3 indent1 margin-top1">
            <div class="item" v-for="(title,index) in t(config.landing.title2).split('\n')" :key="index">{{title}}</div>
        </h4>
    </div>
    <PrimaryMenu class="spiegel" />
    <Calendar limit="yes" gotop="yes" class="spiegel"/>

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


@Component({
  components: {
    CMSIcons,
    PrimaryMenu,
    Toolbar,
    Calendar
  },
})
export default class Landing extends mixins(Translatable) {
  cfg = $config;

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
