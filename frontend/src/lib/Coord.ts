import { distance, toCoords } from './geoUtils';
import { CMS } from '@/models';

export type CoordData = CMS.Coordinate;

export default class Coord
{
    private _coords: CoordData = [0, 0];

    constructor(value: any){
        this._coords = toCoords(value);
    }

    get coords(){
        return this._coords;
    }

    distance(other: Coord){
        return distance(this.coords, other.coords);
    }
}