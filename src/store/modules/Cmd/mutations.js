export default {
    send :function(state ,payload){
        state.datas.unshift(payload);
    },
    setCmdStatus :function(state ,payload){
        switch(payload){
            case 'show':
                state.status = 1;
            break;
            case 'hide':
                state.status = 0;
            break;
            default:
                state.status = -1;
            break;
        }
    },
}