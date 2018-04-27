
/*$(function(){
 RenderiCheckTblBody();
 });*/
var urlPrefix = "http://114.115.165.184:8083/aps-api";
// var urlPrefix = "http://192.168.45.91:8083/aps-api";
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

/**
 * 后端接口中的参数是对象，前端传送的参数是josnString时
 * @param url
 * @param data
 * @param callbackFun
 */
function ajaxToServer(url, data, callbackFun){
    var layerIndex = layer.load(2);
    url = url.toLowerCase().indexOf("http://") == 0? url : (urlPrefix + url);
    $.ajax({
        headers:{
            Accept: "application/json; charset=utf-8",
            // Authorization: getCookie("token_type")+" " +getCookie("authorization")，
            Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6ImFkbWluIiwiYXVkIjoiQWRtaW4gSldUIE9ubGluZSJ9.0fEB0SHaUfc10ARex-BCLPmOxbbr5vgcMfvivQKY1Rc"
        },
        type: "post",
        url: url,
        data: data,
        dataType: 'json',
        contentType:'application/json',
        success: function(result){
            layer.close(layerIndex);
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

/**
 * form提交方式：后端接口中的参数不是对象
 * @param url
 * @param data
 * @param callbackFun
 */
function ajaxToServer1(url, data, callbackFun){  //传送的参数是string时
    var layerIndex = layer.load(2);
    url = url.toLowerCase().indexOf("http://") == 0? url : (urlPrefix + url);
    console.log(url);
    $.ajax({
        headers:{
            Accept: "application/json; charset=utf-8",
            // Authorization: getCookie("token_type")+" " +getCookie("authorization")
            Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6ImFkbWluIiwiYXVkIjoiQWRtaW4gSldUIE9ubGluZSJ9.0fEB0SHaUfc10ARex-BCLPmOxbbr5vgcMfvivQKY1Rc"
        },
        type: "post",
        url: url,
        data: data,
        dataType: 'json',
        contentType:'application/x-www-form-urlencoded',
        success: function(result){
            layer.close(layerIndex);
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

//刷新当前选中tab对应的iframe
function refreshActiveTab() {
    var target = top.getActiveTab();
    var url = target.attr('src');
    console.log(url);
    var t = top.layer;
    //显示loading提示
    var loading = t.load();
    if(url){
        target.attr('src', url).load(function () {
            //关闭loading提示
            t.close(loading);
        })
    }

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



//动态添加Select的option
function createSelect(url,appendEl){
    ajaxToServer(url,{},function(result){
        if(result.success){
            $(appendEl).html();
            var rows = result.rows,
                len = rows.length,
                html ='<option value="" selected="selected"></option>';
            for(var i = 0;i<len;i++){
                html += '<option value="'+rows[i].type+'">'+rows[i].type +'</option>'
            }
            $(appendEl).append(html);
        }else{
            layer.msg(result.message);
        }
    })
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
        console.log(data);
        console.log(url)
        ajaxToServer1(url,data,function (result) {
            if (result.success == true) {
                document.location.reload();
            }
        });
    }

};


//打开对话框(查看、选择上级菜单)
function openDialog(title,url,width,height,innerCallbackFn){
    console.log(url);
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
        maxmin: true, //开启最大化最小化按钮
        content: url ,
        btn: btns
    };
    if(innerCallbackFn) {
        layConfig.yes =  function(index, layero){
            var body = top.layer.getChildFrame('body', index);  //获取子iframe
            var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            var inputForm = body.find('#inputForm');
            if(innerCallbackFn){
                innerCallbackFn(iframeWin.contentWindow,body,index);
            }
        },
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
    var clickFlag = true;
    if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){//如果是移动端，就使用自适应大小弹窗
        width='auto';
        height='auto';
    }else{//如果是PC端，根据用户设置的width和height显示。
    }
    var ind =  top.layer.open({
        type: 2,
        area: [width, height],
        title: title,
        maxmin: true, //开启最大化最小化按钮
        content: url ,
        btn: ['确定', '关闭'],
        yes: function(index, layero){
            var body = top.layer.getChildFrame('body', index);  //获取子iframe
            var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            if(clickFlag){
                if(!innerCallbackFn){
                    iframeWin.contentWindow.doSubmit(iframeWin.contentWindow,body,index);
                }else{
                    //iframeWin.contentWindow[innerCallbackFn]();   //有bug  innerCallbackFn必须是字符串 待解决
                    innerCallbackFn.call(iframeWin.contentWindow,iframeWin.contentWindow,body,index);
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
            console.log(formdata);
            layer.msg('正在提交，请稍等...',{time: 1000});
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
                            if(obj.length == 0){
                                top.refreshActiveTab();
                            }

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
        maxmin: true, //开启最大化最小化按钮
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
                    if(obj.length == 0){

                        top.refreshActiveTab();
                    }

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
    // console.log(arr)

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
                    console.log(eleDom,obj.value);
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
function createTagFrame(frameDivID,frameId,action){
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
function setFrameHeight(){
    var frames = window.parent.document.getElementsByTagName("iframe");
    for(var i = 0; i < frames.length; i++) {
        var f = frames[i];
        if (null != f && f.style.display != "none") {
            f.style.height = (document.body.scrollHeight+50)+"px";
        }
    }
}



