import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'  //登陆
import forgetPword from '@/views/forgetPword'  //登陆
import indexs from '@/views/index' //主页 面
import proDisindex from '@/views/proDis/index' //调度主页面
import instructOperation from '@/views/proDis/instructOperation' //接收
import instructOperationInner from '@/views/proDis/instructOperationInner' //接收
import operationCheckInner from '@/views/proDis/operationCheckInner' //查看
import operationCheck from '@/views/proDis/operationCheck' //chakna
import breakingNews from '@/views/breakingNews/breakingNews' //大事件
import handingOperation from '@/views/handingOperation/handingOperation' //大事件
import my from '@/views/my/my' //大事件

Vue.use(Router);
export default new Router({
  routes: [
    {
      path:"/",
      name:"login",
      component:login,

    },
    {//忘记密码
      path:"/forgetPword",
      name:"forgetPword",
      component:forgetPword,

    },
    {  //主页面
      path: "/indexs",
      name: "indexs",
      component: indexs
    },

    {  //大事件
      path: "/breakingNews",
      name: "breakingNews",
      component: breakingNews
    },
    {  //管理工作
      path: "/handingOperation",
      name: "handingOperation",
      component: handingOperation
    },
    {  //我的
      path: "/my",
      name: "my",
      component: my
    },
    {//生产调度主页
      path:"/proDisindex",
      name:"proDisindex",
      redirect:"/instructOperation",  //设置默认路由为指令及收
      component:proDisindex,
      children:[
        {    //接收
          path:"/instructOperation",
          name:"instructOperation",
          component:instructOperation
        },
        {     //查看
          path:"/operationCheck",
          name:"operationCheck",
          component:operationCheck
        }
      ]
    },
    {  //指令接收内页
      path:"/instructOperationInner",
      name:"instructOperationInner",
      component:instructOperationInner
    },
    {  //指令查看内页
      path:"/operationCheckInner",
      name:"operationCheckInner",
      component:operationCheckInner
    }
    ]
})
