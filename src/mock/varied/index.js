
import Mock from 'mockjs';
import Pages from '../tool'
function auxRandom() {
    var randomInt = parseInt(Math.random() * 4 + 1, 10);
    var data = {}
    var list = [
        {"id": 1,"pid": null,"key": "@word(5, 10)","type": "String","data": "@cname","ptype": null,"parent": null,"note": "@csentence(5,20)","mock_random": "String", "mock_mode": "high","mock_rule": "5-10", "mock_value": "★" ,"data_status|1" :["default","optional","not"]},
        {"id": 1, "pid": null, "key": "@word(5, 10)","type": "Number","data|100-300.0-2": 10, "ptype": null, "parent": null,"note": "@csentence(5,20)","mock_random": "Number","mock_mode": "high","mock_rule": "100-300.0-2","mock_value": 200.15 ,"data_status|1" :["default","optional","not"]},
        {"id": 1,"pid": null,"key": "@word(5, 10)","type": "Array", "data|0-3": ["@csentence(5,20)"],"ptype": null,"parent": null,"note": "@csentence(5,20)","mock_random": "Array", "mock_mode": "high","mock_rule": "3-9", "mock_value": ["@csentence(5,20)"] ,"data_status|1" :["default","optional","not"]}
    ]
    switch (randomInt) {
        case 1:
            data = list[0]
            break;
        case 2:
            data = list[1]
            break;
        case 3:
            data = list[2]
            break;
        default:
            list.sort(function(){
                return Math.random() - 0.5;
            });
            data = {
                "id": 1,
                "pid": null,
                "key": "@word(5, 10)",
                "type": "Object",
                "ptype": null,
                "parent": null,
                "note": "@csentence(5,20)",
                "mock_random": "Array",
                "data_status|1" :["default","optional","not"],
                "mock_mode": "high",
                "mock_rule": "3-9",
                "mock_value": ["@csentence(5,20)"],
                "children": {
                    "parent" :null,
                    "list|1-3": list
                }
            }
            break;
    }
    return data;
}

function auxListRandom(){
    var lenI = parseInt(Math.random() * 3 + 2, 10);
    var list = [];
    for(var i=0;i<lenI;i++){
        list.push(auxRandom());
    }
    return list
}

function auxRandomJONS(){
    var list = []
    for(var i=0;i<=10; i++){
        list.push(JSON.stringify(Mock.mock({
            "parent": null,
            "list": auxListRandom()
        })))
    }
    return list;
}


var list = Pages({
    "_id" :"@guid",
    "type|1":["GET" ,"POST"],
    "req|1" : auxRandomJONS(),
    "res|1" : auxRandomJONS()
},3)

export { list }


