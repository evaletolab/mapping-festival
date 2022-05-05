<template>

    <div class="grid-element card" @click="navigateToNews">
        <lazy-img class="cover" :src="coverDesktop" />
        <div class="description"> 
          <div class="text event-title">{{ t(newsItem.title) }}</div>
          <div class="text">{{ t(newsItem.abstract) }} </div>
        </div>
    </div>
    
</template>

<style scoped>
    .card{
        position: relative;
        cursor: pointer;
    }
    .cover{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .description{
        position:absolute;
        top: 10px;
        left: 10px;
    }

</style>


<script lang="ts">
import { Translatable } from '@/mixins';
import { mixins } from 'vue-class-component';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CMS } from "../models";
import { $config, $event, $i18n } from '../services';
import LazyImg from './LazyImg.vue';

@Component({
  components: { LazyImg }
})
export default class NewsCard extends mixins(Translatable) {
  @Prop() newsItem!: CMS.News;

  get config(){
    return $config.store.config;
  }
  
  get coverDesktop(): string {
    if(this.newsItem.featuredImage){
      return this.newsItem.featuredImage.sizes.small.path;
    }else{
      return "https://via.placeholder.com/450/000000/000000";
    }
  }
  
  navigateToNews(){
    console.log("news-----------", this.newsItem);
    this.$router.push({path: `/news/${this.newsItem.slug}`});
  }
}
</script>
