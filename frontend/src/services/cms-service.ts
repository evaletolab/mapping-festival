import { CMS } from "@/models";

import { Vue } from 'vue-property-decorator';

import { $config } from "./config-service";
import { $user } from "./user-service";


import axios from 'axios';

const defaultAxios = {
  headers: { 
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer abcd'
  }
};



class CMSService {
  public STORAGE_KEY = "cms-progression";

  public cms: any = {};

  constructor() {
    this.cms = Vue.observable({});
  }



  async loadAll(){
    const user = await $user.get();
    const config = Object.assign({},defaultAxios) as any;

    //
    // load events
    const events = (await axios.get("/api/event", config)).data;
    //events.forEach(artist => this.cms[artist._id]=artist);

    //
    // load events
    const artists = (await axios.get("/api/artists", config)).data;
    //artists.forEach(artist => this.cms[artist._id]=artist);

    return events || [];
  }

}

//
// service start with $
export const $cms = new CMSService();