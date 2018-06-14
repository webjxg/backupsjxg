/*
 * Jquery扩展：序列化选择器下表单（不仅支持form，而且支持容器），重要的是支持嵌套属性！
 * @see: $(selector).serializeJSON();
 */
$.fn.serializeJSON=function(){
    var o = {};
    var a = this.serializeArray();
    if(a.length == 0){
        $(this).find('input,textarea,select,:checkbox,:radio').each(function(_i,_o){
            a.push(_o);
        });
    }
    $.each(a, function() {
        if($(this).prop('disabled')!=true){
            var name = this.name;
            var value = this.value;
            var paths = this.name.split(".");
            var len = paths.length;
            var obj = o;
            $.each(paths,function(i,e){
                if(i == len-1){
                    if (obj[e]) {
                        if (!obj[e].push) {
                            obj[e] = [obj[e]];
                        }
                        obj[e].push(value || '');
                    } else {
                        obj[e] = value || '';
                    }
                }else{
                    if(!obj[e]){
                        obj[e] = {};
                    }
                }
                obj = o[e];
            });
        }
    });
    return o;
};

function ajaxToServer(url, data, callbackFun){//传送的参数是josnString时
    var layerIndex = layer.load(2);
    url = url.toLowerCase().indexOf("http://") == 0? url : (admin_domain + url);
    console.log("发起Ajax请求：", url, '参数：',data);
    $.ajax({
        headers:{
            Accept: "application/json; charset=utf-8",
            Authorization: getCookie("token_type")+" " +getCookie("authorization")
        },
        type: "post",
        url: url,
        data: data,
        dataType: 'json',
        contentType:'application/json',
        success: function(result){
            layer.close(layerIndex);
            // 如果在框架或在对话框中，则弹出提示并跳转到首页
            if(result.success == false){
                alert(result.message);
            }
            if(callbackFun){
                callbackFun(result);
            }

        },
        error:function(){
            layer.close(layerIndex);
            layer.msg('请求服务器异常.');
        }
    });
}



//登录判断开始
$("#loginName,#password").keyup(function () {
    var $val = $.trim($(this).val());
    if($val == ""){
        $(".login-error").empty().fadeIn(1000).html("用户名或密码不能为空!");
    }else{
        $(".login-error").fadeOut(400);
    }
});
$("#loginName,#password").blur(function(){
    $(".login-error").fadeOut(400);
});

//提交按钮
$(".login-submit").click(function(){
    if($.trim($("#loginName").val())== "" || $.trim($("#password").val()) == "") {
        $(".login-error").empty().fadeIn(1000).html("用户名或密码不能为空!");
    }else{
        var data = JSON.stringify($("#loginSubmit").serializeJSON());
        ajaxToServer("/oauth/token",data,function(result){
            if(result.success == true){
                setCookie("authorization",result.accessToken.authorization);
                setCookie("token_type",result.accessToken.token_type);
                setCookie("userName",result.user.name);
                setCookie("loginName",result.user.loginName);
                setCookie("loginUserid",result.user.id);
                location.href="index.html";
            }else{
                if(result.retCode == "30006"){
                    $(".login-error").empty().fadeIn(1000).html("账户已被禁用!");
                }else{
                    $(".login-error").empty().fadeIn(1000).html("用户名或密码不正确!");
                }

            }
        })
    }
});

// 记住密码
$("#rememberMe").change(function(){
    setCookie("rememberMe",this.checked?"true":"false");
});
var rememberMe = getCookie("rememberMe");
if(rememberMe == "true"){
    var tokenType = getCookie("token_type"),
        authorization = getCookie("authorization");
    if(tokenType && tokenType != "" && authorization && authorization != ""){
        location.href="index.html";
    }else{
        $("#loginName").val(getCookie("loginName"));
        $("#rememberMe").prop("checked",true);
    }
}
//回车登录
$("body").keydown(function () {
    keyLogin();
});
function keyLogin(){
    if (event.keyCode==13)  //回车键的键值为13
        $(".login-submit").click();
}



