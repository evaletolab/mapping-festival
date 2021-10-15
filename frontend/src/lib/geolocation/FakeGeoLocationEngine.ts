import { newCoords, newErrorCoords } from './geoLocationMessage';

import { Provider } from './provider';

import { mapEventProvider } from '../mapEventProvider';
import { I_Engine } from './I_GeoEngine';

export default class FakeGeoLocationEngine extends Provider implements I_Engine
{
    private handler: (e)=>void;
    private intervalId: number = -1;

    constructor(){
        super();
        this.handler = this.onMapClick.bind(this);
    }

    onMapClick(e){
        if(e.type == "click"){
            const coordinates = newCoords(e.coordinates);
            this._broadcastValue(coordinates);

            clearInterval(this.intervalId);
            this.intervalId = setInterval(() => {
                this._broadcastValue(coordinates);
            }, 5000);
        }
    }

    start() {
        console.log("start fake geolocation engine")
        mapEventProvider.addListener(this.handler);
    }

    stop() {
        console.log("stop fake geolocation engine")
        mapEventProvider.removeListener(this.handler);
    }

    publishCoords(coords) {
        this._broadcastValue(newCoords(coords));
    }
}
