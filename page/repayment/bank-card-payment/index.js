$(function () {
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
       // 查询信息
        httpGet(api.payConfirmInfo,{},
           function success(result){
               let name = result.data.name;
               let amount = result.data.amount;
               amount = amount ? Number(amount).toFixed(2) : 0;
               let cardNo = result.data.cardNo;
               let mobile = result.data.mobile;
               $('.name').text(name);
               $('.amount').text(amount);
               $('.card-no').text(cardNo);
               $('.mobile').text(mobile);
            //    if (result.data.payChannel === '1') {
                    settime($('#vcode-get')[0]);
            //    }
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

   function payCaptcha() {
        // 验证码发送
        httpPost(api.payCaptcha,{},
            function success(result){
                $(document).dialog({
                    type : 'notice',
                    infoText: '验证码发送成功',
                    autoClose: 1500,
                    position: 'center'  
                });
            },
            function complete(xhr, status) {
                console.log(xhr,status);
            },
            function error(xhr, type){
                $(document).dialog({
                    type : 'notice',
                    infoText: xhr.message ? xhr.message : '请求失败',
                    autoClose: 1500,
                    position: 'center'  
                });
            }
        )
   }
    //定义一个200秒计时器变量
    let countdown = 200;
    //倒计时函数
    function settime(obj) {
        //开始判断倒计时是否为0
        if (countdown == 0) {
            obj.removeAttribute("disabled");
            obj.value = "获取验证码";
            countdown = 60;
            //立即跳出settime函数，不再执行函数后边的步骤
            return;
        } else {
            obj.setAttribute("disabled", true);
            obj.value = "重新发送(" + countdown + ")";
            countdown--;
        }
        //过1秒后执行倒计时函数
        setTimeout(function () {
            settime(obj);
        }, 1000)
    }

    //获取验证码
    $('#vcode-get').click(function(){
        payCaptcha();
        settime(this);
    })

    //确认支付
    $('.orange-btn').click(function(){
        
        let captcha = $('#vcode').val();
        if (!captcha) {
            $(document).dialog({
                type : 'notice',
                infoText: '请填写验证码',
                autoClose: 1500,
                position: 'center'  
            });
            return false;
        }
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
        httpPostForm(api.payConfirm,{captcha: captcha},
           function success(result){
                toastShow = false;
                let id = result.data;
                $(document).dialog({
                    type : 'notice',
                    infoText: '支付成功',
                    autoClose: 1500,
                    position: 'center'  
                });
                window.location.href="../repayment-result/index.html?token=" + getUrlVal('token') + '&id=' + id; 
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
       
    })
})