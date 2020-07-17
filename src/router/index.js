import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数，
  // next（）表示放行，next（'/login'）强制跳转
  if (to.path == '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');

  next();
})
export default router