
<template>
    <div class="popup" v-bind:class="{hidden: !visible }" @click.stop="onSelectionRequest" ref="popupElement">
        <div class="article-container">
            <div class="description">
                <p v-if="eventLocation">{{t(eventLocation.name)}}</p>
            </div>
        </div>
        <button @click.stop="broadcastCloseRequest">x</button>
        <div class="tip" ></div>
    </div>
</template>

<style scoped>
    .popup{
        width: 200px;
        height: 80px;
        background-color: white;
        z-index: 20;
        cursor:pointer;
    }

    .tip{
      position: absolute;
      bottom:-15px;
      left: 90px;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 20px solid white;
    }

    .article-container{
        padding: 10px;
        padding-top: 25px;
    }

    .hidden{
        display: none;
    }

    img{
        width: 80px;
        height: 80px;
        object-fit: cover;
    }

    .thumbnail{
        width: 80px;
        height: 80px;
        background-color: grey;
    }
    .description{
    }
    h3, p{
        margin:0;
        color:black;
    }
    button{
        position:absolute;
        right:5px;
        top: 5px;
        background-color:#eee;
        border:1px solid #aaa;
        display:inline-block;
        cursor:pointer;
        color:#555;
        padding:0px 4px;
        text-decoration:none;
    }
</style>

<script lang="ts">
/* eslint-disable */
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import mapboxgl, { LngLatLike, Map, Marker, MarkerOptions } from "maplibre-gl";
// @ts-ignore
import { genevaCoords } from '../lib/geoUtils';
// @ts-ignore
import { mapEventProvider } from '../lib/mapEventProvider.js';

import { CMS } from "@/models";
import { mixins } from 'vue-class-component';
import { Translatable } from '@/mixins';

@Component
export default class MapLibrePopup extends mixins(Translatable) {

    @Prop({default: () => genevaCoords}) private coordinates!: mapboxgl.LngLatLike;


    // @InjectReactive() map!: Map;
    @Prop() map!: Map;
    
    @Prop({default: false}) visible!: boolean;

    @Prop({default:0}) id!: number;
    @Prop({default: true}) clickable!: boolean;

    @Prop({}) eventLocation!: CMS.EventLocation;

    // export let isLast = false;
    // export let isCurrent = false;
    // export let showRadius = false;
    // export let radiusMeters = 35;

    zIndex = 1;
    popup!: Marker;

    get markerUrl(): string{
        return "/map/SpotMarker.svg";
    }

    @Watch('visible')
    onVisibilityChange(val: boolean, oldVal: boolean){
        console.log("-------------------------vis change", val);
    }
    
    @Watch('eventLocation')
    onEventLocationChange(val: CMS.EventLocation, oldVal: CMS.EventLocation){
        console.log("------------------------- eventLocation change", val);
        if(this.popup){
            this.popup.setLngLat(this.eventLocation.coordinates);
        }
    }

    @Watch('map')
    onMapChanged(val: Map, oldVal: Map) {
        console.log("mounting popup--------------------------------");
        const options: MarkerOptions = {
            element: this.$refs.popupElement as HTMLElement,
            anchor: 'bottom',
            offset: [0, -75]
        };
        this.popup = new mapboxgl.Marker(options)
            .setLngLat(genevaCoords as LngLatLike)
            .addTo(this.map);

        setTimeout(() => mapEventProvider.addListener(this.onMapEvent), 0);
    }

    onMapEvent(e: any){
        if(e.type == "click"){
            console.log("got background click");
            this.broadcastCloseRequest();
        }
    }

    broadcastCloseRequest(){
        console.log("sending close popup request");
        this.$emit("closeRequest", null);
    }

    onClick(){
        console.log("on popup click");
    }

    onSelectionRequest(){
        console.log("on selection request");
        this.$emit("selectionRequest", {});
    }

    beforeDestroy() {
        console.log("removing popup");
        mapEventProvider.removeListener(this.onMapEvent);
        if(this.popup){
            this.popup.remove();
        }
    }


}
</script>
