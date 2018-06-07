// function dateTick(contId) {
// 	var cont = document.getElementById(contId);
// 	if(cont){
// 		var dt = getLocalDate()+getLocalTime()+" "+getLocalWeek();
// 		cont.innerHTML = dt;
// 		window.setTimeout("dateTick('"+contId+"')", 1000);
// 	}
// }
function getShortDate(){
	return getLocalDate().replace('年','-').replace('月','-').replace('日','');
}
function getLocalDate(){
	var objD = new Date();
	var yy = objD.getFullYear();
	if (yy < 1900) yy = yy + 1900;
	var MM = objD.getMonth() + 1;
	if (MM < 10) MM = '0' + MM;
	var dd = objD.getDate();
	if (dd < 10) dd = '0' + dd;
	return yy + "年" + MM + "月" + dd + "日";
}
function getLocalTime(){
	var objD = new Date();
	var hh = objD.getHours();
	if (hh < 10) hh = '0' + hh;
	var mm = objD.getMinutes();
	if (mm < 10) mm = '0' + mm;
	var ss = objD.getSeconds();
	if (ss < 10) ss = '0' + ss;
	return hh + ":" + mm + ":" + ss;
}
function getLocalWeek(){
	var objD = new Date();
	var ww = objD.getDay();
	if (ww == 0) ww = "星期日";
	if (ww == 1) ww = "星期一";
	if (ww == 2) ww = "星期二";
	if (ww == 3) ww = "星期三";
	if (ww == 4) ww = "星期四";
	if (ww == 5) ww = "星期五";
	if (ww == 6) ww = "星期六";
	return ww;
}

function monthFirstDay(){
	var t1 = new Date();
	var month = t1.getMonth()+1;
	if(month<10) {
		month="0"+month;
	}
	return t1.getFullYear() + "-" + month + "-01";
}


//日期加上指定的天数
function dateAddDay(sdate, days) {
	if(sdate=="")return "";
	if(typeof(sdate) == 'object'){
		sdate = sdate.getFullYear()+'-'+(sdate.getMonth()+1)+'-'+sdate.getDate();
	}
	if(sdate.indexOf('.') > -1)
		sdate = sdate.substr(0,sdate.indexOf('.'));
	var dt = sdate.replaceAll('-', '/');//js不认2011-11-10,只认2011/11/10
    var t1 = new Date(new Date(dt).valueOf() + days*24*60*60*1000);
    var month;
    var day;
    if((t1.getMonth() + 1)<10) {
        month="0"+(t1.getMonth() + 1);
    }
    else {
        month=t1.getMonth() + 1;
    }
    if(t1.getDate()<10) {
        day="0"+t1.getDate();
    }
    else {
       day=t1.getDate(); 
    }
    return t1.getFullYear() + "-" + month + "-" + day;
}

function dateAddMonth(beginDate, m){
	if(typeof(beginDate) == 'string'){
		beginDate = new Date(beginDate.replaceAll('-', '/'));
	}
	var a = beginDate;//parseStrToDate(beginDate);
	var t1 = new Date(a.getFullYear(), a.getMonth()+1+m, a.getDate());     //转换为10-18-2004格式
	var month = t1.getMonth()<10?("0"+t1.getMonth()):t1.getMonth();
	var day = t1.getDate()<10?("0"+t1.getDate()):t1.getDate();
    return t1.getFullYear() + "-" + month + "-" + day;
}

function dateAddYear(beginDate, y){
	if(typeof(beginDate) == 'string'){
		beginDate = new Date(beginDate.replaceAll('-', '/'));
	}
	var a = beginDate;//parseStrToDate(beginDate);
	var t1 = new Date(a.getFullYear()+y, a.getMonth()+1, a.getDate());     //转换为10-18-2004格式
	var month = t1.getMonth()<10?("0"+t1.getMonth()):t1.getMonth();
    var day = t1.getDate()<10?("0"+t1.getDate()):t1.getDate();
    return t1.getFullYear() + "-" + month + "-" + day;
}

//将字符串转化为时间类型
function parseDate(ipt1){
	if(typeof(ipt1) == 'string'){
		var aDate = ipt1.replaceAll('-', '/').split("/");
		return new Date(aDate[0], aDate[1]-1, aDate[2]);
	}
	return ipt1;
}

function dataBetweenYear(date1,date2){
	if(date1=='' || date2=='')
		return 0;
	date1 = parseDate(date1);
	date2 = parseDate(date2);
	var i=0;
	var dateCyc = date1;
	while(dateCyc <= date2){
		dateCyc = parseDate(dateAddYear(date1,i));
		if(dateCyc == date2){
			return i;
		}
		if(dateCyc > date2){
			return i-1;
		}
		i++;
	}
	return -1;
}
