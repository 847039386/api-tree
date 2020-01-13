<template>
    <div>
        <template>
            <div v-if="project._id">
                <q-splitter
                :value="5"
                style="height: 90vh"
                >

                <template v-slot:before>
                    <q-tabs
                    v-model="tab"
                    vertical
                    class="text-teal"
                    >
                    <q-tab name="table" icon="apps" label="表格" />
                    <q-tab name="tree" icon="format_size" label="树" />
                    </q-tabs>
                </template>

                <template v-slot:after>
                    <q-tab-panels v-model="tab" animated transition-prev="jump-up"  transition-next="jump-up">
                    <q-tab-panel name="table">
                        <div style=" padding:20px 0;">
                            <div style="margin-bottom:10px;">
                                <div style="margin-right:10px; display: inline-block;">{{ project.cname }}</div>
                                <vxe-input class="vxe-input-32" v-model="filterName" placeholder="查询" @keyup="searchEvent"></vxe-input>
                                <vxe-button type="primary" style="margin-left:10px;" @click="saveTree">保存</vxe-button>
                                <vxe-button style="margin-left:10px;" @click="showDetailEvent()">新增</vxe-button>
                                <vxe-button style="margin-left:10px;" @click="$refs.xTree.setAllTreeExpansion(true)">展开所有</vxe-button>
                                <vxe-button style="margin-left:10px;" @click="$refs.xTree.clearTreeExpand()">关闭所有</vxe-button>
                            </div>

                            <vxe-table
                                resizable
                                tree-config
                                ref="xTree"
                                :data="tableData"
                                >
                                <vxe-table-column title="类型" tree-node>
                                    <template v-slot="{ row, seq }">
                                        <span v-if="row.TREE_TYPE =='MAIN'">主项目</span>
                                        <span v-else-if="row.TREE_TYPE =='PROJECT'">项目</span>
                                        <span v-else-if="row.TREE_TYPE =='PAGE'">页面</span>
                                        <span v-else-if="row.TREE_TYPE =='API'">API</span>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="name" title="名称"></vxe-table-column>
                                <vxe-table-column field="cname" title="备注" ></vxe-table-column>
                                <vxe-table-column title="操作">
                                    <template v-slot="{ row, seq }">
                                        <vxe-button v-if="row.TREE_TYPE != 'API'"  @click="showDetailEvent(row)">添加</vxe-button>
                                        <vxe-button v-if="row.TREE_TYPE != 'MAIN'"  @click="deleteDetailEvent(row)">删除</vxe-button>
                                        <vxe-button v-if="row.TREE_TYPE == 'PROJECT'" type="primary" icon="vxe-icon--zoomout"  @click="selectSource(row.pid,row.name)">复制路径</vxe-button>
                                    </template>
                                </vxe-table-column>
                            </vxe-table>
                        </div>
                    </q-tab-panel>

                    <q-tab-panel name="tree">
                        <tree class="tree" :data="treeData" type="tree" :identifier="getId" node-text="value" zoomable layoutType="horizontal"></tree>
                    </q-tab-panel>
                    
                    </q-tab-panels>
                </template>

                </q-splitter>
            </div>
        </template>
        
        <q-dialog persistent v-model="showDialog" >
            <q-card style="width: 700px; max-width: 80vw;">
                <div><create-project-tree :projectid="this.project_id" :selectedItems="selectedItems" @onOk="onOk" @onCancel="onCancel" ></create-project-tree></div>
            </q-card>
        </q-dialog>
    </div>
</template>


<script>
import { mapState } from 'vuex';
import {tree} from 'vued3tree';
import 'vxe-table/lib/index.css';
import createProjectTree from '../components/createProjectTree';
import { construct } from '@aximario/json-tree';
import XEUtils from 'xe-utils';

