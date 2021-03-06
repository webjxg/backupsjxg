/**
 * Created by mac on 18/2/1.
 */

var Page = {
    url_:"",
    paramData:null,
    renderTableFn:null,
    pageSizeArr:[5,10,20,25,30,40,50],
    defaultPageSizeIndex: 2,
    rowCount:0,

    /**
     * 调用Page.init()进行分页渲染,
     * 如果要调整每页显示大小:Page.defaultPageSizeIndex=?
     * @param url
     * @param data
     * @param vari
     * @param renderTableFn
     */
    init:function(url,data,vari,renderTableFn){
        Page.url_ = url;
        Page.paramData = data;
        if(renderTableFn){
            var selPs = parseInt($("#pag-sel option:selected").val())
            Page.paramData.page = {
                pageSize: (isNaN(selPs) || selPs<0)?Page.pageSizeArr[Page.defaultPageSizeIndex]:selPs,
                pageNo: 1
            };
            Page.renderTableFn = renderTableFn;
        }
        Page.pageCom(data,vari);
    },
    reload:function(){
        if(Page.paramData){
            Page.pageCom(Page.paramData,false);
        }
    },
    bindEvent:function(){
        $("#pag-sel").unbind('change').change(function(){
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
                var showInfo = "显示第"+(page.startRowNum+1)+"到第"+(page.endRowNum+1)+"条记录，总共 "+(page.count)+"条记录";
                showInfo += "   <span>每页显示</span><select name='' id='pag-sel' class='form-control' style='height:28px;padding:0 4px;display:inline;font-size:12px;'>";
                var pageSizeArr_ = Page.pageSizeArr;

                var allSelected=' selected';
                pageSizeArr_.forEach(function(o,i){
                    var selected = o==page.pageSize?' selected':'';
                    showInfo += "<option value='"+o+"' "+selected+">"+o+"</option>";
                    if(selected != ''){
                        allSelected = '';
                    }
                });
                // showInfo += "<option value='"+page.count+"' "+allSelected+">所有</option>";
                showInfo += "<option value='-1' "+allSelected+">所有</option>";
                showInfo += "</select>条记录";
                $(".page-info").empty().html(showInfo);
                Page.bindEvent();
                $('.pagination-detail').show();
                if( Page.renderTableFn){
                    Page.renderTableFn(page.rows, result);
                }
                // debugger;
                if(vari){
                    Page.callBackPagination(page.pageSize,page.pageCount,page.count);
                }
                $('html,body').animate({scrollTop: '0px'}, 300);
            }else{
                layer.msg(result.message);
            }

        })
    },
    callBackPagination:function(limit,showCount,totalCount) {
        $('#pagination').extendPagination({
            totalCount: totalCount,
            showCount: showCount,
            limit: limit,
            callback: function (curr,limit, totalCount) {
                Page.paramData.page = {
                    pageSize:limit,
                    pageNo:curr
                };
                Page.init(Page.url_,Page.paramData,false);
            }
        });
    }
};
