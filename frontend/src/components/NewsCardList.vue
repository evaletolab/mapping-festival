<template>

  <div class="">
    <div class="grid-container grid-container--fit2">
      <news-card v-for="(newsItem, index) in news" :key="index" :newsItem="newsItem" />
    </div> 
  </div>

</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { $config, $cms, $i18n, $news } from '../services';
import { CMS } from "../models";
import { Translatable } from '../mixins';
import NewsCard from './NewsCard.vue';

@Component({
  components: { NewsCard }
})
export default class Calendar extends mixins(Translatable)  {

  @Prop({default: -1}) count!: number;

  get news() : CMS.News[] {
    // const result =  $cms.news;
    if(this.count > 0){
      const result = $news.getItems(this.count);
      return result;
    }else{
      const allItems = $news.all;
      return allItems;
    }
  }

  get currentLang(): string{
    const result = $i18n.lang;
    return result;
  }
}
</script>
