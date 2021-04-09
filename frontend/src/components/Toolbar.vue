<template>
  <nav class="toolbar " :class="{'exited': (scrollDirection <= 0) }">
    <div class="toolbar-row">
      <div class="toolbar-section-start">
        <button class="icon start" @click="onBack">
          <i class="fas fa-arrow-left fa-2x"></i>
        </button>
      </div>

      <div class="toolbar-title">
        <!-- <img class="logo" src="@/assets/MILID-logo-text.svg" /> -->
        mppng2051
      </div>        

      <div class="toolbar-section-end">
        <button class="icon end">
          <i class="fas fa-bars fa-2x"></i>
        </button>
      </div>
    </div>

    <div class="toolbar-row">
    </div>        
  </nav>

</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class Toolbar extends Vue {
  private lastScrollTop = 0;
  scrollDirection = 0;
  async mounted(){
    window.addEventListener("scroll", () => { 
      const st = window.pageYOffset || document.documentElement.scrollTop;
      //
      // downscroll code
      if (st > this.lastScrollTop){
        this.scrollDirection = 1;
      } 
      //
      // upscroll code
      else {          
        this.scrollDirection = -1;
      }

      //
      // For Mobile or negative scrolling
      this.lastScrollTop = st <= 0 ? 0 : st; 
    }, false);
  }


  async onBack() {
    this.$router.go(-1);
  }  
}
</script>
