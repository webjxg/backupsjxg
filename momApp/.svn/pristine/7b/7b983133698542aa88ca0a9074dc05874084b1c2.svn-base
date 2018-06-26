<template>
  <div class="instructOperationInner">
    <div class="top">
         <router-link to="/instructOperation"><p class="back"><</p></router-link>
    <p class="name">指令接收</p> 
    </div>
 
    <ul>
      <li v-if="pList.length>0" v-for="item in pList" :id="id">{{item.content}}</li>
      <li v-else>{{err}}</li>
    </ul>
    <ul>
      <li v-if="childList.length>0" v-for="item in childList">{{item.content}}</li>
      <li v-else>{{err}}</li>
    </ul>
    <input v-if="bol" @click="clickHandler" type="button" value="完成指令"/>
  </div>
</template>

<script>
    export default {
        name: "instructOperationInner",
        data(){
          return {
            pList:[],
            childList:[],
            err:"暂无数据",
            bol:"",
            data:{},
            id:""
          }
        },
      methods:{
          getquery:function () {
            // 取到路由带过来的参数
            console.log(this.$route.params.id);
                // var data = {
                //   id:this.$route.params.id
                // }
                var data = "id="+this.$route.params.id;
            this.ApiMethod.ajaxServer1(this.apiD.aps_domain+"/api/ctrl/DirectiveDetail/queryAppReceiveDirective",data)
            .then(result=>{
                if(result.success){
                    this.pList = result.pList
                    this.childList = result.childList;
                    if(this.pList[0].status == "wait"){
                      console.log(this.pList[0])
                      this.id = this.pList[0].ctrlId
                        this.bol=true;
                    }else{
                      this.bol=false;
                    }
                }else{
                  console.log(result.message)
                }
            })
          },
          clickHandler:function(){
            var that = this;
            this.data = "ids="+this.id
            console.log(this.data)
            this.ApiMethod.ajaxServer1(this.apiD.aps_domain + "/api/ctrl/DirectiveIssued/directiveFinish",this.data)
            .then(result=>{
                console.log(result)
              if(result.success){
                      that.$router.push("/instructOperation");
              }else{
                console.log(result.message)
              }
            })
          }

      },
      mounted:function () {
        this.getquery();
      }

    }
</script>

<style scoped>
p{
  font-size: .16rem
}
li{
  font-size: .16rem
}
.top{
  width: 100%;
  height: .7rem;
  background-color: #41b883
}
.top p{
  color: white;
  padding-top:.2rem 
}
.top .back{
  float: left;
  margin-left: .1rem;
}
.top .name{
  width: 20%;
  margin: 0 auto
}
</style>
