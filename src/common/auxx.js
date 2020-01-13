
var mock_random = [
    {
        title : '文章类',
        list :[
            { id:1, title:'姓名' ,mock:"@cname" , desc:'张三'},
            { id:2, title:'标题' ,mock:"@ctitle" ,desc:'这是一列标题'},
            { id:3, title:'图片' ,mock:"@image()" ,desc:'data:image/png;base64,iVBORw0KMg'},
            { id:4, title:'内容' ,mock:"@cparagraph" ,desc:'这是内容'},
            { id:5, title:'时间' ,mock:"@now" ,desc:'2017-10-25 17:57:38'},
            { id:6, title:'email' ,mock:"@email" ,desc:'xxxxxx@xx.com'},
            { id:7, title:'url'  ,mock:"@url" ,desc:'mid://hykgdjwnf.za/anv'},
            { id:8, title :'ip' ,mock:"@ip" ,desc:"147.189.148.79"},
            { id:9, title:'身份证' ,mock:"@id" ,desc:'220000201703080628' },
            { id:10, title:'GUID' ,mock:"@guid" ,desc:'5954Ff50C92-B2F8-2BAF-3Bd1-571Cf7eDBd07488' },
        ],
    },
    {
        title : '区域类',
        list :[
            { id:11, title:'邮政编码' ,mock:"@zip" ,desc:'595488' },
            { id:12, title:'区域' ,mock:"@region" ,desc:'华东' },
            { id:13, title:"省"  ,mock:"@province" ,desc:"台湾" },
            { id:14, title:'市'  ,mock:"@city" ,desc:'忻州市'},
            { id:15, title:'区'  ,mock:"@county" ,desc:'岳普湖县'},
            { id:16, title:'省市区' ,mock:"@county(true)" ,desc:'重庆 重庆市 渝中区'},
        ],
    },
    {
        title : '颜色',
        list :[
            { id:17, title:'hex' ,mock:"@hex" ,desc:'#RRGGBB' },
            { id:18, title:'rgb' ,mock:"@rgb" ,desc:'rgb(r, g, b)' },
            { id:19, title:'rgba' ,mock:"@rgba" ,desc:'rgb(r, g, b,a)' },
            { id:20, title:'hsl' ,mock:"@hsl" ,desc:'hsl(h, s, l)' },
        ],
    }
]

