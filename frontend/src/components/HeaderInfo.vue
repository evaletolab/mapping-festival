<template>
      <div class="header-info white-background">
      <!-- 
      config.landing.title1 : Mapping festival
      config.landing.title2 : Visual audio…
      config.landing.title3 : Geneva
      -->
        <div class="description">
          <h2 class="white" v-html="config.landing.title1"/> 
          <div class="white">Visual audio and<br>deviant electronics</div>
          <div class="margin-top1 white">19 &#8239; — &#8239; 29.5.2022</div>
          <div class="white">Geneva</div>
        </div> 
          <img class="cover" src="/img/mapping_header3.png" alt="">
        
      </div>


</template>

<style scoped>

    .white-background{
      background-color: white;
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
import { Component, Vue, Prop } from 'vue-property-decorator';

import { $config } from '../services';


@Component({
  components: {
  }
})
export default class HeaderInfo extends Vue {


  mounted(){
  }

  beforeDestroy(){

  }
  get config(){
    return $config.store.config;
  }


}
</script>
