<template>
    <div style="padding:20px;"  v-if="this.MVapi.vapi.data && this.MVapi.vapi.data._id" >
        <div 
        v-for="(vapi ,index ) in MVaried.apis.list"
        :key="vapi._id"
        @contextmenu.prevent="openMenu($event, vapi ,index)"
        style="margin-bottom:20px;" >
                <context-menu
                    class="right-menu"
                    :offset="menuOffset"
                    :visible="vapi.PS_ContextMenu"
                    @clearMenus ="clearContentMenus"
                >
                    <template v-slot:menuItem>
                        <div v-if="vapi['PS_AUXMODE'] == 'UPNOTE'">
                            <li @click="save('REQ',vapi)">保存</li>
                            <li @click="toggerMode('DEFAULT',index)">注解模式</li>
                            <li @click="toggerMode('URNOTE',index)">修改返回值注解</li>
                            <li @click="toggerMode('PMOCK',index)">自动化生成模式</li>
                        </div>
                        <div v-else-if="vapi['PS_AUXMODE'] == 'URNOTE'">
                            <li @click="save('RES',vapi)">保存</li>
                            <li @click="toggerMode('DEFAULT',index)">注解模式</li>
                            <li @click="toggerMode('UPNOTE',index)">修改参数注解</li>
                            <li @click="toggerMode('PMOCK',index)">自动化生成模式</li>
                        </div>
                        <div v-else-if="vapi['PS_AUXMODE'] == 'PMOCK'">
                            <li @click="save('REQ',vapi)">保存</li>
                            <li @click="toggerMode('PNOTE',index)">注解模式</li>
                            <li @click="toggerMode('UPNOTE',index)">修改参数注解</li>
                            <li @click="toggerMode('URNOTE',index)">修改返回值注解</li>
                            <li @click="mockTest(vapi)">查看生成</li>
                            <li @click="loopCreateData(vapi)">自动入库</li>
                        </div>
                        <div v-else>
                            <li @click="toggerMode('UPNOTE',index)">修改参数注解</li>
                            <li @click="toggerMode('URNOTE',index)">修改返回值注解</li>
                            <li @click="toggerMode('PMOCK',index)">自动化生成模式</li>
                        </div>
                        <li @click="remove(vapi)">删除</li>

                    </template>
                </context-menu>
                <div class="text-h4" style="margin-bottom:20px;">
                  {{ MVapi.vapi.data.project.cname }}
                  <q-badge transparent :color="vapi.type=='GET'?'green':'pink'">{{ vapi.type }}</q-badge>
                  <q-badge style="margin-left:5px;" transparent color="primary">域名：{{ MVapi.vapi.data.project.domain + MVapi.vapi.data.name }}</q-badge>
                </div>
                <q-card > 
                    <!-- <q-scroll-area
                        :thumb-style="thumbStyle"
                        :bar-style="barStyle"
                        class="caui-step"
                        > -->
                        <q-card-section>
                            <print-template v-if="vapi['PS_AUXMODE'] == 'UPNOTE'" unote :value="vapi.PS_AUXREQ" key="UPNOTE" ></print-template>
                            <print-template v-else-if="vapi['PS_AUXMODE'] == 'URNOTE'" unote :value="vapi.PS_AUXRES" key="URNOTE"  ></print-template>
                            <print-template v-else-if="vapi['PS_AUXMODE'] == 'PMOCK'" :value="vapi.PS_AUXREQ" mock ></print-template>
                            <div v-else>
                                <q-timeline  color="secondary">
                                    <q-timeline-entry side="left" title="参数注释" subtitle="parame note">
                                        <print-template  :value="vapi.PS_AUXREQ" idata note  ></print-template>
                                    </q-timeline-entry>
                                    <q-timeline-entry side="right" title="返回值注释" subtitle="results note">
                                        <div @click="copy(vapi.PS_AUXRES)">
                                            <print-template  :value="vapi.PS_AUXRES" note  ></print-template>
                                        </div>
                                    </q-timeline-entry>
                                    <q-timeline-entry heading>
                                    </q-timeline-entry>
                                </q-timeline>
                            </div>
                        </q-card-section>
                    <!-- </q-scroll-area> -->
                    
                </q-card>
        </div>
        
        <q-dialog v-model="showMockTextAlert">
          <q-card style="min-width:70vw">
            <q-card-section>
              <div class="text-h6">Mock生成测试数据</div>
            </q-card-section>
            <q-separator />
            <q-card-section style="height:80vh;" class="scroll" >
                <print-template :value="auxMockData" note ></print-template>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>


    </div>
</template>

<script>
import Aux from "../common/auxx";
import ContextMenu from "../components/ContextMenu";
import printTemplate from "../components/printTemplate";
// import { construct } from '@aximario/json-tree';
import Mock from "mockjs";
import Async from 'async';
import { mapState } from 'vuex';
import Bus  from '../components/bus'


