<template>
  <div class="landing">
    <LanguageSelector />
    <img class="front" :src="config.logo" />
    <section class="header">
      <div class="title1">{{t(config.landing.title1)}}</div>
      <div class="title2">{{t(config.landing.title2)}}</div>
      <div class="title3">{{t(config.landing.title3)}}</div>
    </section>
    <!-- MENU LINKS -->
    <ul class="links">
      <li v-for="menu in config.landing.menu" :key="menu.link">
        <router-link :to="menu.link">{{ t(menu.name) }}</router-link>
      </li>
    </ul>

    <!-- FOR TEST -->
    <ul>
      <li v-for="event in events" :key="event._id">
        {{ t(event.title) }} 
      </li>
    </ul>

    <!-- FOOTER LINKS -->
    <div class="footer">
      <ul>
        <li v-for="menu in config.footer.menu" :key="menu.link">
          <router-link :to="menu.link">{{ t(menu.name) }}</router-link>
        </li>
      </ul>
    </div>


  </div>
</template>

<style lang="scss" scoped>

  .landing{
    display: block;
    img.front{
      width: 100%;
    }
    section.header {
      div.title1{
      }
    }

    ul.links{
      padding: 0;
      list-style: none;
      li{
        padding: 10px ;
      }
    }

    .footer{
      position: fixed;
      bottom: 0px;
      left: 0;
      right: 0;
      ul{
        list-style: none;
        margin: 0;
        padding: 0;
        li{
          float: left;
          padding: 2px 10px;
          text-decoration: none;
        }
      }
    }
  }

  
  .version {
    font-weight: 200;
    opacity: .5;
  }
</style>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { $config, $cms } from '../services';
import { Translatable } from '../mixins';

import CMSIcons from '../components/CMSIcons.vue';
import LanguageSelector from '../components/LanguageSelector.vue';

import { mixins } from 'vue-class-component';

@Component({
  components: {
    CMSIcons,
    LanguageSelector,
  },
})
export default class Landing extends mixins(Translatable) {

  // async mounted(){
  //   window.addEventListener('beforeinstallprompt', (e) => {
  //     // Prevent Chrome 67 and earlier from automatically showing the prompt
  //     e.preventDefault();

  //     // Stash the event so it can be triggered later.
  //     this.deferredPrompt = e;
  //   });
  // }

  get config(){
    return $config.store.config;
  }

  get events(){
    return $cms.events;
  }

  // beforeRouteEnter(to: any, from: any, next: any) {
  //   const all = [$config.get(),$user.get()]
  //   Promise.all(all).then(([config, user])=> {
  //     if(user.id && user.name) {
  //       return next('/content');
  //     }
  //     next();
  //   })
  // }

}
</script>
