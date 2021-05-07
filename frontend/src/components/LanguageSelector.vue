<template>
    <a @click="toggleLang">{{invertedCurrentLang}}</a>    
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { currentLangStore, setLang, Lang } from '../services/i18n';

@Component({
  components: { },
})
export default class LanguageSelector extends Vue {

  get invertedCurrentLang(){
    return currentLangStore.lang == Lang.fr ? "English" : "Français";
  }

  toggleLang(){
    if(currentLangStore.lang == Lang.fr){
      setLang(Lang.en);
    }else{
      setLang(Lang.fr);
    }
  }
}
</script>
