$(function(){
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
    (function pretreatment () {//预处理
        let type = getUrlVal('type');
        //获取信息
        
        httpPostForm(api.payAlipayInfo,{type: type},
            function success(result){
                console.log(result)
                let amount = result.data.amount;
                amount = amount ? Number(amount).toFixed(2) : 0;
                $('.amount').text(amount);
                let alipayAccount = result.data.alipayAccount;
                $('.alipay-account').text(alipayAccount);
                let alipayName = result.data.alipayName;
                $('.alipay-name').text(alipayName);
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
                    position: 'center' 
                });
            }
        )
    })();

    //复制支付宝账户
    $('.orange-btn').click(function(){
        let copyObj = document.getElementById("copy-text");
        copyObj.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        document.activeElement.blur();
        console.log(copyObj)
        $(document).dialog({
            type : 'notice',
            infoText: '复制成功',
            autoClose: 1500,
            position: 'center' 
        });
    })
})