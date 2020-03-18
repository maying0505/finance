$(function () {
    const bankSelectInit=[{'id':'','value':'请选择'}];
    let merchOrderId = '';
    let orderId = '';
    let bankSelectArr = [];
    let selectBank = '';
    let bankOk = false;
    let bankSelect = new MobileSelect({
        trigger: '#bank',
        title: '选择银行',
        wheels: [
                    {data: bankSelectInit}
                ],
        position:[0], //初始化定位 打开时默认选中的哪个 如果不填默认为0
        transitionEnd:function(indexArr, data){
            console.log(data);
        },
        callback:function(indexArr, data){
            if (data[0].id) {
                $('#bank').text(data[0].value);
            }
            if (selectBank !== data[0].id) {
                selectBank = data[0].id;
                $("#card-no").val('');
            }
           
        }
    });
    (function pretreatment () {//预处理
        $('#name').text(getUrlVal('name') ? getUrlVal('name') : '');
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
        
        //获取所有银行
        httpGet( api.getBankName,{},
            function success(result){
                console.log(result);
                bankSelectArr = result.data ? result.data : [];
                bankSelect.updateWheel(0,result.data ? result.data : bankSelectInit);
                toastShow = false;
            },
            function complete(xhr, status) {
                if (toast){
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
    //定义一个60秒计时器变量
    let countdown = 60;
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

    $("#vcode-get").focus(function(){
        document.activeElement.blur();//阻止键盘弹出
    });

    $('#vcode-get').click(function(){//获取验证码
        let param = {};
        param.type = 2;
        // param.name = getUrlVal('name');
        // param.type = 1;
        // let bank = $('#bank').text();
        // if (bank && selectBank) {
        //     param.bankName = $('#bank').text();
        //     param.bankNo = selectBank;
        // } else {
        //     $(document).dialog({
        //         type : 'notice',
        //         infoText: '请选择银行',
        //         autoClose: 1500,
        //         position: 'center'  // center: 居中; bottom: 底部
        //     });
        //     return;
        // }
        // let cardNo = $('#card-no').val();
        // if (cardNo && bankOk) {
        //     param.cardNo = cardNo;
        // } else {
        //     $(document).dialog({
        //         type : 'notice',
        //         infoText: '请填写正确的银行卡号',
        //         autoClose: 1500,
        //         position: 'center'  // center: 居中; bottom: 底部
        //     });
        //     return;
        // }
        let mobile = $('#mobile').val();
        if(!(/^1[0-9]\d{9}$/.test(mobile))){ 
            mobile = '';
        }
        if (mobile) {
            param.mobile = mobile;
        } else {
            $(document).dialog({
                type : 'notice',
                infoText: '请填写正确的手机号',
                autoClose: 1500,
                position: 'center'  // center: 居中; bottom: 底部
            });
            return;
        }
        let that = this;
        httpPostForm( api.smsSendCaptcha,param,
            function success(result){
                console.log(result);
                let token = getUrlVal('token');
                if (result.data && result.data.status && result.data.status == 0 && result.data.returnUrl) {
                    window.location.href=result.data.returnUrl;
                } else if(result.data && result.data.status && result.data.status == 1) {
                    window.location.href="../tied-card/index.html?token=" + token;
                } 

                merchOrderId = result.data && result.data.merchOrderId ? result.data.merchOrderId:'';
                orderId = result.data && result.data.orderId? result.data.orderId : '';
                $(document).dialog({
                    type : 'notice',
                    infoText: '发送成功',
                    autoClose: 1500,
                    position: 'center'  // center: 居中; bottom: 底部
                });
                settime(that);
            },
            function complete(xhr, status) {
                
            },
            function error(xhr, type){
                $(document).dialog({
                    type : 'notice',
                    infoText: xhr.message ? xhr.message : '发送失败',
                    autoClose: 1500,
                    position: 'center'  // center: 居中; bottom: 底部
                });
            }
        )
    })

    

    //确定绑卡跳转
    $('.orange-btn').click(function(){
        //表单验证
        let bankSaveParam = {};
        bankSaveParam.type = 1;
        bankSaveParam.merchOrderId = merchOrderId;
        bankSaveParam.orderId = orderId;
        bankSaveParam.name = getUrlVal('name');
        let bank = $('#bank').text();
        if (bank && selectBank) {
            bankSaveParam.bankNo = selectBank;
        } else {
            $(document).dialog({
                type : 'notice',
                infoText: '请选择银行',
                autoClose: 1500,
                position: 'center'  // center: 居中; bottom: 底部
            });
            return;
        }
        let cardNo = $('#card-no').val();
        if (cardNo && bankOk) {
            bankSaveParam.cardNo = cardNo;

        } else {
            $(document).dialog({
                type : 'notice',
                infoText: '请填写正确的银行卡号',
                autoClose: 1500,
                position: 'center'  // center: 居中; bottom: 底部
            });
            return;
        }
        let mobile = $('#mobile').val();
        if(!(/^1[0-9]\d{9}$/.test(mobile))){ 
            mobile = '';
        }
        if (mobile) {
            bankSaveParam.mobile = mobile;
        } else {
            $(document).dialog({
                type : 'notice',
                infoText: '请填写正确的手机号',
                autoClose: 1500,
                position: 'center'  // center: 居中; bottom: 底部
            });
            return;
        }
        let verificationCode = $('#verificationCode').val();
        if (verificationCode) {
            bankSaveParam.verificationCode = verificationCode;
        } else {
            $(document).dialog({
                type : 'notice',
                infoText: '请填写验证码',
                autoClose: 1500,
                position: 'center'  // center: 居中; bottom: 底部
            });
            return;
        }
        console.log(bankSaveParam)
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
        
        httpPostForm( api.bankSave,bankSaveParam,
            function success(result){
                toastShow = false;
                $(document).dialog({
                    type : 'notice',
                    infoText: '绑定成功',
                    autoClose: 1500,
                    position: 'center',
                    onClosed: function(){
                        let token = getUrlVal('token');
                        if (result.data && result.data.status && result.data.status == 0 && result.data.returnUrl) {
                            window.location.href=result.data.returnUrl;
                        } else if(result.data && result.data.status && result.data.status == 1) {
                            window.location.href="../tied-card/index.html?token=" + token;
                        }
                    }
                });
                
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
        // return false;
        // window.location.href="../tied-card/index.html"; 
    })
    
    $("#card-no").on({ //填完银行卡后 
        blur:function(event) {  
          console.log(event.target.value)
          let value = event.target.value;
          if (value) {
            httpGet( api.bankGetCode,{bankCard:value},
                function success(result){
                    console.log(result);
                    console.log(bankSelectArr)
                    let curBank = result.data.bank;
                    for (let i in bankSelectArr) {
                        if (bankSelectArr[i]['id'] === curBank) {
                            bankSelect.locatePosition(0,i);
                            $('#bank').text(bankSelectArr[i].value); 
                            selectBank = bankSelectArr[i].id;
                        }
                        console.log(bankSelectArr[i]['id'],curBank)
                    }
                    bankOk = true;
                },
                function complete(xhr, status) {
                    
                },
                function error(xhr, type){
                    bankOk = false;
                    $(document).dialog({
                        type : 'notice',
                        infoText: xhr.message ? xhr.message : '请求失败',
                        autoClose: 1500,
                        position: 'center'  // center: 居中; bottom: 底部
                    });
                }
            )
          }
        }  
    })  
    
})