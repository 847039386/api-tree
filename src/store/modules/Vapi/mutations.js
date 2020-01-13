export default {
    setVapis :function(state ,payload){
        var response = payload.data;
        var vapis = response.data;
        state.vapis = Object.assign(state.vapis ,vapis)
        
    },
    setVapi :function(state ,response){
        var vapi = response.data.data;
        state.vapi = Object.assign(state.vapi ,{data : vapi})
    },
    setVapisSearch :function(state,payload){
        state.vapis.search = payload;
    },
    resetApis :function(state,clearSeach){
        state.vapis.pageNumber = 1;
        state.vapis.totalPage = 1;
        if(clearSeach){
            state.vapis.search = '';
        }
    }
}