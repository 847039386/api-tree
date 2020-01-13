import Axios from '../../../axios'

export default {
    getApis:function({state ,commit} ,payload){
        state.vapis.loading = true;
        payload = payload || { }
        var { pageIndex ,pageSize ,id ,search ,success ,fail } = payload
        pageIndex = pageIndex || 1;
        pageSize = pageSize || state.vapis.pageSize;
        state.vapis.search = search
        var axios = null;
        if(state.vapis.search){ 
            axios = Axios.get('/api/vapi/search',{ params :{ pageIndex ,pageSize ,project_id :id ,keyword :state.vapis.search  }})
        }else{
            axios = Axios.get('/api/vapi/list',{ params :{ pageIndex ,pageSize ,project_id :id }})
        }
        axios.then(function(response){
            if(response.data.success){
                commit('setVapis',response)
                if(success){
                    success(response);
                }
            }else{
                if(fail){
                    fail();
                }
            }
        }).catch(function(){
            if(fail){
                fail();
            }
        }).then(function(){
            state.vapis.loading = false;
        })
    },
    updatePR :function({state } ,payload){
        var { type ,success ,fail } = payload;
        var rout = type == 'parame' ? 'upparame' : 'upresult';
        state.updatePROperate.loading = true;
        Axios.get('/api/vapi/'+rout,{
            params :{
                id : payload.id,
                json :payload.json
            }
        }).then(function(response){
            if(response.data.success){
                if(success){
                    success(response);
                }
            }else{
                if(payload.fail){
                    fail();
                }
            }
        }).catch(function(){
            if(fail){
                fail();
            }
        }).then(function(){
            state.updatePROperate.loading = false;
        })
    },
    create :function(store,payload){
        var  { state } = store;
        var { result , success ,fail } = payload;
        state.create.loading = true;
        Axios.post('/api/vapi/create',result).then(function(response){
            console.log(response)
            if(response.data.success){
                if(success){
                    success(response);
                }
            }else{
                if(fail){
                    fail(response.data.msg || '未知错误');
                }
            }
        }).catch(function(){
            if(payload.fail){
                payload.fail('页面出错');
            }
        }).then(function(){
            state.create.loading = false;
        })
    },
    getApiById :function({state ,commit} ,{id ,success ,fail}){
        state.vapi.loading = true;
        var axios = Axios.get('/api/vapi/detail',{ params : {id}});
        axios.then(function(response){
            if(response.data.success){
                commit('setVapi',response)
                if(success){
                    success(response);
                }
            }else{
                if(fail){
                    fail();
                }
            }
        }).catch(function(){
            if(fail){
                fail();
            }
        }).then(function(){
            state.vapi.loading = false;
        })
    },
    delete :function({ state  } ,payload){
        state.delete.loading = true;
        var { id ,success ,fail } = payload
        Axios.post('/api/vapi/delete',{id}).then(function(response){
            if(response.data.success){
                if(success){
                    success();
                }
            }else{
                if(fail){
                    fail(response.data.msg || '未知错误');
                }
            }
        }).catch(function(){
            if(fail){
                fail('页面出错');
            }
        }).then(function(){
            state.delete.loading = false;
        })
    },
    // 服务器爬虫
    getResponse :function({ state } ,payload){
        state.reptile.loading = true;
        var { type ,req ,url, success ,fail } = payload
        Axios.post('/api/json',{ type ,req ,url }).then(function(response){
            if(response.data.success){
                if(success){
                    success(response.data.data);
                }
            }else{
                if(fail){
                    fail(response.data.msg || '未知错误');
                }
            }
        }).catch(function(){
            if(fail){
                fail('页面出错');
            }
        }).then(function(){
            state.reptile.loading = false;
        })
    }
}