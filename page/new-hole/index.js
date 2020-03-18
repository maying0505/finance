$(function(){
    let u = navigator.userAgent;
    $('.module-top').click(function(){
        try {
            if (u.indexOf('Android') !== -1 || u.indexOf('Linux') !== -1) {//安卓手机
                h5_android.openWebViewActivity("https://www.baidu.com");
            } else if (u.indexOf('iPhone') !== -1) {//苹果手机
                nativeMethod.returnNativeMethod('{"type":"4","url":"https://www.baidu.com"}');
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