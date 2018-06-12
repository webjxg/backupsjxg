/**
 * Created by mac on 18/2/9.
 */
$(function(){
    //获取上下文路径
    var basePath = function(){
        var obj=window.location;
        var contextPath=obj.pathname.split("/")[1];
        // var path=obj.protocol+"//"+obj.host+"/"+contextPath;
        var path=obj.protocol+"//"+obj.host;
        return path;
    };


    var tokenType = getCookie("token_type"),
        authorization = getCookie("authorization");
    if(tokenType=null || tokenType == "" || authorization ==null || authorization == "") {

        location.href = basePath()+"/login.html";
    }
});