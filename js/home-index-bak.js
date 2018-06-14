var store_tiles;//磁贴商店中的所有磁贴
var move_tile;//移动中的磁贴
var cu_move_tiles = [];
var cu_panel_tiles = []; //存储面板类组内所有子磁贴
var choose_panel_tiles = []; //将面板类磁贴子元素挑选出来存储，进行删除
var appdates;
var template = {};
var app_array = [];   //第一个下拉框存放的数组数据
var gridster = [];   //首页磁贴实例化
var alltiles = [];
var timeStart;
var flagB = false;//声明全局变量  

var del_cu_panel_tiles = []; //存储分组中被删除的磁贴、用来调整商店磁贴状态  lss 20180424

var isEdit = false;
var themeLink = document.querySelector('link[name="card"]');
if(work.config.enterprise === 'zklh'){
// 中科炼化的场景，设置固定宽度 1260px
  widthx = 85;
  margins = 10;
  // 切换磁贴固定样式
    console.log(1);
  themeLink.setAttribute('href', '../work/Content/index-flex-card.css');
} else {
  themeLink.setAttribute('href', '../../Content/index-flex-card.css');
}
function getSizeStyle(sizex,sizey){
    var width = sizex * widthx + (sizex-1) * (margins*2);
    var height = sizey * widthx + (sizey-1) * (margins*2);
    return "width: "+width+"px;height: "+height+"px;";
}

/*面板增加磁贴
* where:父集ul；tile:所有data值；isFirst:1代表初始化，0代表添加,；closeDel：true表示移除红色关闭按钮；
* */
function addWidget(oindex, tile, isFirst, closeDel) {
    if(tile.tempId == undefined){
         // alert(tile.tempId);
    	addPanelWidget(oindex, tile, isFirst, closeDel);
    }else{
        // alert(tile.tempId);
        console.log(oindex, tile, isFirst, closeDel);
    	addTileWidget(oindex, tile, isFirst, closeDel);
    }
}

function addTileWidget(oindex, tile, isFirst, closeDel){
    console.log(tile);
	  var tmpl;
    var templateId = tile.tempId+'';
    if($('#tile-' + tile.tileTemplateId).length <= 0){
        gridster[oindex].add_widget("<li id='tile-" + tile.tileTemplateId + "' class='gs-w' data-ott='" + tile.tileTemplateId + "'></li>",
            parseInt(tile.sizex), parseInt(tile.sizey), parseInt(tile.col), parseInt(tile.row));
    };

    if (templateId == "3" || templateId == "4" || templateId == "5" || templateId == "6") {
        tmpl = $.templates("#tmpl-chart");
    }else{
    	tmpl = $.templates("#tmpl" + templateId);
    };

    if(closeDel){
    	tile["className"] = "panel-box-groups";
    }else{
    	tile["className"] = "box-groups";
    }
    
    tile.sizeStyle = getSizeStyle(tile.sizex,tile.sizey);

    var htmlOutput = tmpl.render(tile);
    console.log(htmlOutput);
    $(document).find("#tile-" + tile.tileTemplateId).html(htmlOutput);
    if(closeDel == true){
        $(".group-panel-ul").find(".ingsht,.lbdestlist,.shewidt,.eacstrslist,.circlelist").remove();
    }else{
        $(document).find("#tile-" + tile.tileTemplateId).addClass("groupli-all-" + tile.tempId);
    };
    
    switch (templateId){
        case "2":
            loadNumberData(tile);
            break;
        case "3":
            loadChartData(tile);
            break;
        case "4":
            loadChartData(tile);
            break;
        case "5":
            loadChartData(tile);
            break;
        case "6":
            loadChartData(tile);
            break;
        case "7":
            loadList(tile);
            break;
        case "9":
            loadCustom(tile,isFirst);
            break;
        case "10":
            loadCard(tile);
            break;
        case "11":
            loadAudio(tile);
            break;
        case "12":
            loadText(tile,isFirst);
            break;
        default:
            break;
    }
}

function addPanelWidget(oindex, tile, isFirst, closeDel){
		var tmpl = $.templates("#panel-tmpl");
   
    if($('#panel-' + tile.panelId).length <= 0){
        gridster[oindex].add_widget("<li id='panel-" + tile.panelId + "' class='gs-w' data-ott='" + tile.panelId + "'></li>",
            parseInt(tile.sizex), parseInt(tile.sizey), parseInt(tile.col), parseInt(tile.row));
    };

    tile.sizeStyle = getSizeStyle(tile.sizex,tile.sizey);

    //分组面板
    var htmlOutput = tmpl.render(tile);
    $(document).find("#panel-" + tile.panelId).html(htmlOutput);
    $(document).find("#panel-" + tile.panelId).addClass("groupli-all-panel");

    loadPanel(tile,isFirst);  //加载面板类磁贴
}

