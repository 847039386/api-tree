import axios from 'axios';
import store from "../store"

axios.defaults.timeout = 15000;

let needLoadingRequestCount = 0;

axios.interceptors.request.use(function(config) {
    //在请求发出之前进行一些操作
    store.state.loading = true;
    needLoadingRequestCount ++;
    return config;
},function(err){
    return Promise.reject(err);
});

axios.interceptors.response.use(function(config) {
    needLoadingRequestCount--;
    //在这里对返回的值进行处理
    if(needLoadingRequestCount <= 0 ){
        needLoadingRequestCount = 0;
        store.state.loading = false;
    }
    return config;
});


export default axios
