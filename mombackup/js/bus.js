/**
 * 业务工具类，命名空间为
 * @see 使用方法：basePath()
 * @type {Bus|*|Function}
 * @Auth Qiyh
 * @Data 2018-6-01
 */
var Bus = window.Bus || (function() {

    // 打开一个模态窗体
    var windowOpen = function(url, name, width, height){
        var top=parseInt((window.screen.height-height)/2,10),left=parseInt((window.screen.width-width)/2,10);
        var options="location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,"+
                "resizable=yes,scrollbars=yes,"+"width="+width+",height="+height+",top="+top+",left="+left;
        if(window.showModalDialog) {
            window.showModalDialog(url, name, options);
        }else{
            window.open(url, name, options);
        }
    };

    var windowOpenPost = function(url, params, target){
        var tempform = document.createElement("form");
        tempform.action = url;
        tempform.method = "post";
        tempform.style.display="none";
        if(target) {
            tempform.target = target;
        };
        if(params){
            for (var x in params) {
                var opt = document.createElement("input");
                opt.name = x;
                opt.value = params[x];
                tempform.appendChild(opt);
            }
        }
        var opt = document.createElement("input");
        opt.type = "submit";
        tempform.appendChild(opt);
        document.body.appendChild(tempform);
        tempform.submit();
        document.body.removeChild(tempform);
    };

    var openDialog = function(title, url, width, height, fullScreen, callback){
        var p_ = top;//window.parent?window.parent:top;
        var isMobileAgent_ = Mom.isMobileAgent;
        if(undefined==width || width==''){
            width = fullScreen==true?'auto':'800px';
        }
        if(undefined==height || height==''){
            height = fullScreen==true?'auto':'500px';
        }
        //如果是移动端，就使用自适应大小弹窗
        if(isMobileAgent_==true){
            width = 'auto';
            height = 'auto';
        }
        var config = {
            type: 2,
            area: [width, height],
            title: title,
            maxmin: true, //开启最大化最小化开关
            content: url,
            success: function(layero, index){
                //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                //var iframeWin = p_.window[layero.find('iframe')[0]['name']];//外部窗口
                var iframeWin = layero.find('iframe')[0].contentWindow; //内部窗口
                iframeWin = iframeWin.contentWindow||iframeWin;
                //自动高度
                if(height=='auto' && isMobileAgent_!=true){
                    p_.layer.iframeAuto(index);
                }
                //加载完成后设置内部的关闭按钮
                $('.closeBtn',iframeWin.document).each(function(i,o){
                    var closeBtnStr = $(o).prop("outerHTML");
                    var _fun = closeBtnStr.match(/\([^\)]*\)/g);
                    if(_fun==null || _fun=='()'){
                        $(o).unbind("click").click(function(){p_.layer.close(index);return false;});
                    }
                });
            }
        };
        if(callback){
            config.btn = ['确定','关闭'];
            config.yes = function(index, layero){
                var flag = callback(index, layero);
                if(flag==true){
                    setTimeout(function(){p_.layer.close(index)}, 100);//延时0.1秒，对应360 7.1版本bug
                }
            };
            config.cancel = function(index){};
        }else{
            config.btn = ['关闭'];
            config.cancel = function(index){};
        }
        var layIndex=p_.layer.open(config);
        if(fullScreen==true){//全屏
            p_.layer.full(layIndex);
        }
    };
    var openEditDialog = function(title, url, width, height, fullScreen){
        if(title==null || title==''){
            title = '修改';
        }
        openDialog(title, url, width, height, fullScreen, function(layerIdx,layero){
            var p_ = top;//window.parent?window.parent:top;
            var iframeBody = p_.layer.getChildFrame('body', layerIdx);
            var iframeWin = layero.find('iframe')[0].contentWindow; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            //body.find('#inputForm').attr("target",Contabs.getActiveTab().attr("name"));//提交到当前激活的页签,在回调的doSubmit方法中设置
            var flag_ = false;
            //默认回调父窗口的doSubmit()方法
            try{
                flag_=iframeWin.doSubmit(iframeWin, iframeBody, layerIdx);
            }catch(e){window.alert(e.message);}
            return flag_;
        });
    };

    /**
     * 回调函数，在修改和添加时，供openEditDialog调用提交表单。
     * 注意：需要在form的action中写上提交的接口地址
     *      地址的Domain地址可以使用$Api.domain$进行定义
     *      如：action="$Api.admin$/api/User/save"
     */

    window.doSubmit = function(iframeWin, iframeBody, layerIdx){
        if(!Validator.valid(document.forms[0],1.3)){
            return;
        }
        var formObj = $('#inputForm');
        var url = formObj.attr('action');
        var formdata = formObj.serializeJSON();
        Api.ajaxJson(url,JSON.stringify(formdata),function(result){
            if(result.success == true){
                layer.msg('已成功提交',{time: 1000});
                setTimeout(function(){
                    //关闭弹出层
                    top.layer.close(layerIdx);
                    //刷新父层
                    var frameActive = top.TabsNav.getActiveTab().attr("name");
                    var obj = $('#search-btn', top.window.frames[frameActive].document);
                    if(obj.length == 0){
                        obj = $('#refresh-btn', top.window.frames[frameActive].document);
                    }
                    obj.trigger('click');
                },1000);
            }else{
                Mom.layAlert(result.message);
            }
        });
    };


    /*
     * 修改数据
     */
    var editCheckedTable = function(title,url,width,height,tableId){
        var len = $(tableId +" tbody tr td input.i-checks:checked").length;
        if(len == 0 ){
            top.layer.alert('请至少选择一条数据!', {icon: 0, title:'警告'});
            return;
        }

        if(len > 1 ){
            top.layer.alert('只能选择一条数据!', {icon: 0, title:'警告'});
            return;
        }
        var id =  $(tableId +" tbody tr td input.i-checks:checkbox:checked").attr("id");
        var url = Mom.extractUrl(url, "id="+id);
        openEditDialog(title,url,width, height);
    };

    // 删除多条数据
    function delCheckTable(tit,url,tableId){
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
                Api.ajaxForm(url,data,function (result) {
                    if(result.success == true){
                        var frameActive = top.TabsNav.getActiveTab().attr("name");
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

    var deleteItem = function(mess,url,id){
        var data = {ids:id} || {};
        top.layer.confirm(mess, {icon: 3, title:'系统提示'},function(index){
            Api.ajaxForm(url,data,function(result){
                console.log(url,data,result);
                if(result.success == true){
                    var frameActive = top.TabsNav.getActiveTab().attr("name");
                    var obj = $('#search-btn', top.window.frames[frameActive].document);
                    if(obj.length == 0){
                        obj = $('#refresh-btn', top.window.frames[frameActive].document);
                        if(obj.length == 0){
                            top.TabsNav.refreshActiveTab();
                        }
                    }
                    obj.trigger('click');
                }
            });
            top.layer.close(index);
        });
        return false;
    };

    //删除成功后的回调函数
    function deleteCheck(result){
        if(result.success){
            layer.msg('删除成功',{time: 1000});
            setTimeout(function(){
                top.TabsNav.refreshActiveTab();
            },1000)
        }
    }


    /**
     * 用户选择
     * @param dataUrl: 已选择的用户
     * @param multiple: 是否多选
     * @param selectUserCallback
     */
    var openSelUserWin = function(dataUrl, multiple, selectUserCallback){
        multiple = multiple!=undefined?multiple:false;
        var url_=basePath()+'/User/userSelect?multiple='+multiple+'&url='+encodeURIComponent(dataUrl);
        openDialog('选择用户',url_,'800px','600px',false, function(index,layero){
            var innerWindow=layero.find("iframe")[0].contentWindow;
            var retUser=innerWindow.getSelectUsers();
            var userIds = retUser['id'];
            if(userIds==''){
                Mom.layMsg('请选择用户!');
                return false;
            }
            if(multiple==false){
                if(userIds.indexOf(',')>-1){
                    Mom.layMsg('最多只能选择一个用户!');
                    return false;
                }
            }
            else if(selectUserCallback) {
                return selectUserCallback(retUser);
            }
            return true;
        });
    };

    /**
     * 用户选择2
     * @param dataUrl: 已选择的用户
     * @param multiple: 是否多选
     * @param selectUserCallback
     */
    var openSelUserWin2 = function(multiple, checkedVals, params, selectUserCallback){
        multiple = multiple!=undefined?multiple:false;
        params = params||'';
        var _url = basePath()+'/Common/officeTree?type=3&'+params;
        var p_ = top;
        // 正常打开
        p_.layer.open({
            type: 2,
            area: ['300px', '420px'],
            title: "选择用户",
            content: basePath()+'/Common/treeSelect?url='+_url+'&multiple='+multiple+'&checkedVals='+checkedVals,
            btn: ['确定','关闭'],
            yes: function (index, layero) { //或者使用btn1
                var innerWindow=layero.find("iframe")[0].contentWindow;
                var retObj=innerWindow.getSelectValues(multiple, true, true);
                var retSucess = retObj.success;
                if(retSucess==true){
                    var userIds = retObj['id'];
                    if(userIds==''){
                        layMsg('请选择用户!');
                        return false;
                    }
                    if(multiple==false){
                        if(userIds.indexOf(',')>-1){
                            layMsg('最多只能选择一个用户!');
                            return false;
                        }
                    }
                    var userNames = retObj['name'];
                    if(selectUserCallback) {
                        retSucess = selectUserCallback(userIds, userNames, retObj);
                    }
                    if(retSucess != false) {
                        p_.layer.close(index);
                    }
                }
            },
            cancel: function (index) { //或者使用btn2
                //按钮【按钮二】的回调
            }
        });
    };

    //获取字典标签
    var getDictLabel = function(data, value, defaultValue){
        for (var i=0; i<data.length; i++){
            var row = data[i];
            if (row.value == value){
                return row.label;
            }
        }
        return defaultValue;
    };

    //动态添加Select的option
    function createSelect(url,appendEl,valueField, labelFile){
        Api.ajaxJson(url,{},function(result){
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


    return {
        //打开模态窗口
        windowOpen: windowOpen,
        windowOpenPost: windowOpenPost,
        //打开layer窗口
        openDialog: openDialog,
        openEditDialog: openEditDialog,
        delCheckTable: delCheckTable,
        deleteItem: deleteItem,
        editCheckedTable: editCheckedTable,

        //用户选择窗口
        openSelUserWin: openSelUserWin,
        openSelUserWin2: openSelUserWin2,
        //获取字典的label
        getDictLabel: getDictLabel,

        //下拉框操作方法
        createSelect: createSelect,
        resetSelect: resetSelect,
        appendOptionsValue: appendOptionsValue,
        appendOptions: appendOptions,

    }
})();