//加载数字类磁贴
function loadNumberData(tile) {
    var url = tile.dataSource;
    if (url.indexOf('?') == -1) {
        url += "?loginName=" + work.loginName;
    } else {
        url += "&loginName=" + work.loginName;
    };
    $.ajax({
        url: url,
        type: "get",
        success: function (text) {
            $("#num" + tile.tileTemplateCode).html("").html(text);
            $("#num" + tile.tileTemplateCode).attr("title",text);
        },
        error: function (xmlHttpRequest) {
            console.log(xmlHttpRequest);
        }
    });
    /*
     * 设置定时刷新
     * */
    var timing = function (time,fn) {
        var timer = parseInt(time * 1000);
        setInterval(function () {
            $.ajax({
                url: url,
                type: "get",
                success: function (text) {
                    $("#num" + tile.tileTemplateCode).html("").html(text);
                    $("#num" + tile.tileTemplateCode).attr("title",text);
                },
                error: function (xmlHttpRequest) {
                    console.log(xmlHttpRequest);
                }
            });
        },timer);
    };
    if(tile.timeInterval > 0){
        timing(tile.timeInterval);
    };
};
//将number转换成百分数
Number.prototype.toPercent = function () {
    return (Math.round(this * 100) / 100).toFixed(2) + '%';
};
//加载列表类磁贴
function loadList(tile) {
    var url = tile.dataSource;
    if (url.indexOf('?') == -1) {
        url += "?loginName=" + work.loginName;
    } else {
        url += "&loginName=" + work.loginName;
    };
    var columnName = tile.columnName;
    var columns = [];
    var cns = columnName.split(';');
    var owid = 100 / (parseInt(cns.length));
    for (var i = 0; i < cns.length; i++) {
        var kv = cns[i].split(':');
        if (kv.length > 1) {
            columns.push({ 'field': kv[0], 'title': kv[1], 'width': owid.toPercent(), 'align': 'center' });
        }
    };
    $.ajax({
        url: url,
        type: "get",
        success: function (text) {
            var data = cj.Parse(text);
            drawTable(tile.tileTemplateCode, data, columns, tile.pageSize);
        },
        error: function (xmlHttpRequest) {
            console.log(xmlHttpRequest);
        }
    });

    /*
     * 设置定时刷新
     * */
    /*var timing = function (time,fn) {
        var timer = parseInt(time * 1000);
        setInterval(function () {
            $.ajax({
                url: url,
                type: "get",
                success: function (text) {
                    var data = cj.Parse(text);
                    drawTable(tile.tileTemplateCode, data, columns, tile.pageSize);
                },
                error: function (xmlHttpRequest) {
                    console.log(xmlHttpRequest);
                }
            });
        },timer);
    };
    if(tile.timeInterval > 0){
        timing(tile.timeInterval);
    };*/
}
function drawTable(code, data, columns, rows) {
    var $table = $('#' + code);
    $table.bootstrapTable({
        data: data,
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: false,                      //是否显示行间隔色
        //            height:400,
        singleSelect: false,
        pagination: true,     //分页*/
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: rows,
        pageList: [10, 15, 20, 25],        //可供选择的每页的行数（*）
        search: false, //显示搜索框
        sidePagination: "client", //服务端处理分页
        paginationPreText: '上一页',
        paginationNextText: '下一页',
        columns: columns
    });
}
//加载图表类磁贴
function loadChartData(tile) {
    var url = tile.dataSource;
    ajaxToServer1(url,{},function(result){
        if(result.success){
            var data = result.data;
            if (tile.templateCode == 'line') {   //折线
                ec.render.line(data, tile.tileTemplateCode, tile);
            } else if (tile.templateCode == 'chart') {  //柱状图
                ec.render.bar(data, tile.tileTemplateCode, tile);
            } else if (tile.templateCode == 'bar') {  //饼状图
                ec.render.pie(data, tile.tileTemplateCode, tile);
            } else if (tile.templateCode == 'gauge') {  //仪表盘
                ec.render.gauge(data, tile.tileTemplateCode, tile);
            }
        }else{
            layer.msg(result.message);
        }
    });


    /*
     * 设置定时刷新
     * */
    var timing = function (time,fn) {
        var timer = parseInt(time * 1000);
        setInterval(function () {
            $.ajax({
                url: url,
                type: "get",
                success: function (text) {
                    var data = cj.Parse(text);
		            if (tile.tempId == '3') {
		                ec.render.line(data, tile.tileTemplateCode, tile);
		            } else if (tile.tempId == '4') {
		                ec.render.bar(data, tile.tileTemplateCode, tile);
		            } else if (tile.tempId == '5') {
		                ec.render.pie(data, tile.tileTemplateCode, tile);
		            } else if (tile.tempId == '6') {
		                ec.render.gauge(data, tile.tileTemplateCode, tile);
		            }
                },
                error: function (xmlHttpRequest) {
                    console.log(xmlHttpRequest);
                }
            });
        },timer);
    };
    if(tile.timeInterval > 0){
        timing(tile.timeInterval);
    };
}
//加载文本类磁贴
function loadText(tile,isFirst) {
    //if(isFirst == "0"){
    //    $(".text-shadow-div").show();
    //};
    var ohtml = textTransToArea(tile.content ? tile.content : '');
    console.log(tile);
    $("#text-content-prev"+tile.tileTemplateId).val(ohtml).css({'overflow-y':});
}
//加载卡片类磁贴
function loadCard(obj) {
    var oarray = [], oli = '';
    var columnName = obj.configColumn ? obj.configColumn : '';
    var ourl = obj.dataSource ? obj.dataSource : '';
    if(columnName != '' && columnName != null && columnName != undefined){
        var cns = columnName.split(';');
        oarray = [];
        for (var i = 0; i < cns.length; i++) {
            var kv = cns[i].split(':');
            if (kv.length > 1) {
                oarray.push({ 'key': kv[0], 'value': kv[1]});
            }
        };
    };
    if(ourl != ''){
        $.ajax({
            url: ourl,
            type: "get",
            success: function (data) {
                oli = '';
                var odata = jQuery.ET.toObjectArr(data);
                if(odata.length > 0){
                    for (var i = 0,j = oarray.length; i < j; i++) {
                        var okey = oarray[i].key;
                        oli += '<li>' +
                            '<span class="tit" title="'+ oarray[i].value +'">'+ oarray[i].value +'</span>' +
                            '<p class="val" title="'+ odata[0][okey] +'">'+ odata[0][okey] +'</p>' +
                            '</li> ';
                        if((j % 2 != 0) && i == (j - 1)){
                            oli += '<li>' +
                                '<span class="tit">&nbsp;</span>' +
                                '<p class="val">&nbsp;</p>' +
                                '</li> ';
                        }
                    };
                };
                $(".card-registerCon-ul").html("").html(oli);
            },
            error: function (xmlHttpRequest) {
                if (xmlHttpRequest.responseText) {
                    alert(xmlHttpRequest.responseText);
                } else {
                    alert("服务端异常！")
                }
            }
        });
    }
}
//多媒体类磁贴
function loadAudio(tile){
    var str = '';
    var audioType = tile.audioType + '';
    if(audioType == "1"){
        var imgListArr = tile.audioUrl.split("@@");
        var currentArr = [];
        str += '<div class="banner" style="height:100% !important;"><ul>';
        for(var i = 0;i<imgListArr.length;i++){
            var current = imgListArr[i];
            str += '<li ><img src="'+ current +'" width="100%" height="100%"/></li>'
        }
        str += '</ul></div>';
        $('#tile-'+tile.tileTemplateId).find('.audio-contentBox').html(str);
        //设置轮播图效果
        var dotsFlag = imgListArr.length == 1 ? false:true;
        var unslider04 = $($('#tile-'+tile.tileTemplateId).find('.banner')).unslider({
            dots: dotsFlag
        });
        data04 = unslider04.data('unslider');
    }else if(audioType == "2"){
        str += '<video src="'+ tile.audioUrl+'" id="videoId" controls >你的浏览器不支持 <code>video</code> 标签.</video>';
        $($('#tile-'+tile.tileTemplateId).find('.audio-contentBox')).html(str);
    }

}
//加载自定义类磁贴
function loadCustom(tile,isFirst) {
	var needUrl = '',
		randomNumber = Math.floor(Math.random()*10000);
    if(isFirst == "0"){
        $(".iframe-mask").show();
    };
    if(tile.dataSource.indexOf("?") < 0){
    	needUrl = tile.dataSource + "?randomNumber=" + randomNumber;
    }else{
    	needUrl = tile.dataSource + "&randomNumber=" + randomNumber;
    }

    var ohtm = '<iframe src="' + needUrl +'" frameborder="0" width="100%" height="100%"></iframe>';
    $("#cus" + tile.tileTemplateCode).append(ohtm);
    $("#cus" + tile.tileTemplateCode + " > .iframe-mask").show();// tj add
}
//加载面板类磁贴
function loadPanel(tile, isFirst){
    //通过jquery选择DOM实现gridster
    var maxcol = tile.maxCol ? tile.maxCol : tile.sizex;
    var onum = $(".groupli-all-panel").length ? $(".groupli-all-panel").length : 1;
    $("#icon-set-" + tile.panelId).attr("data-num", onum);
    alltiles[onum] = tile;
    gridster[onum] = $("#ul-group-panel-" + tile.panelId).gridster({
        namespace: "#div-group-panel-" + tile.panelId,
        widget_base_dimensions: [widthx, widthx],   //模块的宽高 [宽,高]
        widget_margins: [5, 5],    //模块的间距 [上下,左右]
        max_cols: 12,                             //最多创建多少列，null表示没有限制
        min_cols: parseInt(maxcol),           //至少创建多少列
        avoid_overlapped_widgets: true,     //不允许widgets加载的时候重叠
        resize: {
            enabled: false
        }
    }).data('gridster');
    gridster[onum].disable();

    if(isFirst == "1"){
        $(".icon-setting").show();
        shortselectTileList(tile.panelId, onum);
    }else{
        return false;
    };
}
/** 获取分组里面的磁贴* */
function shortselectTileList(panelid, oindex){   //获取到 "分组二"的数据集合
    $.ajax({
        // url: work.config.tileService + "userPanelTiles?userCode=" + work.loginName + "&panelId=" + panelid,
        url:"./json/workbenckService-userPanelTitles.json",
        type: "get",
        async:false,
        success: function (text) {
            var data = cj.Parse(text);
            $("#ul-group-panel-" + panelid).empty();
            console.info(data);
            $('#selectCount' + panelid).html(data.length);
            for(var i = 0;i<data.length;i++){
                var tile = data[i];

                addWidget(oindex, tile, "0", true);
                cu_panel_tiles.push(tile);
            };
            shortcut("#ul-group-panel-" + panelid);
        },
        error: function (xmlHttpRequest) {
            console.log(xmlHttpRequest);
        }
    });
}
/** 面板类磁贴配置页面弹出* */    //点击内容区域中 #icon-set-23 触发
function layerOpenPanel(that){
	/*------------------------------start 设置面板款宽度+标题---------------------------------------*/
	//获取当前container的osize类
	var osizex = $(that).closest('li').attr('data-sizex');
	var osizey = $(that).closest('li').attr('data-sizey');
	var otitle = $(that).closest('.group-title').find('.group-title-nameSp').text();
	/*------------------------------end 设置面板款宽度+标题---------------------------------------*/
    var otileId = $(that).attr("data-tileId");
    var opanelId = $(that).attr("data-panelid");
    var otempid = $(that).attr("data-tempid");
    var oindex = $(that).attr("data-num");
    var oobj = {
        "panelId": opanelId,
        "tileTemplateId": otempid
    };
    layer.open({
        type: 2,
        title: otitle,
        maxmin: false,
        scrollbar: false,
        area: ['1200px', '96%'],
        content: 'shortcut-group.html?oti='+ otileId + "&op="+ opanelId + "&ote="+ otempid+'&osizex='+osizex+'&osizey='+osizey,
        success: function(layero,index){
            $(".body").css({
                "overflow-x": "hidden",
                "overflow-y": "hidden"
            });
            var body = layer.getChildFrame('body', index);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            iframeWin.$("#panelid").val(opanelId);
            iframeWin.$("#tileTemplateId").val(otempid);
        },
        cancel:function(index, layero){
        	layer.confirm("<font color='#222'>是否保存当前设置？</font>", {
		            title : false,
		            icon : 0,
		            closeBtn : 0,
		            btn: ['保存','取消'],
		            shadeClose: false,
		            scrollbar: false,
		            area: ['300px','120px']
		       },function(){
		       	 var iframeWin = window[layero.find('iframe')[0]['name']];
		       	 iframeWin.saveShortcutData();
		       	 layer.closeAll();
		       	 setTimeout(load_panel(),2000)
							// 重新加载商店磁贴状态！lss 20180424
						 store_tiles_unmove_style()
		       },function(){
		       	 layer.close(index);
		       })
				  return false;
        },
        end: function () {
            $(".body").css({
                "overflow-x": "hidden",
                "overflow-y": "auto"
            });
            if(store.get('isChange') == true){
								load_panel();
								// 重新加载商店磁贴状态！lss 20180424
								store_tiles_unmove_style()
            }
        }
    });
}