export default {
    components: {
        printTemplate,
        ContextMenu,
    },
    props: {},
    computed :{
        ...mapState({
            MVapi : state => state.Vapi,
            MVaried : state => state.Varied,
        }),
        thumbStyle () {
            return {
                right: '4px',
                borderRadius: '5px',
                backgroundColor: '#027be3',
                width: '5px',
                opacity: 0.75
            }
        },

        barStyle () {
            return {
                right: '2px',
                borderRadius: '9px',
                backgroundColor: '#027be3',
                width: '9px',
                opacity: 0.2
            }
        }
    },
    mounted(){
       Bus.$on('tapKey',(item)=>{
           console.log(item)
           if(item.parent){
               var key = parseInt(item.parent.key);
               if(item.parent.type == "Object" && isNaN(key)){
                   this.$copyText(`{{${item.parent.key}.${item.key}}}`)
               }else{
                //    console.log(this.curCopyAux)
                   var mu = Aux.getParentTree(this.curCopyAux);
                   var parent = {}
                   mu.forEach(element => {
                       if(element.id == item.parent.pid){
                           parent = element;
                       }
                   });
                   this.$copyText(`{{${parent.key}.${item.key}}}`)
               }

           }else if(item.type == "ArrayObject"){
               this.$copyText(`v-for="( ${item.key} , index) in ${item.key}s" :key="index"`)
               
           }else{
                this.$copyText(`{{${item.key}}}`)
           }
        })
    },
    data() {
        return {
            showMockTextAlert: false,
            auxMockData :{ },
            curContentMenuIndex : null,
            menuOffset: { clientX: 0,clientY: 0 },
            id : '',
            // vapi : { }
            curCopyAux :{}
        };
    },

    created: function() {
        var { id } = this.$route.query;
        this.id = id;
        this.$store.dispatch('Vapi/getApiById',{ id })
        this.$store.dispatch('Varied/getApis',{ id })
    },
    watch :{
        'MVapi.vapi.loading' :function(loading){
            if(loading){
               this.$q.loading.show({message: '加载中'})
           }else{
               this.$q.loading.hide();
           }
        },
    },
    methods: {
       // 右键菜单打开方法
        openMenu(e ,item,index) {
             this.MVaried.apis.list.map(function(data ){
                data.PS_ContextMenu = false;
            })
            this.menuOffset.clientX = e.pageX;
            this.menuOffset.clientY = e.pageY;
            this.curContentMenuIndex = index;
            this.MVaried.apis.list[index]["PS_ContextMenu"] = true;
        },
        clearContentMenus:function(){
            this.MVaried.apis.list.map(function(data ){
                data.PS_ContextMenu = false;
            })
        },
        save: function(type,vapi) {
            var id = vapi._id;
            var _aux = type == 'REQ' ? vapi.PS_AUXREQ : vapi.PS_AUXRES;
            var json = JSON.stringify(_aux);
            this.$store.dispatch('Varied/save',{ type ,id ,json ,success:function(res){
                console.log(res)
            }})
        },
        remove: function(vapi) {
            var id = vapi._id;
            var that = this;
            that.$store.dispatch('Varied/delete',{ id,success:function(){
                that.$store.dispatch('Varied/getApis',{ id :that.id })
            }})
        },
        // 生成测试数据
        mockTest: function(vapi) {
            var that = this;
            var auxOBJ = vapi.PS_AUXREQ
            var auxJSON = Aux.mock(auxOBJ.list);
            var mockJSON = Mock.mock(auxJSON);
            that.showMockTextAlert = true;
            that.auxMockData = Aux.getParent(mockJSON);
        },
        /**
         * PNOTE 参数注解模式
         * RNOTE 返回值注解模式
         * -------------------
         * PMOCK 参数mock数据模式
         * --------------------
         * UPNOTE 修改参数注解模式
         * URNOTE 修改返回值注解模式
         * -------------------
         * 默认(无|default) 参数返回均显示注解模式
         */
        toggerMode: function(mode,index) {
            this.MVaried.apis.list[index].PS_AUXMODE = mode;
        },
        /**
         * 自动入库
         */
        loopCreateData :function(vapi){
            var that = this;
            var url = this.MVapi.vapi.data.project.domain + this.MVapi.vapi.data.name
            try {
                var mockJSON = Aux.mock(vapi.PS_AUXREQ.list);
                this.$q.dialog({
                    title: '自动入库',
                    message: '请选择入库多少条数据(Int)',
                    prompt: { model: '',type: 'number' },
                    cancel: true,
                    persistent: true
                    }).onOk(data => {
                    if(data){
                        data = Math.ceil(data);
                        that.$store.dispatch('Cmd/send', { color:'text-green' ,content:`开始添加` });
                        Async.timesSeries(data, function(n, callback){
                            var mockReq = Mock.mock(mockJSON);
                            that.$store.dispatch('Vapi/getResponse',{
                                url ,
                                type:vapi.type ,
                                req :JSON.stringify(mockReq),
                                success :function(){
                                    that.$store.dispatch('Cmd/send', { color:'' ,content:`添加${data}条数据 ,当前第${n +1}` });
                                    callback(null,n)
                                },
                                fail :function(){
                                    that.$q.dialog({ title: '错误提示',message: `请求Api：${url} 请求失败 ,第${n +1}条出错`})
                                    callback("错误")
                                }
                            })
                        }, function() {
                            that.$store.dispatch('Cmd/send', { color:'text-red' ,content:`结束添加` });
                        });
                    }
                })
            } catch (error) {
                this.$q.dialog({
                title: '错误提示',
                message: '错误的操作'
                })
            }
        },
        copy :function(au){
            this.curCopyAux = JSON.parse(JSON.stringify(au))
        }
    }
};
</script>

<style>
.api-list-item {
    position: relative;
}

.api-list-item-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 2rem;
    padding-left: 70px;
}

.api-list-item-status {
    position: absolute;
    top: 7px;
    left: 0;
    width: 60px;
}

.api-list-item-text {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.375rem;
}

.pr {
    position: relative;
}

.pa {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
}
  /* .caui-step { height: calc(100vh - 190px); box-sizing: border-box;} */
</style>