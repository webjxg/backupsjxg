// 公共样式库


//userCompany页面使用 ajax并返回处理节点方法
var zTreeObj;
function ztreeCompany(data) {
    console.log(data);
    var da=data.rows;
    var arr = [];
    da.filter(function (a) {
        // if (a.pId == 0) {
            arr.push(a)
        // }
    })
    var setting = {
        data: {
            simpleData: {
                enable: true,   //设置是否使用简单数据模式(Array)
                idKey: "id",    //设置节点唯一标识属性名称
                pIdKey: "pId"      //设置父节点唯一标识属性名称
            },
            key: {
                name: "name",//zTree 节点数据保存节点名称的属性名称
                title: "name" //zTree 节点数据保存节点提示信息的属性名称
            }
        }
    };

    var zNodes = arr;
    zTreeObj= $.fn.zTree.init($('#tree'), setting, zNodes);
    var nodes = zTreeObj.getNodes();
    for (var i = 0; i < nodes.length; i++) { //设置节点展开
        zTreeObj.expandNode(nodes[i], true, false, true);
    }
    if(zTreeObj)
    {return getSelectVal}
}

// ztree处理弹出层被选中的节点
function getSelectVal(){
    var nodes = zTreeObj.getSelectedNodes();
    if(nodes.length != 1){
        layer.alert('只能选择一项', {
            icon: 2,
            offset: 't',
        })
    }
    var id = nodes[0].id;
    var name = nodes[0].name;
    var pId = nodes[0].pId;
    var type = nodes[0].type;
    var selObj = {'id':id, 'name':name, 'pId':pId, 'type':type};
    return selObj;
}

//  弹出layer页面中使用ztree插件的方法 （点击搜索框）
function layerInZtree(btn,size,url,type,name,id,alt) {
    $(btn).on('click',function () {
        top.layer.open({
            btn: ['确定', '取消'],
            shade: [0.4, '#000'], //0.1透明度的白色背景
            type: 2,
            title: '添加',
            shadeClose: true,
            maxmin: false, //开启最大化最小化按钮
            area: size,
            content: url,
            yes:function (index,layero) {
                var iframeWin = layero.find('iframe')[0];
                var selobj=iframeWin.contentWindow.getSelectVal();//在layer中运行当前弹出页内的getSelectVal方法
                if(selobj){
                    if(selobj.type != type){
                        alert(alt);
                        return false;

                    }
                    $(name).val(selobj.name);
                    $(id).val(selobj.id);
                }
                top.layer.close(index);
            }
        })
    })






}
function layerInZtreeAll(btn,size,url,name,id) {
    $(btn).on('dblclick',function () {
        top.layer.open({
            btn: ['确定', '取消'],
            shade: [0.4, '#000'], //0.1透明度的白色背景
            type: 2,
            title: '添加',
            shadeClose: true,
            maxmin: false, //开启最大化最小化按钮
            area: size,
            content: url,
            yes:function (index,layero) {
                var iframeWin = layero.find('iframe')[0];
                var selobj=iframeWin.contentWindow.getSelectVal();//在layer中运行当前弹出页内的getSelectVal方法
                if(selobj){
                    $(name).val(selobj.name);
                    $(id).val(selobj.id);
                }

                top.layer.close(index);

            }
            // success: function(index,layero){
            //     // var val = $('#companyId').val();
            //     // var iframeWin = layero.find('iframe')[0];
            //     // console.log(iframeWin);
            //     // iframeWin.contentWindow.setDefaultVal(val);
            // },
        })
    })
}
// ztree处理弹出层被选中的节点

//子页面绿色勾选框插件
function icheckinner() {
    $('input.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });
}

//上传头像
function initWebuploader(url,filePicker, ImagePreview,ImgUrl) {
    var $list = $(ImagePreview),//获取文件列表
        $li = $(
            '<div id="" class="file-item thumbnail">' +
            '<img >' +
            '</div>'
        );
    $img = $li.find('img');
    $div =$li.find('div')
    $list.append($li);// $list为容器jQuery实例
    var cc=$('#nameImage').val();
    if(cc==0){
        $img.attr('src',null);
    }else{
        $img.attr('src',ImgUrl)
    }
    var uploader = WebUploader.create({
                                // 选完文件后，是否自动上传。
        auto: true,
                                // // swf文件路径
        swf: admin_domain + '/plugins/webUploader/Uploader.swf',

                                // 文件接收服务端。
        server: admin_domain + url,
        // 选择文件的按钮。可选。
                                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {
            id: filePicker,
            multiple:false
        },

        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        fileNumLimit: 1

    });
                                // console.log(BASE_URL + url);
    uploader.on('fileQueued', function (file) {
        // 创建缩略图
        uploader.makeThumb(file, function (error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            console.log(src);
            $img.attr('src', src);//设置预览图
        }, 100, 100); //100x100为缩略图尺寸

    });
    uploader.on( 'uploadSuccess', function( file,response) {
        console.log(file,response);
        $('#nameImage').val(response.saveName);
    });
}