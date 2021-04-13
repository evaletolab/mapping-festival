<template>
  <div class="landing">
    <LanguageSelector />
    <img class="front" :src="config.logo" />
    <section class="header">
      <div class="title1">{{t(config.landing.title1)}}</div>
      <div class="title2">{{t(config.landing.title2)}}</div>
      <div class="title3">{{t(config.landing.title3)}}</div>
    </section>
    <!-- MENU LINKS -->
    <ul class="navigation">
      <li v-for="menu in config.landing.menu" :key="menu.link">
        <router-link :to="menu.link">{{ t(menu.name) }}</router-link>
      </li>
    </ul>

    <!-- FOOTER LINKS -->
    <div class="footer">
      <ul>
        <li v-for="menu in config.footer.menu" :key="menu.link">
          <router-link :to="menu.link">{{ t(menu.name) }}</router-link>
        </li>
      </ul>
    </div>


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
