$(function () {
    let name = '';
    (function pretreatment () {//预处理
        let toast = null;
        let toastShow = true;
        setTimeout(function(){
            if (toastShow) {
                toast = $(document).dialog({
                    type : 'toast',
                    infoIcon: '../../../public/image/icon/loading.gif',
                    infoText: '正在处理',
                });
            }
        },500);
        //查询已绑定银行卡详情
        httpGet( api.bindedCardDetail,{},
            function success(result){
                
                console.log(result);
                name = result.data.name ? result.data.name: '';
                if (!result.data.hasBankCardBeenFilld) {
                    let token = getUrlVal('token');
                    window.location.href="../rebind-card/index.html?token=" + token + '&name=' + name + '&close=_close_webview'; 
                }
                $('.bank-name').append(result.data.bankName);
                $('.mobile').append(result.data.mobile);
                $('.card-no').append(result.data.cardNo);
                toastShow = false;
            },
            function complete(xhr, status) {
                if (toast) {
                    toast.update({
                        infoIcon: '../../../public/image/icon/loading.gif',
                        infoText: '正在处理',
                        autoClose: 1,
                    });
                }
            },
            function error(xhr, type){
                toastShow = false;
                $(document).dialog({
                    type : 'notice',
                    infoText: xhr.message ? xhr.message : '请求失败',
                    autoClose: 1500,
                    position: 'center'  // center: 居中; bottom: 底部
                });
            }
        )
    })();
    
    //重新绑卡跳转
    $('#rebinding-card').click(function(){
        let token = getUrlVal('token');
        window.location.href="../rebind-card/index.html?token=" + token + '&name=' + name; 
    })
})