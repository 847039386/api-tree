<template>
        <div style="width:700px;padding:20px; margin:auto; box-sizing: border-box; max-width:100%;">
            <div>
                <div class="text-h6">{{ title }}</div>
            </div>
            <div>
                <q-input v-model="projectCName" filled label="中文名" style="margin-top:15px;max-width:100%;"  />
                <q-input v-model="projectName" filled label="英文名" style="margin-top:15px;max-width:100%;"  />
                <q-input v-model="projectDomain" filled label="域名" style="margin-top:15px;max-width:100%;"  />
                <q-input v-model="projectFUrl" filled label="文件地址" style="margin-top:15px;max-width:100%;"  />
            </div>
            <div style="margin-top:10px;">
                <q-btn @click="sumbit"  label="保存" color="primary"  />
            </div>
        </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            title :'添加项目',
            id :'',
            projectName : '',
            projectDomain :'',
            projectCName :'',
            projectFUrl : ''
        }
    },
    computed:{
        ...mapState({ 
            MProject : state => state.Project
        })
    },
    watch :{
        // "MProject.save.loading" :function(loading){
        //    if(loading){
        //        this.$q.loading.show({message: '保存中'})
        //    }else{
        //        this.$q.loading.hide();
        //    }
        // }
    },
    created :function(){
        var { _id , cname ,name ,domain ,furl } = this.$route.params;
        if(_id){
            this.title = "修改项目"
            this.id = _id;
            this.projectName = name;
            this.projectCName = cname;
            this.projectFUrl = furl;
            this.projectDomain = domain;
        }        
    },
    methods :{
        sumbit :function(){
            var that = this;
            var { projectName ,projectDomain ,projectCName ,projectFUrl } = this;
            if(projectName && projectDomain && projectCName){
                that.$store.dispatch('Project/save', { 
                    params :{
                        id : that.id,
                        name : projectName,
                        domain :projectDomain,
                        cname :projectCName,
                        furl : projectFUrl
                    },
                    success:function(){
                        that.$store.dispatch('Cmd/send', {content:`创建项目：${projectName} 成功` ,color:'text-green' })
                        that.$q.notify({
                            position :'top-right',
                            icon :'ion-add',
                            message:'保存成功',
                            timeout:2000,
                            closeBtn :'关闭'
                        })
                        that.$router.push('/')
                    },
                    fail :function(message){
                        that.$q.notify(message)
                    }
                })
            }else{
                that.$q.notify({
                    position :'top',
                    icon :'ion-add',
                    message:'所有字段均为必填项',
                    timeout:2000,
                    closeBtn :'关闭'
                })
            }
            console.log('提交了')
        }

    }
}
</script>

<style >

</style>