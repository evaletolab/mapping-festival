<template>

    <div class="grid-element card" @click="navigateToNews">
       <!-- <lazy-img class="news-image" :src="coverDesktop" /> -->
          <div class="description"> 
          <div class="text news-title">{{ t(newsItem.title) }}</div>
          <div class="text news-description">{{ t(newsItem.abstract) }} 
          </div>
        </div>
    </div>
    
</template>

<style scoped>

  .card{
      position: relative;
      cursor: pointer;
      border-bottom: 1px solid black;
  }

  .grid-element {
    /* background-color: aquamarine; */
    margin: var(--gutter-width) var(--gutter-width) 0 0;
    height: 8rem;
}

@media only screen and (max-width: 476px)
  {
    .grid-element {
      margin-right: 0;
    }
}

  .cover{
      width: 100%;
      height: 100%;
      object-fit: cover;
  }

  .news-image{
      display: block;
      width: 100%;
      height: 2rem;
      object-fit: cover;
  }

  .description{
  position:absolute;
  /* top: 2.2rem; */
  left: 0;
  }

  .news-title{
    color: black;
  }

  .news-description{
    font-size: calc(var(--font-size) * .75);
    line-height: calc(var(--line-height) * .75);
    font-weight: 400;
    color:rgb(148, 148, 148);
    padding-top:.5rem;
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
