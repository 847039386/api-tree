import Vue from 'vue'
import VueResource from 'vue-resource';
import VueClipboard from 'vue-clipboard2'
import vSelectMenu from 'v-selectmenu';
// import vSelectPage from 'v-selectpage';
// import vSuggest from 'v-suggest';

import 'xe-utils'
import VXETable from 'vxe-table'

import App from './App.vue'
import router from './router'
import store from './store';
import './quasar';

// import './mock'

VueClipboard.config.autoSetContainer = true // add this line

Vue.use(VueResource);
Vue.use(VXETable);
Vue.use(VueClipboard)
Vue.use(vSelectMenu, { });
// Vue.use(vSelectPage, {  });
// Vue.use(vSuggest);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
