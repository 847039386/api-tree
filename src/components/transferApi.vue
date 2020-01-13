<template>
    <div style="width:700px;">
        <q-card  style="width:700px;">
            <q-card-section>
                <div style="margin-bottom:10px;">
                    <q-input filled v-model="search" label="查询api" />
                </div>
            </q-card-section>

            <q-card-section>
                 <div class="row" >
                    <div class="col ">
                        <div class="transfer">
                            <div class="transfer-header">
                                <div class="left">{{ tDatas.length }}个</div>
                                <div class="right">全部</div>
                            </div>
                            <div class="transfer-body" >
                                <div v-if="loading">
                                    <div class="transfer-loading">加载中...</div>
                                </div>
                                <div v-else>
                                    <div @click="addItem(index)" class="transfer-item" v-for="(item, index) in tDatas" :key="index">
                                        <div class="title">{{ item.name }}</div>
                                        <div class="desc">{{ item.describe }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-1"></div>
                    <div class="col ">
                        <div class="transfer">
                            <div class="transfer-header">
                                <div class="left">{{ selectedItems.length }}个</div>
                                <div class="right">选中值</div>
                            </div>
                            <div>
                                <div class="transfer-body" >
                                    <div @click="removeItem(index)" class="transfer-item" v-for="(item, index) in selectedItems" :key="index">
                                        <div class="title">{{ item.name }}</div>
                                        <div class="desc">{{ item.describe }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </q-card-section>
            <!-- <q-card-actions align="right" class="text-primary">
                <q-btn color="primary" label="添加API" @click="getSelectedApis()" />
                <q-btn label="取消" @click="getSelectedApis('canle')" />
            </q-card-actions> -->
        </q-card>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import XEUtils from 'xe-utils';
export default {
    data() {
        return {
           tDatas : [],
           search :'',
           loading :false
        }
    },
    props : {
        id : {
            type :[String ,Number],
            default :''
        },
        selectedItems :{
            type:Array,
            default :function(){
                return []
            }
        }
    },
    computed: {
        ...mapState({ MProject : state => state.Project })
    },

    created :function(){
        // this.searchApis('')
        // console.log(this.MProject)
        // console.log(this.selectedItems)
    },
    watch :{
        "MProject.apis.loading" :function(loading){
            this.loading = loading;
        },
        search :XEUtils.debounce(function(val) {
             this.searchApis(val)
        }, 300)
    },
    methods :{
        addItem :function(index) {
            try {
                if(!this.loading){
                    this.selectedItems.push(this.tDatas[index]);
                    this.tDatas.splice(index,1)
                }
            } catch (error) {
                console.log(error)
            }
        },
        removeItem :function(index){
            if(!this.loading){
                this.tDatas.push(this.selectedItems[index]);
                this.selectedItems.splice(index,1);
            }
        },
        filterDataSource :function(dataSource){
            var newArr = [];
            for(var i=0;i<dataSource.length;i++){
                var isRepeat = false;
                for(var j=0;j<this.selectedItems.length;j++){
                    if(dataSource[i].api_id == this.selectedItems[j].api_id){
                        isRepeat = true;
                    }
                }
                if(!isRepeat){
                    newArr.push(dataSource[i])
                }
            }
            return newArr;
        },
        searchApis :function(search){
            var that = this;
            var id = this.id
            this.$store.dispatch('Project/getApis',{ id ,search ,success:function(res){
                var apis = res.data.data.list.map(function(item){
                    var newItem = { }
                    newItem["TREE_TYPE"] = "API";
                    newItem["api_id"] = item._id;
                    newItem["api"] = item.name;
                    newItem["name"] = item.name +'   ' + item.describe;
                    newItem["describe"] = item.describe;
                    return newItem;
                });
                that.tDatas = that.filterDataSource(apis);
            }});
        },
        getSelectedApis : function(canle){
            if(canle){
                this.$emit('selected',null)
            }else{
                this.$emit('selected',this.selectedItems)
            }
            
        }
    }
}
</script>
<style scoped>
.transfer { position: relative; vertical-align: middle;border: 1px solid #d9d9d9;border-radius: 4px;overflow: hidden;}
.transfer .transfer-header{ padding: 0 12px 0;border-bottom: 1px solid #e8e8e8;border-radius: 4px 4px 0 0;position: relative; height: 45px; line-height: 45px; overflow: hidden;}
.transfer .transfer-header .left{ float: left;}
.transfer .transfer-header .right{ float: right;}
.transfer .transfer-body{ height: 450px; overflow-y: scroll; }
.transfer .transfer-item  { overflow: hidden;  padding: 10px; cursor: pointer; }
.transfer .transfer-item:hover { background-color: #e6f7ff; }
.transfer .transfer-item  .title{ overflow: hidden; height: 25px;white-space:nowrap; text-overflow:ellipsis; color: #333; }
.transfer .transfer-item  .desc{ overflow: hidden; height: 20px; line-height: 20px; white-space:nowrap; text-overflow:ellipsis; color: #9e9e9e;}
.transfer .transfer-loading{ margin: 10px; text-align: center; }
</style>