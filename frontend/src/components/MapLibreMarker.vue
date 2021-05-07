<template>
    <img 
    ref="markerElement"
    :src="markerUrl"
    class="spot-marker"
    @click.stop="onClick"
    v-bind:class="{ clickable: clickable }"
    alt="spot marker"> 
</template>

<style scoped>
    .spot-marker
    {
        width:84px;
        height:75px;
        opacity: 0; /* hack to hide marker before load */
    }

    .spot-marker-current
    {
        filter: invert(100%);
    }

    .clickable
    {
        cursor: pointer;
    }

    /* .numberCircle {
        border-radius: 50%;
        width: 24px;
        height: 24px;
        padding: 8px;
    
        background: #f1f1f1;
        border: 2px solid #000;
        color: #000;
        text-align: center;
    
        font: 22px Arial, sans-serif;
    } */
</style>
<script lang="ts">
/* eslint-disable */
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import mapboxgl, { Map, Marker, MarkerOptions, Popup } from "maplibre-gl";
// @ts-ignore
import { genevaCoords } from '../lib/geoUtils';
// @ts-ignore

import { CMS } from "@/models";

@Component
export default class MapLibreEventLocationMarker extends Vue {

    @Prop() private eventLocation!: CMS.EventLocation;
    @Prop({default: () => genevaCoords}) private coordinates!: mapboxgl.LngLatLike;

    // @InjectReactive() map!: Map;
    @Prop() map!: Map;

    @Prop({default:0}) id!: number;
    @Prop({default: true}) clickable!: boolean;
    // export let isLast = false;
    // export let isCurrent = false;
    // export let showRadius = false;
    // export let radiusMeters = 35;

    zIndex = 1;
    marker!: Marker;

    get markerUrl(): string{
        console.log("type---------------", this.eventLocation.type);
        if(this.eventLocation.type == "Standard"){
            return "/map_assets/SpotMarker.svg";
        }else{
            return "/map_assets/SpotMarkerPU.svg";
        }
    }

    @Watch('map')
    onMapChanged(val: Map, oldVal: Map) {
        // console.log("onmap changed", val, oldVal);
        // console.log("map = ", this.map);
        // console.log(this.coordinates);

        // unhide marker
        (this.$refs.markerElement as HTMLElement).style.opacity = "1";

        const options: MarkerOptions = {
            element: this.$refs.markerElement as HTMLElement,
            anchor: 'bottom',
        };

        this.marker = new mapboxgl.Marker(options)
            .setLngLat(this.coordinates)
            .addTo(this.map);
    }

    onClick(e: any){
        if(!this.clickable) return;
        console.log("on marker click");
        this.$emit("selectionRequest", this.eventLocation);
    }

    beforeDestroy() {
        if(this.marker){
            // console.log("removing marker with id", id);
            this.marker.remove();
        }
    }


}
</script>
