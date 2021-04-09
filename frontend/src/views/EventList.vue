<template>
  <div class="events">
    <!-- TOOLBAR -->
    <Toolbar />
    <section class="header">
      <ul>
        <li class="selected">Agenda</li>
        <li class="">lieux</li>
        <li class="">artistes</li>
      </ul>
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

  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    $cms.loadAll().then(next);
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
