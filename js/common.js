$(function(){
    //判断浏览器是否支持html5本地存储
    function localStorageSupport() {
        return (('localStorage' in window) && window['localStorage'] !== null)
    };

    // $("#side-menu").metisMenu();

    $('.navbar-mini-btn').click(function(){
        $('body').toggleClass('nav-mini');
        SmoothlyMenu();
    });
    function SmoothlyMenu() {
        if (!$('body').hasClass('nav-mini')) {
            $('#side-menu').hide();
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(500);
                }, 100);
        } else if ($('body').hasClass('nav-fixed')) {
            $('#side-menu').hide();
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(500);
                }, 300);
        } else {
            $('#side-menu').removeAttr('style');
        }
    };
    function NavToggle(){
        $('.navbar-mini-btn').trigger('click');
    };
    $('#side-menu>li').click(function () {
        if ($('body').hasClass('nav-mini')) {
            NavToggle();
        }
    });
    $('#side-menu>li li a').click(function(){
        if ($(window).width() < 769) {
            NavToggle();            
        }
    });
    //浏览器窗口
    $(window).bind("load resize", function () {
        if ($(this).width() < 769) {
            $('body').addClass('nav-mini');
            $('.navbar-static-side').fadeIn();
        }
    });
    // 主题设置
    $('.theme-icon').click(function () {
        $(".theme-config-box").toggleClass("show");
        $(".skin-settings").toggleClass("show");
    });
    // 收起左侧菜单
    $('#toggleMenu').click(function () {
        if ($('#toggleMenu').is(':checked')) {
            $("body").addClass('nav-mini');
            SmoothlyMenu();
            if (localStorageSupport) {
                localStorage.setItem("toggleMenu",'on');
            }
        } else {
            $("body").removeClass('nav-mini');
            SmoothlyMenu();
            if (localStorageSupport) {
                localStorage.setItem("toggleMenu",'off');
            }
        }
    });
    // 固定顶部
    $('#fixednavbar').click(function () {
        if ($('#fixednavbar').is(':checked')) {
            $("body").removeClass('fixed-layout');
            $("body").addClass('fixed-nav');
            $('#fixedlayout').prop('checked', false);

            if (localStorageSupport) {
                localStorage.setItem("fixedlayout",'off');
            }

            if (localStorageSupport) {
                localStorage.setItem("fixednavbar",'on');
            }
        } else {
            $("body").removeClass('fixed-nav');

            if (localStorageSupport) {
                localStorage.setItem("fixednavbar",'off');
            }
        }
    });

    // 固定宽度
    $('#fixedlayout').click(function () {
        if ($('#fixedlayout').is(':checked')) {
            $("body").addClass('fixed-layout');
            $('#fixednavbar').prop('checked', false);
            $("body").removeClass('fixed-nav');
            if (localStorageSupport) {
                localStorage.setItem("fixednavbar",'off');
            }
            if (localStorageSupport) {
                localStorage.setItem("fixedlayout",'on');
            }
        } else {
            $("body").removeClass('fixed-layout');

            if (localStorageSupport) {
                localStorage.setItem("fixedlayout",'off');
            }
        }
    });

    //读取cookie
    if (localStorageSupport) {
        var toggleMenu = localStorage.getItem("toggleMenu");
        var fixednavbar = localStorage.getItem("fixednavbar");
        var fixedlayout = localStorage.getItem("fixedlayout");
       
        if (toggleMenu == 'on') {
            $('#toggleMenu').prop('checked','checked')
        }
        if (fixednavbar == 'on') {
            $('#fixednavbar').prop('checked','checked')
        }
        if (fixedlayout == 'on') {
            $('#fixedlayout').prop('checked','checked')
        }
        var body = $('body');

        if (toggleMenu == 'on') {
            if (!body.hasClass('body-small')) {
                body.addClass('nav-mini');
            }
        }

        if (fixednavbar == 'on') {
            body.addClass('fixed-nav');
        }

        if (fixedlayout == 'on') {
            body.addClass('fixed-layout');
        }
    }


});
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
//获取上下文路径
var basePath = function(){
    var obj=window.location;
    var contextPath=obj.pathname.split("/")[1];
    var path=obj.protocol+"//"+obj.host+"/"+contextPath;
    return path;
};
function setFrameHeight(){
    var frames = window.parent.document.getElementsByTagName("iframe");
    for(var i=0;i<frames.length;i++){
        var f = frames[i];
        if(null != f && f.style.display != "none"){
            f.style.height = (document.body.scrollHeight+50)+"px";
        }
    }
}

