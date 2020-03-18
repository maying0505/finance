$(function() {
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
         // 查询银行卡列表
         httpPostForm(api.bankCardList,{},
            function success(result){
                let bankCards = result.data ? result.data : [];
                let bankCardsHTML = '';
                for (let item of bankCards) {
                    bankCardsHTML += '<div class="flex flex-a-i flex-j-i pad15 border-bot-gray payment-method repayment-banks" card-id='+item.id+'>'+
                    '<span class="flex1">' + item.bankName + '（' + item.cardNo + '）' + '</span>'+
                    '<img src="./image/right.png"/>' +
                    '</div>';
                }
                $('.card-list').append(bankCardsHTML);
                toastShow = false;
            },
            function complete(xhr, status) {
                repaymentBanks();
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
        //还款信息
        let type = getUrlVal('repaymentType');
        httpPostForm(api.payInfo,{type: type},
            function success(result){
                console.log(result)
                let amount = result.data.amount;
                amount = amount ? Number(amount).toFixed(2) : 0;
                $('.amount').text(amount);
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
                $(document).dialog({
                    type : 'notice',
                    infoText: xhr.message ? xhr.message : '请求失败',
                    autoClose: 1500,
                    position: 'center'  // center: 居中; bottom: 底部
                });
            }
        )
    })();

    //银行卡支付跳转
    $('#bank-card-payment').click(function(){
        $('.popup-bank').addClass('popup-bank1');
        $('.card-co').show();
    })
    
    //支付宝支付跳转
    $('#alipay-payment').click(function(){
        window.location.href="../alipay-payment/index.html?token=" + getUrlVal('token') + '&type=' + getUrlVal('repaymentType'); 
    })

    //关闭
    $('.close').click(function(){
        $('.popup-bank').removeClass('popup-bank1');
    })

    //添加银行卡条状
    $('#add-card-btn').click(function(){
        window.location.href="../add-card/index.html?token=" + getUrlVal('token') + '&type=' + getUrlVal('repaymentType');  
    })

    //银行卡选择
    function repaymentBanks() {
        let ifBack = true;
        $('.repayment-banks').click(function(){
            if (!ifBack) {
                return;
            }
            ifBack = false;
            let curCard = $(this).children('span').text();
            $('.repayment-bank').html(curCard);
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
            
            //还款下单
            let type = getUrlVal('repaymentType');
            let cardId = $(this).attr('card-id');
            
            httpPostForm(api.payOrder,{type: type, cardId: cardId},
                function success(result){
                    toastShow = false;
                    window.location.href="../bank-card-payment/index.html?token=" + getUrlVal('token'); 
                },
                function complete(xhr, status) {
                    if (toast) {
                        toast.update({
                            infoIcon: '../../../public/image/icon/loading.gif',
                            infoText: '正在处理',
                            autoClose: 1,
                        });
                    }
                    ifBack = true;
                },
                function error(xhr, type){
                    toastShow = false;
                    if (xhr.code === 90011) {
                        const id = xhr.data ? xhr.data : '';
                        window.location.href="../repayment-result/index.html?token=" + getUrlVal('token') + '&id=' + id; 
                    } else {
                        $(document).dialog({
                            type : 'notice',
                            infoText: xhr.message ? xhr.message : '请求失败',
                            autoClose: 1500,
                            position: 'center'  // center: 居中; bottom: 底部
                        });
                    }
                }
            )
        })
    }
})