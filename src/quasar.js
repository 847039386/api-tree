import Vue from 'vue'

import './styles/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'
import { 
  Quasar 
  ,LocalStorage 
  ,Loading
  ,Dialog
  ,Notify 
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: { /* not needed if importStrategy is not 'manual' */ },
  directives: { /* not needed if importStrategy is not 'manual' */ },
  plugins: {
    LocalStorage
    ,Loading
    ,Dialog
    ,Notify 
  }
 })