import axios from "axios"
axios.defaults.timeout = 5000;
axios.defaults.baseURL ='';
var ApiMethod = {

  /**
   * json类型的参数提交：适用于后端有@requestBody的情况
   * ！！！注意：参数为JSON.stringfy(json)类型
   * @param url
   * @param data
   * @returns {Promise<AxiosResponse<any>>}
   */
  ajaxServer:function (url,data) {
    console.log(data,url);
    return axios({
      url: url,
      method: 'POST',
      data:data,
      dataType: 'json',
      headers: {

        'Content-Type': 'application/json; charset=UTF-8',
        // 'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwIiwic3ViIjoiYWRtaW4iLCJpc3MiOiJhZG1pbiIsImF1ZCI6IkFkbWluIEpXVCBPbmxpbmUifQ.V5rl08jnjLtWGDWMDOZHVu1wL3MxihNqlrcERedaSW4'        
        'Authorization':this.getCookie("token_type")+" " +this.getCookie("authorization")
      }
    })
      .then(function (res) {
        return res.data;
      })
      .catch(function (err) {
        return err;
      })
  },

  /**
   * form请求：适用于后端没有@requestBody的情况
   * ！！！注意：参数为string类型，格式为：param1=?&param2=?
   * @param url
   * @param data
   * @returns {Promise<AxiosResponse<any>>}
   */
  ajaxServer1:function (url,data) {
    return axios({
      url: url,
      method: 'POST',
      data:data,
      dataType: 'json',
      // type:'json',
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwIiwic3ViIjoiYWRtaW4iLCJpc3MiOiJhZG1pbiIsImF1ZCI6IkFkbWluIEpXVCBPbmxpbmUifQ.V5rl08jnjLtWGDWMDOZHVu1wL3MxihNqlrcERedaSW4'                
        // 'Authorization':this.getCookie("token_type")+" " +this.getCookie("authorization")
      }
    })
      .then(function (res) {
        return res.data;
      })
      .catch(function (err) {
        return err;
      })
  },

  // SetCookie设置Cookie
  setCookie:function (name,value,path) {
    var Days = 30;//30天
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    var pathTmp = path!=undefined?path:'/';
    document.cookie=name+"="+encodeURI(value)+";expires="+exp.toGMTString()+";path="+pathTmp;
  },
  // getCookie  获取Cookie
  getCookie:function (name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
      return (decodeURI(arr[2]));
    else
      return '';
  },
}

export default ApiMethod

