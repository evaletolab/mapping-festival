import { $cms } from './cms-service';
import { CMS } from "@/models";

class NewsService
{
    get all(): CMS.News[]{
<<<<<<< .merge_file_SNg91l
        return $cms.news
        .sort((a, b) => b.created.getTime() - a.created.getTime());
    }

    get pinnedItems(): CMS.News[]{
=======
        return $cms.news;
    }

    // pinned status is obsolete
    private get pinnedItems(): CMS.News[]{
>>>>>>> .merge_file_8lcia4
        return this.all.filter(item => item.highlighted)
        .sort((a, b) => b.created.getTime() - a.created.getTime());
    }

<<<<<<< .merge_file_SNg91l
    get unpinnedItems(): CMS.News[]{
=======
    // pinned status is obsolete
    private get unpinnedItems(): CMS.News[]{
>>>>>>> .merge_file_8lcia4
        return this.all.filter(item => !item.highlighted)
        .sort((a, b) => b.created.getTime() - a.created.getTime());
    }

    getItems(count: number): CMS.News[]{
        if(count <= 0){
            return [];
        }
<<<<<<< .merge_file_SNg91l

        let result = this.pinnedItems.slice(0, count);
        const remainder = count - result.length;
        if(remainder > 0){
            const remainingItems = this.unpinnedItems.slice(0, remainder);
            result = [...result, ...remainingItems];
        }
=======
        let result = this.all.slice(0, count);
>>>>>>> .merge_file_8lcia4

        return result;
    }

    newsWithSlug(slug: string): CMS.News | null {
        console.log("checking for slug", slug);
        return this.all.find(e => e.slug === slug) || null;
    }
    
    slugWithId(id: string): CMS.News | null {
        return this.all.find(e => e._id === id) || null;
    }
}


//
// services start with $
export const $news = new NewsService();