/*给快捷入口类磁贴绑定点击事件*/
function shortcut(cla) {
    $(cla).find("li").each(function () {
        var a = $(this).children("div").children("a");
        a.off('click').on('click', function () {
            var url = a.attr("data-url");
            if (work.config.enterprise == "zklh") {
                var code = a.attr("data-id");
                getLinks(a,code,url);  /*给快捷入口类磁贴绑定中科炼化跳转事件*/
            }else{
                aClick(a, url);   //判断快捷入口类磁贴点击跳转
            }
            return false;
        });
    });
}
/*判断快捷入口类磁贴点击跳转*/
function aClick(a, url){
    var id = a.attr("data-id");
    var title = a.attr("data-title");
    var target = a.attr("data-target");
    if("ConferenceRoomSchedule" == id){
    	oldUrl = a.attr("data-url");
    	str = url.substr(url.indexOf("?"));
	    url = oldUrl+str;
    }
    var tab = {
        url: url,
        id: id,
        title: title
    };
    
		if(target == 1){  //判断a标签的打开形式  1  新窗口  2  layer形式  3 创建新的iframe
        window.open(url);
    }else if(target == 2){
	    	top.layer.open({
	            type: 2,
	            title: title,
	            maxmin: false,
	            area: ['880px', '95%'],
	            content:url
	        });
    }else{
	    	if (top != self) {
		        if(window.top.$("#d" + id).length <= 0) {
		            toParentTab(tab);
		        }else{
		            toParentTab(tab,"0");
		        }
		    } else {
		    		window.open(url);
		    }
    }
}

