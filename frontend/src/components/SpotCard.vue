<template>
    <div class="grid-element spot-card" @click="navigateToSpot">
        <lazy-img class="cover-spot" :src="coverDesktop" />
        
        <div class="description"> 
          <div class="text event-title">{{ t(eventLocation.name) }}</div>
        </div>
    </div>
</template>

<style scoped>
    .spot-card{
        position: relative;
        cursor: pointer;
        width: 100%;
    }

    .cover-spot{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .description{
        position:absolute;
        top: 10px;
        left: 10px;
    }

</style>


<script lang="ts">
import { Translatable } from '@/mixins';
import { mixins } from 'vue-class-component';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CMS } from "../models";
import { $config, $event, $artist } from '../services';
import LazyImg from './LazyImg.vue';

@Component({
  components: { LazyImg }
})
export default class SpotCard extends mixins(Translatable) {
  @Prop() eventLocation!: CMS.EventLocation;
//   @Prop() mobileView!: boolean;

  get config(){
    return $config.store.config;
  }

  get coverDesktop(): string {
    if(this.eventLocation.cover){
      return this.eventLocation.cover.sizes.small.path;
    }else{
      return "https://via.placeholder.com/450/000000/000000";
    }
  }

  navigateToSpot(){
    console.log("on click----------------------------");
    this.$router.push({path: `/map/${this.eventLocation.slug}`});
  }
}
</script>
