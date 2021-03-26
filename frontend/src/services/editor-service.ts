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



class EditorService {
  public STORAGE_KEY = "cms-progression";

  public cms: any = {};

  constructor() {
    this.cms = Vue.observable({});
  }

  //
  // create editor content  
  async create(type: "artist" | "event",content: CMS.Content){
    if(!type || !content) {
      throw new Error('Missing params top POST content');
    }

    const user = await $user.get();

    //
    // save php
    const result = await axios.post("/"+type, content, defaultAxios) as any;
   
    this.cms[result._id] = result;
    console.log('---DBG localStorage',this.cms);
    await $config.storageSet(this.STORAGE_KEY,this.cms);
    return result as CMS.Content;
  }

  //
  // save editor version 
  async save(type: "artist"|"event", content: CMS.Content){
    if(!type || !content) {
      throw new Error('Missing params to PUT content');
    }

    const user = await $user.get();

    //
    // save php
    const result = await axios.put("/" + type + "/" + content._id, content, defaultAxios);

    this.cms[result.data._id] = result.data;
    console.log('---DBG localStorage',this.cms);
    await $config.storageSet(this.STORAGE_KEY,this.cms);

    return content;
  }

  async get(type: "artist"|"event", published?: boolean){
    const user = await $user.get();
    const config = Object.assign({},defaultAxios) as any;
    // config.params = {
    //   published
    // };

    //
    // load Airtable usage
    const result = (await axios.get("/" + type , config)).data;
    console.log('--DBG',result);
    result.forEach(artist => this.cms[artist._id]=artist);
    return result || [];
  }

  async getOne(type: "artist"|"event",id: string){
    const user = await $user.get();

    //
    // try with id
    if(this.cms[id]) {
      return this.cms[id];
    }
    //
    // try with slug
    const ids = Object.keys(this.cms);
    const elem = ids.find(_id => {
      return this.cms[_id].slug.indexOf(id)>-1
    });
    if(elem) {
      return this.cms[elem];
    }
    const config = Object.assign({},defaultAxios) as any;

    const result= (await axios.get("/" + type + "/" + id, config)).data;
    this.cms[result._id] = result;
    await $config.storageSet(this.STORAGE_KEY,this.cms);
    return result;
  }
}

//
// service start with $
export const $editor = new EditorService();