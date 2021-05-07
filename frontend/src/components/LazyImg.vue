<template>
    <img 
    ref="imgElement"
    :alt="alt"
    >
</template>

<style scoped>
  img{
    opacity: 0;
    transition: opacity 300ms ease;
  }
</style>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component({
  components: {
  }
})
export default class Page extends Vue {
  @Prop() src!: string;
  @Prop({default: ""}) alt!: string;

  observer!: IntersectionObserver;

  mounted(){
    if (window["IntersectionObserver"]) {
      this.createObserver();
    } else {
      this.loadImage();
    }
  }

  beforeDestroy(){

    const imageElement = this.$refs.imgElement as HTMLImageElement;
    imageElement.removeEventListener("load", this.onImgLoaded); 
    imageElement.removeEventListener("error", this.onError);

    if(this.observer){
      this.observer.unobserve(this.$refs.imgElement as HTMLElement);
    }
  }

  loadImage() {
    const imageElement = this.$refs.imgElement as HTMLImageElement;
    imageElement.addEventListener("load", this.onImgLoaded); 
    imageElement.addEventListener("error", this.onError);
    imageElement.src = this.src;
  }

  onImgLoaded(){
    console.log("image loaded", this.src);
    (this.$refs.imgElement as HTMLElement).style.opacity = "1";
  }

  onError(e){
    console.log("error loading image", this.src, e);
  }

  handleIntersect(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage();
        this.observer.unobserve(this.$refs.imgElement as HTMLElement);
      }
    });
   }

  createObserver() {
    const options: any = {
      root: null,
      threshold: "0"
    };
    this.observer = new IntersectionObserver(this.handleIntersect, options);
    this.observer.observe(this.$refs.imgElement as HTMLElement);
  }
}
</script>
