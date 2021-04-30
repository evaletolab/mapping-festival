<template>
  <div class="primary-menu">
    <section class="secondary">
        <router-link v-for="(menu) in getMenu('primary')" :class="{'selected':menu.selected}" :key="menu.link" :to="menu.link" >{{t(menu.name)}}</router-link>
        <LanguageSelector v-if="i18n" />
    </section>
  </div>

</template>

<style lang="scss" scoped>


  .secondary{
    display: block;
    width: 100%;
    border-top: 1px solid #666;
    button{
      background: transparent;
      border: 2px solid var(--font-color);
      color: var(--font-color);
      border-radius: 9px;
      width: 32px;
      height: 24px;
      padding: 2px 0;
      transform: translateY(22px);  
    }

    a{
      text-transform: lowercase;
      float: right;
      color: var(--font-color);
      margin: 0 10px ;
      padding: 10px 0;
      text-decoration: none;
      line-height: 50px;

      &.selected{
        font-size: 30px;
        float: left;
        font-weight: 700;
      }

      &:not(.selected)::after {
        content: "⚫";
        margin-top: 5px;
        margin-left: 10px;
        font-size: 17px;
      }  
    }
  }


</style>

<script lang="ts">
import { Translatable } from '@/mixins';
import { mixins } from 'vue-class-component';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { $config, $cms } from '../services';
import LanguageSelector from './LanguageSelector.vue';

@Component({
  components: { LanguageSelector }
})
export default class PrimaryMenu extends mixins(Translatable) {
  @Prop() readonly i18n!:boolean;

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
