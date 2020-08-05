import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const User = () => import('../components/users/User.vue')
const Roles = () => import('../components/access/Roles.vue')
const Rights = () => import('../components/access/Rights.vue')
const Goods = () => import('../components/commodities/Goods.vue')
const Categroy = () => import('../components/commodities/Categroy.vue')
const Params = () => import('../components/commodities/Params.vue')
const Order = () => import('../components/order/Order.vue')
const Reports = () => import('../components/data/Reports.vue')
const AddGoods = () => import('../components/commodities/AddGoods.vue')
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
    component: Home,
    redirect: "/welcome",
    children: [{
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: User,
      },
      {
        path: '/roles',
        component: Roles,
      },
      {
        path: '/rights',
        component: Rights,
      },
      {
        path: '/goods',
        component: Goods,
      },
      {
        path: '/categories',
        component: Categroy,
      },
      {
        path: '/params',
        component: Params,
      },
      {
        path: '/orders',
        component: Order,
      },
      {
        path: '/reports',
        component: Reports,
      },
      {
        path:"/goods/add",
        component:AddGoods
      }
    ],
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