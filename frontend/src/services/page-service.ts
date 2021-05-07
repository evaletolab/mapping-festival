import { $cms } from './cms-service';
import { CMS } from "@/models";

class PageService
{
    all(): CMS.Page[]{
        return $cms.pages;
    }

    get pageLinks(){
        return this.all().map(p => {
            return {
                link: `/pages/${p.slug}`,
                name: p.title,
                selected: false,
            };
        });
    }

    pageWithSlug(slug: string): CMS.Page | null {
        return $cms.pages.find(e => e.slug === slug) || null;
    }
    
    pageWithId(id: string): CMS.Page | null {
        return $cms.pages.find(e => e._id === id) || null;
    }
}


//
// services start with $
export const $page = new PageService();