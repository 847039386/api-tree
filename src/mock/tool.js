import Mock from 'mockjs'
function GET(paramName ,url ,defaultVal){
    var arrObj = url.split('?');
    if(arrObj.length > 1){
        var arr;
        var arrParam = arrObj[1].split('&');
        for(var i=0;i<arrParam.length;i++){
            arr = arrParam[i].split('=');
            if(arr !=null && arr[0]===paramName){
                return arr[1];
            }
        }
    }
    return defaultVal;
}

function Pages(data,total,result){
    total = total || 106;
    return function(Options){
        var numPageIndex = parseInt(GET('pageIndex',Options.url,1));
        var numpageSize = parseInt(GET('pageSize',Options.url,1));
        var pageIndex = isNaN(numPageIndex) ? 1 : numPageIndex;
        var pageSize =  isNaN(numpageSize) ? 1 : numpageSize;
        var totalPages = Math.ceil(total/pageSize);
        var lastPage = !(pageIndex < totalPages);
        var list = [];
        // var lenI = (total - pageSize * (pageIndex - 1)) < pageSize ? (total - pageSize * (pageIndex - 1)) : pageSize;
        var lenI = lastPage ? pageSize - (totalPages * pageSize - total) : pageSize
        for(var i=0;i<lenI;i++){
            var id = 10000 + (pageIndex - 1) * pageSize + (i + 1);
            list.push(Mock.mock(Object.assign({id},data)));
        }
        var pageData = { list ,pageIndex ,pageSize ,total ,totalPages ,lastPage };
        if(!result){
            return { 'success' :true,'data' :pageData}
        }else{
            return result(pageData);
        }
        
    }
}

export default Pages;