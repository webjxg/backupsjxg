/**
 * Created by mac on 18/1/24.
 */

/*$(function(){
    RenderiCheckTblBody();
});*/


//点击查询按钮
$("#search-btn").click(function(){
    pageLoad();
});
//退出
$("#quit-btn").click(function(){
    delCookie("authorization");
    delCookie("token_type");
    location.href="../html/login.html";
});
var layerAlert = function (info, icon){
    icon = icon||0;
    var title = icon==0?'警告':'消息';
    top.layer.alert(info, {skin:'layui-layer-molv', icon:icon, title:title});
};
//设置cookies
var setCookie = function(name,value,path) {
    var Days = 30;//30天
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    var pathTmp = path!=undefined?path:'/';
    document.cookie=name+"="+encodeURI(value)+";expires="+exp.toGMTString()+";path="+pathTmp;
};
//读取cookies
var getCookie = function(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return (decodeURI(arr[2]));
    else
        return '';
};
//删除cookies
function delCookie(name,path) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null){
        var pathTmp = path!=undefined?path:'/';
        document.cookie=name+"="+cval+";expires="+exp.toGMTString()+";path="+pathTmp;
    }
}

//获取文件后缀名
var getFileExt = function(FileName){
    return FileName.substring(FileName.lastIndexOf('.')+1, FileName.length).toLowerCase();
};

//获取上下文路径
var basePath = function(){
    var obj=window.location;
    var contextPath=obj.pathname.split("/")[1];
    var path=obj.protocol+"//"+obj.host+"/"+contextPath;
    return path;
};

//加载css/js
var include = function(id, path, file){
    if (document.getElementById(id)==null){
        var files = typeof file == "string" ? [file] : file;
        for (var i = 0; i < files.length; i++){
            var name = files[i].replace(/^\s|\s$/g, "");
            var ext = getFileExt(files[i]).toLowerCase();
            var isCSS = ext == "css";
            var fileref;
            if(isCSS==true){
                fileref = document.createElement('link');
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", path + name);
            }else{
                fileref = document.createElement('script');
                fileref.setAttribute("type", "text/javascript");
                fileref.setAttribute("src", path + name);
            }
            if(fileref){
                fileref.setAttribute("id", id);
                document.getElementsByTagName("head")[0].appendChild(fileref);
            }
        }
    }
};

//引入用户校验
include('checkUser',basePath()+'/js/','checkUser.js');


