import { $cms } from './cms-service';
import { CMS } from "@/models";

class NewsService
{
    get all(): CMS.News[]{
        return $cms.news;
    }

    // pinned status is obsolete
    private get pinnedItems(): CMS.News[]{
        return this.all.filter(item => item.highlighted)
        .sort((a, b) => b.created.getTime() - a.created.getTime());
    }

    // pinned status is obsolete
    private get unpinnedItems(): CMS.News[]{
        return this.all.filter(item => !item.highlighted)
        .sort((a, b) => b.created.getTime() - a.created.getTime());
    }

    getItems(count: number): CMS.News[]{
        if(count <= 0){
            return [];
        }
        let result = this.all.slice(0, count);

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