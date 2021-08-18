import { Provider } from './provider'


import { newCoords, newErrorCoords } from './geoLocationMessage';
import { I_Engine } from './I_GeoEngine';

export default class GeoLocationEngine extends Provider implements I_Engine
{

    private watchingId:number | null = null;

    static get isSupported(){
        return !!navigator.geolocation;
    }


    constructor() {
        super();
    }

    start(){
        if(this.watchingId !== null) return;

        if(!GeoLocationEngine.isSupported){
            const code = 42;
            const message = "geo location is not supported on this device";
            this._broadcastValue(newErrorCoords(code, message));
            return;
        }

        console.log("starting native geo location service");

        const positionOptions = {
            enableHighAccuracy: true
        };
        this.watchingId = navigator.geolocation.watchPosition(this.successHandler.bind(this), this.errorHandler.bind(this), positionOptions);
    }

    stop(){
        if(this.watchingId){
            navigator.geolocation.clearWatch(this.watchingId as number);
            this.watchingId = null;
        }
    }

    successHandler(p) {
        console.log("new geolocation", p.coords);

        this._broadcastValue(newCoords(p.coords));
    }

    errorHandler(e) {
        // 1 = permission denied
        // 2 = position unavailable
        // 3 = timeout
        console.log("geolocation error", e.code, e.message);
        this._broadcastValue(newErrorCoords(e.code, e.message));
    }
}
