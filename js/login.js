//var canvas = document.getElementById("myCanvas");
//canvas.width = document.documentElement.clientWidth;
//canvas.height = document.documentElement.clientHeight;
//var ctx = canvas.getContext("2d");
////创建小球的构造函数
//function Ball() {
//    this.x = randomNum(3, canvas.width - 3);
//    this.y = randomNum(3, canvas.height - 3);
//    this.r = randomNum(1, 2);
//    // this.color = randomColor();
//    this.color = "#b9bfc4";
//    this.speedX = randomNum(-2, 2) * 0.2;
//    this.speedY = randomNum(-1, 1) * 0.2;
//}
//Ball.prototype = {
//    //绘制小球
//    draw: function() {
//        ctx.beginPath();
//        ctx.globalAlpha = 1;
//        ctx.fillStyle = this.color;
//        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
//        ctx.fill();
//    },
//    //小球移动
//    move: function() {
//        this.x += this.speedX;
//        this.y += this.speedY;
//        //为了合理性,设置极限值
//        if (this.x <= 3 || this.x > canvas.width - 3) {
//            this.speedX *= -1;
//        }
//        if (this.y <= 3 || this.y >= canvas.height - 3) {
//            this.speedY *= -1;
//        }
//    }
//}
////存储所有的小球
//var balls = [];
////创建200个小球
//for (var i = 0; i < 100; i++) {
//    var ball = new Ball();
//    balls.push(ball);
//}
//main();
//function main() {
//    ctx.clearRect(0, 0, canvas.width, canvas.height);
//    //鼠标移动绘制线
//    mouseLine();
//    //小球与小球之间自动画线
//    drawLine();
//    //使用关键帧动画，不断的绘制和清除
//    window.requestAnimationFrame(main);
//}
////添加鼠标移动事件
////记录鼠标移动时的mouseX坐标
//var mouseX;
//var mouseY;
//canvas.onmousemove = function(e) {
//    var ev = event || e;
//    mouseX = ev.offsetX;
//    mouseY = ev.offsetY;
//}
////判断是否划线
//function drawLine() {
//    for (var i = 0; i < balls.length; i++) {
//        balls[i].draw();
//        balls[i].move();
//        for (var j = 0; j < balls.length; j++) {
//            if (i != j) {
//                if (Math.sqrt(Math.pow((balls[i].x - balls[j].x), 2) + Math.pow((balls[i].y - balls[j].y), 2)) < 80){
//                    ctx.beginPath();
//                    ctx.moveTo(balls[i].x, balls[i].y);
//                    ctx.lineTo(balls[j].x, balls[j].y);
//                    // ctx.strokeStyle = "#13273b";
//                    ctx.strokeStyle = "#13273b";
//                    ctx.globalAlpha = 0.2;
//                    ctx.stroke();
//                }
//            }
//        }
//    }
//}
////使用鼠标移动划线
//function mouseLine() {
//    for (var i = 0; i < balls.length; i++) {
//        if (Math.sqrt(Math.pow((balls[i].x - mouseX), 2) + Math.pow((balls[i].y - mouseY), 2)) < 80) {
//            ctx.beginPath();
//            ctx.moveTo(balls[i].x, balls[i].y);
//            ctx.lineTo(mouseX, mouseY);
//            ctx.strokeStyle = "white";
//            ctx.globalAlpha = 0.8;
//            ctx.stroke();
//        }
//    }
//}
////随机函数
//function randomNum(m, n) {
//    return Math.floor(Math.random() * (n - m + 1) + m);
//}
////随机颜色
//function randomColor() {
//    return "rgb(" + randomNum(0, 255) + "," + randomNum(0, 255) + "," + randomNum(0, 255) + ")";
//}
//

//canvas连线结束



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
            // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6ImFkbWluIiwiYXVkIjoiQWRtaW4gSldUIE9ubGluZSJ9.0fEB0SHaUfc10ARex-BCLPmOxbbr5vgcMfvivQKY1Rc"
        },
        type: "post",
        url: url,
        data: data,
        dataType: 'json',
        contentType:'application/json',
        success: function(result){
            console.log("返回：",result);
            layer.close(layerIndex);
            if(result.success == false){
                if(result.retCode == "30009"){  //用户登录信息失效
                    alert('用户登录信息失效,请重新登录');
                    //$("#quit-btn",top.document).children("i").trigger("click");
                    top.location.href='../html/login.html';
                    return;
                }
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

