<template>
  <div>
    <h1><img src="../assets/image/logofusheng.jpg" alt="logo"></h1>
    <form action="" id="inputForm">
        <label for="acc">
            <img src="../assets/image/acc.jpg" alt="acc" class="acc">
            <input id="acc" type="text" @input="change" v-model="userName" placeholder="请输入用户名"/>
            <span v-if="userNames==''">用户名不能为空</span>
        </label>
        <label for="pass">
            <img src="../assets/image/password.jpg" alt="password" class="pass">
            <input id="pass" type="password"  @input="change" v-model="passWord" placeholder="请输入密码"/>
            <span v-if="passWords==''">密码不能为空</span>
        </label>
        
        <p v-if="bol">{{content}}</p>
    </form>
    
    <div class="checkbox">
      <label for="remPword">
      <input id="remPword" type="checkbox" name="remPword">
      <span>记住密码</span>
      </label>
    </div>
    <button @click="clickHandler">登陆</button>
    <router-link to="/forgetPword">忘记密码</router-link>
  </div>
</template>

<script>
    export default {
        name: "login",
        data(){
           return{  
             userName:"",
             userNames:"1",
             passWord:"",
             passWords:"1",
             bol:false,
             content:""
           }
        },
        methods:{
              //侦听按钮点击。判断input
              clickHandler:function () {
                var that = this;
                  if(this.userName == "" && this.passWord==""){
                      this.userNames = "";
                      this.passWords = "";
                  }else{
                    var data = {
                        clientId:"admin",
                        loginName:this.userName,
                        password:this.passWord
                    };
                    this.ApiMethod.ajaxServer(this.apiD.admin_domain + "/oauth/token",JSON.stringify(data))
                      .then((response)=>{
                        if(response.success){
                          this.ApiMethod.setCookie("authorization",response.accessToken.authorization);
                          this.ApiMethod.setCookie("token_type",response.accessToken.token_type);
                          this.ApiMethod.setCookie("userName",response.user.name);
                          this.ApiMethod.setCookie("loginName",response.user.loginName);
                          this.ApiMethod.setCookie("loginUserid",response.user.id);
                          that.$router.push("/indexs");
                        }else if(response.data.retCode == "30006"){
                          this.bol = true;
                          this.content = "该账户已经被禁用"
                          }else{
                          this.bol = true;
                          this.content = "密码输入错误，请重新输入"
                          }
                      })
                  }
              },
              change:function () {
                this.userNames = this.userName;
                this.passWords = this.passWord;
              }
          }
    }
</script>

<style lang="scss" scoped type="text/scss">
  h1{
    text-align: center;
    >img{
    height: .65rem;
    width: .65rem;
  }
  }
  #inputForm{
    position: relative;
    span,p{
      display: block;
      margin-left:.36rem; 
      font-size:.14rem; 
      color: red;
    }
    label{
    position: relative;
    display: block;
    max-width: 7.5rem;
  }
  }
  .acc,.pass{
    width: .19rem;
    height: .19rem;
    position: absolute;
    left: 10%;
    top:.21rem;
  }
 
  input{
    box-sizing: border-box;
    padding: 0 .31rem;
    display: block;
    width: 80%;
    height: .62rem;
    line-height: .62rem;
    border: none;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    :focus{
    outline: none; 
  }
  }
  button{
    margin-top: .45rem;
    max-width: 6rem;
    width: 80%;
    display: block;
    border-radius: .03rem;
    height: .43rem;
    font-size: 18px;
    background-color: #00c99f;
    border: none;
    color: white;
  }
  button,.checkbox,input,#inputForm label,.checkbox label{
    margin: 0 auto;
  }
  .checkbox{
    box-sizing: border-box;
    padding-left:.23rem;
    font-size: .14rem;
    height: .62rem;
    line-height: .62rem;
    width: 100%;
    max-width: 7.5rem;
    position: relative;
    label{
    display: block;
    width: 80%;
    padding: 0 .05rem;
    box-sizing: border-box;
    position: relative;
  }
  input{
    display: block;
    position: absolute;
    top: .24rem;
    left:-.19rem;
    width: .16rem;
    height: .16rem;
    border-radius:.03rem;
    cursor: pointer;
  }
  }
  a{

    text-align: center;
    display: block;
    font-size: .16rem;
    margin: 1.3rem auto;
  }
</style>
