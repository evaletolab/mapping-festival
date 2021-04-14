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
      <div v-else-if="externalMedia.platform == 'vimeo'"  class="plyr__video-embed">
        <iframe
          :src="resolveVimeoSrc"
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

  get resolveVimeoSrc(): string {
    const quietMode = "loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media";
    let result = "";
    if(this.externalMedia.url.startsWith("https://")){
      result = `${this.externalMedia.url}?${quietMode}`;
    }else{
      result = `https://player.vimeo.com/video/${this.externalMedia.url}?${quietMode}`; 
    }
    console.log("computed vimeo source", result);
    return result;
  }
}
</script>
