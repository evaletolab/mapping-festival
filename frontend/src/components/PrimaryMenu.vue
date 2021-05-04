<template>
  <div class="primary-menu">
    <section class="secondary">
        <router-link v-for="(menu) in menuCollection" :class="{'selected':menu.selected}" :key="menu.link" :to="menu.link" >{{t(menu.name)}}</router-link>
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
import { Route } from 'vue-router';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { $config, $cms, $page } from '../services';
import { CMS } from '../models'
import LanguageSelector from './LanguageSelector.vue';

@Component({
  components: { LanguageSelector }
})
export default class PrimaryMenu extends mixins(Translatable) {
  @Prop() readonly i18n!:boolean;

  key = 0; // haxor

  @Watch('$route', { immediate: true, deep: true })
  onRouteChange(to:Route, from:Route) {
    console.log("route changed");
    // this.$forceUpdate();
    this.key++;
  }

  mounted(){
  }

  get config(){
    return $config.store.config;
  }

  get menuCollection() {

    ////// 
    // HAXOR, why why why (needed else route /artists does not update correctly)
    let _BOU = this.key + "getting mad";
    
    const layout = "primary";
    let menu = [... $config.getMenu(layout)];
    const path = this.$router.currentRoute.fullPath;
    console.log("full path ------------------------", path);
    menu.forEach(item => item.selected = false);
    const itemIdx = menu.findIndex(item => item.link.indexOf(path)>-1);
    
    if(itemIdx >= 0) {
      menu[itemIdx].selected = true;
    }else{
      // selected not found so we are on special page
      let newMenuItem = {
        link: "/",
        name:{
          fr: "",
          en: "",
        },
        selected: true,
      }
      switch(this.$router.currentRoute.name){
        case "Page":
          {
            let page = $page.pageWithSlug(this.$router.currentRoute.params.pageslug) as CMS.Page;
            newMenuItem.name = page.title;
            newMenuItem.link = `/pages/${page.slug}`;
          }
          break;
        case "Diagnostics":
          newMenuItem.name.fr = "Diags";
          newMenuItem.name.en = "Diags";
          newMenuItem.link = '/__diagnostics';
          break;
        case "Artist":
          newMenuItem.name.fr = "Artiste";
          newMenuItem.name.en = "Artist";
          newMenuItem.link = this.$router.currentRoute.fullPath;
          break;
        case "Spot":
          newMenuItem.name.fr = "Lieu";
          newMenuItem.name.en = "Spot";
          newMenuItem.link = this.$router.currentRoute.fullPath;
          break;
        case "Event":
          newMenuItem.name.fr = "Event";
          newMenuItem.name.en = "Event";
          newMenuItem.link = this.$router.currentRoute.fullPath;
          break;
        case "NotFound":
          newMenuItem.name.fr = "404";
          newMenuItem.name.en = "404";
          newMenuItem.link = '/404';
          break;
      }
      menu = [newMenuItem, ...menu];
    }

    //supa cryptic
    // menu[(itemIdx == -1)? 0:itemIdx].selected = true;
    return menu;
  }

  async onBack() {
    this.$router.go(-1);
  }  
}
</script>
