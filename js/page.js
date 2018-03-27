/**
 * Created by mac on 18/2/1.
 */

var Page = {
    url_:"",
    paramData:null,
    renderTableFn:null,
    defaultPageSize:null,
    rowCount:0,
    init:function(url,data,vari,renderTableFn){
        Page.url_ = url;
        Page.paramData = data;
        if(renderTableFn){
            Page.paramData.page = {
                pageSize: parseInt($("#pag-sel option:selected").val()),
                pageNo: 1
            };
            Page.renderTableFn = renderTableFn;
            Page.regist();
        }
        Page.pageCom(data,vari);
    },
    reload:function(){
        if(Page.paramData){
            Page.pageCom(Page.paramData,false);
        }
    },
    regist:function(){
        $("#pag-sel").change(function(){
            var _ps = parseInt($(this).val());
            Page.paramData.page.pageSize = (_ps==-1?Page.rowCount:_ps);
            Page.pageCom(Page.paramData,true);
        });
    },
    reset:function(arrParam){
        var len = arrParam.length;
        if(len){
            for(var i = 0;i<len;i++ ){
                if(typeof(Page.paramData[arrParam[i]]) == "object"){
                   var obj = Page.paramData[arrParam[i]];
                    for(var key in obj){
                        var arr =[]; arr.push(arrParam[i][key]);
                        obj[key] = "";
                    }
                }else{
                    Page.paramData[arrParam[i]] = "";
                }
            }
        }

        Page.paramData.page.pageSize = $("#pag-sel").val();
        Page.pageCom(Page.paramData,true);
    },
    pageCom:function(data,vari){
        ajaxToServer(Page.url_, JSON.stringify(data), function(result){
            if(result.success){
                var page = result.page;
                Page.rowCount = page.count;
                $(".page-info").empty().html("显示第"+(page.startRowNum+1)+"到第"+(page.endRowNum+1)+"条记录，总共 "+(page.count)+"条记录");
                $('.pagination-detail').show();
                if( Page.renderTableFn){
                    Page.renderTableFn(page.rows);
                }
                if(vari){
                    Page.callBackPagination(page.pageSize,page.pageCount,page.count);
                }
            }else{
                layer.msg(result.message);
            }

        })
    },
    callBackPagination:function(limit,showCount,totalCount) {
    //createTable(pagNo, limit, totalCount);
    $('#pagination').extendPagination({
        totalCount: totalCount,
        showCount: showCount,
        limit: limit,
        callback: function (curr,limit, totalCount) {
            Page.paramData.page = {
                pageSize:limit,
                pageNo:curr,
            };
            Page.init(Page.url_,Page.paramData,false);
        }
    });
}
};
