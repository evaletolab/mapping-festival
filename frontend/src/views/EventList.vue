<template>
  <div class="events">
    <!-- TOOLBAR -->
    <Toolbar />
    <section class="primary">
      <p>
        <router-link v-for="(menu) in getMenu('primary')" :class="{'selected':menu.selected}" :key="menu.link" :to="menu.link" >{{t(menu.name)}}</router-link>
      </p>
    </section>

    <Calendar limit="yes" gotop="yes"/>
  </div>
</template>

<style lang="scss">
  @import "../styles/event-list.scss";
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $cms } from '../services';
import { Translatable } from '../mixins';

import CMSIcons from '../components/CMSIcons.vue';
import Toolbar from '../components/Toolbar.vue';
import Calendar from '../components/Calendar.vue';


@Component({
  components: {
    CMSIcons, Toolbar,Calendar
  }
})
export default class EventList extends mixins(Translatable) {

  today = new Date();

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

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    next();
  }

  beforeDestroy() {
    document.body.classList.remove('body-scroll');
  }

  async mounted(){
    document.body.classList.add('body-scroll');
  }

  async onBack() {
    // this.$router.go(-1);
    this.$router.push({ path: '/' });
  }

  async onEventCategory(name) {
    const label = (name||'all').toLowerCase();
    this.$router.replace({ query: { selected: label }}).catch(()=>{});    
  }

  async onEvent(event: CMS.Event) {
    this.$router.push({ path: `/events/${event.slug}` });
  }

  async onLoad(slug: string) {
    //
  }

  async onSave() {
    //
  }


}
</script>
