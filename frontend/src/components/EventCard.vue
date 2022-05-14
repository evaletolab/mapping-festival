<template>
    <div class="grid-element event-card" @click="navigateToEvent">
        <lazy-img class="cover-event" :src="coverDesktop" />
        
        <div class="description shadow"> 
          <div class="text event-title">{{ t(event.title) }}</div>
          <div class="artist-name-wrapper" v-for="artist in artists" :key="artist._id">
            <span class="text artistname">{{artist.fullname}} 
            <span class="text artist-country">{{artist.country}}</span></span>
          </div>
          <div v-if="location" class="text event-location">{{t(location)}}</div>

      <!-- Only end date seems to be shown in calendar view (Check installations)! -->   
          <div v-if="timeStartAndEnd" class="text event-date">{{timeStartAndEnd}}</div>

          <div v-else>
            <!------------- Nice dates ----------->

            <div class="text dates-wrapper">
              
              <div v-if="realEvent.when.length < 2" >
                <div class="text event-date" v-for="(when,index) in realEvent.when" :key="index">
                {{when.start|shortdate}}
                </div>
              </div>
            
              <div v-else>
                <div class="text event-date">
                  {{shortDatesAsString}}
                </div>
              </div>
            </div>

            <!-- ------------------------------- -->
          </div>
          <div class="text event-type shadow">{{getTypeLabel(event.typology)}}
        </div>
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

  get realEvent(): CMS.Event {
    const realEvt: CMS.Event = $event.eventWithId(this.event._id) as CMS.Event;
    return realEvt;
  }

  get realWhens(): CMS.When[]{

    return this.realEvent.when;
  }

  get timeStartAndEnd(): string | null{
    return null;
    // if(!this.date){
    //   return null;
    // } 

    // const firstWhenOfDate = new CMS.EventWrap(this.realEvent).getFirstWhenForDate(this.date);

    // if(firstWhenOfDate){
    //   return `${firstWhenOfDate.startTime}-${firstWhenOfDate.endTime}`;
    // }else{
    //   console.log("no when found for date, event id ", this.date, this.event);
    // }

    // return null;
  }

  get intervals(): CMS.Interval[]{
    const realEvt: CMS.Event = $event.eventWithId(this.event._id) as CMS.Event;
    const intervals = new CMS.EventWrap(realEvt).intervals;
    return intervals;
  }

  get artists(): CMS.ArtistWrap[]{
    return $event.artistsForEvent(this.event).map(a => new CMS.ArtistWrap(a));
  }

  get shortDatesAsString(): string{
    let result = "";
    for(let i = 0; i < this.intervals.length; i++){
      if(i < this.intervals.length - 1){
        result += `${this.intervals[i].shortDate} / `;
      }else{
        result += `${this.intervals[i].shortDate}`;
      }
    }
    return result;
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
