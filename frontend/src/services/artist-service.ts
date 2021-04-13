import { $cms } from './cms-service';
import { CMS } from "@/models";

class ArtistService
{
    artistWithSlug(slug: string): CMS.Artist | null {
        return $cms.artists.find(a => a.slug === slug) || null;
    }
    
    artistWithId(id: string): CMS.Artist | null {
        return $cms.artists.find(a => a._id === id) || null;
    }

    eventsForArtist(artist: CMS.Artist): CMS.Event[]{
        return $cms.events.filter(event => {
            !!event.artists.find(obj => obj._id === artist._id);
        });
    }
}


//
// services start with $
export const $artist = new ArtistService();