import Pages from '../tool'

var Detail = {
    success :true,
    data :{
        "project":{ 
            'name' :'@last',
            'cname' :'@cname',
            'domain' :'@domain',
        },
        "_id" :"@guid",
        "name": "/api/@word(5)/@word(5)", // api名
        "describe" :"@csentence(5,20)",
    }
}

var List = Pages({
    "project":{ 
        'name' :'@last',
        'cname' :'@cname',
        'domain' :'@domain',
    },
    "_id" :"@guid",
    "name": "/api/@word(5)/@word(5)", // api名
    "describe" :"@csentence(5,20)",
},206)

var SearchList = Pages({
    "project":{ 
        'name' :'@last',
        'cname' :'@cname',
        'domain' :'@domain',
    },
    "_id" :"@guid",
    "name": "/api/@word(5)/@word(5)", // api名
    "describe" :"@csentence(5,20)",
},Math.floor(Math.random() * (50 - 1) + 1))

var operate = {
    "success|9-1": true,
}

export { List as vapis ,SearchList as vapisearch ,Detail as vapi};
export { operate };

