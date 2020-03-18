$(function(){
    //定时器6分钟
    let clearInterval = false;//是否停止定时器
    let requestNum = (1000*60*5) / 5000;
    let userId = getUrlVal('userId');
    let outUniqueId = getUrlVal('outUniqueId');
    let type = getUrlVal('type');
    
    if (type === 'meituan_crawl') {
        $('title').text('美团认证结果');
    } else if (type === 'ele_crawl') {
        $('title').text('饿了么认证结果');
    } else if (type === 'mobile') {
        $('title').text('运营商认证结果');
    } else if (type === 'taobao') {
        $('title').text('芝麻认证结果');
    }
    settime();
    //还款状态查询
   
    function authenticationQuery() {
        httpPostForm(api.authenticationQuery,{type:type,userId:userId,outUniqueId:outUniqueId},
            function success(result){
                if(result.data.verificationOK == 1) {
                    $('.state0').hide();
                    $('.state1').show();
                    $('.state2').hide();
                    clearInterval = true;
                } else if(result.data.verificationOK == 0) {
                    $('.state0').show();
                    $('.state1').hide();
                    $('.state2').hide();
                } else {
                    $('.state0').hide();
                    $('.state1').hide();
                    $('.state2').show();
                    clearInterval = true;
                }
                
                //5分钟后失败
                requestNum--;
                if (requestNum === 0) {
                    $('.state0').hide();
                    $('.state1').hide();
                    $('.state2').show();
                    clearInterval = true;
                    return;
                }
            },
            function complete(xhr, status) {
                
            },
            function error(xhr, type){
                $('.state0').hide();
                $('.state1').hide();
                $('.state2').show();
                $(document).dialog({
                    type : 'notice',
                    infoText: xhr.message ? xhr.message : '请求失败',
                    autoClose: 1500,
                    position: 'center'  // center: 居中; bottom: 底部
                });
                clearInterval = true;
            }
        )
    }

    //定时器，过5秒执行一次
    function settime() {
        if (clearInterval) {
            return
        }
        authenticationQuery();
        setTimeout(function () {
            settime();
        }, 5000)
    }

})