function postcall( url, params, target){  //跳转到第三方系统事件
    var tempform = document.createElement("form");
    tempform.action = url;
    tempform.method = "post";
    tempform.style.display="none";
    if(target) {
        tempform.target = target;
    };
    for (var x in params) {
        var opt = document.createElement("input");
        opt.name = x;
        opt.value = params[x];
        tempform.appendChild(opt);
    };
    var opt = document.createElement("input");
    opt.type = "submit";
    tempform.appendChild(opt);
    document.body.appendChild(tempform);
    tempform.submit();
    document.body.removeChild(tempform);
}
/*给快捷入口类磁贴绑定中科炼化跳转事件*/
function getLinks(a, code, url) {
	if("ConferenceRoomSchedule" == code){
		code = "OA";
	}
	$.ajax({
		type: "GET",
		url: work.config.portalRoot + "ssolinks/" + code,
		async: false,
		cache: false,
		ifModified: true,
		success: function(obj) {
			if(obj == null){
				aClick(a, url);
			}else{
				if(obj.method == "post"){
					postcall(obj.link,obj.params,"_blank");
				}else{
					aClick(a, obj.link);
				}
			}
		},
		error: function(XMLHttpRequest) {
				if(XMLHttpRequest.status==200){
					aClick(a, url);
				}else{
						layer.msg("您尚未登录，稍后进入登录页面");
						setTimeout(go, 2000);
						function go() {
							parent.window.location.assign(work.config.portalserver);
						}
				}
		}
	});
}

//点击磁贴触发页签添加的事件
function toParentTab(obj,isFirst) {
    window.top.$(".J_iframe").css("display", "none");
    var ospan = '<span class="dspan d' + obj.id + ' on">' +
        '<a data-id="d' + obj.id + '" class="d' + obj.id + '" onclick="aClick(this)">' + obj.title + '</a>' +
        '<span class="spanDelate disblock" onclick="spanClick(this)">x</span>' +
        '</span>';
    if(isFirst == "0"){
        window.top.$(".J_iframe").css("display", "none");
        window.top.$(".page-tabs-content").children(".d" + obj.id).addClass("on").siblings("span").removeClass("on");
        window.top.$("#d" + obj.id).css("display", "block");
        return false
    }else{
        var oframe = '<iframe id="d' + obj.id + '" src="' + obj.url + '" class="J_iframe" width="100%" height="100%" style="display: block;"></iframe>';
        window.top.$(".page-tabs-content").find(".dspan").removeClass("on");
        window.top.$(".page-tabs-content").append(ospan);
        window.top.$("#content-main").append(oframe);
    }
}

//加载面板磁贴
var iarr = ['shortcutTileTemplates','numberTileTemplates', 'chartTileTemplates', 'listTileTemplates', 'cardTileTemplates', 'textTileTemplates', 'audioTileTemplates', 'customTileTemplates'];
//递归入口调用
function load_tile_old(i,n,arr,ispush){
    $.ajax({
        // url: work.config.tileService + "tiles/" + work.loginName + "/" + arr[i],
        url:"./json/workbenckService-title.json",
        type: "get",
        success: function (text) {
            alert('设么呢');
            var tiles = cj.Parse(text);
            tiles.forEach(function (t) {
                if(ispush){
                    cu_panel_tiles.push(t);
                };
                addWidget(0, t, "1");
            });
            //每个磁贴的html是异步加载，延迟1秒执行
            setTimeout(function () {
                linkInit(".function");
                removeInit();
            }, 1000);
            if (i == 0) {
                shortcut(".function");
            }
            //递归
            if (i < (n - 1)) {
                load_tile(i + 1, iarr.length, iarr, true);
            } else {
                appsInit();   //加载应用
                layer.closeAll("loading");
            }
        },
        error: function (xmlHttpRequest) {
            console.log(xmlHttpRequest);
        }
    });
}


function load_tile(ispush){  //页面加载的时候调用    左侧磁贴管理快捷入口的json数据
    $.ajax({
        // url: work.config.tileService + "tiles?userCode=" + work.loginName,
        url:"./json/workbenckService-title.json",
        type: "get",
        success: function (text) {
            var tiles = cj.Parse(text);
            tiles.forEach(function (t) {
                if(ispush){
                    cu_panel_tiles.push(t);
                };
                addWidget(0, t, "1");
            });
            console.log(cu_panel_tiles);
            //每个磁贴的html是异步加载，延迟1秒执行
            setTimeout(function () {
                linkInit(".function");
                removeInit();
            }, 1000);
            
            shortcut(".function");
            appsInit();   //加载应用
            layer.closeAll("loading");
        },
        error: function (xmlHttpRequest) {

            console.log(xmlHttpRequest);
        }
    });
}

function load_panel(){
    $.ajax({
        // url: work.config.tileService + "userPanels/" + work.loginName,
        url:"./json/workbenckService-userPanels.json",
        type: "get",
        success: function (text) {
            var tiles = cj.Parse(text);
            console.log(tiles);
            tiles.forEach(function (t) {
               cu_panel_tiles.push(t);
                addWidget(0, t, "1");
            });
            
            setTimeout(function () {
                linkInit(".function");
                removeInit();
            }, 1000);
        },
        error: function (xmlHttpRequest) {
            console.log(xmlHttpRequest);
        }
    });
}

//linkInit
function linkInit(cla) {
    $(cla).find("li").each(function () {
        for (var i = 0; i < cu_panel_tiles.length; i++) {
            var t = cu_panel_tiles[i];
            if ($(this)[0].id == t.tileTemplateCode && t.Url) {
                var a = $(this).children("div").children("a");
                a.attr("href", "javascript:void(0);");
                a.attr("data-url", t.Url);
                a.attr("data-id", t.tileTemplateCode);
                a.attr("data-title", t.TileName);
                a.attr("data-target", t.target);
                a.on('click', function () {
                    var url = a.attr("data-url");
                    var id = a.attr("data-id");
                    var title = a.attr("data-title");
                    var tab = {
                        url: url,
                        id: id,
                        title: title
                    };
                    if (top != self) {
                        //alert('我在框架里');
                        //window.parent.addTab(tab);
                        if(window.top.$("#d" + id).length <= 0){   ///这里调用tabsNav.js下的 openTab
                            toParentTab(tab);   //点击磁贴触发页签添加的事件
                        }else{
                            toParentTab(tab,"0");
                        }
                    } else {
                        $('a[data-id="' + id + '"]').attr("target", "_blank");
                        $('a[data-id="' + id + '"]').attr("href", url);
                    }

                });
            }
        }
    });
}
//个人工作台编辑按钮的切换lcj  //点击右下角编辑按钮事件
$(".sjkhs").click(function () {
    $(".iframe-mask").show();//tj add
    isEdit = true;
    //ingsht 快捷入口磁贴、数字类磁贴、自定义磁贴、面板类  eacstrslist 图表类磁贴   lbdestlist  列表类磁贴  shewidt 卡片类磁贴、文本类磁贴、多媒体类磁贴
    $(".ingsht,.lbdestlist,.shewidt,.eacstrslist,.circlelist").show();
    $(".navtopstyle").hide();  //编辑按钮的父元素
    $(".sumenlist").show();   //对号、购物车icon
    $(".div-group-shadows").show();
    $(".icon-setting").hide();
    gridster[0].enable();

    $(".function>li").each(function () {
        //$(this)[0].id;
        var a = $(this).children("div").children("a");
        a.attr("href", "javascript:void(0);");
        a.removeAttr("target");
        a.unbind("click");
    });

});

