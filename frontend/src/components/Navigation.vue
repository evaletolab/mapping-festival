<template>
    <div class="page-wrap">


        <header class="page-header">
            <!-- --------------- Header  ----------------- -->

            <!-- Visual Column guides helpers -->
            <div class="column-guides-wrapper">
                <div class="column-display">1</div>
                <div class="gutter-display">.</div>
                <div class="column-display">2</div>
                <div class="gutter-display">.</div>
                <div class="column-display">3</div>
                <div class="gutter-display">.</div>
                <div class="column-display">4</div>
                <div class="gutter-display">.</div>
                <div class="column-display">5</div>
                <div class="gutter-display">.</div>
                <div class="column-display">6</div>
                <div class="gutter-display">.</div>
                <div class="column-display">7</div>
                <div class="gutter-display">.</div>
                <div class="column-display">8</div>
            </div>

            <h2>mppngfstvl<br>2051<br></h2>

        </header>

            <!-- --------------- sub-nav  ----------------- -->

        <nav class="page-sub-nav">
            <!-- <div class="item">[Current view] / [otherview1 / otherview2] —— filtres</div> -->
            <PrimaryMenu i18n="true" />
        </nav>

            <!-- --------------- main  ----------------- -->

        <main class="page-main">
            <slot></slot>    
        </main>

            <!-- --------------- aside  ----------------- -->
        <aside class="page-sidebar">[Main navigation menu]
            <br>
            <br>
            <div class="item">agenda</div>
            <div class="item">carte</div>
            <div class="item">artistes</div>
            <br>
            <br>[Other pages and links]
            <br>
            <br>
            <div class="item">about</div>
            <div class="item">archives</div>
            <br>
            <br>

            <div class="item">Français/English</div>
            <div class="item">Night mode</div>


            <br>
            <br>

            <p>
                <a class="" href="mailto:elvis@mappingfestival.com">contact</a><br>
                <a class="" href="https://www.facebook.com/mappingfest">fbook</a><br>
                <a class="" href="https://www.instagram.com/mappingfestival/">insta</a><br>
                <a class="" href="https://vimeo.com/mappingfestival">vimeo</a><br><br>
                <a class="" href="https://docs.google.com/forms/d/e/1FAIpQLSeqzDLxisp0UboBNDx6G6IvQo2oYRfvwPPT1_rZ7Wo-E_mMmA/viewform">
                bénévoles</a>
            </p>

        </aside>
    </div>
</template>




<style scoped>

</style>


<script lang="ts">
import { Translatable } from '@/mixins';
import { mixins } from 'vue-class-component';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CMS } from "../models";
import { $config } from '../services';

import PrimaryMenu from './PrimaryMenu.vue';

@Component({
  components: { PrimaryMenu, }
})
export default class Navigation extends mixins(Translatable) {

  get config(){
    return $config.store.config;
  }

  mounted(){
      console.log("current route", this.$router.currentRoute);
  }

}
</script>
