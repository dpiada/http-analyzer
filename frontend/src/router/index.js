import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/request',
  },
  {
    path: '/request',
    name: 'request',
    component: () => import('../components/RequestForm')
  },
  {
    path: '/request/:id',
    name: 'reuquest_history',
    component: () => import('../components/RequestForm')
  },
  {
    path: '/NotWorking',
    name: 'NotWorking',
    component: () => import('../components/NotWorking')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
