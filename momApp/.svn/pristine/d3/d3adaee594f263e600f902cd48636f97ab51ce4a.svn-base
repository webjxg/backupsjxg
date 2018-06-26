<template>
<!-- 轮播图 -->
<div class="body">
  <div class="container">
    <div class="block">
      <el-carousel width="100%"  arrow="always">
        <el-carousel-item v-for="item in imges" :key="item">
          <img :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 导航 -->
    <ul class="navbar clearfix">
      <li>
        <router-link to="/event">
          <cite class="jjb-icon"></cite>
          <span>交接班</span>
      </router-link>
      </li>
      <li>
          <router-link to="/event">
          <cite class="zljs-icon"></cite>
          <span>指令接收</span>
      </router-link>
      </li>
      <li>
          <router-link to="/event">
          <cite class="scjh-icon"></cite>
          <span>生产计划</span>
      </router-link>
      </li>
      <li>
          <router-link to="/event">
          <cite class="scgk-icon"></cite>
          <span>生产管控</span>
      </router-link>
      </li>
      <li>
          <router-link to="/event">
          <cite class="gzt-icon"></cite>
          <span>工作台</span>
      </router-link>
      </li>
    </ul>
    <!-- 内容区域 -->
    <div class="wrapper">
      <div class="scjh-box">
        <h1 class="scjh-title bg-f6">生产计划</h1>
        <div class="echarts-box"></div>
      </div>
    </div>
    <!-- 底部 -->
    
  </div>
  <footer>
      <ul>
        <li> 
            <router-link to="/indexs"><img src="../assets/logo.png" alt="">
            <p>首页</p></router-link>
        </li>
        <li>
          <router-link to="/breakingNews"><img src="../assets/logo.png" alt="">
            <p>大事件</p></router-link>
          
        </li>
        <li>
          <router-link to="/handingOperation"><img src="../assets/logo.png" alt="">
            <p>管理工作</p></router-link>
          
        </li>
        <li>
          <router-link to="/my"><img src="../assets/logo.png" alt="">
            <p>我的</p></router-link>
          
        </li> 
      </ul>
    </footer>
</div>
</template>
<script>
import ec from '@/js/ec'
import echartsTheme from '@/js/macarons'
export default {
  data () {
    return {
      imges: ['/static/images/card1.png', '/static/images/card2.png', '/static/images/card3.png', '/static/images/card4.png'],
      lineArray: [],
      echartArr:[],
      echartArrLast:{}
    }
  },
  mounted () { 
    this.loadData()    
  },
  methods: {
    loadData:function () {
      var data = {};
      this.ApiMethod.ajaxServer1(this.apiD.admin_domain+'/api/workbench/PhoneWorkBenchHomePage/phoneChartList',{})
        .then(response=>{
          console.log(response.rows);
          for (let i=0; i<response.rows.length; i++){
            var url= response.rows[i].dataSource;
           var url = url.toLowerCase().indexOf("http://") == 0? url : (this.apiD.aps_domain + url)
           let tile = {name:response.rows[i].title};
           if(response.rows[i].templateCode === 'line'){
             this.getTileObj(url,data,i,tile);
            }else if(response.rows[i].templateCode === 'bar'){
            // this.ApiMethod.ajaxServer1(url,data)
            //   .then(response=>{
            //     this.getEcId(i,tile.name);
            //     var data = response.rows;
            //     this.echartArr.push(ec.render.bar(data, '', tile));
            //     this.echartArrLast = this.echartArr.splice(this.echartArr.length-1);
            //     var op = this.echartArrLast;
            //     var id ='echart'+i;
            //     this.aa(id,this.echartArrLast[0])
              
            //   })
            }else if(response.rows[i].templateCode === 'pie'){
            // this.ApiMethod.ajaxServer1(url,data)
            //   .then(response=>{
            //     this.getEcId(i,tile.name);
            //     var data = response.rows;
            //     this.echartArr.push(ec.render.pie(data, '', tile));
            //     this.echartArrLast = this.echartArr.splice(this.echartArr.length-1);
            //     var op = this.echartArrLast;
            //     var id ='echart'+i;
            //     this.aa(id,this.echartArrLast[0])
              
            //   })
            }
          }
        })
    },
    getTileObj(url,data,index,tile){
      this.ApiMethod.ajaxServer1(url,data)
        .then(response=>{
          this.createEc(index,tile.name);
          var data = response.rows;
          this.echartArr.push(ec.render.line(data, '', tile));
          this.echartArrLast = this.echartArr.splice(this.echartArr.length-1);
          var op = this.echartArrLast;
          var id ='echart'+index;
          this.initEc(id,this.echartArrLast[0]);
        })
    },
    createEc(index,title){
      let html =`<div class="echarts-item">
                    <h2 class="echarts-tit">${title}</h2>
                    <div class="echartsEle" id="echart${index}"</div>
                </div>`;    
      var dom = this.$(html).appendTo('.echarts-box');
      this.$('.echartsEle').css({"height":"350px"});
    },
    initEc(echartId,options){
         var echartId= this.$echarts.init(document.getElementById(echartId), echartsTheme());
         echartId.setOption(options);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
 <style src="../assets/css/common.css"></style>

<style lang="scss" scoped type="text/scss">
/* 导航 */
.navbar{
  padding:.15rem 0;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  li{
    flex:1;
    text-align: center;
    cite{
      display: block;
      width:.47rem;
      height:.47rem;
      overflow: hidden;
      border-radius: 50%;
      background-image: url('../assets/image/index-navSprite.png');
      background-repeat: no-repeat;
      background-size: 2.75rem .47rem;
      margin:0 auto .1rem;
      &.jjb-icon{
        background-position:  0 0;
      }
      &.zljs-icon{
        background-position:  -0.57rem 0;
      }
      &.scjh-icon{
        background-position:  -1.14rem 0;
      }
      &.scgk-icon{
        background-position:  -1.71rem 0;
      }
      &.gzt-icon{
        background-position:  -2.28rem 0;
      }
    }
    span{
      font-size:.12rem;
      color:#333;
      line-height: .15rem;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
/* 内容区域 */
.scjh-title{
  font-size:.15rem;
  color:#000;
  height:.38rem;
  line-height: .38rem;
  text-align: center;
}
.echarts-box{
  .echarts-item{
    padding:.1rem;
    .echarts-tit{
      font-size:.15rem;
      color:#333;
      line-height: .15rem;
    }
  }
}
.echarts-item{}
/* 生产计划 */


.block img{
  width: 100%;
  height: 100%;
}
.el-carousel{
  height: 200px;
}
.el-carousel__container{
  height: 100%;
}
button{
  display:block;
}


a{
  text-decoration: none;
}

footer{
    position: fixed;
    width: 100%;
    height: 100px;
    bottom: 0px;
    background-color: #ccc;
}
.container{
  margin-bottom: 100px;
}
footer ul{
  width: 100%;
  height: 100%;
}
footer ul li{
  float: left;
  width: 25%;
  height: 100%;
  text-align: center
}
footer ul a{
  display: inline-block;
  width: 100%;
  height: 100%;
}
footer ul img{
  width: 30%;
  margin-top: 25px;
}
</style>
