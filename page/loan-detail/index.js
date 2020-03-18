$(function(){
    let orderId = getUrlVal('orderId');
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
        httpGet( api.loanDetail,{orderId:orderId},
            function success(result){
                console.log(result);
                $('.fc-wrapper').show();
                const { state, status,  invest, realAmount, serviceFee, loanDay, loanPeriod, interest, bank, applyTime, titleString } = result.data;
                if (state !== 8) {
                    $('.orange-btn').hide();
                }

                $('.status').text(status ? status : '--');
                $('.invest').text(invest ? invest : '--');
                $('.realAmount').text(realAmount ? realAmount : '--');
                $('.serviceFee').text(serviceFee ? serviceFee : '--');
                $('.loanDay').text(loanDay ? loanDay : '--');
                $('.loanPeriod').text(loanPeriod ? loanPeriod : '--');
                $('.interest').text(interest ? interest : '--');
                $('.bank').text(bank ? bank : '--');
                $('.applyTime').text(applyTime ? applyTime.date['year'] + '-' + applyTime.date['month'] + '-' + applyTime.date['day'] : '--');

                if (titleString) {
                    let contentShow = '';
                    for (let i = titleString.length-1; i >= 0; i--) {
                        let origin = i == titleString.length-1 ? 'tip-suc2' : 'tip-fail2';
                        let verticalLine = i == titleString.length-1 ? 'tip-suc1' : 'tip-fail1';
                        let resultTipStep = i == titleString.length-1 ? '' : 'result-tip-step-fail';
                        if (i == 0) {
                            origin = '';
                        }
                        let title = titleString[i]['title'] ? titleString[i]['title'] : '';
                        let text = titleString[i]['text'] ? titleString[i]['text'] : '';
                        
                        contentShow += '<div class="flex flex-c result-tip-step ' + resultTipStep + '">'+
                                            '<div class=' + origin + '></div>'+
                                            '<div>'+
                                                '<span class=' + verticalLine + '></span>'+
                                                '<span class="tip-text">' + title + '</span>'+
                                            '</div>'+
                                            '<div class="gray-style font-s12 result-tip-step-t">'+
                                                '<span>' + text + '</span>'+
                                            '</div>'+
                                        '</div>';
                    }
                    
                    $('.loan-steps').append(contentShow);
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
    $('.loan-issued').click(function(){
        window.location.href = '../loan-issued/index.html?token=' + getUrlVal('token') + '&orderId=' + getUrlVal('orderId') + '&type=0';  
    })

    $('.loan-agreement').click(function(){
        window.location.href = '../loan-agreement/index.html?token=' + getUrlVal('token') + '&orderId=' + getUrlVal('orderId') + '&type=0';   
    })

    $('.license-agreement').click(function(){
        window.location.href = '../license-agreement/index.html?token=' + getUrlVal('token') + '&orderId=' + getUrlVal('orderId') + '&type=0';   
    })

    $('.orange-btn').click(function(){
        window.location.href="../repayment/repayment-method/index.html?token=" + getUrlVal('token') + '&repaymentType=0';  
    })
})