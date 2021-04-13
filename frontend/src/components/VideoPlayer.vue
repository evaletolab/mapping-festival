<template>
  <div class="player">
    <vue-plyr ref='plyr'>
      <div v-if="externalMedia.platform == 'youtube'" class="plyr__video-embed">
        <iframe
          :src="resolveYoutubeSrc"
          allowfullscreen
          allowtransparency
          allow="autoplay"
        ></iframe>
      </div>
    </vue-plyr>
  </div>
</template>

<style lang="scss">
  .player {
    --plyr-video-background: rgba(255, 255, 255, 0);
  }
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { CMS } from '../models';

@Component({
  components: { },
})
export default class VideoPlayer extends Vue {
  @Prop() private externalMedia!:CMS.ExternalMedia;


  mounted(){
    // console.log("got", this.externalMedia);
  }

  get resolveYoutubeSrc(): string{
    const quietMode = "amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
    let result = "";
    if(this.externalMedia.url.startsWith("https://")){
      result = `${this.externalMedia.url}?${quietMode}`;
    }else{
      result = `https://www.youtube.com/embed/${this.externalMedia.url}?${quietMode}`; 
    }

    console.log("computed youtube source", result);
    return result;
  }
}
</script>
