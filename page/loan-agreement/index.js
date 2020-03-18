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
        if (type == 0) {
            httpUrl = api.loanPact;
            param = {orderId: orderId};
        } else {
            httpUrl = api.loanApplyPact;
            param = {invest: invest};
        }
        httpGet(httpUrl,param,
            function success(result){
                console.log(result);
                const {id, partyA, partyB, partyBIdCard, repayments, pactDay} = result.data.servicePact;
                $('.number').text(id);
                $('.partyA').text(partyA);
                $('.partyBIdCard').text(partyBIdCard);
                $('.partyB').text(partyB);
                let pactDayText = pactDay ? pactDay.date['year'] + '年' + pactDay.date['month'] + '月' + pactDay.date['day'] + '日' : '';
                $('.pactDay').text(pactDayText);

                if (repayments) {
                    let repaymentsText = '';
                    for (let i in repayments) {
                        let repayTime = repayments[i]['repayTime'];
                        let repayTimeText = repayTime ? repayTime.date['year'] + '年' + repayTime.date['month'] + '月' + repayTime.date['day'] + '日' : '';
                        repaymentsText += '<tr>'+
                                                '<td>'+repayments[i]['period']+'</td>'+
                                                '<td>'+repayTimeText+'</td>'+
                                                '<td>'+repayments[i]['repayAmount']+'</td>'+
                                                '<td>'+repayments[i]['periodCapital']+'</td>'+
                                                '<td>'+repayments[i]['serviceFee']+'</td>'+
                                            '</tr>';
                    }
                    $('.repayments').append(repaymentsText);
                }
                
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