//保存返回首页状态lcj
$(".succesesed_ok").click(function (e) {   //点击对号（保存）的时候
    $(".iframe-mask").hide();//tj add
    isEdit = false;
    $(".ingsht,.lbdestlist,.shewidt,.eacstrslist,.circlelist").hide();
    $(".sumenlist").hide();
    $(".navtopstyle").show();
    $("#right-sidebar").hide();
    $(".div-group-shadows").hide();
    $(".icon-setting").show();
    gridster[0].disable();
    cu_move_tiles.splice(0, cu_move_tiles.length);

    $(".tile_li").each(function () {
        $(this).css("border", "0px solid #FF992D");
    });
    linkInit(".function");
    var json = gridster[0].serialize();
    var data = cj.parseCjArray(json);

    $.ajax({
        // url: work.config.tileService + "tiles?userCode=" + work.loginName,
        url:"./json/workbenckService-title.json",
        type: "put",
        contentType: "application/json;charset=utf-8",
        data: data,
        success: function (text) {
            //location.reload();
            shortcut(".function");   //给快捷入口类磁贴绑定点击事件
        },
        error: function (xmlHttpRequest) {
            console.log(xmlHttpRequest);
        }
    });
});

$(".appendtext").click(function (e) {  //点击购物车icon事件
    $(".sideOpener").show();
    $("#right-sidebar").show();
    var self = this;
    if ($(self).attr("data-p") == "off") {
        //展开
        $(self).attr("data-p", "on");
        $(".sideOpener").attr("data-p", "on");
        $(".sideOpener").html('<b>&gt;</b>');
        $("#right-sidebar").animate({ marginRight: "460px" });
    } else {
        //收回
        $(self).attr("data-p", "off");
        $(".sideOpener").attr("data-p", "off");
        $(".sideOpener").html('<b>&lt;</b>');
        $("#right-sidebar").animate({ marginRight: "0px" });
    };
});

$(".sideOpener").click(function () {  //点击磁贴商店左侧小按钮事件
    var self = this;
    if ($(self).attr("data-p") == "off") {
        //展开
        $(self).attr("data-p", "on");
        $(self).html('<b>&gt;</b>');
        $(".appendtext").attr("data-p", "on");
        $("#right-sidebar").animate({ marginRight: "460px" });
    } else {
        //收回
        $(self).attr("data-p", "off");
        $(self).html('<b>&lt;</b>');
        $(".appendtext").attr("data-p", "off");
        $("#right-sidebar").animate({ marginRight: "0px" });
    }
});

function closeStore(){  //点击磁贴商店关闭按钮事件
	$('.sideOpener').attr("data-p", "off");
    $('.sideOpener').html('<b>&lt;</b>');
    $(".appendtext").attr("data-p", "off");
    $("#right-sidebar").animate({ marginRight: "0px" });
}

//查询
$("#searchBtn").click(function () {
    load_tiles_store();
});

$("#keyword").keydown(function (e) {
    if (e.keyCode == 13) {
        load_tiles_store();
    }
});

$("#apps").change(function () {
    load_tiles_store();
});

$("#tile_type").change(function () {
    load_tiles_store();
});

/*
 *修改标题
 * */
/*------------*/
function spantoinput(that){
    if(isEdit) return
    var oval = $(that).children(".group-title-nameSp").html();
    if($(that).children(".group-title-nameSp").css("display") == "none"){
        return false
    }else{
        $(that).children(".group-title-nameSp").hide();
        $(that).children(".group-title-nameInp").val(oval).show().focus();
    }
};
function saveGroupTitle(that){
    var needid = $(that).attr("data-oid");
    var oldVal = $(that).siblings(".group-title-nameSp").html();
    var newVal = $(that).val();
    if($.trim(oldVal) != $.trim(newVal)){
        if($.trim(newVal) == ""){
            layer.msg( "标题不能为空！", {time: 1000, icon: 2});
            $(that).hide().siblings(".group-title-nameSp").show();
            return false
        }else{
            var pdata = {
                "userCode" : work.loginName,
                "panelId" : needid,
                "title" : newVal
            };
            $.ajax({
                // url: work.config.tileService + "userPanels",
                url:"./json/userPanels",
                type: "put",
                data: pdata,
                success: function (data) {
                    if (data.collection) {
                        $(that).hide().siblings(".group-title-nameSp").show();
                        var mes1 = data.collection.error ? data.collection.error : "修改失败！";
                        var mes2 = mes1.message ? mes1.message : "修改失败！";
                        $(that).parent().parent().parent().parent("li").attr("type", "");
                        layer.msg( mes2, {time: 2000, icon: 2});
                    }else{
                        $(that).hide().siblings(".group-title-nameSp").html(newVal).show();
                        $(that).parent().parent().parent().parent("li").attr("type", newVal);
                    }
                },
                error: function (xmlHttpRequest) {
                    console.log(xmlHttpRequest);
                    $(that).parent().parent().parent().parent("li").attr("type", "");
                    layer.msg("修改失败！", {time: 1000, icon: 2});
                }
            });
        }
    }else{
        $(that).hide().siblings(".group-title-nameSp").show();
    }
}


//加载应用下拉框   第一个下拉框
function appsInit() {    //页面每次加载的时候都会调用该方法 然后获取到第一个下拉框的数据 将数据动态的渲染到#apps中
    app_array = [];
    $.ajax({
        // url: work.config.aaaResourceService + "ResourceService/apps",
        url:"./json/ResourceService-apps.json",
        type: "get",
        success: function (text) {
            console.log(text);
            appdates = cj.Parse(text);   //将获取到的数据进行转换 最终转换成数组对象形式。
            for (var i = 0,j = appdates.length; i < j; i++) {
                var app = appdates[i];
                $("#apps").addOptions(app.appName, app.appCode);   //addOptions方法将获取到的数组对象进行遍历然后动态创建option标签
                var a = { "appName": app.appName, "appCode": app.appCode, "total": 0, "tiles": [] };
                app_array.push(a);   //返回一个新的关于#apps的数据对象。
            };
            console.log(app_array);
            loadTmplType(); // 执行第二个下拉框
        },
        error: function (xmlHttpRequest) {
            console.log(xmlHttpRequest);
        }
    });
}

