import { $cms } from './cms-service';
import { CMS } from "@/models";

class NewsService
{
    get all(): CMS.News[]{
        return $cms.news;
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