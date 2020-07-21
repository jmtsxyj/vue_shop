import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


//全局css样式
import './assets/necolas-normalize.css-fc091cc/normalize.css'
import './assets/css/global.css'

// elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//axios
import axios from 'axios';
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 在最后必须return config
  return config;
})
Vue.prototype.$http = axios;


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
