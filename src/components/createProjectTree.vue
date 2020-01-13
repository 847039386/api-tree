<template>
    <div style="width:700px;">
        <q-card  style="width:700px;">
            <q-card-section>
                <div style="margin-bottom:10px;">

                </div>
            </q-card-section>

            <q-card-section>
                <div class="row mb" >
                    <div class="col-2 ipt-m">添加：</div>
                    <div class="col ">
                        <q-select filled v-model="mode" :options="modeMenu" />
                    </div>
                </div>
                <div v-if="mode=='project'">
                    <div class="row mb" >
                        <div class="col-2 ipt-m">中文名：</div>
                        <div class="col ">
                            <q-input filled v-model="project.cname" />
                        </div>
                    </div>
                    <div class="row mb" >
                        <div class="col-2 ipt-m">英文名：</div>
                        <div class="col ">
                            <q-input filled v-model="project.name" />
                        </div>
                    </div>
                </div>
                <div v-else-if="mode=='page'">
                    <div class="row mb" >
                        <div class="col-2 ipt-m">中文名：</div>
                        <div class="col ">
                            <q-input filled v-model="page.cname" />
                        </div>
                    </div>
                    <div class="row mb" >
                        <div class="col-2 ipt-m">英文名：</div>
                        <div class="col ">
                            <q-input filled v-model="page.name" />
                        </div>
                    </div>
                </div>
                <div v-else-if="mode=='api'">
                    <div class="row mb" >
                        <div class="col-2 ipt-m"></div>
                        <div class="col">
                            <div class="row">
                                <div class="col"><q-btn @click="saveApi" color="primary" label="添加" /></div>
                                <div class="col" style="line-height:36px;">当前API：{{ selectedItems.length}}条</div>
                            </div>
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="right" >
                <q-btn color="primary" @click="onOk" label=" 保存 " />
                <q-btn label=" 取消 " @click="onCancel" />
            </q-card-actions>
        </q-card>
        <q-dialog  v-model="alertSelectedApi"  >
            <q-card style="width: 700px; max-width: 80vw;">
                <transfer-api :id="projectid"  :selectedItems="selectedItems" ></transfer-api>   <!-- @selected="saveApis" -->
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import transferApi from '../components/transferApi';
export default {
    components :{ transferApi },
    data() {
        return {
            alertSelectedApi :false,
            mode :'page',
            modeMenu :["project","page","api"],
            // view
            project : {
                name :'',
                cname :''
            },
            // page 
            page :{
                name :'',
                cname :''
            },
            api :{
                selectedItems :[]
            },
        }
    },
    props :{
        selectedItems :{
            type :Array,
            default :function(){
                return [];
            }
        },
        projectid :{
            type :String
        }
    },
    methods :{
        saveApi :function(){
            this.alertSelectedApi = true;
        },
        onOk :function(){
            var that = this;
            var result = [];
            if(that.mode == 'project'){
                result.push({ name :that.project.name ,cname :that.project.cname ,value :that.project.cname + '  ' + that.project.name ,TREE_TYPE:'PROJECT'  })
            }else if(that.mode == 'page'){
                result.push({ name :that.page.name ,cname :that.page.cname ,value :that.page.cname + '  ' + that.page.name ,TREE_TYPE :'PAGE' })
            }else {
                that.selectedItems.forEach(element => {
                    result.push({ name :element.api ,cname :element.describe ,api_id :element.api_id , value :element.api +'  ' +element.describe ,TREE_TYPE :'API' });
                })
            }
            this.$emit('onOk',result,that.mode);
        },
        onCancel :function(){
            this.$emit('onCancel')
        }
    }, 
}
</script>
<style scope>
    .ipt-m { text-align: right; line-height: 56px; padding-right: 10px; }
    .mb { margin-bottom: 5px;}
</style>