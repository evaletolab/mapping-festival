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
    path: '/artists/:artist?',
    name: 'About',
    component: Artist
  },
  {
    path: '/artists',
    name: 'About',
    component: ArtistList
  },
  {
    path: '/spot/:spotslug?',
    name: 'Spot',
    component: Spot
  },
  {
    path: '/content/:slug',
    name: 'Modules',
    component: Content,
    // children:[{
    //   path: ':slug',
    //   name: 'Content',
    //   components: { l2 : Content}  
    // }]
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
