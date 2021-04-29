import Vue from 'vue'
import Component from 'vue-class-component'

import { t } from "../services/i18n";

// You can declare mixins as the same style as components.
@Component
export class Translatable extends Vue {
    t(obj){
        return t(obj);
    }
}
