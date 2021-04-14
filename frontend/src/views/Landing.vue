<template>
  <div class="landing">
    

    <!--------------- Main wrapper --------------------->

    <div class="spiegel margin-top1">
        <h1 class="width7">mp<br>pngfst
            <br>vl</h1>
        <h2 class="width6 indent3" v-html="t(config.landing.title3)"/>

        <h1 class="margin-top1 indent1" v-html="t(config.landing.title1)"/>

        <h4 class="width3 indent1 margin-top1">
            <div class="item" v-for="(title,index) in t(config.landing.title2).split('\n')" :key="index">{{title}}</div>
        </h4>

        <a :href="config.landing.help.link">
          <div class="volunteer-sticker height5 width3 align-center">
              <div class="margin-top1" v-html="t(config.landing.help.name)" />
          </div>
        </a>
    </div>
    <!--------------------- Social links --------------------------->
    <div class="sociallinks">
      <p>
        <span v-for="(menu,index) in cfg.getMenu('social')" :key="menu.link">
          <a :href="menu.link" target="_new">{{t(menu.name)}}</a>
           <span v-if="index != cfg.getMenu('social').length - 1"> — </span> 
        </span>
      </p>
    </div>
    <!--------------------- Footer --------------------------->
    <footer>
      <p>
        <a v-for="menu in cfg.getMenu('footer')" :key="menu.link" :href="menu.link" target="_new">{{t(menu.name)}}</a>
        <LanguageSelector class="lang" />
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
import { $config, $cms } from '../services';
import { Translatable } from '../mixins';

import CMSIcons from '../components/CMSIcons.vue';
import LanguageSelector from '../components/LanguageSelector.vue';

import { mixins } from 'vue-class-component';

@Component({
  components: {
    CMSIcons,
    LanguageSelector,
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
