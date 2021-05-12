import { $cms } from './cms-service';
import { $artist } from './artist-service';
import { CMS } from "@/models";

class EventService
{
    get all(): CMS.Event[]{
        return $cms.events;
    }

    eventWithSlug(slug: string): CMS.Event | null {
        return $cms.events.find(e => e.slug === slug) || null;
    }
    
    eventWithId(id: string): CMS.Event | null {
        return $cms.events.find(e => e._id === id) || null;
    }

    artistsForEvent(event: CMS.Event): CMS.Artist[]{
        return event.artists.reduce((result, nextArtistObj) => {
           const artist:CMS.Artist | null = $artist.artistWithId(nextArtistObj._id);
           if(artist){
               result = [...result, artist];
           } 
           return result;
        }, [] as CMS.Artist[]);
    }

    eventIsOfSpecialTypeLive(event: CMS.Event){
        const result = event.type == "Masterclass" || event.type == "Performance" ||
        event.type == "Workshop";

        return result;
    }
    
    getSetsByLetter(lang = 'fr'): CMS.EventSetByType[]{
        let result: CMS.EventSetByType[] = []

        const eventMap = {};
        for(const evt of this.all ){
            if(evt.type in eventMap){
                eventMap[evt.type].push(evt);
            }else if(evt.type as string !== 'Collection virtuelle'){
                eventMap[evt.type] = [evt];
            }

        }

        const keys = Object.keys(eventMap).sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()));
        console.log("keys-------", keys);
        for(let key of keys){
            result.push({
                type: key,
                events: eventMap[key].sort((a, b) =>{
                    return a.title[lang].localeCompare(b.title[lang]);
                }),
            });
        }

        return result;
    }
}


//
// services start with $
export const $event = new EventService();