function RenderiCheckTblBody(){
    $('input.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });
    //全选多选
    $('th input[class="i-checks"]').on('ifChecked', function () {
        $('td input[class="i-checks"]').iCheck('check');
    });
    $('th input[class="i-checks"]').on('ifUnchecked', function () {
        $('td input[class="i-checks"]').iCheck('uncheck');
    });
}
function ajaxToServer(url, data, callbackFun){//传送的参数是josnString时
    var layerIndex = layer.load(2);
    url = url.toLowerCase().indexOf("http://") == 0? url : (admin_domain + url);
    // console.log("发起Ajax请求：", url, '参数：',data);
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
            // console.log("返回：",result);
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
function ajaxToServer1(url, data, callbackFun){  //传送的参数是string时
    var layerIndex = layer.load(2);
    url = url.toLowerCase().indexOf("http://") == 0? url : (admin_domain + url);
    // console.log("发起Ajax-1请求：", url, '参数：',data);
    $.ajax({
        headers:{
            Accept: "application/json; charset=utf-8",
            Authorization: getCookie("token_type")+" " +getCookie("authorization")
        },
        type: "post",
        url: url,
        data: data,
        dataType: 'json',
        contentType:'application/x-www-form-urlencoded',
        success: function(result){
            // console.log("返回：",result);
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

var lang = { //dataTable国际化配置
    "sLengthMenu": "每页显示 _MENU_ 条记录",
    "sInfoEmpty": "没有数据",
    "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
    "sZeroRecords": "没有找到符合条件的数据",
    "sLoadingRecords": "载入中..."
}

// 获取URL地址参数
function getQueryString(name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    if (!url || url == ""){
        url = window.location.search;
    }else{
        url = url.substring(url.indexOf("?"));
    }
    r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//动态添加Select的option
function createSelect(url,appendEl,valueField, labelFile){
    ajaxToServer(url,{},function(result){
        if(result.success){
            $(appendEl).html();
            valueField = valueField||'value';
            labelFile = labelFile||'label';
            var rows = result.rows,
                len = rows.length,
                html ='<option value="" selected="selected">--请选择--</option>';
            for(var i = 0;i<len;i++){
                html += '<option value="'+rows[i][valueField]+'">'+rows[i][labelFile] +'</option>'
            }
            $(appendEl).append(html);
        }else{
            layer.msg(result.message);
        }
    })
}

function resetSelect(obj, blankLabel){
    $(obj).empty();
    blankLabel = blankLabel || '-- 全部 --';
    $(obj).append("<option value=''>"+blankLabel+"</option>");
}
/**
 * 动态添加Select的option
 */
function appendOptionsValue(obj, rows, valueField, labelFile){
    if(typeof(obj) == "string"){
        obj = $(obj);
    }
    if(rows && rows.length > 0){
        var options = new Array();
        valueField = valueField||'value';
        labelFile = labelFile||'label';
        $(rows).each(function(i,o){
            options.push({'value':o[valueField], 'label':o[labelFile]});
        });
        appendOptions(obj, options);
    }
}

// 追加select的options
function appendOptions(obj, options){
    if(options){
        $(options).each(function(i,o){
            $(obj).append("<option value='"+o.value+"'>"+o.label+"</option>");
        });
    }
}

//  窗口工具操作事件
function windowclick(){
    $('.collapse-link>.fa').eq(0).click(function () {
            if ($('.collapse-link>.fa').hasClass('fa-chevron-up')) {
                $('.collapse-link>.fa').eq(0).addClass('fa-chevron-down').removeClass('fa-chevron-up');
                $('.ibox-content').slideUp('fast');
            } else {
                $('.collapse-link>.fa').eq(0).addClass('fa-chevron-up').removeClass('fa-chevron-down');
                $('.ibox-content').slideDown('fast');
            }
        }
    )
    $('.close-link>.fa').eq(0).click(function () {
        $('.wrapper-content').fadeOut("normal");
    })
}
//分配、撤销功能
function allotCancelItem(tableId,opflag,ifAllot,dataPrama,url){
    var str="",flag = true;
    $(tableId +" tbody tr td input.i-checks:checkbox").each(function(){
        if(true == $(this).is(':checked')) {
            var ifAllotText = "";
            ifAllotText = $(this).parents("tr").find('.ifAllot').text();
            str += "," + $(this).attr("id");
            if (ifAllotText == ifAllot) {
                var tit = "";
                if(ifAllot == "是"){
                    tit = "您所选的已有分配！"
                }else{
                    tit ="您所选的已有撤销的！"
                }
                top.layer.alert(tit, {icon: 0, title: '警告'});
                flag = false;
                return;
            }
        }
    });
    if(str == ""){
        top.layer.alert('请至少选择一条数据!', {icon: 0, title:'警告'});
    }
    if(flag){

        var data = {
            [dataPrama[0]]:id,
            [dataPrama[1]]:str.substr(1),
            opflag:opflag
        };
        ajaxToServer1(url,data,function (result) {
            if (result.success == true) {
                document.location.reload();
            }
        });
    }

};


//打开对话框(查看、选择上级菜单)
function openDialog(title,url,width,height,innerCallbackFn){
    if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){//如果是移动端，就使用自适应大小弹窗
        width='auto';
        height='auto';
    }else{//如果是PC端，根据用户设置的width和height显示。

    }
    var btns = ['关闭'];
    if(innerCallbackFn){
        btns = ['确定', '关闭'];
    }
    var layConfig = {
        type: 2,
        area: [width, height],
        title: title,
        maxmin: false, //开启最大化最小化按钮
        content: url ,
        btn: btns
    };
    if(innerCallbackFn) {
        layConfig.yes =  function(index, layero){
            var body = parent.layer.getChildFrame('body', index);  //获取子iframe
            var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            var inputForm = body.find('#inputForm');
            if(innerCallbackFn){
                innerCallbackFn(iframeWin.contentWindow,body,index);
            }
        };
        layConfig. cancel = function(index){

        }
    }else{
        layConfig.yes = function (index) {
            top.layer.close(index);

        }
    }
    var ind =  top.layer.open(layConfig);

}

//添加、修改
function openEditDialog(title,url,width,height,innerCallbackFn){
    var _top = top;
    var clickFlag = true;
    if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){//如果是移动端，就使用自适应大小弹窗
        width='auto';
        height='auto';
    }else{//如果是PC端，根据用户设置的width和height显示。
    }
    var ind =  _top.layer.open({
        type: 2,
        area: [width, height],
        title: title,
        maxmin: false, //开启最大化最小化按钮
        content: url ,
        btn: ['确定', '关闭'],
        yes: function(index, layero){
            var body = _top.layer.getChildFrame('body', index);  //获取子iframe
            var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            if(clickFlag){
                if(!innerCallbackFn){
                    iframeWin.contentWindow.doSubmit(iframeWin.contentWindow,body,index);
                }else{
                    //iframeWin.contentWindow[innerCallbackFn]();   //有bug  innerCallbackFn必须是字符串 待解决
                    // innerCallbackFn.call(iframeWin, body, index);
                    innerCallbackFn(iframeWin, body, index);

                }
                clickFlag = false;
                setTimeout(function(){
                    clickFlag = true;
                },3000);
            }
        },
        cancel: function(index){
        }
    });

}

//回调函数，在修改和添加时，供openDialog调用提交表单。
function doSubmit(){
    var formId = getSubmitFormId();
    var formObj =$(formId);
    // var formObj =$(formId,win?win.document:this);
    var url = formObj.attr('action');
    var validateFlag = formObj.validate({
        submitHandler: function(form){
            var formdata = JSON.stringify(formObj.serializeJSON());
            layer.msg('正在提交，请稍等...',{time: 1000});
            console.log(formdata);
            ajaxToServer(url,formdata,function(result){
                if(result.success == true){
                    layer.msg('已成功提交',{time: 1000});
                    setTimeout(function(){
//                        var src =top.getActiveTab().attr('src');
                        //获取父层
                        var index = top.layer.getFrameIndex(window.name);
                        //关闭弹出层
                        top.layer.close(index);
                        //刷新父层
                        var frameActive = top.getActiveTab().attr("name");
                        var obj = $('#refresh-btn', top.window.frames[frameActive].document);
                        if(obj.length == 0){
                            obj = $('#search-btn', top.window.frames[frameActive].document);
                        }
                        obj.trigger('click');
                    },1000);
                }else{
                    layerAlert(result.message)
                }
            });
        },
        errorContainer: "#messageBox",
        errorPlacement: function(error, element) {
            $("#messageBox").text("输入有误，请先更正。");
            if (element.is(":checkbox")||element.is(":radio")||element.parent().is(".input-append")){
                error.appendTo(element.parent().parent());
            } else {
                error.insertAfter(element);
            }
        }
    }).form;
    if(validateFlag){
        formObj.submit();
       // $(".layui-layer-btn0").css({"background":'red'});
    }
}





//打开对话框(查看)
function openDialogView(title,url,width,height){


    if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){//如果是移动端，就使用自适应大小弹窗
        width='auto';
        height='auto';
    }else{//如果是PC端，根据用户设置的width和height显示。

    }
    top.layer.open({
        type: 2,
        area: [width, height],
        title: title,
        maxmin: false, //开启最大化最小化按钮
        content: url ,
        btn: ['关闭'],
        cancel: function(index){
        }
    });

}

//修改数据
function edit(title,url,width,height,tableId){
    var len = $("#treeTable tbody tr td input.i-checks:checked").length;
    if(len == 0 ){
        top.layer.alert('请至少选择一条数据!', {icon: 0, title:'警告'});
        return;
    }

    if(len > 1 ){
        top.layer.alert('只能选择一条数据!', {icon: 0, title:'警告'});
        return;
    }
    var id =  $(tableId +" tbody tr td input.i-checks:checkbox:checked").attr("id");
    var url = url+"?id="+id;
    openEditDialog(title,url,width, height);
}

//删除单条数据
function deleteItem(mess,url,id){
    //var ids= eleP.find('input.i-checks').attr('id')
    var data = {ids:id} || {};
    top.layer.confirm(mess, {icon: 3, title:'系统提示'},function(index){
        ajaxToServer1(url,data,function(result){
            if(result.success == true){
                var frameActive = top.getActiveTab().attr("name");
                var obj = $('#search-btn', top.window.frames[frameActive].document);
                if(obj.length == 0){
                    obj = $('#refresh-btn', top.window.frames[frameActive].document);
                }
                obj.trigger('click');
            }
        });
        top.layer.close(index);
    });
    return false;
}

function deleteACallback(mess,callfn){
    top.layer.confirm(mess, {icon: 3, title:'系统提示'},function(index) {
        if (callfn) {
            callfn(index);
        }else{
            top.layer.close(index);
        }
    });
}

// 删除多条数据
function deleteAll(tit,url,tableId){
    var str="";
    var ids="";
    $(tableId +" tbody tr td input.i-checks:checkbox").each(function(){
        if(true == $(this).is(':checked')){
            str+=","+$(this).attr("id");
        }
    });
    if(str.length>0){
        var data = {
            ids:str.substr(1)
        };
        top.layer.confirm(tit, {icon: 3, title:'系统提示'}, function(index){
            ajaxToServer1(url,data,function (result) {
                if(result.success == true){
                    var frameActive = top.getActiveTab().attr("name");
                    var obj = $('#search-btn', top.window.frames[frameActive].document);
                    if(obj.length == 0){
                        obj = $('#refresh-btn', top.window.frames[frameActive].document);
                    }
                    obj.trigger('click');pageLoad();
                }else{
                    layer.msg(result.message);
                }
            });
            top.layer.close(index);
        });
    }else{
        top.layer.alert('请至少选择一条数据!', {icon: 0, title:'警告'});
    }



}
//删除成功后的回调函数
function deleteCheck(result){
    if(result.success){
        layer.msg('删除成功',{time: 1000});
        setTimeout(function(){
            refreshActiveTab();
        },1000)
    }
}


// 将获取到的数据动态插入到要展示的Dom结构中

function renderData(data,renderID){
    var arr = getJsonData(data);
    for(var i = 0;i<arr.length;i++){
        var obj = arr[i];
        var eleId = obj.name.replaceAll("\\.","\\.");
        var eleDom =  $("#"+eleId);
        if(eleDom.length == 0){
             eleDom =  $(renderID).find("*[name = '"+obj.name+"']");
        }
        if(eleDom.length>0){
            var eleType = eleDom[0].type;
            if(eleType){
                if(eleType == 'radio'){
                    setCheckboxValue(obj.name,obj.value);
                }else if(eleType == 'checkbox'){
                    setCheckboxValue(obj.name,obj.value);
                }else{
                    $(eleDom).val(obj.value);
                }
            }else{
                $(eleDom).text(obj.value);
            }

        }

    }
}


 function setCheckboxValue(name,values){
    var objs=document.getElementsByName(name);
    if(objs == null || values=='') return;
    var len=objs.length;
    var valArr;
    if(values instanceof Array){
        valArr = values;
    }else{
        valArr = values.split(',');
    }
    for(var i=0;i<len;i++) {
        if(valArr.contains(objs[i].value)){
            try{
                $(objs[i]).iCheck('check');
            }catch(e){
                objs[i].checked = true;
            }
        }else{
            try{
                $(objs[i]).iCheck('uncheck');
            }catch(e){
                objs[i].checked = false;
            }
            try{$(objs[i]).val(value).trigger("change");}catch(e){}
        }
    }
}
//数组是否包含
Array.prototype.contains = function(item){
    return RegExp("(^|,)" + item.toString() + "($|,)").test(this);
};
//字符串替换
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        if(reallyDo=="?") return this.replace(/\?/g,replaceWith);
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
};

//获取json数据，遍历数据。返回数组对象
function getJsonData(data, arr, key){
    if(key==undefined)key='';
    if(arr==undefined)arr=new Array();
    for(var item in data){
        var value = data[item];
        if( value instanceof Array || typeof value != 'object' ){
            var ret = key==''?item:(key+"."+item)
            arr.push({'name':ret, 'value':value}); //将获取到的属性名称赋值给"name",属性值赋值给"value"
        }else{
            var ret = key==''?item:(key+"."+item);
            getJsonData(value, arr, ret);
        }
    }
    return arr;
}



// 选择图标icon
$("#iconButton").click(function(){
    var selVal = $('#icon').val();
    top.layer.open({
        type: 2,
        maxmin: false,
        title:"选择图标",
        area: ['700px',  $(top.document).height()-180+"px"],
        content: '../html/iconselect.html?selVal='+selVal,
        btn: ['确定', '关闭'],
        yes: function(index, layero){ //或者使用btn1
            var icon = layero.find("iframe")[0].contentWindow.$("#icon").val();
            $("#iconIcon").attr("class", "fa "+icon);
            $("#iconIconLabel").text(icon);
            $("#icon").val(icon);
            top.layer.close(index);
        },cancel: function(index){ //或者使用btn2

        }
    });
});

$("#iconclear").click(function(){
    $("#iconIcon").attr("class", "icon- hide");
    $("#iconIconLabel").text("无");
    $("#icon").val("");

});
/**
 * 动态创建iframe
 * @param frameDivID
 * @param frameId
 * @param action
 * @returns {Element}
 */
function createTagFrame(frameDivID,action,frameId){
    frameId = frameId || action;
    var frameDivCont = document.getElementById(frameDivID);
    var tabFrame = document.getElementById(frameId);
    if(tabFrame==null || tabFrame==undefined){
        tabFrame = document.createElement("iframe");
        tabFrame.id=frameId;
        tabFrame.style.width="100%";
        tabFrame.marginWidth="0";
        tabFrame.frameBorder="0";
        tabFrame.frameSpacing="0";
        tabFrame.scrolling="no";
        tabFrame.style.overflow = "hidden";
        frameDivCont.appendChild(tabFrame);
    }
    if(action!=undefined && action!='' && tabFrame.src==""){
        tabFrame.src = action;
    }
    /* if(tabFrame.attachEvent){
         tabFrame.attachEvent("onload",setFrameHeight);
     }else{
         tabFrame.oncload=setFrameHeight;
     }*/
    tabFrame.style.display="inline";
    return frameDivCont;
}

/**
 * 设置iFrame高度，在iframe内部页面调用
 */
function setFrameHeight(offsetHeight_){
    var frames = window.parent.document.getElementsByTagName("iframe");
    for(var i = 0; i < frames.length; i++) {
        var f = frames[i];
        if (null != f && f.style.display != "none") {
            var h = document.body.scrollHeight+50+(offsetHeight_||0);
            f.style.height = h+"px";
        }
    }
}
/*jQuery.validator.addMethod("notblank", function(value, element) {
    var pwdblank = /^\S*$/;
    return this.optional(element) ||(pwdblank.test(value));
}, "密码不可包含空格");*/


