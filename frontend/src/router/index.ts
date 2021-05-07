import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Artist from '../views/Artist.vue'
import ArtistList from '../views/ArtistList.vue'
import Event from '../views/Event.vue'
import EventList from '../views/EventList.vue'
import Landing from '../views/Landing.vue'
import NotFound from '../views/NotFound.vue'
import Page from '../views/Page.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/events',
    name: 'Event',
    component: EventList
  },
  {
    path: '/events/:event',
    name: 'Event',
    component: Event
  },
  {
    path: '/artists',
    name: 'Artists',
    component: ArtistList
  },
  {
    path: '/artists/:artist?',
    name: 'Artist',
    component: Artist
  },
  {
    path: '/map',
    name: 'Map',
    // route level code-splitting
    // this generates a separate chunk (map.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "map" */ '../views/Map.vue')
  },
  {
    path: '/map/:spotslug?',
    name: 'Spot',
    component: () => import(/* webpackChunkName: "spot" */ '../views/Spot.vue')
  },
  {
    path: '/pages/:pageslug?',
    name: 'Page',
    component: Page
  },
  // helper routes point
  {
    path: '/contact',
    name: 'Contact',
    redirect: {path: '/pages/contact'},
  },
  {
    path: '/__diagnostics',
    name: 'Diagnostics',
    component: () => import(/* webpackChunkName: "diags" */ '../views/Diagnostics.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '*',
    name: 'CatchAll',
    redirect: {name: "NotFound"},
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition: any) {
    //console.log("--DBG: route position",savedPosition);
    return savedPosition || {
      x:0,
      y:undefined
    };
  },

})

export default router
