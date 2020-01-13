import Axios from '../../../axios'


export default {
    save :function({ state  } ,payload){
        state.save.loading = true;
        var { params ,success ,fail } = payload;
        var axios = null;
        if(params && params.id){
            axios = Axios.post('/api/project/update',params)
        }else{
            axios = Axios.post('/api/project/create',params)
        }
        axios.then(function(response){
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
            state.save.loading = false;
        })
    },

    getProjects :function({ state ,commit } ,payload){
        state.projects.loading = true;
        payload = payload || { }
        var { pageIndex ,pageSize ,search ,success ,fail } = payload
        pageIndex = pageIndex || 1;
        pageSize = pageSize || state.projects.pageSize;
        var axios = null;
        state.projects.search = search
        if(state.projects.search){ 
            axios = Axios.get('/api/project/search',{ params :{ pageIndex ,pageSize ,search :state.projects.search  }})
        }else{
            axios = Axios.get('/api/project/list',{ params :{ pageIndex ,pageSize }})
        }
        axios.then(function(response){
            if(response.data.success){
                commit('setProjects',response)
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
            state.projects.loading = false;
        })
    },

    delete :function({ state  } ,payload){
        state.delete.loading = true;
        var { id ,success ,fail } = payload
        Axios.post('/api/project/delete',{ id }).then(function(response){
            console.log(response)
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
    getApis:function({state ,commit} ,payload){
        state.apis.loading = true;
        payload = payload || { }
        var { pageIndex ,pageSize ,id ,search ,success ,fail } = payload
        pageIndex = pageIndex || 1;
        pageSize = pageSize || state.apis.pageSize;
        var axios = null;
        state.apis.search = search
        if(state.apis.search){ 
            axios = Axios.get('/api/vapi/search',{ params :{ pageIndex ,pageSize ,project_id :id ,keyword :state.apis.search  }})
        }else{
            axios = Axios.get('/api/vapi/list',{ params :{ pageIndex ,pageSize ,project_id :id }})
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
    getProjectById :function({state ,commit} ,{id ,success ,fail}){
        state.project.loading = true;
        var axios = Axios.get('/api/project/detail',{ params : {id}});
        axios.then(function(response){
            if(response.data.success){
                commit('setProject',response)
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
            state.project.loading = false;
        })
    },
    saveTree :function(store,payload){
        var  { state } = store;
        var { result , success ,fail } = payload;
        state.saveTree.loading = true;
        Axios.post('/api/project/savetree',result).then(function(response){
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
            state.saveTree.loading = false;
        })
    },
}