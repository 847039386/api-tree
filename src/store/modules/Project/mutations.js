export default {
    getSelectMenu :function(state,payload){
        var list = payload;
        state.menu.list = list
    },
    setProjects :function(state,payload){
        var response = payload.data;
        var projects = response.data;
        state.projects = Object.assign(state.projects ,projects);
    },
    setDefault :function(state ,payload){
        state.defaultProject = payload;
    },
    setApis :function(state,payload){
        var response = payload.data;
        var projects = response.data;
        state.apis = Object.assign(state.projects ,projects);
    },
    setProject :function(state ,response){
        var project = response.data.data;
        state.project.data = project;
    },
}