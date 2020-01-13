

import Pages from '../tool'

var save = {
    "success": true,
}

var list = Pages({
    "_id" :"@guid",
    "name" :'@word(5,10)',
    "cname" :'@cname',
    "domain" :'https://cnodejs.org',
    "furl" :'C:\\Users\\Administrator\\Desktop',
    "tree" : '{}'
},63)

var Detail = {
    success :true,
    data :{
        "id" :10000,
        "_id" :"@guid",
        "name" :'@word(5,10)',
        "cname" :'@cname',
        "domain" :'https://cnodejs.org',
        "furl" :'C:\\Users\\Administrator\\Desktop',
        "tree|1" : [
            '{"name":"万娜","TREE_TYPE":"PROJECT","children":[{"name":"啊啊啊","TREE_TYPE":"PAGE","children":[{"TREE_TYPE":"API","api":"/api/syexx/wvlkw","name":"/api/syexx/wvlkw   影较得计论油查图色得众。","describe":"影较得计论油查图色得众。"}]}]}'
            ,'{}'
            ,'aaa'
        ]
    }
}

export { save ,list ,Detail }


