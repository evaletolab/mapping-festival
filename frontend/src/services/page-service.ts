import { $cms } from './cms-service';
import { CMS } from "@/models";

class PageService
{
    all(): CMS.Page[]{
        return $cms.pages;
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