<template>
  <div class="primary-menu">
    <section class="secondary">
        <a class="selected hide-sm">{{t(menuActive.name)}}</a>
        <router-link v-for="(menu) in menuCollection"  :key="menu.link" :to="menu.link" >{{t(menu.name)}}</router-link>
    </section>
  </div>

</template>

<style lang="scss" scoped>

  .primary-menu{
    background-color: var(--body-color);
  }

  .secondary{
    display: block;
    width: 100%;

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

      @media (min-width:476px) {
        &:not(.selected){
          display: none;
        }
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
import { Route } from 'vue-router';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { $config, $cms, $page } from '../services';
import { CMS } from '../models'
import LanguageSelector from './LanguageSelector.vue';

@Component({
  components: { LanguageSelector }
})
export default class PrimaryMenu extends mixins(Translatable) {
  key = ""; // haxor
  menuActive = {name:{}};

  @Watch('$route', { immediate: true, deep: true })
  onRouteChange(to:Route, from:Route) {
    // FIXME, use this.key to force update content
    // this.$forceUpdate();
    this.key += " ";
  }

  mounted(){
  }

  get config(){
    return $config.store.config;
  }

  //
  // return not active menu items
  get menuCollection() {
    //const page = $page.pageWithSlug(this.$router.currentRoute.params.pageslug) as CMS.Page;
    //newMenuItem.name = page.title;

    // FIXME, use this.key to force update content
    const defaultName = this.$router.currentRoute.name + this.key;
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
    
    const items = menu.filter(item => !item.selected);
    this.menuActive = menu.find(item => item.selected) || {
      name:{fr:defaultName,en:defaultName}
    };

    console.log("menuActive ", path, this.menuActive);    
    return items;
  }

  async onBack() {
    this.$router.go(-1);
  }  
}
</script>