//加载模板类型下拉框   第二个下拉框
function loadTmplType() {
    $("#tile_type").empty();
    $.ajax({
        //url: work.config.tileService + "templateTypes?enabled=1",
        url:"./json/workbenchService-templateTypes.json",
        type: "get",
        success: function (text) {
            var types = cj.Parse(text);
            for (var i = 0; i < types.length; i++) {
                var type = types[i];
                $("#tile_type").addOptions(type.name, type.code);
            };
            load_tiles_store(); //每次下拉框选择完具体的磁贴类型之后都会调用该方法。
        },
        error: function (xmlHttpRequest) {
            console.log(xmlHttpRequest);
        }
    });
}

//加载磁贴商店磁贴   //两个下拉框都选择完成了之后调用该方法
function load_tiles_store() {    //每次下拉框选择完具体的磁贴类型之后都会调用该方法。
    //$("#store_group_main").html("");
    var appCode = $("#apps").val() ? $("#apps").val() : '';
    var tile_type = $("#tile_type").val() ? $("#tile_type").val() : '';
    var keyword = $("#keyword").val() ? $("#keyword").val() : '';
    var obj = {
        status : 1,
        title : keyword,
        appCode : appCode,
        userCode: work.loginName
    };
    app_array.forEach(function (ele,index) {
        ele.total = 0;
        ele.tiles = [];
    });

   // tile_type == shortcut
    var url = "AAA/" + tile_type + "TileTemplates";
    if(tile_type == "panel"){
    	url = "panels";
    	obj = {title : keyword};
    }
    
    $.ajax({
        // url: work.config.tileService + url,
        url:"./json/workbenchService-AAA-shortcutTile-Templates.json",
        type: "get",
        data: obj,
        cache:false,
        ifModified :true,
        success: function (text) {
            // alert("成功了："+text);
            var data = cj.Parse(text);
             console.log(data);
            store_tiles = data;  //个人工作台的5条数据
            for (var i = 0; i < data.length; i++) {
                var tile = data[i];
                tile.code = tile_type;  //shortcut
                tile["thumbnail"] = getThumbnail(tile);   //判断图片是否存在 有的话直接返回该图片 没有的话使用switch语句根据tempId的值指定图片。
                // console.log(app_array);
                app_array.forEach(function (ele,index) {
                    if (ele.appCode == tile.appCode) {
                        ele.tiles.push(tile);
                        ele.total++;
                    }
                });
            };
            template.apps = app_array;  //template={};
            var tmpl;
            var htmlOutput;
            if(tile_type == "panel"){
                tmpl = $.templates("#tile_store_panel_tmpl");
                htmlOutput = tmpl.render(data);
                $("#store_group_main").html('<div class="mainCon"><ul class="totleCon" id="store_group_panel">'+htmlOutput+'</ul></div>');
            }else{  //进到这里
                tmpl = $.templates("#tile_store_Tmpl");
                console.log(template);
                htmlOutput = tmpl.render(template);
                $("#store_group_main").html(htmlOutput);  //将个人工作台的数据动态渲染到#store_group_main容器中
            }
            
            store_tiles_event();   //为右侧内容区域中动态添加的元素添加拖拽事件
            store_tiles_unmove_style();
        },
        error: function (xmlHttpRequest) {
            console.log(xmlHttpRequest);
            // alert("失败");
        }
    });
}

function getThumbnail(tile){
	if(tile.thumbnail == undefined || tile.thumbnail == null || tile.thumbnail == ""){
		switch(tile.tempId + ''){
			case "3":
				return 'Content/img/zhexiantushow.png';
			case "4":
				return 'Content/img/yibiaopanshow.png';
			case "5":
				return 'Content/img/bingtushow.png';
			case "6":
				return 'Content/img/zhuzhuangtushow.png';
			case "11":
				if(tile.type == 1){
					return 'Content/img/lunbotushow.png';
				}

				return 'Content/img/shipinshow.png';
			default:
				return 'Content/img/'+tile.code+'show.png';
		}
	}

	return tile.thumbnail;
}

//获取此刻时间  
function getTimeNow() {
    var now = new Date();
    return now.getTime();
}