export default {
    components :{ createProjectTree ,tree  },
    data() {
        return {
            tab: 'table',
            showDialog : false,
            cur_row :{ },
            selectedItems :[],
            filterName :'',

            MenuData :[],
            tableData :[],
            treeData : { },

            originData :[],

            project_id : ''
        }

    },
    watch :{
        MenuData :{
            handler :function(val){
                // 主项目不显示在table中
                var UO_MenuData = XEUtils.clone(val ,true);
                UO_MenuData.splice(0,1) 
                var cst = construct(UO_MenuData,{ id:'id' ,pid:'pid' ,children :'children' });
                this.tableData = XEUtils.clone(cst ,true);
                this.originData = XEUtils.clone(cst ,true);
                this.treeData = construct(XEUtils.clone(val ,true),{ id:'id' ,pid:'pid' ,children :'children' })[0];
            },
        },
        "project.tree" :{
            handler :function(val){ 
                var that = this;
                try {
                    if(val){
                        that.MenuData = JSON.parse(val);
                    }else{
                        throw new Error();
                    }
                } catch (error) {
                    that.MenuData = [{ id : 1 ,pid :0 , TREE_TYPE :'MAIN' , name :that.project.name ,cname :that.project.cname ,value :that.project.cname }];
                }
            },
            immediate :true
        }
    },
    computed: {
        ...mapState({ project : state => state.Project.project.data }),
        menuLenI :function(){
            return parseInt(this.MenuData[this.MenuData.length - 1].id);
        }

    },
    created (){
        var { id } = this.$route.query;
        var that = this;
        that.project_id = id;
        that.$store.dispatch('Project/getProjectById',{ id } );
       
    },
    methods :{
        getId (node) {
            return node.id
        },
        showDetailEvent :function(row){
            var that = this;
            row = row || { }
            row.id = row.id || 1;
            that.cur_row = row;
            that.$refs.xTree.setAllTreeExpansion( true);
            that.showDialog = true;
            var filterArr = that.MenuData.filter(function(item){
                return item.pid == row.id && item.TREE_TYPE == 'API'
            });
            filterArr.map(function(item){
                item["api"] = item.name;
                item["name"] = item.name +'   ' + item.cname;
                item["describe"] = item.cname;
            })
            this.selectedItems = filterArr;
        },
        deleteDetailEvent:function(row){
            var id = row.id;
            var filterArr = this.MenuData.filter(function(item){
                return item.id != id && item.pid != id;
            })
            this.MenuData = filterArr;
        },
        onOk :function(result,mode){
            var that = this;
            if(mode == 'api'){
                var parentID = this.cur_row.id;
                var filterArr = this.MenuData.filter(function(item){
                    return !(item.pid == parentID && item.TREE_TYPE == 'API')
                })
                that.MenuData = filterArr;
            }
            if(result){
                result.forEach(function(item){
                    var newID = that.menuLenI + 1;
                    var data = Object.assign(item,{ id :newID ,pid : that.cur_row.id });
                    that.MenuData.push(data)
                })
            }
            this.showDialog = false;
            this.$nextTick(() => {
                this.$refs.xTree.setAllTreeExpansion(true)
            })
        },
        onCancel:function(){
            this.showDialog = false;
        },
        handleSearch () {
            let filterName = XEUtils.toString(this.filterName).trim()
            if (filterName) {
                let options = { children: 'children' }
                let searchProps = ['cname','name']
                this.tableData = XEUtils.searchTree(this.originData, item => searchProps.some(key => XEUtils.toString(item[key]).indexOf(filterName) > -1), options)
                // 搜索之后默认展开所有子节点
                this.$nextTick(() => {
                    this.$refs.xTree.setAllTreeExpansion(true)
                })
            } else {
                this.tableData = this.originData
            }
        },
        searchEvent: XEUtils.debounce(function () {
            this.handleSearch()
        }, 500, { leading: false, trailing: true }),
        selectSource :function(pid ,name ,result){
            result = result || [name];
            var that = this;
            var MenuData = this.MenuData;
            var filterArr = MenuData.filter(function(item){
                return item.id == pid
            })
            if(filterArr.length > 0){
                result.push(filterArr[0].name);
                this.selectSource(filterArr[0].pid,name,result)
            }else{
                var wurl = '\\' + result.reverse().join('\\');
                var murl = that.project.furl + wurl
                 this.$copyText(murl)
            }
            return result;
        },
        saveTree :function(){
            var id = this.project_id;
            var tree = JSON.stringify(this.MenuData)
            this.$store.dispatch('Project/saveTree',{ result :{ id , tree} });
            this.$store.dispatch('Project/getProjectById',{ id } );
        }

    }
}
</script>

<style >
    .vxe-input-32 .vxe-input { height:32px;line-height:32px ;  }
    .tree {height: 800px;}
</style>