<template>
  <div class="events">
    <!-- TOOLBAR -->
    <Toolbar />
    <section class="primary">
      <p>
        <a v-for="(menu) in getMenu('primary')" :class="{'selected':menu.selected}" :key="menu.link" :href="menu.link" target="_new">{{t(menu.name)}}</a>
      </p>
    </section>

    <section class="secondary">
        <a v-for="(menu) in getMenu('secondary')" :class="{'selected':menu.selected}" :key="menu.link" :href="menu.link" target="_new">{{t(menu.name)}}</a>
    </section>


    <div class="grid">
      <div class="event" v-for="event in events" :key="event._id">
        {{ t(event.title) }} 
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
  @import "../styles/event-list.scss";
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $cms } from '../services';
import { Translatable } from '../mixins';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';


@Component({
  components: {
    CMSIcons, Toolbar
  }
})
export default class EventList extends mixins(Translatable) {
  //
  // "emission"|"workshop"|"masterclass"|"table-ronde"|"concert"|"performance"|"nightclubbing");
  private _selected;

  get events() {
    return $cms.cms.events.filter(event => {
      if(!this._selected || this._selected == ''){
        return event;
      }
      return event.type == this._selected;
    })
  }

  get config(){
    return $config.store.config;
  }

  getMenu(layout) {
    const menu = $config.getMenu(layout);
    const path = this.$router.currentRoute.fullPath;
    const itemIdx = menu.findIndex(item => item.link.indexOf(path)>-1);
    menu[itemIdx].selected = true;
    // const item = menu[itemIdx];
    // menu.splice(itemIdx)
    console.log('--DBG',this.$router.currentRoute.fullPath,menu,itemIdx)

    return menu;
  }

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    next();
  }

  async mounted(){
    this._selected = this.$route.query.selected;
  }

  async onBack() {
    this.$router.go(-1);
  }

  async onLoad(slug: string) {
    //
  }

  async onSave() {
    //
  }
}
</script>
