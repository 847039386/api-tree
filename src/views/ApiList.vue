<template>
    <div style="padding:20px;">
        
        <q-input style="width:600px;margin:auto; padding-bottom:0;" filled bottom-slots v-model="search" label="search"  >
            <!-- <template v-slot:append>
                <q-btn round dense flat icon="add" />
            </template> -->
        </q-input>
        <div style="padding:20px;min-height:600px;" >
            <div class="row">
                <q-card bordered flat class="bg-grey-1 my-card" @click="toVapiDetail(item._id)"  v-for="(item, index) in MVapi.vapis.list" :key="index">
                    <q-card-section  class="my-card" >
                        <div class="row items-center no-wrap">
                            <div class="col">
                                <div class="text-h6">{{ item.name }}</div>
                                <!-- <div class="text-subtitle2">{{ item.describe }}</div> -->
                            </div>
                        </div>
                    </q-card-section>
                    <q-card-section>{{ item.describe }}</q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn color="red" @click.stop="deleteById(item._id)" >删除</q-btn>
                    </q-card-actions>
                </q-card>
            </div>
        </div>
        <div>
            <div v-if="MVapi.vapis.total > 0" class="q-pa-lg flex flex-center">
                <q-pagination
                v-model="current"
                :max="MVapi.vapis.totalPages"
                :direction-links="true"
                :max-pages="8"
                >
                </q-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import XEUtils from 'xe-utils';

export default {
    computed :{
        ...mapState({
            MVapi : state => state.Vapi,
            MDefaultProject : state => state.Project.defaultProject
        })
    },
    data() {
        return {
            current : 1, // '当前页数'
            search :'',
            project_id :null,
        };
    },

    created: function() {
        var that = this;
        var { pid } = this.$route.query;
        if(pid){
            this.project_id = pid
        }else{
            if(this.MDefaultProject._id){
                this.project_id = this.MDefaultProject._id;
            }
        }
        this.$store.dispatch('Vapi/getApis',{ id :that.project_id })
    },
    watch :{
        'MVapi.vapis.loading' :function(loading){
            if(loading){
               this.$q.loading.show({message: '加载中'})
           }else{
               this.$q.loading.hide();
           }
        },
        'MVapi.delete.loading' :function(loading){
            if(loading){
               this.$q.loading.show({message: '删除中'})
           }else{
               var current = this.current;
               this.$q.loading.hide();
               this.$store.dispatch('Vapi/getApis',{ pageIndex : current })
           }
        },
        current :function(current){
            this.$store.dispatch('Vapi/getApis',{ pageIndex :current })
        },
        search :XEUtils.debounce(function(val) {
            var that = this;
            this.$store.commit('Vapi/setVapisSearch',val)
            this.$store.commit('Vapi/resetApis');
            this.$store.dispatch('Vapi/getApis',{ id :that.project_id ,search :val });
            this.current = 1;
        }, 300)
    },
    methods: {
        toVapiDetail:function(id){
           this.$router.push({
                path: '/vapi/detail',
                query: {
                    id: id
                }
           })
        },
        deleteById :function(id){
            this.$store.dispatch('Vapi/delete',{ id });
        }
    }
};
</script>

<style scoped >
.my-card{
    width: 100%;
    max-width: 350px;
    margin: 10px;
    overflow: hidden;
    cursor: pointer;
}
</style>