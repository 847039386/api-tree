export default {
    close :function(state){
        return state.show = -1;
    },
    hide :function(state){
        return state.show = 0;
    },
    open :function(state){
        return state.show = 1;
    },
    
}