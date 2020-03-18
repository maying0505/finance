$(function(){
    $('.main-container li').click(function(){
        console.log($(this).find('p').text())
        console.log($(this).attr('data-id'))
        let type = $(this).attr('data-id');
        window.location.href="./detail/index.html?answerType=" + type;
    })

    let u = navigator.userAgent;
     //在线咨询
     $('#online').click(function(){
        try {
            if (u.indexOf('Android') !== -1 || u.indexOf('Linux') !== -1) {//安卓手机
                // h5_android.call("2");
            } else if (u.indexOf('iPhone') !== -1) {//苹果手机
                nativeMethod.returnNativeMethod('{"type":"0"}');
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

    //电话咨询
    
    $('.phone').click(function(){
        try {
            if (u.indexOf('Android') !== -1 || u.indexOf('Linux') !== -1) {//安卓手机
                h5_android.call("15111201071");
            } else {
                nativeMethod.returnNativeMethod('{"type":"1","phone":"15111201071"}');
            }
        } catch (e) {
            $(document).dialog({
                type : 'notice',
                infoText: '拨打失败',
                autoClose: 1500,
                position: 'center' 
            });
        }
    })

   
})