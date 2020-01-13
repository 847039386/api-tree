<template>
    <div class="v-component-print-template" >
            <div v-if="!mock">
                <div v-for="(item ,idx) in list" :key="idx" class="boxx">
                    <span ref="key" class="key" @click="tapKey(item)" >{{ item.key }}：</span>
                    <div v-if="item.children" >
                        <v-print-template @tapKey="tapKey(item)" :value="item.children" :note="note" :aone="aone" :udata="udata" :idata="idata" :mock="mock" :unote="unote" :odata="odata" ></v-print-template> 
                    </div>
                    <span v-else class="value ml5" >
                        <span v-if="item.type =='Array'">
                            <span v-if="udata">
                                <span v-if="item.data.length > 0">
                                    <span>[</span>
                                    <br />
                                    <span v-for="(it ,i) in item.data" :key="i">
                                        <div v-if="udata" class="aux-input mb5" >
                                            <input class="input-control" v-model="item.data[i]" placeholder="值" type="text">
                                        </div>
                                        <span v-else>{{it}}</span>
                                        <br />
                                    </span>
                                    <span>]</span> 
                                </span>
                                <span v-else>[ ]</span>
                            </span>
                            <div class="aux-input ml5" v-if="unote"><input class="input-control" v-model="item.note" placeholder="注解" type="text"></div>
                            <span v-if="idata && !overflow" >
                                <span v-if="item.data.length > 0" :style="getDataStatusStyle(item.data_status)">
                                    <span>[</span>
                                    <br />
                                    <span  style="text-indent:20px;display:block; height:20px;line-height:20px;" v-for="(it ,i) in item.data" :key="i">
                                        <span>{{it}}</span>
                                        <br />
                                    </span>
                                    <span>]</span> 
                                </span>
                                <span v-else>[ ]</span>
                            </span>
                            <span class="ml5" :class="overflow ? 'aux-overflow' :''"  v-else >
                                [ Array ...... ]
                            </span>
                            <!-- data选择 -->
                            <div v-if="odata" class="ml10 text-blue-grey"><q-option-group v-model="item.data_status"  :options="data_status" color="primary" inline  dense /></div>
                            <!-- data选择end -->
                            
                            <span class="aux-note ml10" v-if="note"><span class="a-overflow" >// {{ item.note }}</span></span>
                        </span>
                        <span v-else>
                            <span class="inlineBlock" v-if="udata">
                                <div class="aux-input ml5" ><input class="input-control" v-model="item.data" placeholder="值" type="text"></div>
                            </span>
                            <div class="aux-input ml5" v-if="unote"><input class="input-control" v-model="item.note" placeholder="注解" type="text"></div>
                            <span v-if="idata" class="ml5">
                                <span class="auxdata"  :class="overflow ? 'aux-overflow' :''"  :style="getDataStatusStyle(item.data_status)" >{{ item.data }}</span>
                            </span>
                            <!-- data选择 -->
                            <div  v-if="odata" class="ml10 text-blue-grey"><q-option-group v-model="item.data_status"  :options="data_status" color="primary" inline  dense /></div>
                            <!-- data选择end -->
                            <span class="aux-note ml10" v-if="note">
                                <span class="a-overflow" v-if="item.note">// {{ item.note }}</span>
                            </span>
                        </span>
                    </span>
                </div>
            </div>
            <!-- mock 自动化数据 -->
            <div v-else>
                <div v-for="(item ,idx) in list" :key="idx" class="boxx">
                    <span ref="key" class="key" >{{ item.key }}：</span>
                    <div v-if="item.children" >
                        <v-print-template :value="item.children" :note="note" :aone="aone" :udata="udata" :idata="idata" :mock="mock" :unote="unote" :odata="odata" > </v-print-template> 
                    </div>
                    <div v-else class="value" style="width:700px;" >
                        <div class="ml10 mb10 text-blue-grey"><q-option-group v-model="item.mock_mode"  :options="mock_mode" color="primary" inline  dense /></div>
                        <div class="ml10 mb10 mock_defaultmenu">
                            <v-selectmenu v-if="item.mock_mode=='default'" style="width:200px;" :data="getMockMenu()" title="随机数据" :width="500" key-field="mock" show-field="title"  v-model="item.mock_random">
                                <template #row="{ row }">
                                    <span>
                                        <span class="text-green" style="font-weight:bold;" v-html="row.title"></span><span style="margin:0 10px;" class="inlineBlock">-</span>
                                        <span class="text-grey ">例：</span><span class="text-grey" v-html="row.desc"></span>
                                    </span>
                                </template>
                            </v-selectmenu>
                            <div class="aux-input ml5" v-else>
                                <input class="input-control" style="width:150px;" v-model="item.mock_rule" placeholder="规则" type="text">
                                <input class="input-control" style="width:150px;" v-model="item.mock_value" placeholder="值" type="text">
                                <div class="mt10">
                                    <div style="color:#D32F2F;"><span class="text-blue-grey">规则：</span>{{item.mock_rule || '无'}}</div> 
                                    <div><span class="text-blue-grey">```值：</span>{{item.mock_value || '无'}}</div> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
    import Bus  from './bus'
    import Aux from '../common/auxx'
    import VPrintTemplate from './printTemplate'
    export default {
        name :'VPrintTemplate',
        components :{ VPrintTemplate },
        props :{
            // 解析的JOSN值
            value :{
                type: [Object, Array],
            },
            // 是否显示注解
            note :{
                type :[Boolean],
                default :false
            },
            // 是否可以修改注解
            unote :{
                type :[Boolean],
                default :false
            },
            // 每是数组的子集是否只显示一条数据
            aone :{
                type :[Boolean],
                default :false
            },
            // 是否可以修改data ,(这里的data 是键值中的值); 
            udata :{
                type :[Boolean],
                default :false
            },
            // 是否显示data
            idata :{
                type :[Boolean],
                default :true
            },
            // 是否修改data可选项
            odata :{
                type :[Boolean],
                default :false
            },
            // 自动化数据 
            mock :{
                type :[Boolean],
                default :false
            },
            // 超出部分隐藏
            overflow :{
                type:[Boolean],
                default :true
            }
        },
        data() {
            return {
                list :[],
                parent :{},
                mock_mode :[
                    {label: '普通模式',value: 'default'},
                    {label: '高级模式',value: 'high'},
                ],
                data_status :[
                    { label :'必填' ,value :'default' },
                    { label :'选填' ,value :'optional' },
                    { label :'不填' ,value :'not' }
                ]
            }
        },
        created(){
            this.list = this.value.list || [];
            this.parent = this.value.parent;
            if(this.aone){
                this.list = Aux.aone(this.list);
            }
        },
        methods :{
            getMockMenu :function(){
                return Aux.mockRandom();
            },
            getDataStatusStyle :function(state){
                var dataStyle = { };
                switch(state){
                    case 'optional' :
                            dataStyle = {
                                color : '#027BE3',
                            }
                        break;
                    case 'not' :
                            dataStyle = {
                                color : '#9e9e9e',
                                textDecoration :'line-through'
                            }
                        break;
                    default :
                            dataStyle = {
                                color : '#0b7500',
                            }
                        break;
                }
                return dataStyle;
            },
            tapKey :function(item){
                Bus.$emit('tapKey',JSON.parse(JSON.stringify(item)))
            },
            
        }

    }
</script>

<style>
    .v-component-print-template{ text-align: left; border-left: 1px dashed #ccc; overflow: hidden;  }
    .v-component-print-template .boxx{overflow: hidden;  border-bottom: 1px dashed #ccc; overflow: hidden; padding: 5px; min-height: 34px;}
    .v-component-print-template .key { color: #D32F2F; min-width: 100px; float: left; display: block;text-align: center; min-height: 34px; line-height: 34px; text-align: right; }
    .v-component-print-template .value { color: #0b7500; display: block; float: left;min-height: 34px; line-height: 34px; }
    .v-component-print-template .block { display: block; }
    .v-component-print-template .auxdata {min-width: 50px; display: inline-block;}
    .v-component-print-template .inlineBlock {display: inline-block;  }
    .v-component-print-template .aux-note { color: darkgrey; display: inline-block;cursor: pointer;}
    .v-component-print-template .ml10{ margin-left: 10px; }
    .v-component-print-template .ml10{ margin-bottom: 10px; }
    .v-component-print-template .mt10{ margin-top: 10px; }
    .v-component-print-template .ml5 { margin-left: 5px; }
    .v-component-print-template .mb5 { margin-bottom: 5px; }
    .v-component-print-template .mock_defaultmenu .sm-default-btn{ width: 200px; }
    .v-selectmenu ul.sm-results>li{max-width: 100%;}
    .v-component-print-template .aux-input{ display: inline-block; position: relative; overflow: hidden;  }
    .v-component-print-template .aux-input .input-control{ outline: none; background-color: #fff;border: 1px solid #e2e2e2;height: 34px;line-height: 100%;padding: 0 10px; width: 300px;overflow: hidden; color: #666;font-size: 14px;transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out 0s; }
    .v-component-print-template .input-control:focus { border-color: #f60;color: #333;box-shadow: 2px 2px 5px #ebeaea;}
    .v-component-print-template .optional { text-decoration: line-through;}
    .v-component-print-template .aux-overflow { overflow: hidden; width: 200px; text-overflow:ellipsis;height: 34px; display: inline-block; }
     .v-component-print-template .a-overflow { overflow: hidden; display: inline-block;   }

</style>