<template>
  <div class="landing">
    <h1>calendar</h1>
    <ul>
      <li v-for="event in events" :key="event._id">
        {{ event.title.en }} 
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
import { Component, Vue } from 'vue-property-decorator';
import { $config, $cms } from '../services';

import CMSIcons from '../components/CMSIcons.vue';

@Component({
  components: {
    CMSIcons    
  },
})
export default class Landing extends Vue {

  mounted(){

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
