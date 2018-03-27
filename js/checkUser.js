/**
 * Created by mac on 18/2/9.
 */
$(function(){
    var tokenType = getCookie("token_type"),
        authorization = getCookie("authorization");
    if(tokenType=null || tokenType == "" || authorization ==null || authorization == "") {
        location.href = "../html/login.html";
    }
})