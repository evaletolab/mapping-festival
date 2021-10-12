import GeoLocationEngine from '../lib/geolocation/GeoLocationEngine';
import FakeGeoLocationEngine from '../lib/geolocation/FakeGeoLocationEngine';
import LocationTween from '../lib/geolocation/locationTween';
import { BaseEventProvider } from '../lib/geolocation/BaseEventProvider';
import { GeoLocationMessage, newCoords } from '../lib/geolocation/geoLocationMessage';
import { localStorage, LocalStorageKeys } from '../lib/geolocation/LocalStorage';
import { $config } from './config-service';
import { I_Engine } from '@/lib/geolocation/I_GeoEngine';
import { CoordData } from '@/lib/Coord';

export enum LocationServiceState { 
    UNKNOWN = "UNKNOWN",
    PERMISSION_DENIED = "PERMISSION_DENIED",
    UNSUPPORTED_DEVICE = "UNSUPPORTED_DEVICE",
    WORKING = "WORKING",
}

export enum GeolocationEventType  {
    locationError = "locationError",
    coords = "coords",
    significantCoords = "significantcoords",
    started = "started",
    stopped = "stopped",
}

class GeoLocationService extends BaseEventProvider
{
    private _currentEngine!: I_Engine;
    private _tween: LocationTween | null;
    private _fromCoords: CoordData | null;
    private _currentCoords: CoordData | null;
    private _started: boolean = false;
    private _serviceState: LocationServiceState = LocationServiceState.UNKNOWN;
    private _newCoordsHandler: (e) => void;
    private _inited: boolean = false;

    constructor(){
        super();

        this._tween = null;
        this._fromCoords = null;
        this._currentCoords = null;

        const useFakeGeoLocationProvider = false;

        this._currentEngine = useFakeGeoLocationProvider ? new FakeGeoLocationEngine() : new GeoLocationEngine();
        this._serviceState = this.__getStateFromLocalStorage();

        this._newCoordsHandler = this.onNewCoords.bind(this);
    }
    

    __getStateFromLocalStorage(): LocationServiceState{
        const state = localStorage.get(LocalStorageKeys.geo_location_state);
        console.log("state", state);
        if(state === null){
            console.log("state", state);
            return LocationServiceState.UNKNOWN;
        }

        return state;
    }

    __setState(newState){
        if(newState === this._serviceState) return;

        this._serviceState = newState;
        localStorage.set(LocalStorageKeys.geo_location_state, newState);
    }

    get isStarted(): boolean{
        return this._started;
    }

    get serviceState(): LocationServiceState{
        return this._serviceState;
    }

    get currentCoords(): CoordData | null{
        if(this._serviceState == LocationServiceState.WORKING && this._currentCoords){
            return this._currentCoords.slice() as CoordData;
        }else {
            return null;
        }
    }

    // initMap(aMap){
    //     console.log("init map");
    //     this.fakeGeolocationEngine.initMap(aMap);
    // }


    onNewCoords(coordsMessage){
        console.log("on new coords in geolocationManager", coordsMessage);
        if(coordsMessage.error){

            // handle critical cases
            if(coordsMessage.error.code == 42){
                this.__setState(LocationServiceState.UNSUPPORTED_DEVICE);
            }else if(coordsMessage.error.code == 1){
                this.__setState(LocationServiceState.PERMISSION_DENIED);
            }
            this.provide(GeolocationEventType.locationError, coordsMessage);
            this.stop();
            return;
        }

        // this is a significant geoLocation change
        this.provide(GeolocationEventType.significantCoords, coordsMessage);

        this.__setState(LocationServiceState.WORKING);

        if(this._tween && this._tween.isTweening){
            this._tween.stop();
            this._fromCoords = this._currentCoords!.slice() as CoordData;
        }

        const tweenStep = (nextCoords) => {
            this.provide(GeolocationEventType.coords, newCoords(nextCoords.slice()));
            this._currentCoords = nextCoords.slice();
        }

        const tweenComplete = (nextCoords) => {
            this.provide(GeolocationEventType.coords, newCoords(nextCoords.slice()));
            this._fromCoords = nextCoords.slice();
        }

        // const tweenDuration = Config.useFakeGpsProvider ? 4000 : 1000; // ms
        const tweenDuration = 4000; // ms

        if(this._fromCoords){
            this._tween = new LocationTween(this._fromCoords, coordsMessage.coords, tweenDuration, tweenStep, tweenComplete);
            this._tween.start();
        }else{
            this._fromCoords = coordsMessage.coords;
        }
    }

    start(){
        if(this._started) return;

        this._started = true;
        this._currentEngine.start();
        this._currentEngine.addListener(this._newCoordsHandler);
        this.provide(GeolocationEventType.started, null);
        console.log("geoLocationManager started");
    }

    stop(){
        if(!this._started) return;
        
        if(this._tween && this._tween.isTweening){
            this._tween.stop();
        }
        this._currentEngine.stop();
        this._currentEngine.removeListener(this._newCoordsHandler);
        this._started = false;
        this._fromCoords = null;
        this.provide(GeolocationEventType.stopped, null);
        console.log("geoLocationManager stopped");
    }
}

export const $geoLocation = new GeoLocationService();