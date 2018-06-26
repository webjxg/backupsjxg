<template>
    <div class="operationCheck">
            <div class="finish">
        <h3>已完成指令</h3>
        <ul v-if="finish.length>0">
          <li class="finish1" v-for="(item,index) in finish">
            <router-link :to="{name:'operationCheckInner',params:{id:item.ctrlId} }">
              {{item.content}}
                    <span>{{item.updateDate}}</span>
              <p>{{item.shiftName}}({{item.delFlag}})</p>
            </router-link>
            <!-- <div v-if="bol"  class="content">
              {{item.content}}
          </div> -->
          </li>
          <!-- <span class="logo" @click="clickHandler">></span> -->
          
        </ul>
        <ul v-else>{{err}}</ul>
      </div>
      <div class="wait">
        <h3>待完成指令</h3>
        <ul v-if="wait.length>0">
          <li class="wait1" v-for="(item,index) in wait">
            <router-link :to="{name:'operationCheckInner',params:{id:item.ctrlId} }">
              {{item.content}}
                    <span>{{item.updateDate}}</span>
              <p>{{item.shiftName}}({{item.delFlag}})</p>
            </router-link>
            <div v-if="bol"  class="content">
              {{item.content}}
          </div>
          </li>
        </ul>
        <ul v-else>{{err}}</ul>
      </div>
    </div>
</template>

<script>
    export default {
        name: "operationCheck",
      data(){
         return{
           finish : [],
           wait:[],
           err:"当前没有指令",
           bol:false
         }
      },
      methods:{
          getmsg:function () {
            var data = {};
            this.ApiMethod.ajaxServer1(this.apiD.aps_domain + "/api/ctrl/DirectiveDetail/getReceiveDirective",data)
              .then((result)=>{
                console.log(result.rows)
                for(var i=0;i<result.rows.length;i++){
                  if(result.rows[i].status == "finish"){
                          this.finish.push(result.rows[i]);
                  }else if(result.rows[i].status == "wait"){
                          this.wait.push(result.rows[i])
                  }
                }
              })
          },
          clickHandler:function(){
            var that = this;
            this.bol = !this.bol;
          }
      },
      created:function () {
        this.getmsg()
      }
    }
</script>

<style scoped>
*{
    padding: 0;
    margin: 0;
  }
  ul{
    list-style: none;
  }
  li{
    width: 100%;
    line-height: 30px;
  }
  a{
    text-decoration:none;
    color: #000;
  }
.instructOperation{
  width: 90%;
  margin-left: 2%;
}
  .instructOperation p{
    font-size: 16px;
    font-weight: bold;
  }
  .finish p{
    font-size: .20rem;
    font-weight: bold
  }
    .wait p{
    font-size: .20rem;
    font-weight: bold
  }
</style>
