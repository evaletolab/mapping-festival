
<template>
    <div class="popup" v-bind:class="{hidden: !visible }" @click.stop="onSelectionRequest" ref="popupElement">
        <div class="article-container">
            <div class="description">
                <h3>a spot</h3>
                <p>a spot description</p>
            </div>
        </div>
        <button @click.stop="broadcastCloseRequest">x</button>
    </div>
</template>

<style scoped>
    .popup{
        width: 300px;
        height: 100px;
        background-color: white;
        z-index: 20;
    }

    .article-container{
        display: flex;
        width: 280px;
        height: 80px;
        padding: 10px;
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
        padding-left: 5px;
    }
    h3, p{
        margin:0;
    }
    button{
        position:absolute;
        right:5px;
        top: 5px;
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

@Component
export default class MapLibrePopup extends Vue {

    @Prop({default: () => genevaCoords}) private coordinates!: mapboxgl.LngLatLike;


    // @InjectReactive() map!: Map;
    @Prop() map!: Map;
    
    @Prop({default: false}) visible!: boolean;

    @Prop({default:0}) id!: number;
    @Prop({default: true}) clickable!: boolean;
    // export let isLast = false;
    // export let isCurrent = false;
    // export let showRadius = false;
    // export let radiusMeters = 35;

    zIndex = 1;
    popup!: Marker;

    get markerUrl(): string{
        return "/map/SpotMarker.svg";
    }

    @Watch('map')
    onMapChanged(val: Map, oldVal: Map) {
        console.log("mounting popup--------------------------------");
        const options: MarkerOptions = {
            element: this.$refs.popupElement as HTMLElement,
            anchor: 'left',
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
