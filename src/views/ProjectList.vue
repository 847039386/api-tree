<template>
    <div style="">
        <div style="padding:20px;min-height:750px;" >
            <div class="row">
                <q-card bordered flat :dark="MProject.defaultProject._id+''==item._id+''" class="my-card" v-for="(item, index) in MProject.projects.list" :key="index">
                    <q-card-section   >
                        <div class="text-h6">{{ item.cname }}</div>
                        <div class="text-h6">{{ item.name }}</div>
                        <div class="text-subtitle2">{{ item.domain }}</div>
                    </q-card-section>
                    <q-separator :dark="MProject.defaultProject._id+''==item._id+''"  />
                    <q-card-actions align="right">
                        <q-btn v-if="MProject.defaultProject._id+''!=item._id+''" @click="settingDefault(item)" color="blue">设置</q-btn>
                        <q-btn v-else color="blue">已设置</q-btn>
                        <q-btn @click="toAPI(item._id)" color="blue-grey">Api</q-btn>
                        <q-btn @click="toProjectTree(item._id)"  color="green">关系</q-btn>
                        <q-btn @click="toUpdate(item)" color="brown">修改</q-btn>
                        <q-btn color="red" @click="deleteById(item._id)" >删除</q-btn>
                    </q-card-actions>
                </q-card>
            </div>
        </div>
        <div>
            <div v-if="MProject.projects.total > 0 " class="q-pa-lg flex flex-center">
                <q-pagination
                v-model="current"
                :max="MProject.projects.totalPages"
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
export default {
    computed :{
        ...mapState({ MProject : state => state.Project })
    },
    data() {
        return {
            current : 1,
        }
    },
    created(){
        this.$store.dispatch('Project/getProjects');
    },
    watch :{
        "MProject.projects.loading" :function(loading ){
           if(loading){
               this.$q.loading.show({message: '加载中' })
           }else{
               this.$q.loading.hide();
           }
        },
        "MProject.delete.loading" :function(loading){
           if(loading){
               this.$q.loading.show({message: '删除中'})
           }else{
               var that = this;
               this.$q.loading.hide();
               that.$store.dispatch('Project/getProjects',{ pageIndex : that.current })
           }
        },
        current :function(current){
            this.$store.dispatch('Project/getProjects',{ pageIndex :current })
        }
    },
    
    methods :{
        settingDefault :function(project){
            this.$q.localStorage.set("currentProject",project);
            this.$store.commit('Project/setDefault',project)
        },
        deleteById :function(id){
            var that =this;
            if(this.MProject.defaultProject._id == id){
                this.$q.localStorage.set("currentProject",{});
                this.$store.commit('Project/setDefault',{});
            }
            that.$store.dispatch('Project/delete',{ id });
        },
        toProjectTree :function(id){
            this.$router.push({
                path: '/project/tree',
                query: {
                    id: id
                }
           })
        },
        toAPI :function(id){
            this.$router.push({
                path: '/vapi/list',
                query: {
                    pid: id
                }
           })
        },
        toUpdate :function(item){
            this.$router.push({
                name: 'createProject',
                params: item
           })
        },
        
    }
}
</script>

<style scoped >
    .my-card{
        width: 100%;
        max-width: 350px;
        margin: 10px;
    }
</style>