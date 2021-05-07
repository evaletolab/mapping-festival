<template>
    <div class="grid-element event-card" @click="navigateToEvent">
        <lazy-img class="cover-event" :src="coverDesktop" />
        
        <div class="description"> 
          <div class="text event-title">{{ t(event.title) }}</div>
          <div v-for="artist in artists" :key="artist._id">
            <div class="text artistname">{{artist.fullname}}</div>
            <div class="text artist-country">{{artist.country}}</div>
          </div>
          <div v-if="location" class="text event-location">{{t(location)}}</div>
          <div v-if="timeStartAndEnd" class="text event-date">{{timeStartAndEnd}}</div>
          <br>
          <div class="text event-type">{{event.type}}</div>
        </div>
    </div>
</template>

<style scoped>
    .event-card{
        position: relative;
        cursor: pointer;
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
import { $config, $event, $artist } from '../services';
import LazyImg from './LazyImg.vue';

@Component({
  components: { LazyImg }
})
export default class EventCard extends mixins(Translatable) {
  @Prop() event!: CMS.Event;
  @Prop() date!: Date | null;
//   @Prop() mobileView!: boolean;

  get config(){
    return $config.store.config;
  }

  get timeStartAndEnd(): string | null{
    if(!this.date){
      console.log("no date----------------------------------", this.date);
      return null;
    } 

    const firstWhenOfDate = new CMS.EventWrap(this.event).getFirstWhenForDate(this.date);

    if(firstWhenOfDate){
      return `${firstWhenOfDate.startTime}-${firstWhenOfDate.endTime}`;
    }else{
      console.log("no when found for date, event id ", this.date, this.event);
    }

    return null;
  }

  get artists(): CMS.ArtistWrap[]{
    return $event.artistsForEvent(this.event).map(a => new CMS.ArtistWrap(a));
  }

  get location(): { fr: string, en: string } | null{
    return new CMS.EventWrap(this.event).location;
  }

  get coverMobile(): string {
    if(this.event.cover){
      return this.event.cover.sizes.thumbs.path;
    }else{
      return "https://via.placeholder.com/80";
    }
  }
  
  get coverDesktop(): string {
    if(this.event.cover){
      return this.event.cover.sizes.small.path;
    }else{
      return "https://via.placeholder.com/450";
    }
  }

  mounted(){
    console.log("event card mounted", this.date);
  }

  navigateToEvent(){
    this.$router.push({path: `/events/${this.event.slug}`});
  }
}
</script>
