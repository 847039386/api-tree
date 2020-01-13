export default {
    send :function({ commit },payload){
        commit('send' ,payload)
    },
    status :function({ commit },payload){
        commit('setCmdStatus',payload);
    }
}