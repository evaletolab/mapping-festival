<template>
  <div class="toolbar " :class="{'exited': (scrollDirection <= 0), 'tiny':tiny,'main':main }">

    <nav >
      <div class="toolbar-row " v-if="main">
        <div class="toolbar-section-start">
          <button class="icon start" @click="onBack">
            <i class="fas fa-arrow-left fa-2x"></i>
          </button>
        </div>

        <div class="toolbar-title">
          mppng2051
        </div>        

        <div class="toolbar-section-end">
          <button class="icon end" @click="onMenu">
            <i class="fas fa-bars fa-2x"></i>
          </button>
        </div>
      </div>        

      <div class="toolbar-row" v-if="tiny">
        <button class="icon hide" @click="onDark">
          <i class="fas fa-moon fa-2x"></i>
        </button>


        <div class="toolbar-section-end">
          <button class="icon end " @click="onMenu">
            <i class="fas fa-bars fa-2x"></i>
          </button>
        </div>

      </div>

    </nav>
  </div>

</template>

<style lang="scss" scoped>

  nav.tiny{  
    .toolbar-row {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      flex-wrap: nowrap;    
      justify-content: flex-end;
      transform: translateY(0);
      transition: all 200ms;      

    }
    button.i18n{
      flex:0;
      background: transparent;
      border: 2px solid var(--font-color);
      border-radius: 9px;
      padding: 0px 2px;
      width: 36px;
      height: 28px;        
      background-color: transparent;
      cursor: pointer;
      outline: 0;
      color: var(--font-color);
      transform: translateY(-6px);  
      margin-right: 5px;
    }

    button.icon{
      margin-right: 5px;
      flex:0;
      padding: 2px 2px;
      width: 36px;
      height: 36px;        
      background-color: transparent;
      border: none;
      cursor: pointer;
      outline: 0;
      color: var(--font-color);
  
      svg{
        width: 34px;
      }
  
      &.end{
        margin-right: 10px;
        margin-top: 15px;
      }
      &.start{
        margin-left: 10px;
        margin-top: 15px;
      }
    }    
  }


  //
  // common style for toolbar, can be overhided on Component.vue
  .toolbar {
    display: flex;
    flex-direction: column;
    justify-content: center;    

    z-index: 4;    
    position: fixed;
    top:-70px ;
    left: 0;
    right: 0;

    transform: translateY(0);
    transition: all 200ms;      
    width: 100%;
    height: 69px;
    &.main{
      background-color: var(--body-color);
    }


    &.exited {
      transform: translateY(69px);            
    }


    .toolbar-section-start,
    .toolbar-section-end
    {
      display: flex;
      align-items: center;
      flex: 1;    
    }

    .toolbar-section-end {
      justify-content: flex-end;
      order: 10;    
    }

    .toolbar-section-start {
      justify-content: flex-start;
      order: 0;    
    }

    .toolbar-title{
      text-align: center;
      font-size: 17px;
      letter-spacing: -0.01em;
      line-height: 22px;
      margin-left: 6px;
      font-weight: 900;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
      &.tight {
        margin: 0;
      }
      &.title-left{
        text-align: left;
      }
      .progress{
        width: 90px;
        height: 25px;
        margin: auto;        
      }
    }

    .toolbar-row {
      width: 100%;
      min-height: 38px;
      display: flex;
      align-items: center;
      align-content: center;
    }

    button{
      padding: 2px 2px;
      width: 36px;
      height: 36px;        
      background-color: transparent;
      border: none;
      cursor: pointer;
      outline: 0;
      color: var(--font-color);

      svg{
        width: 34px;
      }

      &.end{
        margin-right: 10px;
      }
      &.start{
        margin-left: 10px;
      }
    }

  }

  .toolbar-row + .toolbar-row {
    margin-top: -12px;
  }


</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LanguageSelector from '../components/LanguageSelector.vue';
import PrimaryMenu from '../components/PrimaryMenu.vue';

@Component({
  components: {
    LanguageSelector, PrimaryMenu
  }
})
export default class Toolbar extends Vue {
  private lastScrollTop = 0;
  private exited = true;
  scrollDirection = 0;
  darkMode = false;
  @Prop() tiny!:boolean;
  main = true;

  async mounted(){
    //
    // switch mode
    this.main = ! this.tiny;

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

      //
      // fire event
      if(!this.exited && (this.scrollDirection <= 0)) {
        this.exited = true;
        this.$emit('exited', true);
      }
      if(this.exited && (this.scrollDirection > 0)) {
        this.exited = false;
        this.$emit('exited',false);
      }


    }, false);
  }

  async onBack() {
    this.$router.go(-1);
  }  

  async onDark() {
    this.darkMode = ! this.darkMode;
    const root = document.documentElement;
    const fcolor = this.darkMode ? 'white':'black';
    const bcolor = this.darkMode ? 'black':'white';
    root.style.setProperty('--font-color', fcolor);
    root.style.setProperty('--main-font-color', fcolor);
    root.style.setProperty('--body-color', bcolor);
  }

  //
  // decorate body to inform sidenav in others components
  async onMenu() {
    //this.$emit('click');
    document.body.classList.toggle('menu-open');
  }
}
</script>