export default {
    /**
     * Aux属性值                键/值会被重新封装成多个属性(name:'name')
     * id       ：唯一标识符
     * key      ：键名
     * data     ：值        （当该键值不是object或object数组时，该属性存在，children不存在。反而亦之） 
     * pid      ：父级id
     * ptype    ：父级类型
     * type     ：本身类型
     * chlidren ：子集  
     *
     *  
     * note     ：注解
     * data_status date值的三种变化  1、必选 2、可选 3、不选但显示
     * mock_random : 自动化数据
     * mock_mode : 模式     // 两种模式 1、普通模式 2、高级模式
     * mock_rule : 规则
     * mock_value : 值         
     */
    getParent :function(aTree,id ,pid ,ptype ,parent){
        parent = parent || null;
        ptype = ptype || null;
        id = id || 0;
        pid = pid || 0;
        var aParent =[];
        for(var key in aTree){
            ++id ;
            var aux = { id ,pid ,key }     
            var analysis = this.initAnalysis(aTree[key]);
            aux.type = analysis.type;
            aux.ptype = ptype;
            aux.parent = parent;
            // 增加非重要字段 v-model控制 defalut 值
            aux.note = "";
            aux.mock_random ="";
            aux.mock_mode = "default";
            aux.data_status = 'default';
            aux.mock_rule ="";
            aux.mock_value = "";
            // 是否有子集
            if(analysis.isChild){
                var newParent = { }
                newParent.key = aux.key;
                newParent.id = aux.id;
                newParent.ptype = aux.ptype;
                newParent.pid = aux.pid;
                newParent.type = aux.type;
                aux.children = this.getParent(aTree[key], id ,id ,analysis.type ,newParent);
            }else{
                aux.data = aTree[key];
            }
            aParent.push(aux);
        } 
        return {
            list  :aParent,
            parent,
        };
    },
    /**
     * 判断传值的数据类型 
     * @param {Object} value 
     */
    initAnalysis :function(value){
        var type = Object.prototype.toString.call(value);
        var isChild = false;
        var newType = 'String';
        switch(type){
            case '[object Object]' :
                isChild = true;
                newType = 'Object';
            break;
            case '[object Array]' :
                if(Object.prototype.toString.call(value[0]) == '[object Object]'){
                    isChild = true;
                    newType = 'ArrayObject';
                }else{
                    isChild = false;
                    newType = 'Array';
                }
            break;
            case '[object String]' :
                isChild = false;
                newType = 'String';
            break;
            case '[object Number]' :
                isChild = false;
                newType = 'Number';
            break;
            case '[object Boolean]' :
                isChild = false;
                newType = 'Boolean';
            break;
        }
        return {
            type :newType,
            isChild
        };
    },
    /**
     * 清空data值。因为数据库不需要多余数据
     * @param {*} aTree 树
     */
    clear :function(aTree){
        for(var key in aTree){ 
            var analysis = this.initAnalysis(aTree[key]);
            if(key == "data"){
                aTree['data'] = '';
            }
            if(analysis.isChild){
                this.clear(aTree[key]);
            }
        }
        return aTree
    },
    /**
     * 当json有数组为多条时 写注释或显示只有一条足以
     * @param {*} aTree 树
     */
    aone :function(aTree){
        for(var key in aTree){ 
            var analysis = this.initAnalysis(aTree[key]);
            if(aTree["type"] == "ArrayObject" && aTree["children"] && aTree["children"].list){
                aTree["children"].list = aTree["children"].list.slice(0,1)
            }
            if(analysis.isChild){
                this.aone(aTree[key]);
            }
        }
        return aTree
    },
    /**
     * 逆解析 根据树推算成普通的json
     * key 属性键  
     * data 属性值
     * 例如：{ key：data } 这里 aux的键值对的值 均可当key 所有键值对的值 均可当值。
     * @param {*} aTree 树 
     */
    inverseCompilation :function(aTree,attr,isOA){
        var naux = { };
        var aaux =[];
        if(!isOA){  //不为数组正常迭代
            for(let i = 0; i<aTree.length; i++){
                let atre = aTree[i];
                let atre_children = atre["children"];
                let attr_key = atre[attr.key];
                let attr_data = atre[attr.data];
                if(!atre_children){
                    naux[attr_key] = this.conversion(attr_data);
                }else{
                    if(atre["type"] == "ArrayObject"){
                        naux[attr_key] = this.inverseCompilation(atre_children['list'],attr,true) 
                    }else{
                        naux[attr_key] = this.inverseCompilation(atre_children['list'],attr) 
                    }
                }
            }
        }else{
            for(let item in aTree){
                let alist = aTree[item]['children']['list'];
                for(let it in alist){
                    let atre = alist[it];
                    let atre_children = atre["children"];
                    let attr_key = atre[attr.key]
                    let attr_data = atre[attr.data]
                    if(!atre_children){
                        naux[attr_key] = this.conversion(attr_data);
                    }else{
                        if(atre['type'] == "ArrayObject"){
                            naux[attr_key]  = this.inverseCompilation(atre_children['list'],attr,true) 
                        }else{
                            naux[attr_key]  = this.inverseCompilation(atre_children['list'],attr) 
                        }
                    }
                }
                aaux.push(naux);
                naux = {};
            }
        }
        return isOA ? aaux : naux;
    },
    inverse :function(aTree){
        return this.inverseCompilation(aTree,{ key:'key' ,data :'data' },)
    },
    /**
     * 生成mock格式
     * 与逆解析原理相同只传Aux树即可
     */
    mock :function(aTree ,isOA){
        var naux = { };
        var aaux =[];
        var mkey = '';
        var mdata = '';
        var key = 'key';
        var rule = 'mock_rule';
        var mode = 'mock_mode';     
        var value ='mock_value';
        var random = 'mock_random';

        if(!isOA){  //不为数组正常迭代
            for(let i = 0; i<aTree.length; i++){
                let atre = aTree[i];
                let atre_children = atre["children"];
                if(atre[mode] !== 'default'){
                    mkey = atre[key] +'|' +atre[rule];
                    mdata = atre[value];
                }else{
                    mkey = atre[key];
                    mdata = atre[random];
                }
                if(!atre_children){
                    naux[mkey] = this.conversion(mdata);
                }else{
                    if(atre["type"] == "ArrayObject"){
                        naux[mkey] = this.mock(atre_children['list'],true) 
                    }else{
                        naux[mkey] = this.mock(atre_children['list']) 
                    }
                }
            }
        }else{
            for(let item in aTree){
                let alist = aTree[item]['children']['list'];
                for(let it in alist){
                    let atre = alist[it];
                    let atre_children = atre["children"];

                    if(atre[mode] !== 'default'){
                        mkey = atre[key] +'|' +atre[rule];
                        mdata = atre[value];
                    }else{
                        mkey = atre[key];
                        mdata = atre[random];
                    }

                    if(!atre_children){
                        naux[mkey] = this.conversion(mdata)
                    }else{
                        if(atre['type'] == "ArrayObject"){
                            naux[mkey]  = this.mock(atre_children['list'],true) 
                        }else{
                            naux[mkey]  = this.mock(atre_children['list']) 
                        }
                    }
                }
                aaux.push(naux);
                naux = {};
            }
        }
        return isOA ? aaux : naux;
    },
    /**
     * mock的random自动数据    12
     */
    mockRandom :function(){    
        return mock_random;
    },
    conversion :function(value){
        var newVal = value;
        if(typeof value ==='string'){
            try {
                newVal = JSON.parse(value);
            } catch (e) {
                if(value == "true"){ 
                    value = true;
                }else if(value == "false"){
                    value = false;
                }else{
                    let n = Number(value); 
                    if(!isNaN(n)){
                        value = n;
                    }
                }
            }
        }
        return newVal;
    },
    getParentTree :function(aTree,arr){
        arr = arr || []
        if(aTree.list){
            aTree.list.forEach(element => {
                if(element.children){
                    this.getParentTree(element.children,arr)
                    delete element.children
                    arr.push(element)
                }else{
                    arr.push(element)
                }
            });
        }
        return arr;
    }
}





