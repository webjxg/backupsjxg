// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import jquery from 'jquery'
import ApiMethod from "./js/app"
import apiD from "./js/apiDomain"
import FastClick from 'fastclick'
import echarts from 'echarts'
import '../src/assets/css/element-Ui.css'
Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.prototype.$ = jquery; 
Vue.prototype.ApiMethod = ApiMethod;
Vue.prototype.apiD = apiD;
Vue.prototype.$echarts = echarts
FastClick.attach(document.body);
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  components: { App },
  template: '<App/>'
})
