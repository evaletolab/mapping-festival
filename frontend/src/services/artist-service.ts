import { $cms } from './cms-service';
import { CMS } from "@/models";


class ArtistService
{

    get all(): CMS.Artist[]{
        return $cms.artists;
    }

    get sorted(): CMS.Artist[]{
        const result = this.all.sort((a, b) =>{
            const aName = this.artistSortingName(a);
            const bName = this.artistSortingName(b);
            return aName.toLocaleLowerCase().localeCompare(bName.toLocaleLowerCase());
        });
        // result.forEach(a => console.log(this.artistSortingName(a)));
        return result;
    }

    get setsByLetter(): CMS.ArtistSetByLetter[]{
        let result: CMS.ArtistSetByLetter[] = []

        const artistMap = {};
        for(let artist of this.sorted){
            const artistFirstLetter = this.artistSortingName(artist)[0];
            if(artistFirstLetter in artistMap){
                artistMap[artistFirstLetter].push(artist);
            }else{
                artistMap[artistFirstLetter] = [artist];
            }
        }

        const keys = Object.keys(artistMap).sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()));
        for(let key of keys){
            result.push({
                letterId: key,
                artists: artistMap[key],
            });
        }

        return result;
    }

    artistSortingName(artist: CMS.Artist): string{
        const aName = artist.artistName || artist.lastname || artist.firstname || " ";
        return aName;
    }

    artistWithSlug(slug: string): CMS.Artist | null {
        return $cms.allArtists.find(a => a.slug === slug) || null;
    }
    
    artistWithId(id: string): CMS.Artist | null {
        return $cms.allArtists.find(a => a._id === id) || null;
    }

    //
    // FIXME, list events depends on selected Festival !!
    eventsForArtist(artist: CMS.Artist): CMS.Event[]{
        return $cms.allEvents.filter(event => {
            return !!event.artists.find(obj => obj._id === artist._id);
        });
    }
}


//
// services start with $
export const $artist = new ArtistService();