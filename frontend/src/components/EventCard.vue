<template>
    
    <div class="event-card" @click="navigateToEvent">
        <lazy-img class="cover-event" :src="coverDesktop" />

        <div class="description">
            <div class="title">{{ t(event.title) }} </div>      
            <div v-if="event.when.length > 0" class="when">{{ event.when[0].startTime }} </div>
            <div class="type">{{ (event.type) }} </div>      
        </div>
    </div>
</template>

<style scoped>
    .event-card{
        position: relative;
        width: 100%;
        height: 100%;
    }

    .cover-event{
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
import { $config } from '../services';
import LazyImg from './LazyImg.vue';

@Component({
  components: { LazyImg }
})
export default class ArtistCard extends mixins(Translatable) {
  @Prop() event!: CMS.Event;
//   @Prop() mobileView!: boolean;

  get config(){
    return $config.store.config;
  }

  get coverMobile(): string {
    if(this.event.cover){
      return this.event.cover.sizes.thumbs.path;
    }else{
      return "https://via.placeholder.com/80";
    }
  }
  
  get coverDesktop(): string {
    console.log("cov", this.event.cover);
    if(this.event.cover){
      return this.event.cover.sizes.small.path;
    }else{
      return "https://via.placeholder.com/450";
    }
  }

  navigateToEvent(){
    console.log("on click----------------------------");
    this.$router.push({path: `/events/${this.event.slug}`});
  }
}
</script>
