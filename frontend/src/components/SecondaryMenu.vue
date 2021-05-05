<template>
  <aside class="page-sidebar">
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
</template>

<script lang="ts">
import { Translatable } from '@/mixins';
import { mixins } from 'vue-class-component';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CMS } from "../models";
import { $config, $page } from '../services';

import LanguageSelector from './LanguageSelector.vue';

@Component({
  components: { LanguageSelector }
})
export default class SecondaryMenu extends mixins(Translatable) {


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

  // get footerMenu() {
  //   const layout = "footer";
  //   let menu = [... $config.getMenu(layout)];
  //   const path = this.$router.currentRoute.fullPath;
  //   console.log("nav full path", path);
  //   menu.forEach(item => item.selected = false);

  //   return menu;

  // }


}
</script>
