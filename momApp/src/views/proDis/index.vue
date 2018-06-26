<template>
    <div class="proDis">
      <div class="heade">
        <div class="content">
          <router-link to="/indexs">
            <i class="arrow"></i>
          </router-link>
          <ul>
            <router-link to="/instructOperation" @click.native="setClass">
              <li class="active">指令接收</li>
            </router-link>
            <router-link to="/operationCheck" @click.native="setClass">
              <li>指令查看</li>
            </router-link>
          </ul>
        </div>
      </div>
      <router-view></router-view>
    </div>

</template>

<script>
    export default {
        name: "index",
      data(){
        return {
          bol:true
        }
      },
      methods:{
        setClass:function (e) {
            this.$('li').removeClass('active');
            e.target.className = "active"
        }
      },
    }

</script>

<style scoped>
  *{
    padding: 0;
    margin: 0;
  }
  a{
    text-decoration:none;
    color: #000;
  }
  .proDis{
    width: 100%;
    margin: 0 auto;
    font-size: .18rem
  }
  ul{
    list-style: none;
    width: 40%;
    margin: 0 auto;
    display:block;
  }
  li{
    display: inline-block;
    border: 2px solid hsl(153, 48%, 49%);
    padding: 5px 2px 4px 2px;
    background-color: #41b883;
    color: white;
    border-color: white;
    font-size: .16rem;
    border-radius: 3px
  }
  .active{
    background-color: white;
    color: #41b883;
    border-color:white;
  }
  .heade{
    width: 100%;
    height: 70px;
    background-color: #41b883;
  }
  .heade p{
    display: inline-block;
    font-size: .18rem;
    width: .4rem;
    color: white;
    float: left;
  }
  .content{
      padding-top:.15rem
  }
    i.arrow{
    display: inline-block;
    float: left;
    width: 18px;
    height: 32px;
    margin-left: .1875rem;
    background-image: url(../../assets/image/logo.png);
    background-position: -0.375rem -0.375rem;
  } 
</style>
