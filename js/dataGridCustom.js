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
            var filterEle = arr[i].id==""?"itemCode":"id";
            if( (arr[i][filterEle])===(item[filterEle])){
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
    },
    getSaveItemArr:function(){  //获取修改过的数据的集合
        var len = $(".tableItemBox").length;
        for(var i = 0; i<len;i++){
            //触发每个table隐藏的保存按钮，从而获取到表格中最后一条被修改的数据并将其放入到saveItemArr中。
            $("#td"+i).parents('.datagrid-view').siblings(".datagrid-toolbar").find(".l-btn-text").trigger('click');
        }
        // console.log(dataGridObj.saveItemArr);
        return dataGridObj.saveItemArr;
    },
    checkDatagridNotNull:function(dgName, dgId, checkRowArr, checkFieldArr){ //校验datagrid中指定的列是否为空 dgName指dataGrid的描述  dgId指dataGrid  checkColArr指要检查的列名称
        var rows = $(dgId).datagrid('getRows');
        for(var i=0; checkRowArr&&i<rows.length; i++){
            if(checkRowArr.contains(i)){
                $(dgId).datagrid('endEdit', i);
                var row = rows[i];
                for(var j=0; checkFieldArr&&j<checkFieldArr.length; j++){
                    var fieldName = checkFieldArr[j];
                    var fieldTitle = $(dgId).datagrid('getColumnOption',fieldName).title;
                    var colVal =  row[fieldName];
                    if(colVal == ''){
                        layerAlert(dgName+' 第'+(i+1)+'行:'+fieldTitle+' 的值不能为空!');
                        return false;
                    }
                }
            }
        }
        return true;
    },
    eachCheckDataGrid:function(checkDGArr){   //对要进行核对操作的dataGrid进行遍历
        for(var i=0; i<checkDGArr.length; i++){
            var item = checkDGArr[i];
            var checkFlag = dataGridObj.checkDatagridNotNull(item.dgName, item.dgId, item.checkRowArr, item.checkFieldArr);
            if(checkFlag == false){
                return false;
            }
        }
    }

}



