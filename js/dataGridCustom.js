/**
 * Created by mac on 18/3/28.
 */
var dataGridObj = {
    td0EditIndex:undefined,
    td1EditIndex:undefined,
    td2EditIndex:undefined,
    td3EditIndex:undefined,
    td4EditIndex:undefined,
    saveItemArr:[],
    arrIndex:-1,
    getEditIndex:function (id) {  //获取到td#EditIndex的值
        id = id.substr(1);
        return eval("dataGridObj."+id+"EditIndex");
    },
    setEditIndex:function(id, val){  ////设置td#EditIndex的值
        id = id.substr(1);
        eval("dataGridObj."+id+"EditIndex="+val);
    },
    startEditing:function(index,id){  //开始编辑
        if (dataGridObj.getEditIndex(id) != index) {
            if (dataGridObj.endEditing(id)) {
                $(id).datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
                dataGridObj.setEditIndex(id,index);
            } else {
                $(id).datagrid('selectRow', dataGridObj.editIndex);
            }
        }
    },
    endEditing:function(gridTableId){  //结束编辑
        var editIndex = dataGridObj.getEditIndex(gridTableId);
        if ( editIndex == undefined) { return true }
        if ($(gridTableId).datagrid('validateRow', editIndex)) {
            $(gridTableId).datagrid('endEdit', editIndex);
            dataGridObj.setEditIndex(gridTableId,undefined);
            return true;
        } else {
            return false;
        }
    },
    pushRowData:function(rowData){ //编辑过的元素如果不存在就push到数组中，如果已存在新的数据会替换原有的数据
        if(dataGridObj.saveItemArr.length>0){
            dataGridObj.filterItem(dataGridObj.saveItemArr,rowData);
            if(dataGridObj.arrIndex == -1){
                dataGridObj.saveItemArr.push(rowData);
            }else{
                dataGridObj.saveItemArr.splice(dataGridObj.arrIndex,1,rowData);
            }
        }else{
            dataGridObj.saveItemArr.push(rowData);
        }
    },
    filterItem:function (arr,item) { //判断元素是否存在于数组中
        for( var i=0;i<arr.length;i++){
            if((arr[i].id)===(item.id)){
                dataGridObj.arrIndex = i;
                return ;
            }else{
                dataGridObj.arrIndex = -1;
            }
        }
    },
    mergeCells:function(data,id,field){  //合并单元格功能
        var mark=1;
        for (var i=1; i <data.rows.length; i++) {
            if (data.rows[i][field] == data.rows[i-1][field]) {
                mark += 1;
                $(id).datagrid('mergeCells',{
                    index: i+1-mark,
                    field: field,
                    rowspan:mark
                });
            }else{
                mark=1;
            }
        }
    }

}

$(".btn-save").click(function(){
    var len = $(".tableItemBox").length;
    for(var i = 0; i<len;i++){
        $("#td"+i).parents('.datagrid-view').siblings(".datagrid-toolbar").find(".l-btn-text").trigger('click');
    }
    alert(dataGridObj.saveItemArr);
    console.log(dataGridObj.saveItemArr);

});