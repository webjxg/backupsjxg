<template>
  <div class="instructOperationInner">
    <router-link to="/instructOperation"><p>返回上一级</p></router-link>
    <p>指令接收内页</p>
    <ul>
      <li v-if="pList.length>0" v-for="item in pList" :id="id">{{item.content}}</li>
      <li v-else>{{err}}</li>
    </ul>
    <ul>
      <li v-if="childList.length>0" v-for="item in childList">{{item.content}}</li>
      <li v-else>{{err}}</li>
    </ul>
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
                      this.id = this.pList[0].id
                    }else{
                        console.log(result.message)
                        }
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
</style>
