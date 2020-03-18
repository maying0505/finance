$(function(){
    let clearInterval = false;//是否停止定时器
    let requestNum = (1000*60*5) / 5000;
    let toast = null;
    let toastShow = true;
    let id = getUrlVal('id');
    setTimeout(function(){
        if (toastShow) {
            toast = $(document).dialog({
                type : 'toast',
                infoIcon: '../../../public/image/icon/loading.gif',
                infoText: '正在处理',
            });
        }
    },500);
    (function pretreatment () {//预处理
        settime(true);
    })();
    
    //还款状态查询
    function payQuery(obj) {
        httpPostForm(api.payQuery,{id},
            function success(result){
                if(result.data && result.data.status && result.data.status == 3) {
                    $('.repaymenting').hide();
                    $('.repayment-success').show();
                    $('.repayment-fail').hide();
                    $('.orange-btn').show();
                    clearInterval = true;
                    if (result.data.type == 0 && result.data.returnUrl) {
                        window.location.href=result.data.returnUrl;
                    } 
                } else if(result.data && result.data.status && result.data.status == 2) {
                    $('.repaymenting').show();
                    $('.repayment-success').hide();
                    $('.repayment-fail').hide();
                    $('.orange-btn').hide();
                } else {
                    $('.repaymenting').hide();
                    $('.repayment-success').hide();
                    $('.repayment-fail').show();
                    clearInterval = true;
                    $('.orange-btn').show();
                }
                
                if(obj) {
                    let currentdate = result.data.date.year + '-' + result.data.date.month + '-' + result.data.date.day
                    $('.cur-time').text(currentdate);
                    let amount = result.data.amount ? Number(result.data.amount).toFixed(2) : 0;
                    $('.amount').text('还款金额：' + amount +'元')
                }
                let tipError = result.data.error;
                $('.tip-error').text(tipError);
                let parResult = result.data.message;
                $('.rep-result-text').text(parResult);

                //5分钟后失败
                requestNum--;
                if (requestNum === 0) {
                    $('.repaymenting').hide();
                    $('.repayment-success').hide();
                    $('.repayment-fail').show();
                    $('.orange-btn').show();
                    if (result.data && result.data.status && (result.data.status == 0 || result.data.status == 1)) {
                        clearInterval = true;
                    }
                    return;
                }
                toastShow = false;
            },
            function complete(xhr, status) {
                if (obj && toast) {
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
                clearInterval = true;
            }
        )
    }

    //定时器，过5秒执行一次
    function settime(obj) {
        if (clearInterval) {
            return
        }
        payQuery(obj);
        setTimeout(function () {
            settime();
        }, 5000)
    }

    //确认
    let u = navigator.userAgent;
    $('.orange-btn').click(function(){
        try {
            if (u.indexOf('Android') !== -1 || u.indexOf('Linux') !== -1) {//安卓手机
                h5_android.close();
            } else {//苹果手机
                nativeMethod.returnNativeMethod('{"type":"6"}');
            }
        } catch (e) {
            $(document).dialog({
                type : 'notice',
                infoText: '跳转失败',
                autoClose: 1500,
                position: 'center' 
            });
        }
    })
})