/**
 * zree方法
 * @param treeObj_
 * @param prop
 * @param value
 */
//搜索节点
function searchNode(treeObjId, prop, value) {
    var treeObj_ = $.fn.zTree.getZTreeObj(treeObjId);
    var nodes = treeObj_.getNodes();
    // 如果要查空字串，就退出不查了。

    if (value == "") {
        showAllNode(treeObj_, nodes);
        return;
    }
    console.log(treeObj_, nodes);
    hideAllNode(treeObj_, nodes);
    var nodeList = treeObj_.getNodesByParamFuzzy(prop, value);
    updateNodes(treeObjId,treeObj_,nodeList);
}

//更新节点状态
function updateNodes(treeObjId,treeObj_,nodeList) {
    var len = nodeList.length;
    var $noData = $("#"+treeObjId).next('.no-treeData'),
        noDataLen =$noData.length;
    if(len>0){
        if(noDataLen >= 1){
            $noData.remove();
        }
        treeObj_.showNodes(nodeList);
        for(var i=0, l=nodeList.length; i<l; i++) {
            //展开当前节点的父节点
            treeObj_.showNode(nodeList[i].getParentNode());
            //treeObj.expandNode(nodeList[i].getParentNode(), true, false, false);
            //显示展开符合条件节点的父节点
            while(nodeList[i].getParentNode()!=null){
                treeObj_.expandNode(nodeList[i].getParentNode(), true, false, false);
                nodeList[i] = nodeList[i].getParentNode();
                treeObj_.showNode(nodeList[i].getParentNode());
            }
            //显示根节点
            treeObj_.showNode(nodeList[i].getParentNode());
            //展开根节点
            treeObj_.expandNode(nodeList[i].getParentNode(), true, false, false);
        }
    }else{
        if(noDataLen == 0){
            $("<span class='no-treeData'>未找到相对应数据!</span>").insertAfter("#"+treeObjId);
        }

    }

}

//隐藏所有节点
function hideAllNode(treeObj_, nodes_){
    var nodes = treeObj_.transformToArray(nodes_);
    console.log(treeObj_);
    treeObj_.hideNodes(nodes);
}

//显示所有节点
function showAllNode(treeObj, nodes_){
    var nodes = treeObj.transformToArray(nodes_);
    for(var i=nodes.length-1; i>=0; i--) {
        /* if(!nodes[i].isParent){
         treeObj.showNode(nodes[i]);
         }else{ */
        if(nodes[i].getParentNode()!=null){
            treeObj.expandNode(nodes[i],false,false,false,false);
        }else{
            treeObj.expandNode(nodes[i],true,true,false,false);
        }
        treeObj.showNode(nodes[i]);
        showAllNode(treeObj,nodes[i].children);
        /* } */
    }
}

//数组是否包含
Array.prototype.contains = function(item){
    return RegExp("(^|,)" + item.toString() + "($|,)").test(this);
};
//去掉数组中的重复项
Array.prototype.unique = function() {
    var res = [], hash = {};
    for(var i=0, elem; (elem = this[i]) != null; i++) {
        if (!hash[elem]) {
            res.push(elem);
            hash[elem] = true;
        }
    }
    return res;
};

//拼接参数到url中
var extractUrl = function(url, paramStr){
    return url+=(url.indexOf('?')>-1?'&':'?')+paramStr;
};



    