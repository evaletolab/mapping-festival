<template>
  <div class="primary-menu">
    <section class="secondary">
        <router-link v-for="(menu) in getMenu('primary')" :class="{'selected':menu.selected}" :key="menu.link" :to="menu.link" >{{t(menu.name)}}</router-link>
        <LanguageSelector />
    </section>
  </div>

</template>

<style lang="scss" scoped>

  .primary-menu {
  }

</style>

<script lang="ts">
import { Translatable } from '@/mixins';
import { mixins } from 'vue-class-component';
import { Component, Vue } from 'vue-property-decorator';
import { $config, $cms } from '../services';
import LanguageSelector from './LanguageSelector.vue';

@Component({
  components: { LanguageSelector }
})
export default class PrimaryMenu extends mixins(Translatable) {
  
  mounted(){
  }

  get config(){
    return $config.store.config;
  }

  getMenu(layout) {
    const menu = [... $config.getMenu(layout)];
    const path = this.$router.currentRoute.fullPath;
    const itemIdx = menu.findIndex(item => item.link.indexOf(path)>-1);
    menu.forEach(item => item.selected = false);
    menu[(itemIdx == -1)? 0:itemIdx].selected = true;
    return menu;
  }

  async onBack() {
    this.$router.go(-1);
  }  
}
</script>
