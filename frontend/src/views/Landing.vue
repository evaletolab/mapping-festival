<template>
  <div class="landing">
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
