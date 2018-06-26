<template>
    <div class="instructOperation">
      <!--<h1>指令接收</h1>-->
        <p class="title">已完成指令</p>      
      <div class="finish">
        <ul v-if="finish.length>0">
          <li v-for="item in finish">
            <router-link :to="{name:'instructOperationInner',params:{id:item.ctrlId} }">
                  <!-- <span>{{itme}}</span> -->
                  <i class="smallimg"></i>
              <span>{{item.content}}</span>

              <span class="date">{{item.updateDate}}</span>
              <div class="shiftName"><span>{{item.shiftName}}({{item.delFlag}})</span><span>{{item.groupName}}班</span></div>
            </router-link>
          </li>
        </ul>
        <ul v-else>
          <li>{{err}}</li>
        </ul>
      </div>
      <div class="wait">
        <p class="title">待完成指令</p>
        <ul v-if="wait.length>0">
           <li v-for="item in wait">
             <router-link :to="{name:'instructOperationInner',params:{id:item.ctrlId} }">
              <i class="smallimg"></i>               
               <span>{{item.content}}</span>
              <span class="date">{{item.updateDate}}</span>
              <div class="shiftName">{{item.shiftName}}({{item.delFlag}}){{item.groupName}}班</div>
             </router-link>
           </li>
        </ul>
        <ul v-else>{{err}}</ul>
      </div>
    </div>
</template>

<script>
    export default {
        name: "instructOperation",
        data(){
          return {
              finish:[],
              wait:[],
              err:"当前没有指令"
          }
        },
      methods:{
          loadData:function () {
            var data = {};
            this.ApiMethod.ajaxServer1(this.apiD.aps_domain + "/api/ctrl/DirectiveDetail/getReceiveDirective",data)
              .then(result=>{
                if(result.success){
                    if(result.rows.length>0){
                      for(var i=0;i<result.rows.length;i++){
                        if(result.rows[i].status=="finish"){
                          this.finish.push(result.rows[i])
                        }else if(result.rows[i].status=="wait"){
                          this.wait.push(result.rows[i])
                        }
                      }
                    }else{
                      this.err = this.err
                    }
                }else{
                  console.log("网络请求超时...")
                }
              })
          }
      },
      created:function () {
        this.loadData()
      }
    }
</script>

<style scoped>
.title{
    font-size: 21px;
    font-weight: 900;
     margin-top: .1875rem
}
  *{
    padding: 0;
    margin: 0;
  }
  ul{
    list-style: none;
  }
  li{
    /* width: 100%; */
    line-height: .35rem;
  }
  .finish li span {
    padding-left: .2rem;
    font-size: .16rem  
  }
    .finish li div {
    padding-left: .2rem;
    font-size: .16rem  
  }
  a{
    text-decoration:none;
    color: #000;
  }
.instructOperation{
  width: 100%;
  margin-left: 2%;
}
  .finish{
    border-left: 1px solid black;
  }
  .wait li{
    border-bottom: 1px solid gray    
  }
 .shiftName{
   font-size: .16rem
 }
 i.smallimg {
       display: inline-block;
       width: 11px;
       height: 11px;
       background-image: url(../../assets/image/logo.png);
       background-position: -0.375rem --0.357rem;
       margin-left: -.06rem
        }
  .date{
    display: inline-block;
     margin-right: .03rem;
    }

</style>
