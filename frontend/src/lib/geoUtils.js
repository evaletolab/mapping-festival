// computes distance between two coordinates
// takes two coordinates expected format -> [longitude, latitude]
// returns distance in meters
// uses the ‘haversine’ formula to calculate the great-circle distance between two points 
// ref -> https://www.movable-type.co.uk/scripts/latlong.html
export function _distance([lon1, lat1], [lon2, lat2]){
   const R = 6371e3; // metres
   const φ1 = lat1 * Math.PI/180; // φ, λ in radians
   const φ2 = lat2 * Math.PI/180;
   const Δφ = (lat2-lat1) * Math.PI/180;
   const Δλ = (lon2-lon1) * Math.PI/180;
   
   const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
             Math.cos(φ1) * Math.cos(φ2) *
             Math.sin(Δλ/2) * Math.sin(Δλ/2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
   
   const d = R * c; // in metres 
   return d;
}

// format anything to return array [longitude, latitude]
export function toCoords(mysteryCoords){

    if(!mysteryCoords){
        console.error("got null expected valid coordinates object");
        return [0,0];
    }

    if(Array.isArray(mysteryCoords)){
        return mysteryCoords;
    }

    if(typeof mysteryCoords !== 'object'){
        console.error("toCoords got invalid object type", typeof mysteryCoords);
        return [0,0];
    }

    if('lat' in mysteryCoords && 'lng' in mysteryCoords){
        return [mysteryCoords.lng, mysteryCoords.lat];
    }

    if('longitude' in mysteryCoords && 'latitude' in mysteryCoords){
        return [mysteryCoords.longitude, mysteryCoords.latitude];
    }

    console.error("invalid coordinates format in object", mysteryCoords);
    return [0, 0];
}


export function spotInRangeOfCoord(spots, coords){

    for(let i = 0; i < spots.length; i++){
        const radius = spots[i].radius;
        const dist = distance(spots[i].coords, coords);
        if(dist < radius){
            return spots[i];
        }
    }

    return null;
}


export const genevaCoords = [6.14569, 46.20222];
// export const genevaCoords = [6.14798,46.20609];


// compute minimal bounds where centerCoords remains in center
// and otherCoords is Visible
// used for map.fitBounds
export function computeBounds(centerCoords, otherCoords){
    // bounds defined as [sw, ne]
    const [x1, y1] = centerCoords;
    const [x2, y2] = otherCoords;

    // x
    const longDelta = Math.abs(x2 - x1);
    // y
    const latDelta = Math.abs(y2 - y1);

    const sw = [x1 - longDelta, y1 - latDelta];
    const ne = [x1 + longDelta, y1 + latDelta];

    return [sw, ne];
}

// https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js
export function createGeoJSONCircle(center, radiusInKm, points) {
    if(!points) points = 64;

    const coords = {
        latitude: center[1],
        longitude: center[0]
    };

    const km = radiusInKm;

    let ret = [];
    const distanceX = km/(111.320 * Math.cos(coords.latitude * Math.PI / 180));
    const distanceY = km/110.574;

    let theta, x, y;
    for(let i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI);
        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);

        ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ret]
                }
            }]
        }
    };
}


import center from '@turf/center';
import bbox from '@turf/bbox';
import distance from '@turf/distance';
import { featureCollection, point } from '@turf/helpers';

export function getCenter(points){
    const features = featureCollection(points.map(point));
    console.log(features);

    const result = center(features);
    console.log(result);
    return result.geometry.coordinates;
}

export function getBbox(points){
    const features = featureCollection(points.map(point));
    // console.log(features);

    const result = bbox(features);

    const sw = [result[0], result[1]];
    const ne = [result[2], result[3]];
    // console.log("bbox sw: ", sw, "ne:", ne);
    return [sw, ne];
}

export function turfDistance(pointA, pointB, options={units:"kilometers"}){
    const from = point(pointA);
    const to = point(pointB);

    return distance(from, to, options);
}

export function lineFeatureCollectionFromPoints(points){
    const pointsString = points.reduce((result, next, index) => {
        result += `[${next[0]}, ${next[1]}]`;

        if(index < points.length - 1){
            result += ', ';
        }
        return result;
    }, "");

    const result = `
    {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "LineString",
              "coordinates": [
                  ${pointsString}
              ]
            }
          }
        ]
      }
    `

    return result;
}

export function injectLineStringIntoFeatureCollection(lineStringAsStr){

    const result = `
    {
        "type": "FeatureCollection",
        "features": [
            ${lineStringAsStr}
        ]
      }
    `

    return result;
}