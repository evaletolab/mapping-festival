<template>
  <div class="events">
    <!-- TOOLBAR -->
    <Toolbar />
    <section class="primary">
      <p>
        <router-link v-for="(menu) in getMenu('primary')" :class="{'selected':menu.selected}" :key="menu.link" :to="menu.link" >{{t(menu.name)}}</router-link>
      </p>
    </section>

    <section class="secondary">
        <router-link v-for="(menu) in getMenu('secondary')" :class="{'selected':menu.selected}" :key="menu.link" :to="menu.link" >{{t(menu.name)}}</router-link>
    </section>


    <div class="grid">
      <div class="event" v-for="event in events" :key="event._id" @click="gotoEvent(event)">
        <div class="when">{{ getWhen(event).start |shortdate }} </div>
        <div class="title">{{ t(event.title) }} </div>
        
      </div>
    </div>

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


@Component({
  components: {
    CMSIcons, Toolbar
  }
})
export default class EventList extends mixins(Translatable) {
  //
  // "emission"|"workshop"|"masterclass"|"table-ronde"|"concert"|"performance"|"nightclubbing");
  private selected = '';

  get events() {
    return $cms.cms.events.filter(event => {
      if(!this.selected || this.selected == ''){
        return event;
      }
      return event.type == this.selected;
    })
  }

  get config(){
    return $config.store.config;
  }

  getWhen(event: CMS.Event) {
    return event.when[0];
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

  gotoEvent(event: CMS.Event) {
    this.$router.push({ path: `/events/${event.slug}` });
  }

  async mounted(){
    this.selected = this.$route.query.selected as string;
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

  @Watch('$route', { immediate: true, deep: true })
  async onRouteUpdate(to) {
    this.selected = this.$route.query.selected as string;
  }

}
</script>
