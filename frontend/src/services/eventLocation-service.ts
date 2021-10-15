import { $cms } from './cms-service';
import { $artist } from './artist-service';
import { CMS } from "@/models";

class EventLocationService
{
    all(): CMS.EventLocation[]{
        return $cms.eventLocations;
    }

    eventLocationWithSlug(slug: string): CMS.EventLocation | null {
        return $cms.allEventLocations.find(a => a.slug === slug) || null;
    }
    
    eventLocationWithId(id: string): CMS.EventLocation | null {
        return $cms.allEventLocations.find(a => a._id === id) || null;
    }

    eventsForEventLocation(eventLocation: CMS.EventLocation): CMS.Event[]{
        const set: Set<CMS.Event> = new Set();
        for(const event of $cms.events){
            for(const w of event.when){
                if(w.eventLocation && w.eventLocation == eventLocation){
                    set.add(event);
                }
            }
        }
        return Array.from(set);
    }

    artistsForEventLocation(eventLocation: CMS.EventLocation): CMS.Artist[]{
        const events = this.eventsForEventLocation(eventLocation);
        return events.reduce((accum, nextEvent) => {
            const artists: CMS.Artist[] = nextEvent.artists.map(obj => $artist.artistWithId(obj._id)).filter(a => a != null) as CMS.Artist[];
            return accum.concat(artists);
        }, [] as CMS.Artist[]);
    }
}

//
// services start with $
export const $eventLocation = new EventLocationService();