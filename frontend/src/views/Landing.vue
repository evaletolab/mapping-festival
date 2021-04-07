<template>
  <div class="landing">
    <h1>i18n reactive test</h1>
    <ul>
      <li v-for="event in events" :key="event._id">
        {{ t(event.title) }} 
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>

  .landing{
    display: block;
  }
  
  .version {
    font-weight: 200;
    opacity: .5;
  }
</style>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { $config, $cms } from '../services';
import { Translatable } from '../mixins';

import CMSIcons from '../components/CMSIcons.vue';

import { setLang, Lang } from '../services/i18n';
import { mixins } from 'vue-class-component';

@Component({
  components: {
    CMSIcons    
  },
})
export default class Landing extends mixins(Translatable) {

  mounted(){
    let lang = Lang.fr;
    setInterval(() => {
      lang = (lang == Lang.fr) ? Lang.en : Lang.fr;
      setLang(lang);
      
    }, 1000);
  }

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

  // t(obj){
  //   return t(obj); 
  // }

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
