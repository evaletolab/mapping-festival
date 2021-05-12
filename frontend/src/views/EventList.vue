<template>
  <div class="events">
    <div class="header hide-sm">
      <h4 class="tagline  align-right">
          <div  v-for="(title,index) in t(config.landing.title2).split('\n')" :key="index">{{title}}</div>
          <div  v-html="t(config.landing.title3)"  class="hide-sm"/>
      </h4>

      <div class="ui-font big destination">
        {{t(title)}}
      </div>
    </div>

    <!-- TOOLBAR -->
    <toolbar class="hide-lg hide-md" @exited="onToolbarExit"/>
    <Calendar  gotop="yes" :class="{'exited': toolbarExit}" @calendarUpdate="onCalendarUpdate"/>
  </div>
</template>

<style lang="scss">
.events{
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  color: var(--font-color);
  margin: 0;
  z-index: 2;
  height: 100vh;
  width: 100%;    
  margin-top: 0px;

  @media (max-width:426px) {
    .calendar {
      transition: all 200ms;      
      transform: translateY(0px);
      &.exited{
        transform: translateY(60px);
      }
    }  
  }


  section.primary{
    display: block;
    width: 100%;
    height: 70px;
    border-top: 1px solid #666;
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
      }  
    }
  }
}



</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $cms, $i18n } from '../services';
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
  toolbarExit = true;
  defaultTitle = {
    name:{fr:"Live",en:"Live"}
  }
  currentTitle: any = {}


  get config(){
    return $config.store.config;
  }

  get title() {
    const menu = this.getMenu('primary').find(item => item.selected) || this.defaultTitle ;
    return menu.name;
  }

  getMenu(layout) {
    const menu = [... $config.getMenu(layout)];
    const path = (this.$route.query.selected as string ||'').toLowerCase();

    const itemIdx = menu.findIndex(item => {
      const name = item.name['fr'].toLowerCase();
      return name.indexOf(path)>-1;
    });
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
    this.currentTitle = this.title;
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

  async onToolbarExit($exited) {
    this.toolbarExit = $exited;
  }

  async onSave() {
    //
  }

  async onCalendarUpdate() {
    this.currentTitle = this.title;
  }


}
</script>
