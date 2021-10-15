
import Coord from '../Coord';
import { toCoords } from '../geoUtils';

export interface GeoLocationError {
    code: number | null,
    message: string | null,
}

export class GeoLocationMessage
{
    constructor(public coords: Coord | null, public error: GeoLocationError | null ){ }
}

export function newCoords(coordsLike:any): GeoLocationMessage
{
    const coords = toCoords(coordsLike);
    const error = null;
    return new GeoLocationMessage(coords, error); 
}

export function newErrorCoords(code:number, message: string): GeoLocationMessage{
    const coords = null;
    const error = {
            code,
            message,
    };
    return new GeoLocationMessage(coords, error);
}