// store_tiles_event();
function store_tiles_event() {   //为右侧内容区域中动态添加的元素添加拖拽事件
    //单位宽度
    var w = 0; var h = 0; var X = 0; var Y = 0;

    $(".totleCon>li .midCon").each(function () {
        $(this).bind('mousedown', function (e) {
            e.preventDefault();
            timeStart = getTimeNow();//获取鼠标按下时的时间  
            flagB = true;
            return false;
        });
        $(this).bind('mouseup', function (e) {
            e.preventDefault();
            var self = this;
            flagB = false;
            var time = getTimeNow() - timeStart;
            e.preventDefault();

        });
        $(this).bind('mousemove', function (e) {
            e.preventDefault();
            if (getTimeNow() - timeStart > 500 && flagB) {
                $(".sideOpener").attr("data-p", "off");
                $(".appendtext").attr("data-p", "off");
                $("#right-sidebar").animate({ marginRight: "0px" });
            }
            return false;
        });
        $(this).bind('mouseenter', function (e) {
            e.preventDefault();
            flagB = false;
            return false;
        });
        $(this).bind('mouseleave', function (e) {
            e.preventDefault();
            if (getTimeNow() - timeStart > 50 && flagB) {
                var tileTemplateId = this.id.replace('store_tile_', '');
                var result = store_tiles_unmove(tileTemplateId);
                if (result) {
                    return;
                }
                var $doc = $(document);
                var $tips = $('#J_tips');
                if (!$tips.length) {
                    $tips = $('<div id="J_tips" class="tips"></div>');
                    $('body').append($tips);
                }
                console.log(store_tiles);
                //store_tiles  磁贴商店两个下拉框选取完毕之后筛选出来的数据 //个人工作台5条数据
                //var tileTemplateId = this.id.replace('store_tile_', '');
                for (var i = 0; i < store_tiles.length; i++) {
                	 var st =  store_tiles[i].tileTemplateId;
                    if (st == tileTemplateId) {
                        move_tile = store_tiles[i];  //获取到要移动的磁贴的数据
                        console.log(move_tile);
                    }
                    
                    if(st==undefined && "panel_"+store_tiles[i].panelId == tileTemplateId){
                    	move_tile = store_tiles[i];
                    }
                }

                $doc.on('mousemove', function (e) {
            		e.preventDefault();
                    var pageX = e.pageX,
                        pageY = e.pageY;
                    var tile_type = $("#tile_type").val() ? $("#tile_type").val() : '';
                    var tmpl;
                    console.log(tile_type);
                    if(tile_type == "panel"){
                    	tmpl = $.templates("#panel-tmpl");
                    }else{
                    	tmpl = $.templates("#tmpl" + move_tile.tempId);
                    }
                    
                    htmlOutput = tmpl.render(move_tile);

                    $tips.html(htmlOutput).css({
                        top: pageY - parseInt(move_tile.sizey) * widthx / 2,
                        left: pageX - parseInt(move_tile.sizex) * widthx / 2,
                        width: (parseInt(move_tile.sizex) * widthx) + ((parseInt(move_tile.sizex) - 1) * 20),
                        height: (parseInt(move_tile.sizey) * widthx) + ((parseInt(move_tile.sizey) - 1) * 20)
                    });
                    return false;
                });
                $doc.one('mouseup', function (e) {  //只绑定一次 只有首次触发事件时会执行该事件处理函数。触发之后，jQuery就会移除当前事件绑定。
                    X = Math.floor(e.pageX / widthx) - 1;
                    Y = Math.floor(e.pageY / widthx);
                    if (X <= 0) {
                        X = 1;
                    }
                    if (Y == 0) {
                        Y = 1;
                    }
                    $tips.remove();
                    $(this).unbind('mousemove');
                    var is_add = true;
                    $(".function>li").each(function () {
                        var id = $(this)[0].id;
                        var code;
                        
                        if (id == move_tile.tileTemplateCode) {
                            is_add = false;
                        }
                    });

                    if (is_add) {
                        move_tile["row"] = Y;
                        move_tile["col"] = X;
                        addWidget(0, move_tile, "0");

                        cu_panel_tiles.push(move_tile);
                        cu_move_tiles.push(move_tile.tileTemplateCode);

                        console.log();
                        store_tiles_check_style();
                        store_tiles_unmove_style();

                        //每个磁贴的html是异步加载，延迟1秒执行
                        $(".ingsht,.lbdestlist,.shewidt,.eacstrslist,.circlelist").show();
                        setTimeout(function () {
                            removeInit();
                        }, 1000);

                    }
                    return false;
                })
                return false;
            }

        })
    })

    $('.hiddenD', window.parent.document).click(function () {
        $(this).hide();
        $(".totleCon>li .midCon").each(function () {
            $(this).parent().css("background", "#515e6f").css("opacity", "1")
            $(this).parent().find(".bottomCon").children("img").attr("src", "Content/img/addB.png")
        })
    })
}

//初始化磁贴删除事件
function removeInit() {
    $('.ingsht,.circlelist,.shewidt,.eacstrslist,.lbdestlist').each(function () {
        $(this).unbind('click');
        $(this).on('click', function () {
            var self = this;
            var id = "#" + $(self).data("needid");
            var otype = $(self).attr("data-group");
            gridster[0].remove_widget($(id));
            console.log(cu_move_tiles);
            cu_move_tiles.splice($.inArray("breviary_" + id, cu_move_tiles), 1);
            console.log( cu_move_tiles,"breviary_" + id,cu_move_tiles);
            store_tiles_check_style();
            console.log(cu_panel_tiles);
            var tileTemplateId;
            for (var i = 0; i < cu_panel_tiles.length; i++) {
                if ("tile-"+cu_panel_tiles[i].tileTemplateId == $(self).data("needid")) {
                    tileTemplateId = cu_panel_tiles[i].tileTemplateId;
                    cu_panel_tiles.splice($.inArray(cu_panel_tiles[i], cu_panel_tiles), 1);
                }
            }
            
            store_tiles_unmove_style();
            store_tiles_unmove_style_only(tileTemplateId);
            
            if (otype == "panel") {
                var olist = $(id).find("#ul-group-" + $(self).data("needid")).find("li");
                for(var i = 0, j = olist.length; i< j; i++){
                    store_tiles_unmove_style_only(olist.eq(i).attr("data-ott"));

                };
                for(var m = 0, n = cu_panel_tiles.length; m< n; m++){
                    if (cu_panel_tiles[m].tileTemplateId == olist.eq(m).attr("data-ott")) {
                        choose_panel_tiles.push(cu_panel_tiles[m]);
                    };
                };
                for(var i = 0, j = choose_panel_tiles.length; i< j; i++){
                    cu_panel_tiles.splice($.inArray(choose_panel_tiles[i], cu_panel_tiles), 1);
                };
            };

            //layer.confirm('删除后无法恢复，确认删除？', {
            //        icon : 3,
            //        btn: ['确定', '取消'] //按钮
            //    }, function (index) {
            //
            //    }
            //);
        });
    });
}

//磁贴商店中磁贴移到面板的磁贴样式
function store_tiles_check_style() {
    //遍历当前添加的磁贴编码数组变量
    //找到磁贴商店中的磁贴li，并设置样式
    //$(this).parent().css("border","2px solid red")
    $(".tile_li").each(function () {
        $(this).css("border", "0px solid #FF992D");
    });
    for (var i = 0; i < cu_move_tiles.length; i++) {
        var id = "#breviary_" + cu_move_tiles[i];
        $(id).css("border", "2px solid #FF992D");
    }
}

//面板中已有，磁贴商店中不能移动的磁贴
function store_tiles_unmove(id) {
    var store_tiles_code = [];
    var panel_tiles_code = [];
    var tiles_same = new Array();
    var n = 0;
    for (var i = 0,j = store_tiles.length?store_tiles.length:0; i < j; i++) {
        var ttId = store_tiles[i].tileTemplateId;
    		if(ttId == undefined){
    				store_tiles_code.push("panel_"+store_tiles[i].panelId);
    		}else{
    				store_tiles_code.push(ttId);
    		}
    }
    for (var i = 0,j = cu_panel_tiles.length?cu_panel_tiles.length:0; i < j; i++) {
        var ttId2 = cu_panel_tiles[i].tileTemplateId;
    		if(ttId2 == undefined){
    			panel_tiles_code.push("panel_"+cu_panel_tiles[i].panelId);
    		}else{
    			panel_tiles_code.push(ttId2);
    		}
    }
    for (var i = 0; i < store_tiles_code.length; i++) {
        for (var j = 0; j < panel_tiles_code.length; j++) {
            if (store_tiles_code[i] == panel_tiles_code[j]) {
                tiles_same[n] = store_tiles_code[i];
                n++;
            }
        }
    }
    var result = false;
    for (var i = 0; i < tiles_same.length; i++) {
        if (tiles_same[i] == id) {
            result = true;
        }
    }
    return result;
}

