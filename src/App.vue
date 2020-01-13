<template>
  <q-layout view="hHh lpR lFr">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title>
          <router-link to="/">Quasar App</router-link>
        </q-toolbar-title>

        <q-space />
        <q-space />

        <q-btn-dropdown flat round dense label="添加API" dropdown-icon="change_history">
          <q-list>
             <q-item clickable v-close-popup >
              <q-item-section>
                <q-item-label> <router-link to="/project/list">项目列表</router-link> </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup >
              <q-item-section>
                <q-item-label> <router-link to="/project/create">创建项目</router-link> </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup >
              <q-item-section>
                <q-item-label> <router-link to="/vapi/create">创建API</router-link> </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <aux-add-api :show="addApiShow" @ok="addApiOk" @cancel="addApiCancle"  />

        <!-- <aux-create-project :show="addApiShow" :type="addApiType" @ok="addApiOk" @cancel="addApiCancle"  /> -->
        
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      side="left"
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <router-link to="/project/create">
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>创建项目</q-item-label>
              <q-item-label caption>quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
        </router-link>
        <router-link to="/vapi/create">
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>创建API</q-item-label>
              <q-item-label caption>quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
        </router-link>
        <router-link to="/project/list">
          <q-item clickable >
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>项目列表</q-item-label>
              <q-item-label caption>quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
        </router-link>
        <router-link to="/vapi/list">
          <q-item clickable >
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>API列表</q-item-label>
              <q-item-label caption>quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
        </router-link>
      </q-list>
    </q-drawer>
    <q-page-container>
      <!-- {{ $store.state.loading }}
      <div v-if="$store.state.loading">加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中加载中</div> -->
      <router-view/>
    </q-page-container>
    <com-component />
  </q-layout>
</template>

<script>
import auxAddApi from './components/addApi';
import comComponent from './components/cmd';
import { mapState } from 'vuex'
export default {
  name: 'LayoutDefault',
  components :{ auxAddApi ,comComponent },
  data () {
    return {
      leftDrawerOpen: false,
      addApiShow :false,
    }
  },
  computed :{
    ...mapState({ store : state => state })
  },
  created(){
      var currentProject = this.$q.localStorage.getItem("currentProject")
      if(currentProject){
        this.$store.commit("Project/setDefault",currentProject);
      }
  },
  methods :{
    addApiCancle :function(){
      this.addApiShow = false;
    },
    addApiOk :function(result){
      if(result.success){
        this.addApiShow = false;
        this.$q.localStorage.set('aux-create',result);
        this.$router.push('/vapi/create');
      }
    }
  }
}
</script>

<style>
blockquote {
    padding: 8px 16px;
    margin: 0;
    font-size: 16px;
    border-left: 4px solid #027be3;
}
a { text-decoration: none; color: initial; }
</style>