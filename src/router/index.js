import Vue from 'vue'
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/vapi/create',
    name: 'createApi',
    component: () => import('../views/ApiCreate.vue')
  },
  {
    path: '/project/create',
    name: 'createProject',
    component: () => import('../views/ProjectSave.vue')
  },
  {
    path :'/project/list',
    name :'ProjectList',
    component: () => import('../views/ProjectList.vue')
  },
  {
    path :'/vapi/detail',
    name :'ApiDetail',
    component: () => import('../views/ApiDetail.vue')
  },
  {
    path :'/vapi/list',
    name :'ApiList',
    component: () => import('../views/ApiList.vue')
  },
  {
    path :'/project/tree',
    name :'ProjectTree',
    component: () => import('../views/ProjectTree.vue')
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
    next()
})


export default router
