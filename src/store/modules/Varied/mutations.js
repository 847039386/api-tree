export default {
    setApis :function(state,payload){
        var response = payload.data;
        var apis = response.data;
        apis.list = apis.list.map(function(vapi){
            vapi["PS_AUXMODE"] = "DEFAULT";
            vapi["PS_ContextMenu"] = false;
            vapi["PS_AUXREQ"] = JSON.parse(vapi.req);
            vapi["PS_AUXRES"] = JSON.parse(vapi.res);
            return vapi;
        });
        state.apis = Object.assign(state.apis ,apis);
    },
}