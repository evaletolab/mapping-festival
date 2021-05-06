import { $cms } from './cms-service';
import { $artist } from './artist-service';
import { CMS } from "@/models";

class EventService
{
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
        event.type == "Workshop" || event.type == "mppngTV";

        console.log("is live", event.type, "result", result);

        return result;
    }
}


//
// services start with $
export const $event = new EventService();