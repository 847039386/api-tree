import Axios from '../../../axios'


export default {
    // 获取ID 为 APIid
    getApis:function({state ,commit} ,payload){
        state.apis.loading = true;
        payload = payload || { }
        var { pageIndex ,pageSize ,id ,search ,success ,fail } = payload
        pageIndex = pageIndex || 1;
        pageSize = pageSize || state.apis.pageSize;
        var axios = null;
        state.apis.search = search
        if(state.apis.search){ 
            axios = Axios.get('/api/varied/search',{ params :{ pageIndex ,pageSize ,id ,search :state.apis.search  }})
        }else{
            axios = Axios.get('/api/varied/list',{ params :{ pageIndex ,pageSize ,id }})
        }
        axios.then(function(response){
            if(response.data.success){
                commit('setApis',response)
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
            state.apis.loading = false;
        })
    },
    save :function({state } ,payload){
        var { type ,id ,json ,success ,fail } = payload;
        state.save.loading = true;
        Axios.post('/api/varied/updata',{type ,id ,json}).then(function(response){
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
            state.save.loading = false;
        })
    },
    delete :function({ state  } ,payload){
        state.delete.loading = true;
        var { id ,success ,fail } = payload
        Axios.post('/api/varied/delete',{id}).then(function(response){
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
            if(fail){
                fail('页面出错');
            }
        }).then(function(){
            state.delete.loading = false;
        })
    },
}