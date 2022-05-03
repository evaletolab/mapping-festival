import { $cms } from './cms-service';
import { $artist } from './artist-service';
import { CMS } from "@/models";

class EventService
{
    get all(): CMS.Event[]{
        return $cms.events;
    }

    eventWithSlug(slug: string): CMS.Event | null {
        return $cms.allEvents.find(e => e.slug === slug) || null;
    }
    
    eventWithId(id: string): CMS.Event | null {
        return $cms.allEvents.find(e => e._id === id) || null;
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
    
    getSetsByLetter(lang = 'fr'): CMS.EventSetByType[]{
        let result: CMS.EventSetByType[] = []

        const eventMap = {};
        for(const evt of this.all ){
            if(evt.typology in eventMap){
                eventMap[evt.typology].push(evt);
            }else if(evt.typology as string !== 'Collection virtuelle'){
                eventMap[evt.typology] = [evt];
            }
        }


        // presentation order
        // lowest valid weight is 1
        const sortWeigths = {
            "Performance": 1,
            "Installation": 2,
            "Collection virtuelle": 3,
            "Masterclass": 4,
            "mppngTV": 5,
            "Parcours urbain": 6,
            "Workshop": 7,
        };

        const keys = Object.keys(eventMap).sort((a, b) => {
            const weightA = sortWeigths[a] || 10;
            const weightB = sortWeigths[b] || 10;
            return weightA - weightB;
        });
        
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