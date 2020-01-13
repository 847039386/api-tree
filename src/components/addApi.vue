<template>
    <div style="padding:20px;">
          <q-dialog v-model="show" persistent>
            <q-card style="width: 700px;">
              <q-card-section>
                <div class="text-h6">添加API</div>
              </q-card-section>
              <q-card-section>
                  <div>
                        <blockquote>
                          <small>当前项目名称：<cite title="Quasar Framework">{{ this.MProject.defaultProject.cname || '无' }}</cite></small><br>
                          <small>当前项目域名：<cite title="Quasar Framework">{{ this.MProject.defaultProject.domain || '无' }}</cite></small><br>
                          <!-- <small>请填写参数名<cite title="Quasar Framework"></cite></small><br><br> -->
                          <!-- <q-btn color="primary" size="sm" label="添加参数" @click="addApiArg" /> -->
                        </blockquote>
                        <q-input v-model="api" filled label="Api地址必填：(如：/api/xxx/xxx/xxx)" style="margin-top:5px;"  />
                        <q-input v-model="pramas" filled label="参数名选填请以英文逗号为分隔符：(如：aaa,bbb,ccc)" style="margin-top:5px;"  />
                  </div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="确定" color="primary" @click="onOk" />
                <q-btn flat label="关闭" color="primary" @click="onCancel" />
              </q-card-actions>
            </q-card>
          </q-dialog>
    </div>

</template>

<style>
  
</style>


<script>
  import { mapState } from 'vuex'
  export default {
    name: 'aux-add-api',
    props :{
        show :{
            type :[Boolean],
            default :false
        }
    },
    data() {
      return {
        pramas:'',
        api :''
      }
    },
    computed: {
      ...mapState({ 
            MProject : state => state.Project
        })
    },
    methods : {
        onReset :function(){
          this.arguments = '';
          this.api = "";
        },
        onOk :function(){
          var  defaultProject = this.MProject.defaultProject;
          var result = {};
          if(defaultProject && this.api){
            result = {
              success :true,
              pramas :this.pramas,
              api :this.api,
              project : defaultProject,
              url : defaultProject.domain + this.api
            }
          }else{
              result = { 
                success :false,
                msg :'当前无项目或API为空'
              }
          }
          this.onReset();
          this.$emit('ok',result)
        },
        onCancel :function(){
          // this.onReset();
          this.$emit('cancel')
        },
        onDialogHide :function(){
          // this.onReset();
          this.$emit('cancel')
        },

    },
  };
</script>
