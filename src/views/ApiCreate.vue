<template>
  <div class="q-pa-md">
    <!-- <q-btn label="Reset" push color="white" text-color="primary" @click="step = 1" class="q-mb-md" /> -->
    <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated>
       <q-step :name="1" title="填写API" icon="settings" :done="step > 1" :header-nav="step > 1">
       <div class="caui-step scroll">
           <div>
           </div>
           <div style="width:1000px; margin:20px auto;max-width:100%;">
                <div class="text-h4" style="margin-bottom:20px;">
                  {{ MProject.defaultProject.cname || '无' }}
                  <q-badge transparent color="primary">
                    域名：{{ MProject.defaultProject.domain || '无' }}
                  </q-badge>
                </div>
                <q-select filled v-model="apiType" :options="apiTypeOptions" label="请求类型" />
                <q-radio v-model="mode" val="default" label="普通模式" />
                <q-radio v-model="mode" val="high" label="高级模式" />
                <div v-if="mode == 'default'">
                    <q-input v-model="mainUrl" filled label="填写URL" style="margin-top:5px;"  />
                </div>
                <div v-else >
                  <q-input v-model="api" filled label="Api地址必填：(如：/api/xxx/xxx/xxx)" style="margin-top:5px;"  />
                  <q-input v-model="pramas" filled label="参数名选填请以英文逗号为分隔符：(如：aaa,bbb,ccc)" style="margin-top:5px;"  />
                </div>
                <q-input v-model="describe" filled  type="textarea" label="api描述" style="margin-top:5px;" />
            </div>
       </div>
        <q-separator />
        <q-stepper-navigation>
          <q-btn @click="createMainUrl" color="primary" label="下一步" />
        </q-stepper-navigation>
      </q-step>
      <q-step :name="2" title="填写参数" icon="create_new_folder" :done="step > 2" :header-nav="step > 2">
        <div class="caui-step scroll" >
          <div style="margin-bottom:30px;">请求API接口：<span class="text-green">{{ CAResult.url }}</span></div>
          <print-template v-if="args.list" :value="args" unote udata :idata="false"></print-template>
          <div class="caui-step scroll" v-else>无参数</div>
        </div>
        
        <q-separator />
        <q-stepper-navigation>
          <q-btn @click="getResponse" color="primary" label="下一步" />
          <q-btn flat @click="step = 1" color="primary" label="上一步" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>


      <q-step :name="3" title="返回API数据" icon="create_new_folder" :done="step > 3" :header-nav="step > 3">
        <div class="caui-step scroll">
          <print-template :value="response" unote aone></print-template>
        </div>
        <q-separator />
        <q-stepper-navigation>
          <q-btn @click="() => { step = 4 }" color="primary" label="下一步" />
          <q-btn flat @click="step = 2" color="primary" label="上一步" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>


      <q-step :name="4" title="生成数据" icon="add_comment" :done="step > 4" :header-nav="step > 4">
        <div class="caui-step scroll">
          <q-timeline color="secondary">
          <q-timeline-entry heading body="生成数据" />
          <q-timeline-entry title="参数注释" subtitle="parame note">
            <print-template :value="args" note></print-template>
          </q-timeline-entry>
          <q-timeline-entry title="返回值注释" subtitle="results note">
            <print-template :value="response" note></print-template>
          </q-timeline-entry>
        </q-timeline>
        </div>
        <q-separator />
        <q-stepper-navigation>
          <q-btn color="primary" @click="createApi" label="完成创建" />
          <q-btn flat @click="step = 3" color="primary" label="上一步" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script>
  import Aux from '../common/auxx';
  import printTemplate from '../components/printTemplate';
  import XEUtils from 'xe-utils';
  import {
    mapState
  } from 'vuex'
  export default {
    components: {
      printTemplate
    },
    data() {
      var createApiDefaultMode = this.$q.localStorage.getItem('createApiDefaultMode') || 'default';
      return {
        step: 1,
        args: {},
        response: {},
        CAResult : { },
        describe :'',
        pramas:'',
        api :'',
        apiType:'GET',
        apiTypeOptions :['GET','POST'],
        mode :createApiDefaultMode,
        mainUrl :'',
      }
    },
    computed: {
      ...mapState({ 
            MProject : state => state.Project,
            MVapi : state => state.Vapi,
      })
    },
    watch :{
        "MVapi.create.loading" :function(loading ){
           if(loading){
               this.$q.loading.show({message: '创建中' })
           }else{
               this.$q.loading.hide();
           }
        },
        mode :function(val){
            this.$q.localStorage.set("createApiDefaultMode",val);
        },
        "MVapi.reptile.loading" :function(loading ){
           if(loading){
               this.$q.loading.show({message: '请求API中' })
           }else{
               this.$q.loading.hide();
           }
        }
    },
    methods: {
      resetData :function(){
        this.step = 1;
        this.args = {};
        this.response = {};
        this.CAResult = {};
        this.describe ='';
        this.pramas='';
        this.api = '';
      },
      getResponse: function () {
        var that = this;
        var queryKey = JSON.parse(JSON.stringify(that.args));
        var newQueryKey = Aux.inverse(queryKey.list);
        var url = this.CAResult.url;
        this.$store.dispatch('Cmd/send', { content :`请求Api：${url}`})
        this.$store.dispatch('Vapi/getResponse',{
          url ,type:that.apiType ,req :JSON.stringify(newQueryKey),
          success :function(response){
            that.response = Aux.getParent(response);
            that.step = 3;
          },
          fail :function(){
            that.$q.dialog({ title: '错误提示',message: `请求Api：${url} 请求失败`})
          }
        })
      },
      createApi: function () {
        var that = this;
        var result = {
            project_id : this.CAResult.project._id, // api名称
            api : this.CAResult.api, // api名称
            type :this.apiType,
            describe : this.describe,     //详情
            req: JSON.stringify(this.args),
            res: JSON.stringify(this.response),
        }
        this.$store.dispatch('Vapi/create' ,{ result ,success:function(){
          that.$q.notify({position :'top-right',icon :'ion-add', message:`创建API：${that.CAResult.url} 成功`, timeout:2000,closeBtn :'关闭' })
          that.$store.dispatch('Cmd/send', {content:`创建API：${that.CAResult.url} 成功` ,color:'text-green' })
          that.resetData();
          that.$router.push('/');
        }});
      },
      distinct :function(arr) {
          let result = []
          let obj = {}
          for (let i of arr) {
              if (!obj[i]) {
                  result.push(i)
                  obj[i] = 1
              }
          }
          return result
      },
      createMainUrl :function(){
        var defaultProject = this.MProject.defaultProject;
        var mode = this.mode;
        var api = this.api;
        var pramas = this.pramas;
        var mainUrl = this.mainUrl;
        var result = this.checkMode(mode,api,pramas,mainUrl,defaultProject);
        if(result.success){
            this.args = Aux.getParent(result.queryKey);
            this.CAResult = result;
            this.step = 2;
        }else{
            this.$q.dialog({
              title: '错误提示',
              message: result.msg
            })
        }
      },
      checkDefaultMode : function(url,defaultProject){
        var success = true;
        var msg = '';
        var userUrlObj = XEUtils.parseUrl(url)
        var projectObj = XEUtils.parseUrl(defaultProject.domain)
        var u_authority = userUrlObj.origin;
        var d_authority = projectObj.origin;
        if(u_authority != d_authority){
            msg = '你当前添加的api并不是当前项目的域名。'
            success = false;
        }
        if(success){
          return {
            success,
            url :defaultProject.domain + userUrlObj.pathname ,
            api :userUrlObj.pathname,
            project :defaultProject,
            queryKey : userUrlObj.searchQuery
          }
        }else{
          return { success ,msg }
        }
      },
      checkHighMode :function(api,pramas,defaultProject){
        var queryKey = { };
        if(pramas){
          var newparams = pramas.split(',');
          newparams = this.distinct(newparams);
          for(var i =0;i<newparams.length;i++){
            if(newparams[i]){
              queryKey[newparams[i]] =''
            }
          }
        }
        return {
          success :true,
          url :defaultProject.domain + api,
          api ,
          project :defaultProject,
          queryKey
        }
      },
      checkMode :function(mode ,api ,pramas ,mainUrl ,defaultProject){
          var result = { }
          if(defaultProject._id){
              switch(mode){
                case 'high' :
                    result = this.checkHighMode(api,pramas,defaultProject)
                break;
                default :
                    result = this.checkDefaultMode(mainUrl ,defaultProject);
                    console.log(result)
                  break;
              }
          }else{
              result = { success :false ,msg :"必须设置默认项目才允许添加API" }
          }
          return result;
      }
    },

  }
</script>

<style>
  .caui-step { height: calc(100vh - 310px); box-sizing: border-box;}
</style>