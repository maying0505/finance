$(function(){
    //还款状态查询
    let crawlerToken = getUrlVal('crawlerToken');
    let crawlerId = getUrlVal('crawlerId');
    authenticationQuery();
    function authenticationQuery() {
        httpPostForm(api.huachenOperatorAsk,{crawlerId,crawlerToken},
            function success(result){
                $('.state0').hide();
                $('.state1').show();
                $('.state2').hide();
            },
            function complete(xhr, status) {
                
            },
            function error(xhr, type){
                $('.state0').hide();
                $('.state1').hide();
                $('.state2').show();
                $(document).dialog({
                    type : 'notice',
                    infoText: xhr.message ? xhr.message : '请求失败',
                    autoClose: 2000,
                    position: 'center'  // center: 居中; bottom: 底部
                });
            }
        )
    }

})