<template>
    <div style="padding:20px;">
        
        <q-input style="width:600px;margin:auto;margin-bottom:50px;" filled bottom-slots v-model="search" label="search" counter >
            <!-- <template v-slot:append>
                <q-btn round dense flat icon="add" />
            </template> -->
        </q-input>

        <q-list bordered>
            <div
                v-for="(item ,index ) in MVapi.vapis.list"
                :key="item.index" 
                @contextmenu.prevent="openMenu($event, item ,index)"
            >
                <context-menu
                    class="right-menu"
                    :offset="menuOffset"
                    :visible="item.ContextMenu"
                    @clearMenus ="clearContentMenus"
                >
                    <template v-slot:menuItem>
                        <!-- 参数的自动化模式 -->
                        <div v-if="item['AUX_MODE'] == 'UPNOTE'">
                            <li @click="save('parame',item)">保存</li>
                            <li @click="toggerMode('DEFAULT',index)">注解模式</li>
                            <li @click="toggerMode('URNOTE',index)">修改返回值注解</li>
                            <li @click="toggerMode('PMOCK',index)">自动化生成模式</li>
                        </div>
                        <div v-else-if="item['AUX_MODE'] == 'URNOTE'">
                            <li @click="save('result',item)">保存</li>
                            <li @click="toggerMode('DEFAULT',index)">注解模式</li>
                            <li @click="toggerMode('UPNOTE',index)">修改参数注解</li>
                            <li @click="toggerMode('PMOCK',index)">自动化生成模式</li>
                        </div>
                        <div v-else-if="item['AUX_MODE'] == 'PMOCK'">
                            <li @click="save('parame',item)">保存</li>
                            <li @click="toggerMode('PNOTE',index)">注解模式</li>
                            <li @click="toggerMode('UPNOTE',index)">修改参数注解</li>
                            <li @click="toggerMode('URNOTE',index)">修改返回值注解</li>
                            <li @click="mockTest(item)">查看生成</li>
                            <li @click="loopCreateData(item)">自动入库</li>
                        </div>
                        <div v-else>
                            <li @click="toggerMode('UPNOTE',index)">修改参数注解</li>
                            <li @click="toggerMode('URNOTE',index)">修改返回值注解</li>
                            <li @click="toggerMode('PMOCK',index)">自动化生成模式</li>
                        </div>

                    </template>
                </context-menu>
                <q-expansion-item
                    expand-icon-toggle
                    expand-separator
                    :label="item.name"
                    :caption="item.describe"
                >
                    <q-card>
                        <q-card-section>
                            <print-template v-if="item['AUX_MODE'] == 'UPNOTE'" :value="item.AUXPARAME" key="UPNOTE" ></print-template>
                            <print-template v-else-if="item['AUX_MODE'] == 'URNOTE'" :value="item.AUXRESULT" key="URNOTE"  ></print-template>
                            <print-template v-else-if="item['AUX_MODE'] == 'PMOCK'" :value="item.AUXPARAME" mock ></print-template>
                            <div v-else>
                                <q-timeline  color="secondary">
                                    <q-timeline-entry side="left" title="参数注释" subtitle="parame note">
                                        <print-template  :value="item.AUXPARAME" idata note  ></print-template>
                                    </q-timeline-entry>
                                    <q-timeline-entry side="right" title="返回值注释" subtitle="results note">
                                        <print-template  :value="item.AUXRESULT" note ></print-template>
                                    </q-timeline-entry>
                                    <q-timeline-entry heading>
                                    </q-timeline-entry>
                                </q-timeline>
                            </div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>
            </div>
        </q-list>
        <div class="q-pa-lg flex flex-center">
            <q-pagination
            v-model="current"
            :max="MVapi.vapis.totalPages"
            :direction-links="true"
            :max-pages="8"
            >
            </q-pagination>
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
import Aux from "../common/aux";
import ContextMenu from "./ContextMenu.vue";
import printTemplate from "./printTemplate";
import Mock from "mockjs";
import Async from 'async';
import { mapState } from 'vuex'

export default {
    name: "ApiList",
    components: {
        printTemplate,
        ContextMenu,
    },
    props: {},
    computed :{
        ...mapState({
            MVapi : state => state.Vapi
        })
    },
    data() {
        return {
            test: { },
            showMockTextAlert: false,
            auxMockData :{ },
            curContentMenuIndex : null,
            menuOffset: { clientX: 0,clientY: 0 },
            current : 1, // '当前页数'
            search :'',
        };
    },

    created: function() {
        this.$store.dispatch('Vapi/getApis')
        this.test = this.$q.localStorage.getItem("test");
        console.log(this.MVapi.vapis.list)
    },
    watch :{
        'MVapi.vapis.loading' :function(loading){
            if(loading){
               this.$q.loading.show({message: '加载中'})
           }else{
               this.$q.loading.hide();
           }
        },
        current :function(current){
            this.$store.dispatch('Vapi/getApis',{ pageIndex :current })
        },
        search :function(val){
            this.$store.commit('Vapi/setVapisSearch',val)
            this.$store.commit('Vapi/resetApis');
            this.$store.dispatch('Vapi/getApis');
            this.current = 1;
        }
    },
    methods: {
       // 右键菜单打开方法
        openMenu(e ,item,index) {
            this.MVapi.vapis.list.map(function(data ){
                data.ContextMenu = false;
            })
            this.menuOffset.clientX = e.pageX;
            this.menuOffset.clientY = e.pageY;
            this.curContentMenuIndex = index;
            this.MVapi.vapis.list[index]["ContextMenu"] = true;
        },
        clearContentMenus:function(){
            this.MVapi.vapis.list.map(function(data ){
                data.ContextMenu = false;
            })
        },
        save: function(type ,item) {
            var id = item.id;
            var _aux = type == 'parame' ? item.AUXPARAME : item.AUXRESULT;
            var json = JSON.stringify(_aux);
            this.$store.dispatch('Vapi/updatePR',{ type ,id ,json })
        },
        // 生成测试数据
        mockTest: function(item) {
            var that = this;
            var auxOBJ = item.AUXPARAME
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
        toggerMode: function(mode ,index) {
            this.MVapi.vapis.list[index].AUX_MODE = mode;
        },
        /**
         * 自动入库
         */
        loopCreateData :function(){
            var that = this;
            var mockJSON = Aux.mock(that.test.list);
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
                    setTimeout(function(){
                        var mockTest = Mock.mock(mockJSON);
                        console.log(mockTest)
                        that.$store.dispatch('Cmd/send', { color:'' ,content:`添加${data}条数据 ,当前第${n}` });
                        callback(null, n);
                        
                    },that.delay(n));
                }, function() {
                    that.$store.dispatch('Cmd/send', { color:'text-red' ,content:`结束添加` });
                });
              }
            })
        },delay(n){return (n+12) % 7 *100;}
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
</style>