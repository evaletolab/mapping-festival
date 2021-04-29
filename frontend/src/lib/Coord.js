import { distance, toCoords } from './geoUtils';

export default class Coord
{
    constructor(value){
        this.coords = toCoords(value);
    }

    get coords(){
        return this.coords;
    }

    distance(otherCoord){
        return distance(this.coords, other.coords);
    }
}