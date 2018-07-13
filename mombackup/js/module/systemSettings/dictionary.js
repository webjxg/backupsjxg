require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);

    var PageModule = {
        listInit: function(){
            //引入Page插件
            require(['Page'],function(){
                window.pageLoad = function (){
                    var data = {
                        type: $("#type option:selected").val(),
                        descriptionParam: $('#description').val()
                    };
                    //修改默认每页显示条数
                    Page.init(Api.admin+"/api/sys/SysDict/page",data,true,function(tableData){
                        renderTableData(tableData);
                        $('.btn-check').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openDialog('查看字典','systemSettings/dictionaryInner.html?id='+id,'800px','500px')
                        });
                        $('.btn-change').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openEditDialog('修改字典','systemSettings/dictionaryInner.html?id='+id,'800px','500px');
                        });
                        $('.btn-delete').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.deleteItem('确定要删除该字典吗',Api.admin+'/api/sys/SysDict/delete',id)
                        });
                        $('.btn-add').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openEditDialog('添加键值','systemSettings/dictionaryInner.html?id='+id+'&api=addKey','800px','500px')
                        });
                        //点击重置按钮
                        $('#reset-btn').click(function(){
                            $("#type option:first").prop("selected", 'selected');
                            $("#description").val("");
                            Page.reset(["type","description"]);
                        });
                    });
                };
                $("#search-btn").click(function(){
                    pageLoad();
                });
                pageLoad();
            });

            function renderTableData(tableData){
                $('#treeTable').dataTable({
                    "bPaginate": false,
                    "bAutoWidth": false,
                    "bDestroy":true,
                    "paging": false,
                    "bProcessing": true,
                    "searching": false, //禁用aa原生搜索
                    "info": false,  //底部文字
                    "order": [],
                    "aoColumnDefs": [
                        {"bSortable": false, "aTargets": [0, 2, 6]}
                    ],
                    "oLanguage": dataTableLang,
                    "data":tableData,
                    //定义列 宽度 以及在json中的列名
                    "aoColumns": [
                        {"data": null,"sWidth":"60px;","defaultContent":"",'sClass':"alignCenter",
                            "render":function(data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": "value",'sClass':" alignCenter","width":"12%"},
                        {"data": "label",'sClass':"alignCenter ","width":"12%"},
                        {"data": "type",'sClass':"alignCenter","width":"12%"},
                        {"data": "description",'sClass':"alignCenter"},
                        {"data": "sort",'sClass':"alignCenter","width":'8%'},
                        {
                            "data": "id", "orderable": false, "defaultContent": "",'sClass':" alignCenter autoWidth",
                            "render": function (data, type, row, meta) {
                                return "<a class='btn btn-info btn-xs btn-check' ><i class='fa fa-search-plus'></i>查看</a >" +
                                    "<a class='btn btn-success btn-xs btn-change' ><i class='fa icon-change'></i>修改</a >" +
                                    "<a class='btn btn-danger btn-xs btn-delete' ><i class='fa fa-trash-o' ></i>删除</a >" +
                                    "<a class='btn btn-primary btn-xs btn-add'><i class='fa fa-plus'></i>添加键值</a >";
                            }
                        }]
                });
                renderIChecks();
            }

            Bus.createSelect(Api.admin+"/api/sys/SysDict/allType","#type",'type','type');  //动态添加Select的option
        },

        formInit: function(){
            var id = Mom.getUrlParam('id'),
                api = Mom.getUrlParam('api') || 'form';

            $("#value").focus();
            if(id){
                var url = Api.admin+"/api/sys/SysDict/"+api+"/"+id;
                Api.ajaxJson(url,{},function(result){
                    if(result.success){
                        Validator.renderData(result.SysDict,$('#inputForm'));
                    }else{
                        layer.msg(result.message);
                    }
                });
            }


        }
    };

    $(function(){
        //数据字典列表
        if($('#dictionary').length > 0){
            PageModule.listInit();
        }
        else if($('#dictionaryInner').length > 0){
            PageModule.formInit();
        }


    });

});