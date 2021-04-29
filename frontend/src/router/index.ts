import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'


import { $config, $user } from '@/services'

import Artist from '../views/Artist.vue'
import ArtistList from '../views/ArtistList.vue'
import Content from '../views/Content.vue'
import Event from '../views/Event.vue'
import EventList from '../views/EventList.vue'
import Landing from '../views/Landing.vue'
import Spot from '../views/Spot.vue'
import NotFound from '../views/NotFound.vue'
import Diagnostics from '../views/Diagnostics.vue'
import Map from '../views/Map.vue';
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
    component: Map
  },
  {
    path: '/map/:spotslug?',
    name: 'Spot',
    component: Spot
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
    component: Diagnostics,
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
