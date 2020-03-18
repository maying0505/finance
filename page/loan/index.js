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
        httpGet( api.SDLoanDetail,{orderId:orderId},
            function success(result){
                console.log(result);
                $('.fc-wrapper').show();
                const { invest, realAmount, serviceFee, loanDay, totalRepayment, totalInterest, bank, repayType, repaymentPlanDetails } = result.data;

                $('.invest').text(invest ? invest+'（元）' : '--');
                $('.loanDay').text(loanDay ? loanDay+'（天）' : '--');
                $('.totalInterest').text(totalInterest ? totalInterest+'（元）' : '--');
                $('.serviceFee').text(serviceFee ? serviceFee+'（元）' : '--');
                $('.bank').text(bank ? bank : '--');
                $('.realAmount').text(realAmount ? realAmount+'（元）' : '--');
                $('.totalRepayment').text(totalRepayment ? totalRepayment+'（元）' : '--');
                $('.repayType').text(repayType ? repayType : '--');


                if (repaymentPlanDetails && repaymentPlanDetails.length > 0) {
                    $('.open-detail').show();
                    let contentShow = '';
                    
                    for (let i = repaymentPlanDetails.length-1; i >= 0; i--) {
                        let period = repaymentPlanDetails[i]['period'] ? repaymentPlanDetails[i]['period'] : '--';
                        let RepaymentDate = repaymentPlanDetails[i]['RepaymentDate'] ? repaymentPlanDetails[i]['RepaymentDate'] : '--';
                        let periodIncome = repaymentPlanDetails[i]['periodIncome'] ? repaymentPlanDetails[i]['periodIncome'] : '--';
                        let periodCapital = repaymentPlanDetails[i]['periodCapital'] ? repaymentPlanDetails[i]['periodCapital'] : '--';
                        let periodInterest = repaymentPlanDetails[i]['periodInterest'] ? repaymentPlanDetails[i]['periodInterest'] : '--';
                        let periodCapitalText = '本金' + periodCapital + '+' + '利息' + periodInterest
                        contentShow += '<div class="pad10-15 border-bot-gray">'+
                                            '<div class="flex flex-j-sb">'+
                                                    '<span>第'+ period +'期</span>'+
                                                    '<span class="">'+ periodIncome +'（元）</span>'+
                                                '</div>'+
                                                '<div class="flex flex-j-sb font-s12 gray-style">'+
                                                    '<span>'+ RepaymentDate +'</span>'+
                                                    '<span class="">'+ periodCapitalText +'</span>'+
                                                '</div>'+
                                        '</div>';
                    }
                    
                    $('.loan-detail').append(contentShow);
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

    $('.open-detail').click(function(){
        if($(this).text() === '展开详情') {
            $('.loan-detail').show();
            $(this).text('收起详情');
        } else if($(this).text() === '收起详情') {
            $('.loan-detail').hide();
            $(this).text('展开详情');
        }
        
    })
    
    $('.ok-btn').click(function(){
        if (!$('.check-box').hasClass('checked-box')) {
            $(document).dialog({
                type : 'notice',
                infoText: '需要同意协议才能借款',
                autoClose: 1500,
                position: 'center' 
            });
            return;
        }
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
        //确认申请
        httpGet( api.SDLoanDetailConfirm,{orderId:orderId},
            function success(result){
                $(document).dialog({
                    type : 'notice',
                    infoText: '申请成功',
                    autoClose: 1500,
                    position: 'center' 
                });
                toastShow = false;
                if (result.data && result.data.status && result.data.status == 0 && result.data.returnUrl) {
                    window.location.href=result.data.returnUrl;
                } 
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
    })

    $('.check-box').click(function(){//是否同意协议
        $(this).toggleClass("checked-box");
    })

    $('.loan-issued').click(function(){
        window.location.href = '../loan-issued/index.html?token=' + getUrlVal('token') + '&orderId=' + getUrlVal('orderId') + '&type=0';  
    })

    $('.loan-agreement').click(function(){
        window.location.href = '../loan-agreement/index.html?token=' + getUrlVal('token') + '&orderId=' + getUrlVal('orderId') + '&type=0';   
    })

    $('.license-agreement').click(function(){
        window.location.href = '../license-agreement/index.html?token=' + getUrlVal('token') + '&orderId=' + getUrlVal('orderId') + '&type=0';   
    })
})