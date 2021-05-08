
<template>
  <div class="popup" v-bind:class="{hidden: !visible }" @click.stop="onSelectionRequest" ref="popupElement">
    <img class="portrait" :src="cover" />
    <div v-if="!!eventLocation" class="eventlocation-text">
      <p>{{t(eventLocation.name)}}</p>
      <p>{{eventLocation.street}}</p>
    </div> 
    <div class="dot">•</div>
    </div>
</template>

<style scoped>

  .popup
  {
    position: absolute;
    top:0;
    left: 0; 
    right: 0; 
    margin-left: auto; 
    margin-right: auto; 

    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    cursor: pointer;
    height: 70px;
    width: 100%;
    max-width: 500px;
    padding-right: 10px;
    padding-left: 10px;
    border: 1px solid var(--font-color);

    background-color: var(--body-color);
  }
  
  .hidden{
    display: none;
  }

  .portrait
  {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }

  .eventlocation-text{
    margin-left: 20px;
    margin-top: 20px;
    line-height: 0;
    color: var(--font-color);
  }

  .dot{
    margin-left: auto; /* https://stackoverflow.com/questions/33924655/position-last-flex-item-at-the-end-of-container */
  }

</style>

<script lang="ts">
/* eslint-disable */
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import { CMS } from "@/models";
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';

@Component
export default class MapLibrePopupFix extends mixins(Translatable) {

    
    @Prop({default: false}) visible!: boolean;

    @Prop({}) eventLocation!: CMS.EventLocation;


    @Watch('visible')
    onVisibilityChange(val: boolean, oldVal: boolean){
        console.log("-------------------------vis change", val);
    }

    get cover(): string {
        if(this.eventLocation && this.eventLocation.cover){
            return this.eventLocation.cover.sizes.thumbs.path;
        }else{
            return "https://via.placeholder.com/80/000000/000000";
        }
    }

    broadcastCloseRequest(){
        console.log("sending close popup request");
        this.$emit("closeRequest", null);
    }

    onSelectionRequest(){
        console.log("on selection request");
        this.$emit("selectionRequest", {});
    }

    beforeDestroy() {
        console.log("removing popup");
    }


}
</script>
