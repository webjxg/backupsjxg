$(function(){
    $.ajax({
        url : "../json/nav.json",
        type : "GET",
        dataType : "json",
        //data :"json",
        async:"false",
        success : function(data) {
            var navData = data.children;
            var str = getListHTML(navData,1);
            $("#side-menu").append(str).metisMenu();
            loadFn();
            var sideMenu = $("#side-menu li:first"),
                lev1Len = sideMenu.has("ul").children("ul").length;
            lev1A = sideMenu.find("a:first");
            if(lev1Len >= 1){
                lev1A.trigger('click');
                var levl2 =lev1A.next("ul").find("li:first");
                if(levl2.length >= 1){
                    var levl2Len = levl2.children("ul").length,
                        lev2A = levl2.find("a:first");
                    setTimeout(function(){
                        lev2A.trigger('click');
                    },1000);
                }
            }else{
                lev1A.trigger('click');
            }

        },
        error : function(err) {
            console.log(err);
        }
    });

});
function getItemHTML(opt,num){
    return [
        '<li>',
        '<a href="' + (opt.href ? opt.href : 'javascript:;') + '"class="'+(opt.href? "navItem-tit" : '')+'">',
        '<i class="fa' + (opt.iconName ? ' '+ opt.iconName : '') + '"></i>',
        '<span>' + (opt.name ? opt.name : '') + '</span>',
        ((opt.children).length >0 ? '<span class="fa arrow"></span>' : ''),
        '</a>',
        ((opt.children).length >0? '<ul class="nav collapse nav-level'+(num+1)+'">' + getListHTML(opt.children,num + 1) + '</ul>' : ''),
        '</li>'
    ].join('');
}
function getListHTML(list,num){
    if(num >= 8){
        return '';
    }
    var str = '';
    for(var i = 0;i < list.length;i++){
        str += getItemHTML(list[i],num);
    }
    return str;
}
function loadFn(){
        $('.navItem-tit').on('click', menuItem); //点击侧边栏
        $('.tabs-nav').on('click', '.navItem-tabTag', activeTab); // 点击选项卡菜单
        $('.tabs-nav').on('dblclick', '.navItem-tabTag', refreshTab);  //刷新选项卡对应的内容
        $('.tabs-nav').on('click', '.navItem-tabTag i', closeTab); //关闭选项卡菜单
        $('.tabs-lBtn').on('click', scrollTabLeft);  // 左移按扭
        $('.tabs-rBtn').on('click', scrollTabRight);// 右移按扭
        // $('.tabs-nav').on('dblclick', '.navItem-tabTag', refreshTab);
        $('.tabTag-closeOther').on('click', closeOtherTabs);  //关闭其余选项卡
        $('.tabTag-fixed').on('click', showActiveTab); //定位当前选项卡
        // 关闭全部
        $('.tabTag-closeAll').on('click', function () {
            $('.tabs-nav').children("[data-id]").not(":first").each(function () {
                $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).remove();
            });
            $('.tabs-nav').children("[data-id]:first").each(function () {
                $('.J_iframe[data-id="' + $(this).data('id') + '"]').show();
                $(this).addClass("active");
            });
            $('.tabs-nav').css("margin-left", "0");
        });
        //关闭其他选项卡
        function closeOtherTabs() {
            $('.tabs-nav').children("[data-id]").not(":first").not(".active").each(function () {
                $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).remove();
            });
            $('.tabs-nav').css("margin-left", "0");
        };
        //通过遍历给菜单项加上data-index属性
        $(".navItem-tit").each(function (index) {
            if (!$(this).attr('data-index')) {
                $(this).attr('data-index', index);
            }
        });
        $(".navScrollView").slimScroll({
            height:"100%"
        });
    }
    //将选中状态对应得tab内容区显示出来
    function ActiveNavItem(elType) {
        $('.navItem-con .J_iframe').each(function () {
            if ($(this).data('id') == elType) {
                $(this).show().siblings('.J_iframe').hide();
                return false;
            }
        });
    };
    //删除选中的选项卡，以及移除tab对应的内容 （即对应的iframe）
    function DeleteNavItem(elId, eleParent) {
        //  移除当前选项卡
        eleParent.remove();
        // 移除tab对应的内容区
        $('.navItem-con .J_iframe').each(function () {
            if ($(this).data('id') == elId) {
                $(this).remove();
                return false;
            }
        });
    };
    //滚动到已激活的选项卡
    function showActiveTab(){
        scrollToTab($('.navItem-tabTag.active'));
    }
    function menuItem(e) {
        e.preventDefault();
        // 获取标识数据
        var dataUrl = $(this).attr('href'),
            dataIndex = $(this).data('index'),
            menuName = $.trim($(this).text()),
            flag = true;
        if (dataUrl == undefined || $.trim(dataUrl).length == 0)return false;
    
        // 选项卡菜单已存在
        $('.navItem-tabTag').each(function () {
            if ($(this).data('id') == dataUrl) {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('.navItem-tabTag').removeClass('active');
                    scrollToTab(this);
                    // 显示tab对应的内容区
                    ActiveNavItem(dataUrl);
                    
                }
                flag = false;
                return false;
            }
        });
    
        // 选项卡菜单不存在
        if (flag) {
            var str = '<a href="javascript:;" class="active navItem-tabTag" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
            $('.navItem-tabTag').removeClass('active');
            // 添加选项卡对应的iframe
            var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
           
            $('.navItem-con').find('iframe.J_iframe').hide();
            $('.navItem-con').append(str1)
            //显示loading提示
            var loading = layer.load();
            $('.navItem-con iframe:visible').load(function () {
                //iframe加载完成后隐藏loading提示
                layer.close(loading);
            });
            // 添加选项卡
            $('.tabs-menu .tabs-nav').append(str);
            scrollToTab($('.navItem-tabTag.active'));
        }
        return false;
    };

    // 点击选项卡菜单
    function activeTab() {
        if (!$(this).hasClass('active')) {
            var currentId = $(this).data('id');
            // 显示tab对应的内容区
            $('.navItem-con .J_iframe').each(function () {
                if ($(this).data('id') == currentId) {
                    $(this).show().siblings('.J_iframe').hide();
                    return false;
                }
            });
            $(this).addClass('active').siblings('.navItem-tabTag').removeClass('active');
            scrollToTab(this);

        }
    }
    // 关闭选项卡菜单
    function closeTab() {
        var eleParent = $(this).parents('.navItem-tabTag'),
            closeTabId = eleParent.data('id'),
            currentWidth = eleParent.width();
        // 当前元素处于活动状态
        if (eleParent.hasClass('active')) {
            var thisNextEl = eleParent.next('.navItem-tabTag'),
                thisPrevEl = eleParent.prev('.navItem-tabTag');
            // 当前元素后面有同辈元素，使后面的一个元素处于活动状态
            if (thisNextEl.length) {
                var activeId = thisNextEl.data('id');
                thisNextEl.addClass('active');
                ActiveNavItem(activeId);
                DeleteNavItem(closeTabId,eleParent);
                var marginLeftVal = parseInt($('.tabs-nav').css('margin-left'));
                if (marginLeftVal < 0) {
                    $('.tabs-nav').animate({
                        marginLeft: (marginLeftVal + currentWidth) + 'px'
                    }, "fast");
                }
                return false;
            }

            // 当前元素后面没有同辈元素，使当前元素的上一个元素处于活动状态
            if (thisPrevEl.length) {
                var activeId = thisPrevEl.data('id');
                thisPrevEl.addClass('active');
                ActiveNavItem(activeId);
                DeleteNavItem(closeTabId,eleParent);
            }  
        }
        // 当前元素不处于活动状态
        else {

            DeleteNavItem(closeTabId,eleParent);
            scrollToTab($('.navItem-tabTag.active'));
        }
        return false;
    }
    //刷新iframe
    function refreshTab() {
        var target = $('.J_iframe[data-id="' + $(this).data('id') + '"]');
        var url = target.attr('src');
        //显示loading提示
        var loading = layer.load();
        target.attr('src', url).load(function () {
            //关闭loading提示
            layer.close(loading);
        });
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


    //获取显示的iframe
    function getActiveTab(){
        return $(".J_iframe:visible");
    }
    //计算元素集合的总宽度
    function calSumWidth(elements) {
        var width = 0;
        $(elements).each(function () {
            width += $(this).outerWidth(true);
        });
        return width;
    }
    //滚动到指定选项卡
function scrollToTab(element) {
    var marginLeftVal = calSumWidth($(element).prevAll()), marginRightVal = calSumWidth($(element).nextAll());
    // 可视区域非tab宽度
    var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".tabs-menu"));
    //可视区域tab宽度
    var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
    //实际滚动宽度
    var scrollVal = 0;
    if ($(".tabs-nav").outerWidth() < visibleWidth) {
        scrollVal = 0;
    } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
        if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
            scrollVal = marginLeftVal;
            var tabElement = element;
            while ((scrollVal - $(tabElement).outerWidth()) > ($(".tabs-nav").outerWidth() - visibleWidth)) {
                scrollVal -= $(tabElement).prev().outerWidth();
                tabElement = $(tabElement).prev();
            }
        }
    } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
        scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
    }
    $('.tabs-nav').animate({
        marginLeft: 0 - scrollVal + 'px'
    },"fast");
}

    //查看左侧隐藏的选项卡
    function scrollTabLeft() {
        var marginLeftVal = Math.abs(parseInt($('.tabs-nav').css('margin-left')));
        // 可视区域非tab宽度
        var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".tabs-menu"));
        //可视区域tab宽度
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        //实际滚动宽度
        var scrollVal = 0;
        if ($(".tabs-nav").width() < visibleWidth) {
            return false;
        } else {
            var tabElement = $(".navItem-tabTag:first");
            var offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {//找到离当前tab最近的元素
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            if (calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).prev();
                }
                scrollVal = calSumWidth($(tabElement).prevAll());
            }
        }
        $('.tabs-nav').animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    }
    //查看右侧隐藏的选项卡
    function scrollTabRight() {
        var marginLeftVal = Math.abs(parseInt($('.tabs-nav').css('margin-left')));
        // 可视区域非tab宽度
        var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".tabs-menu"));
        //可视区域tab宽度
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        //实际滚动宽度
        var scrollVal = 0;
        if ($(".tabs-nav").width() < visibleWidth) {
            return false;
        } else {
            var tabElement = $(".navItem-tabTag:first");
            var offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {//找到离当前tab最近的元素
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            scrollVal = calSumWidth($(tabElement).prevAll());
            if (scrollVal > 0) {
                $('.tabs-nav').animate({
                    marginLeft: 0 - scrollVal + 'px'
                }, "fast");
            }
        }
    }
    //打开选项卡菜单
    function openTab(url,title, isNew){
        //isNew 为true时，打开一个新的选项卡；为false时，如果选项卡不存在，打开一个新的选项卡，如果已经存在，使已经存在的选项卡变为活跃状态。

        // 获取标识数据
        var dataUrl = url,
            dataIndex ,
            menuName = title,
            flag = true;
        if (dataUrl == undefined || top.$.trim(dataUrl).length == 0)return false;
//    //设置dataIndex
//    $(".J_menuItem").each(function (index) {
//        if (!$(this).attr('data-index')) {
//            $(this).attr('data-index', index);
//        }
//    });

        if(!isNew){
            top.$('.navItem-tabTag').each(function () {
                if (top.$(this).data('id') == dataUrl) {// 选项卡已存在，激活。
                    if (!top.$(this).hasClass('active')) {
                        top.$(this).addClass('active').siblings('.navItem-tabTag').removeClass('active');
                        scrollToTab(top.$(this));
                        // 显示tab对应的内容区
                        top.$('.navItem-con .J_iframe').each(function () {
                            if (top.$(this).data('id') == dataUrl) {
                                top.$(this).show().siblings('.J_iframe').hide();
                                return false;
                            }
                        });
                    }
                    flag = false;
                    return false;
                }
            });
        }

        if(isNew || flag){//isNew为true，打开一个新的选项卡； flag为true，选项卡不存在，打开一个新的选项卡。
            var str = '<a href="javascript:;" class="active navItem-tabTag" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
            top.$('.navItem-tabTag').removeClass('active');

            // 添加选项卡对应的iframe
            var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
            top.$('.navItem-con').find('iframe.J_iframe').hide().parents('.navItem-con').append(str1);

            //显示loading提示
            var loading = layer.load();

            top.$('.navItem-con iframe:visible').load(function () {
                //iframe加载完成后隐藏loading提示
                layer.close(loading);
            });
            // 添加选项卡
            top.$('.tabs-menu .tabs-nav').append(str);
            scrollToTab(top.$('.navItem-tabTag.active'));

        }
        return false;

    }


  
