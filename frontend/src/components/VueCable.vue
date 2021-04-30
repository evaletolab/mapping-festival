<template>
  <div class="cables">
    <canvas id="glcanvas"></canvas>
  </div>
</template>

<style scoped>
  .cables{
    top: 0;
    left: 0;
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }

</style>

<script lang="ts">
/* eslint-disable */
// @ts-nocheck 
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VueCable extends Vue {
  @Prop() private msg!: string;

  patch: any = null;

  mounted(){
    this.loadJS();
  }

  onBeforeDestroy(){
    // document.removeEventListener('CABLES.jsLoaded', this.initCables);
  }

  patchInitialized(patch){
    // You can now access the patch object (patch), register variable watchers and so on
    this.patch = patch;
    console.log("patchInitialized");
  }

  showError(errId, errMsg) {
    console.log('An cables-gl error occured: ' + errId + ', ' + errMsg);
  }

  patchFinishedLoading(patch) {
    // The patch is ready now, all assets have been loaded
    console.log("patch loaded");
  }

  initCables(){
    console.log("init-------------------------------------", CABLES);
    if(window.CABLES){
      new CABLES.Patch({
        patch: CABLES.exportedPatch,
        prefixAssetPath: '',
        glCanvasId: 'glcanvas',
        glCanvasResizeToWindow: true,
        onError: this.showError,
        onPatchLoaded: this.patchInitialized,
        onFinishedLoading: this.patchFinishedLoading,
      });
    }
  }

  loadJS(){
    if(window.CABLES){
      this.initCables();
    }else{
      console.log("loading patch------------------------");
      const scriptTag = document.createElement('script');
      scriptTag.setAttribute('src', "/cable/cable.patch.js");
      this.$el.appendChild(scriptTag);
      scriptTag.onload = this.initCables;
      //document.addEventListener('CABLES.jsLoaded', this.initCables); // does not fire...
    }

  }
}
</script>

