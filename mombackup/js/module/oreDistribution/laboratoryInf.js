/**
 * Created by jiaxuguang on 2018/7/9.
 */
require(['/js/zlib/app.js'], function (App) {
    //引入用户登录校验
    require(['/js/plugins/dropzone/dropzone.min.js', 'icheck']),
        //引入样式文件
        Mom.include('myCss', '', [
            '../js/plugins/metismenu/metisMenu.css',
            '../js/plugins/datetimepicker/css/bootstrap-datetimepicker.css',
            '../js/plugins/webUpLoader/webuploader.css',
            '../js/plugins/dropzone/dropzone.min.css'

        ]);


    var PageModule = {
        //页面初始化
        init: function () {
            //引入Page插件
            require(['Page'], function () {
                window.pageLoad = function () {
                    //时间选择插件
                    require(['/js/plugins/datetimepicker/js/bootstrap-datetimepicker.js'], function () {
                        $("#startDate,#endDate").val("").datetimepicker({
                            format: "yyyy-mm-dd hh:ii",  //保留到日
                            showMeridian: false,     //显示上、下午
                            language: "zh-CN",   //中文显示
                            minView: "0",    //月视图
                            autoclose: true  //选择时间后自动隐藏
                        });
                    });


                    //拖拽上传
                    $('.dropUpLoader').click(function () {
                        Bus.openDialog('', 'oreDistribution/laboratoryInfInner.html', '640px', '400px');
                    });


                    //搜索框信息
                    var data = {
                        sendDate: $('#startDate').val(),
                        endDate: $('#endDate').val(),
                        sid2: $('#sid2').val()
                    };
                    console.log(data);
                    //渲染表格以及渲染分页
                    Page.init(Api.aps + "/api/ob/OreLaboratoryInfo/page", data, true, function (result) {
                        if (result != undefined || result != null || result != '') {
                            PageModule.rendertable(result);
                        } else {
                            Mom.layAlert('数据载入异常,请联系管理员')
                        }

                    });
                };
                $("#search-btn").click(function () {
                    pageLoad();
                });
                pageLoad();
            });


        },
        //渲染表格
        rendertable: function (res) {
            require(['dataTables'], function () {
                require(['icheck'], function () {
                    //datatables方法
                    $('#dataTable').dataTable({
                        "bPaginate": false,
                        "bAutoWidth": false,
                        "bDestroy": true,
                        "paging": false,
                        "bProcessing": true,
                        "searching": false, //禁用aa原生搜索
                        "info": false,  //底部文字
                        "order": [],
                        "aoColumnDefs": [
                            {"bSortable": false, "aTargets": [0, 2, 6]}
                        ],
                        "oLanguage": dataTableLang,
                        "data": res,
                        //定义列 宽度 以及在json中的列名
                        "aoColumns": [
                            {
                                "data": null, "sWidth": "60px;", "defaultContent": "", 'sClass': "alignCenter",
                                "render": function (data, type, row, meta) {
                                    return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                                }
                            },
                            {"data": null, 'sClass': " alignCenter", 'sWidth': '4%'},
                            {"data": "checkedDate", 'sClass': "alignCenter ", 'sWidth': '11%'},
                            {"data": "sid2", 'sClass': "alignCenter", 'sWidth': '7%'},
                            {
                                "data": "al2o3Value", 'sClass': "alignCenter", 'sWidth': '4%',
                                "render": function (data, type, row, meta) {
                                    row.al2o3Value = Number(data).toFixed(2);//保留两位小数
                                    return row.al2o3Value
                                }
                            },
                            {
                                "data": "sio2Value", 'sClass': "alignCenter", 'sWidth': '4%',
                                "render": function (data, type, row, meta) {
                                    row.sio2Value = Number(data).toFixed(2);
                                    return row.sio2Value
                                }
                            },
                            {
                                "data": "fe2o3Value", 'sClass': "alignCenter", 'sWidth': '4%',
                                "render": function (data, type, row, meta) {
                                    row.fe2o3Value = Number(data).toFixed(2);
                                    return row.fe2o3Value
                                }
                            },
                            {
                                "data": "tio2Value", 'sClass': "alignCenter", 'sWidth': '4%',
                                "render": function (data, type, row, meta) {
                                    row.tio2Value = Number(data).toFixed(2);
                                    return row.tio2Value
                                }
                            },
                            {
                                "data": "caoValue", 'sClass': "alignCenter", 'sWidth': '4%',
                                "render": function (data, type, row, meta) {
                                    row.caoValue = Number(data).toFixed(2);
                                    return row.caoValue
                                }
                            },
                            {
                                "data": "aSValue", 'sClass': "alignCenter", 'sWidth': '4%',
                                "render": function (data, type, row, meta) {
                                    row.aSValue = Number(data).toFixed(2);
                                    return row.aSValue
                                }
                            },
                            {
                                "data": "tolValue", 'sClass': "alignCenter", 'sWidth': '4%',
                                "render": function (data, type, row, meta) {
                                    row.tolValue = Number(data).toFixed(2);
                                    return row.tolValue
                                }
                            },
                            {
                                "data": "k2oValue", 'sClass': "alignCenter", 'sWidth': '4%',
                                "render": function (data, type, row, meta) {
                                    row.k2oValue = Number(data).toFixed(2);
                                    return row.k2oValue
                                }
                            },
                            {
                                "data": "cValue", 'sClass': "alignCenter", 'sWidth': '4%',
                                "render": function (data, type, row, meta) {
                                    row.cValue = Number(data).toFixed(2);
                                    return row.cValue
                                }
                            },
                            {
                                "data": "sValue", 'sClass': "alignCenter", 'sWidth': '4%',
                                "render": function (data, type, row, meta) {
                                    row.sValue = Number(data).toFixed(2);
                                    return row.sValue
                                }
                            },
                            {"data": "checkedUser", 'sClass': "alignCenter", 'sWidth': '4%'},
                            {"data": "auditor", 'sClass': "alignCenter", 'sWidth': '5%'},
                            {"data": "censorDate", 'sClass': "alignCenter"},
                            {"data": "sendDate", 'sClass': "alignCenter"}
                        ],
                        "fnDrawCallback": function () {
                            this.api().column(1).nodes().each(function (cell, i) {
                                cell.innerHTML = i + 1;
                            });
                        }
                    });
                    //渲染勾选框
                    renderIChecks();
                    PageModule.tablebtn();


                })
            })
        },
        //操作表格的按钮
        tablebtn: function () {
            /*table控制按钮*/
            //添加一可编辑行
            $('#add-btn').unbind('click');
            $('#add-btn').on('click',function () {
                var i = 0;
                i++;
                trhtm = '<tr role="row" class="newrows odd"><td class="alignCenter"><input type="checkbox" class="i-checks "></td><td ><input type="text" readonly="readonly" class="giveWidth alignCenter form-control"></td></tr>';
                $('#datainner').prepend(trhtm);
                for (var i = 0; i < $('#dataTable>thead>tr>th').length - 2; i++) {
                    tdhtm = '<td ><input type="text" class="giveWidth alignCenter editText"></td>';
                    $('#datainner>tr:first').append(tdhtm);

                }
                $('.newrows').each(function (i, item) {
                    $(item).find('td:eq(2),td:eq(16),td:eq(17)').children('input').addClass('datetimepicker').datetimepicker({
                        format: "yyyy-mm-dd hh:ii",  //保留到日
                        showMeridian: false,     //显示上、下午
                        language: "zh-CN",   //中文显示
                        minView: "0",    //月视图
                        autoclose: true  //选择时间后自动隐藏
                    });

                });


                renderIChecks();
            });
            //保存编辑行
            $('#save-btn').on('click', function () {
                var savedata = [];
                $("#datainner .newrows").each(function (index, item) {
                    savedata.push(PageModule.save(item));
                });
                var data = {
                    laboratoryInfos: JSON.stringify(savedata)
                };
                console.log(data);
                Api.ajaxForm(Api.aps + '/api/ob/OreLaboratoryInfo/save', data, function (result) {
                    if(result.success){
                        Mom.layMsg('保存成功');
                        pageLoad();
                    }else{
                        Mom.layMsg(result.message);
                    }
                })

            })
        },
        //导入excel
        import: function () {
            require(['/js/plugins/dropzone/dropzone-amd-module.js', '/js/plugins/dropzone/dropzone.js'], function () {
                var url = Api.aps + '/ob/import/OreLaboratoryInfo/excelPut';
                $(".dropzone").dropzone({
                    url: url,//上传地址
                    paramName: "file",//传参名称
                    maxFilesize: 5.0, // MB
                    parallelUploads: 10,//并行上传个数
                    maxFiles: 10,//一次性上传的文件数量上限
                    acceptedFiles: ".xls,.xlsx",//限制上传格式
                    addRemoveLinks: true,//添加移除文件
                    autoProcessQueue: false,//不自动上传
                    dictCancelUploadConfirmation: '你确定要取消上传吗？',
                    dictMaxFilesExceeded: "您一次最多只能上传{{maxFiles}}个文件",
                    dictFileTooBig: "文件过大({{filesize}}MB). 上传文件最大支持: {{maxFilesize}}MB.",
                    dictDefaultMessage: '拖动文件至该处(或点击此处)',
                    dictResponseError: '文件上传失败!',
                    dictInvalidFileType: "你不能上传该类型文件,文件类型只能是*.xls以及*.xlsx。",
                    dictCancelUpload: "取消上传",
                    dictRemoveFile: "移除文件",
                    uploadMultiple: false,//传参是否开放多个 传参类型不一样
                    init: function () {
                        myDropzone = this; // closure
                        arr = [];
                        $('#upexcel').click(function () {
                            myDropzone.processQueue();

                        });
                        //添加了文件的事件
                        this.on("addedfile", function (file) {
                            console.log(file);
                            $('#subModel').modal().css({
                                'margin-top': function () {
                                    return (document.body.scrollHeight / 2.5);
                                }

                            });
                            $('#subModel').modal('show');

                        });

                        //为上传按钮添加点击事件
                        this.on("success", function (file, data) {
                            console.log('成功', file, data);
                            if (data.success == false) {
                                arr.push(data.message);
                            } else {
                                layer.msg("上传成功！");

                            }
                        });

                        this.on("error", function (file, data) {
                            alert("文件上传失败！");
                        });
                        this.on("queuecomplete", function (file, data) {
                            alert(arr);
                            arr = [];
                        });

                    }


                });
            })
        },
        //保存调用事件
        save: function (item) {
            var tabArr = [];
            var valObj = {};
            var tbheadArr = ['checkedDate', 'sid2', 'al2o3Value', 'sio2Value', 'fe2o3Value', 'tio2Value', 'caoValue',
                'aSValue', 'tolValue', 'k2oValue', 'cValue', 'sValue', 'checkedUser', 'auditor', 'censorDate', 'sendDate'
            ];
            $(item).find('td .editText').each(function (index, item) {
                if ($(item).val() == '') {
                    Mom.layAlert('除序号列外，所有数据信息需要填写完整再进行保存！');
                } else {
                    tabArr.push($(item).val());
                }

            });
            for (var j = 0; j < tbheadArr.length; j++) {
                valObj[tbheadArr[j]] = tabArr[j]
            }
            return valObj
        }
    };


    $(function () {
        if ($('#laboratoryInf').length > 0) {
            PageModule.init();
        } else if ($('#laboratoryInfInner').length > 0) {
            PageModule.import();
        }

    });

});
