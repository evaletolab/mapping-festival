<template>
    <div class="maplibre-container" id="maplibre-container-id">
        <slot v-bind:map="map"></slot>

        <div class="attribution">{{attributionText}}</div>
    </div>    
</template>

<style src='maplibre-gl/src/css/maplibre-gl.css'>
    /* global styles */
</style> 

<style scoped>
    .maplibre-container{
        width: 100%;
        height: 100%;
        position: relative;
    }

    .attribution{
        position: absolute;
        bottom:10px;;
        left: 10px;
        background-color: rgba(255, 255, 255, 0.8);
        z-index: 2;
        color: #444;
    }
</style>

<script lang="ts">
/* eslint-disable */
import { Component, Prop, Provide, ProvideReactive, Vue } from 'vue-property-decorator';

import mapboxgl, { Map } from "maplibre-gl";
// @ts-ignore
import { genevaCoords } from '../lib/geoUtils';
// @ts-ignore
import { getMapStyle } from '../lib/esriStyleAdapter';
// @ts-ignore
import { mapEventProvider } from '../lib/mapEventProvider.js';

import { flyToProvider } from '../lib/geolocation/provider';

@Component
export default class MapLibre extends Vue {
    @Prop() private msg!: string;

    @Prop({default: true}) private interactive!: boolean;
    @Prop({default: 0}) private pitch!: number;
    @Prop({default: 15}) private startZoom!: number;
    @Prop({default: () => genevaCoords}) private startCoordinates!: mapboxgl.LngLatLike;

    @Prop({default:null}) private bounds!: mapboxgl.LngLatBoundsLike;

    map: Map | null = null;

    async mounted(){
        const mapStyle = await getMapStyle();
        // SW, NE
        const maxBounds:mapboxgl.LngLatBoundsLike = [
             [ 5.4052734375, 45.838367585245855 ],
             [ 7.248229980468751, 46.66263249079177 ]
        ];
        
        let options: any = {
            container: "maplibre-container-id", // container id
            style: mapStyle,
            interactive: this.interactive,
            pitch: this.pitch, // pitch in degrees
            center: this.startCoordinates,
            zoom: this.startZoom, // starting zoom,
            minZoom: 9,
            maxZoom: 18,
            maxBounds: maxBounds,
            attributionControl:false,
        }

        if(this.bounds){
            console.log("setting bounds");
            options.bounds = this.bounds;
            options.fitBoundsOptions = {
                padding: 90
            };
        }

        this.map = new Map(options);

        console.log("loading map");
        mapEventProvider.initMap(this.map);

        this.map.on('load', this.onMapLoaded);
    }

    onMapLoaded(){
        console.log("map loaded");
        flyToProvider.addListener(this.onFlyToRequest);
        this.$emit("loaded", {map: this.map});
    }
    
    beforeDestroy() {
        if(this.map){
            this.map.off('load', this.onMapLoaded);
            this.map.remove()
        }
        flyToProvider.removeListener(this.onFlyToRequest);
    }

    get attributionText(): string{
        return "Esri Community maps, SITG State of Geneva";
    }

    onFlyToRequest(request){
        // console.log("flying to ", request);
        if(request.coordinates){
            const options = {
                center: request.coordinates, 
                zoom: request.zoom || 14,
                speed: 0.25
            };
            if(this.map){
                this.map.flyTo(options);
            }
            return;
        }

        if(request.bounds){
            const options = {
                duration: 1500,
                padding: request.padding || 0,
            };
            // console.log("flying to ", request.bounds, options);
            if(this.map){
                this.map.fitBounds(request.bounds, options);
            }
            return;
        }
    }

}
</script>
