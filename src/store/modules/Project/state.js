export default {
    
    defaultProject :{ },
    save : {
        loading: false,
    },
    delete :{
        loading :false,
    },
    projects : {
        loading :false,
        list : [],
        search :'',
        pageIndex :1,
        pageSize :10,
        total : 1,
        totalPages : 1,
        lastPage :true,
    },
    apis : {
        loading :false,
        list : [],
        search :'',
        pageIndex :1,
        pageSize :10,
        total : 1,
        totalPages : 1,
        lastPage :true,
    },

    project  :{ 
        data : { },
        loading :false
    },
    saveTree :{
        loading :false
    },
}