// 字符串 String, 数字 Number, 布尔型 Boolean, 对象 Object, 数组 Array, 函数 Function ,占位符定义
// 'name|rule': value
// 'name|min-max': 'value' //通过重复 'value' 生成一个字符串，重复次数大于等于 min，小于等于 max
// 'name|count': 'value' //通过重复 'value' 生成一个字符串，重复次数等于 count
// 'name|+1': 100 //属性值自动加 1，初始值为 100
// 'name|1-100': 100 //生成一个大于等于 1、小于等于 100 的整数，属性值 100 只用来确定类型
// 'name|1-100.1-10': 100 //生成一个浮点数，整数部分大于等于 1、小于等于 100，小数部分保留 1 到 10 位
// 'name|1': value //随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率是 1/2。
// 'name|min-max': value //随机生成一个布尔值，值为 value 的概率是 min / (min + max)，值为 !value 的概率是 max / (min + max)。
// 'name|min-max': {} //从属性值 {} 中随机选取 min 到 max 个属性。
// 'name|count': {} //从属性值 {} 中随机选取 count 个属性。
// 'name|1': [{}, {} ...] //从属性值 [{}, {} ...] 中随机选取 1 个元素，作为最终值
// 'name|min-max': [{}, {} ...] //通过重复属性值 [{}, {} ...] 生成一个新数组，重复次数大于等于 min，小于等于 max
// 'name|count': [{}, {} ...] //通过重复属性值 [{}, {} ...] 生成一个新数组，重复次数为 count
// 'name': function(){} //执行函数 function(){}，取其返回值作为最终的属性值，上下文为 'name' 所在的对象