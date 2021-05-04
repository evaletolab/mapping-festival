<template>
  <div>
    <div v-if="externalMedia.platform == 'youtube'" ref="player" data-plyr-provider="youtube" :data-plyr-embed-id="videoId"></div>
    <div v-else-if="externalMedia.platform == 'vimeo'" ref="player" data-plyr-provider="vimeo" :data-plyr-embed-id="videoId"></div>
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
import getVideoId from 'get-video-id';
import Plyr from 'plyr';
import "plyr/dist/plyr.css";


@Component({
  components: { },
})
export default class VideoPlayer extends Vue {
  @Prop() private externalMedia!:CMS.ExternalMedia;


  player!: any;

  mounted(){
    this.player = new Plyr(this.$refs.player as HTMLElement);
    console.log("got player", this.player);
    this.player.on("error", this.onError);
  }

  beforeDestroy(){
    if(this.player){
      this.player.off("error", this.onError);
    }
  }

  onError(e){
    console.log("plyr play error----------------", e);
  }

  get videoId(){
    return getVideoId(this.externalMedia.url).id;
  }

  // get resolveYoutubeSrc(): string{
  //   // const quietMode = "amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
  //   const quietMode = "origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
  //   let result = "";
  //   if(this.externalMedia.url.startsWith("https://")){
  //     const videoId = getVideoId(this.externalMedia.url).id;
  //     // result = `https://www.youtube.com/embed/${videoId}?${quietMode}`; 
  //     result = `www.youtube.com/embed/${videoId}?${quietMode}`; 
  //   }else{
  //     result = `https://www.youtube.com/embed/${this.externalMedia.url}?${quietMode}`; 
  //   }
  //   console.log("computed youtube source", result);
  //   return result;
  // }

  // get resolveVimeoSrc(): string {
  //   const quietMode = "loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media";

  //   const videoId = this.externalMedia.url.startsWith("https://") ? getVideoId(this.externalMedia.url).id : this.externalMedia.url;
  //   const result = `https://player.vimeo.com/video/${videoId}?${quietMode}`; 
  //   // console.log("computed vimeo source", result);
  //   return result;
  // }
}
</script>
