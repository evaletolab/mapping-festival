<template>
    <div class="grid-element event-card" @click="navigateToEvent">
        <lazy-img class="cover-event" :src="coverDesktop" />
        
        <div class="description"> 
          <div class="text event-title">{{ t(event.title) }}</div>
          <div v-for="artist in artists" :key="artist._id">
            <div class="text artistname">{{artist.fullname}} </div>
            <div class="text artist-country">&#8239;{{artist.country}}</div>
          </div>
          <div v-if="location" class="text event-location">{{t(location)}}</div>

      <!-- Only end date seems to be shown in calendar view (Check installations)! -->   
          <div v-if="timeStartAndEnd" class="text event-date">{{timeStartAndEnd}}</div>

          <div v-else>
            <!------------- Nice dates ----------->
            <div v-if="event.when.length < 2" >
              <div class="text event-date" v-for="(when,index) in event.when" :key="index">
              {{when.start|shortdate}} / {{when.startTime}} — {{when.endTime}}
              </div>
            </div>
            <div v-else>
              <div class="text event-date" v-for="(interval, index) in intervals" :key="index">
                {{interval.shortDate}} / {{interval.startTimeAsStr}} — {{interval.endTimeAsStr}}
              </div>
            </div>
            <!-- ------------------------------- -->
          </div>
          <br>
          <div class="text event-type">{{getTypeLabel(event.type)}}</div>
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
import { $config, $event, $i18n } from '../services';
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
      return null;
    } 

    const realEvt: CMS.Event = $event.eventWithId(this.event._id) as CMS.Event;
    const firstWhenOfDate = new CMS.EventWrap(realEvt).getFirstWhenForDate(this.date);

    if(firstWhenOfDate){
      return `${firstWhenOfDate.startTime}-${firstWhenOfDate.endTime}`;
    }else{
      console.log("no when found for date, event id ", this.date, this.event);
    }

    return null;
  }

  get intervals(): CMS.Interval[]{
    const intervals = new CMS.EventWrap(this.event).intervals;
    return intervals;
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
      return "https://via.placeholder.com/80/000000/000000";
    }
  }
  
  get coverDesktop(): string {
    if(this.event.cover){
      return this.event.cover.sizes.small.path;
    }else{
      return "https://via.placeholder.com/450/000000/000000";
    }
  }


  getTypeLabel(type) {
    return $i18n.t(type);
  }
  
  navigateToEvent(){
    const queryParams = this.date ? `?when=${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}` : '';
    this.$router.push({path: `/events/${this.event.slug}${queryParams}`});
  }
}
</script>
