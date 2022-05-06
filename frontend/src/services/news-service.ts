import { $cms } from './cms-service';
import { CMS } from "@/models";

class NewsService
{
    get all(): CMS.News[]{
        return $cms.news
        .sort((a, b) => b.created.getTime() - a.created.getTime());
    }

    get pinnedItems(): CMS.News[]{
        return this.all.filter(item => item.highlighted)
        .sort((a, b) => b.created.getTime() - a.created.getTime());
    }

    get unpinnedItems(): CMS.News[]{
        return this.all.filter(item => !item.highlighted)
        .sort((a, b) => b.created.getTime() - a.created.getTime());
    }

    getItems(count: number): CMS.News[]{
        if(count <= 0){
            return [];
        }

        let result = this.pinnedItems.slice(0, count);
        const remainder = count - result.length;
        if(remainder > 0){
            const remainingItems = this.unpinnedItems.slice(0, remainder);
            result = [...result, ...remainingItems];
        }

        console.log("limited news selection", result);

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