$(function() {
    let masterCardId = '';
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
                if (bankCards.length > 0) {
                    $('.master-card').text(bankCards[0]['bankName']+'（'+bankCards[0]['cardNo']+'）');
                    masterCardId = bankCards[0]['id'];
                }
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
    
    //支付宝支付跳转
    $('#alipay-payment').click(function(){
        window.location.href="../alipay-payment/index.html?token=" + getUrlVal('token') + '&type=' + getUrlVal('repaymentType'); 
    })

    //银行卡支付跳转
    function repaymentBanks() {
        let ifBack = true;
        $('#bank-card-payment').click(function(){
            if (!ifBack) {
                return;
            }
            ifBack = false;
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
            
            httpPostForm(api.payOrder,{type: type, cardId: masterCardId},
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