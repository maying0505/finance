$(function(){
    let orderId = getUrlVal('orderId');
    let uid = getUrlVal('uid');
    $('.uid').text((uid || uid === 0) ? uid : '');
    (function pretreatment () {//预处理
        let toast = null;
        let toastShow = true;
        setTimeout(function(){
            if (toastShow) {
                toast = $(document).dialog({
                    type : 'toast',
                    infoIcon: '../../public/image/icon/loading.gif',
                    infoText: '正在处理',
                });
            }
        },500);
        //查询详情
        let httpUrl = '';
        let type = getUrlVal('type');
        let invest = getUrlVal('invest');
        let param = {};
        if (type === '0') {
            httpUrl = api.loanPact;
            param = {orderId: orderId};
        } else {
            httpUrl = api.loanApplyPact;
            param = {invest: invest};
        }
        httpGet(httpUrl,param,
            function success(result){
                console.log(result);
                const { partyA, partyB, pactDay, name, idCard, mobile, bankName, bankNumber } = result.data.empowerPact;
                $('.partyA').text(partyA);
                $('.partyB').text(partyB);
                $('.name').text(name);
                $('.idCard').text(idCard);
                $('.mobile').text(mobile);
                $('.bankName').text(bankName);
                $('.bankNumber').text(bankNumber);
                let pactDayText = pactDay ? pactDay.date['year'] + '年' + pactDay.date['month'] + '月' + pactDay.date['day'] + '日' : '';
                $('.pactDay').text(pactDayText);
                toastShow = false;
            },
            function complete(xhr, status) {
                if (toast) {
                    toast.update({
                        infoIcon: '../../public/image/icon/loading.gif',
                        infoText: '正在处理',
                        autoClose: 1,
                    });
                }
            },
            function error(xhr, type){
                toastShow = false;
                $(document).dialog({
                    type : 'notice',
                    infoText: xhr && xhr.message ? xhr.message : '请求失败',
                    autoClose: 1500,
                    position: 'center' 
                });
            }
        )
    })();
})