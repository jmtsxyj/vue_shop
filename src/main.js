import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


//全局css样式
import './assets/necolas-normalize.css-fc091cc/normalize.css'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

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

Vue.component('tree-table', TreeTable)
import {
  formatDate
} from './common/unti';
// 过滤器
Vue.filter('dateForm', function (originVal) {
  const dt = new Date(originVal)
  return formatDate(dt,'yyyy-mm-dd hh:MM:ss')

})

// 导入富文本
import VueQuillEditor from 'vue-quill-editor'
// 样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 注册
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')