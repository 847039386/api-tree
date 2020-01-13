import Vue from 'vue'
import Vuex from 'vuex'
import Cmd from './modules/Cmd';
import Vapi from './modules/Vapi';
import Project from './modules/Project';
import Varied from './modules/Varied';

Vue.use(Vuex);

export default new Vuex.Store({
  state : {
    loading : false,
    source :  {
          token: null,
          cancel: null
    }
  },
  modules: {
    Cmd,
    Vapi,
    Project,
    Varied
  }
})