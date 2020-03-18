
// const httpUrl = '';
// const httpUrl = 'http://192.168.2.121:8085';
// const httpUrl = 'http://192.168.2.135:8085';
const httpUrl = 'http://demo.user.buyem.cn:88';
function httpGet (url,param,success,complete,error) {
    $.ajax({
        type: 'GET',
        url: httpUrl + url,
        data: param,
        headers: {"token": getUrlVal('token')},
        dataType: 'json',
        timeout: 10000,
        success: function(result){
            let curUrl = window.location.href;
            curUrl = curUrl.split("page/");
            if (result.code === 401) {
                window.location.href = curUrl[0] + 'page/login-timeout/index.html';
                return;
            }
            if (result && result.code === 200) {
                success(result);
            } else {
                error(result);
            }
        },
        complete: function(xhr, status) {
            complete(xhr,status);
        },
        error: function(xhr, type){
            error(xhr, type);
        }
    })
}

function httpPost (url,param,success,complete,error) {
    // post a JSON payload:
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        headers: {"token": getUrlVal('token')},
        data: JSON.stringify(param),
        contentType: 'application/json',
        dataType: 'json',
        timeout: 10000,
        success: function(result){
            let curUrl = window.location.href;
            curUrl = curUrl.split("page/");
            if (result.code === 401) {
                window.location.href = curUrl[0] + 'page/login-timeout/index.html';
                return;
            }
            if (result && result.code === 200) {
                success(result);
            } else {
                error(result);
            }
        },
        complete: function(xhr, status) {
            complete(xhr,status);
        },
        error: function(xhr, type){
            error(xhr, type);
        }
    })
}

function httpPostForm (url,param,success,complete,error) {
    // post a JSON payload:
    console.log(param)
    let fd = new FormData();
    for (let i in param) {
        if (i === 'files') {
            param[i].forEach((file) => {
                fd.append('files', file);
            });
        } else {
            fd.append(i, param[i])
        }
    }
    console.log(fd.get('name'))
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        headers: {"token": getUrlVal('token')},
        data: fd,
        contentType:false,
        processData:false,
        timeout: 10000,
        success: function(result){
            let curUrl = window.location.href;
            curUrl = curUrl.split("page/");
            if (result.code === 401) {
                window.location.href = curUrl[0] + 'page/login-timeout/index.html';
                return;
            }
            if (result && result.code === 200) {
                success(result);
            } else {
                error(result);
            }
        },
        complete: function(xhr, status) {
            complete(xhr,status);
        },
        error: function(xhr, type){
            error(xhr, type);
        }
    })
}

function getUrlVal(para){
    let search=location.search; //页面URL的查询部分字符串
    let arrPara=new Array(); //参数数组。数组单项为包含参数名和参数值的字符串，如“para=value”
    let arrVal=new Array(); //参数值数组。用于存储查找到的参数值
 
    if(search!=""){
        let index=0;
        search=search.substr(1); //去除开头的“?”
        arrPara=search.split("&");
 
        for(let i in arrPara){
            let paraPre=para+"="; //参数前缀。即参数名+“=”，如“para=”
            if(arrPara[i].indexOf(paraPre)==0&& paraPre.length<arrPara[i].length){
                arrVal[index]=decodeURI(arrPara[i].substr(paraPre.length)); //顺带URI解码避免出现乱码
                index++;
            }
        }
    }
 
    if(arrVal.length==1){
        return arrVal[0];
    }else if(arrVal.length==0){
        return null;
    }else{
        return arrVal;
    }
}