function store_tiles_unmove_style() {
		//商店磁贴
    var store_tiles_code = []; 
    //左侧面板内磁贴
    var panel_tiles_code = [];
    //共同存在的磁贴
    var tiles_same = new Array();
    
    var n = 0;
    console.log(store_tiles);
    //  store_tiles  个人工作台的5条数据
    for (var i = 0,j = store_tiles.length?store_tiles.length:0; i < j; i++) {
    		var ttId = store_tiles[i].tileTemplateId;
    		if(ttId == undefined){
    				store_tiles_code.push("panel_"+store_tiles[i].panelId);
    		}else{
    				store_tiles_code.push(ttId);
    		}
    }
    console.log(cu_panel_tiles);
    // cu_panel_tiles;   获取到的是拖拽完成之后的数据 即窗口容器中的数据集合 （磁贴管理、分组二  length=4）
    for (var i = 0,j = cu_panel_tiles.length?cu_panel_tiles.length:0; i < j; i++) {
    		var ttId2 = cu_panel_tiles[i].tileTemplateId;
    		if(ttId2 == undefined){
    			panel_tiles_code.push("panel_"+cu_panel_tiles[i].panelId);
    		}else{
    			panel_tiles_code.push(ttId2);
    		}
    }
    console.log(panel_tiles_code);
    
    for (var i = 0; i < store_tiles_code.length; i++) {
        for (var j = 0; j < panel_tiles_code.length; j++) {
            if (store_tiles_code[i] == panel_tiles_code[j]) {
                tiles_same[n] = store_tiles_code[i];
                n++;
            }
        }
    }
    
    for (var i = 0; i < tiles_same.length; i++) {
        var thisT = $("#store_tile_" + tiles_same[i]);
        thisT.parent().css("opacity", "0.9");
        thisT.parent().find(".bottomCon").children("img").attr("src", "Content/img/rightC.png");
    }
    
    //切换磁贴状态！并清空数组 lss 20180424   没有什么用处！
    for (var i = 0; i < del_cu_panel_tiles.length; i++) {
        var thisT = $("#store_tile_" + del_cu_panel_tiles[i]);
        thisT.parent().css("opacity", "0.9");
        thisT.parent().find(".bottomCon").children("img").attr("src", "Content/img/addB.png");
    }

    del_cu_panel_tiles = [];
    
}

function store_tiles_unmove_style_only(id) {
    var thisT = $("#store_tile_" + id);
    thisT.parent().css("opacity", "0.9");
    thisT.parent().find(".bottomCon").children("img").attr("src", "Content/img/addB.png");
}

//gridster把每一块称为widget（窗口小部件）
$(document).ready(function () {
    gridster[0] = $(".gridster>ul").gridster({
        namespace: ".gridster",
        widget_selector: "li",                        //确定哪个元素是widget
        widget_margins: [margins, margins],                       //margin大小
        widget_base_dimensions: [widthx, widthx],           //面积大小
        //extra_rows: 0,                              //增加更多的横数确保空隙合适
        //extra_cols: 0,                              //增加更多的列数确保空隙合适
        //max_size_x: 6,                              //一个widget最大多少列
        //max_size_y: 6,                              //一个widget最大多少横
        max_cols: 12,                             //最多创建多少列，null表示没有限制
        //max_rows: null,                             //最多创建多少横，null表示没有限制
        min_cols: 12,                                //至少创建多少列
        //min_rows: 15,                               //至少创建多少横
        //autogenerate_stylesheet: true,   //允许通过CSS自动生成，例如：[data-col="1"] { left: 10px; }
        avoid_overlapped_widgets: true,  //不允许widgets加载的时候重叠

        //resize.enabled: false,//允许改变大小
        //resize.axes: ['both'],      //能通过X,Y轴去改变大小
        //resize.handle_class: 'gs-resize-handle',          //把某个class当做改变大小的控件
        //resize.handle_append_to: '',//set a valid CSS selector to append resize handles to. If value evaluates to false it's appended to the widget.
        //resize.max_size: [Infinity, Infinity],  //改变大小的最大值
        helper: 'clone',
        resize: {
            enabled: false   //表示不可以拖动模块的右下角改变模块大小
        },
        serialize_params: function ($w, wgd) {        //返回序列化后widget的数据
            var obj = {
                col: wgd.col.toString(),//列
                row: wgd.row.toString(),//行
                sizex: wgd.size_x,//X轴宽
                sizey: wgd.size_y,//Y轴高
                config: $w.context.type.toString(),
                userCode: work.loginName
            };
            var contextId = $w.context.id.toString();
	        	if(contextId.indexOf('tile')>-1){
	        		obj.tileTemplateId = contextId.substring(5);
	        	}else{
	        		obj.panelId = contextId.substring(6);
	        	}
            
            return obj;
        }
        //draggable.start: function(event, ui){},          //拖动事件
        //draggable.drag: function(event, ui){},
        //draggable.stop: function(event, ui){},
        //用法：
        /*draggable:{
         //handle: 'header',         //设置拖动控件
         start: function(event, ui){
         },
         drag:function(event, ui){
         },
         stop: function(event, ui){
         }
         }*/
        //collision.on_overlap_start: function(collider_data) { },    //碰撞/交互事件
        //collision.on_overlap: function(collider_data) { },
        //collision.on_overlap_stop: function(collider_data) { },
        //resize.start: function(e, ui, $widget) {},     //改变大小事件
        //resize.resize: function(e, ui, $widget) {},
        //resize.stop: function(e, ui, $widget) {},

    }).data('gridster');
    gridster[0].disable();//禁止拖动
    //var gridster = $(".gridster ul").gridster().data('gridster');//获取对象
    //alert("row:"+gridster.rows+"--cols"+gridster.cols);
    //gridster.remove_widget( $('.gridster li').eq(0) ); //删除第4块,0开始算起
    //var json = gridster.serialize();
    //alert(JSON.stringify(json));
    //gridster.enable( );
    /* gridster.$el   //增加事件
     .on('mouseenter', '> li', function() {
     gridster.resize_widget($(this), 3, 3);
     })
     .on('mouseleave', '> li', function() {
     gridster.resize_widget($(this), 1, 1);

     });*/

    var index = layer.load(1, {
        shade: [0.5, '#000'],
        success: function (index) {
            load_tile(true);
            load_panel();
        }
    });
    
    

});
/*===加载面板===*/