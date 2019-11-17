import Vue from 'vue'
import Router from 'vue-router'
import { plugin as VueStator, createStore } from '../../../src'

Vue.use(Router)
Vue.use(VueStator)

export default function createApp () {
  const Home = {
    name: 'home',
    template: `<div>
      <router-link to="/about">About</router-link>

      <p class="state">{{ $state.test }}</p>
      <p class="getter">{{ $getters.userFullName }}</p>
    </div>`,
    created () {
      // Testing SSR state change
      this.$actions.user.update({
        firstName: 'Jonas',
        lastName: 'Galvez'
      })
    }
  }

  const About = {
    name: 'About',
    template: `  <div>
      <router-link to="/">Home</router-link>

      <p class="state">{{ $state.test }}</p>
      <p class="getter">{{ $getters.userFullName }}</p>
    </div>`,
    mounted () {
      this.$state.test = 456
    }
  }

  const router = new Router({
    mode: 'history',
    base: '/',
    routes: [
      { path: '/', component: Home },
      { path: '/about', component: About }
    ]
  })
  router.afterEach((to) => {
    Vue.nextTick(() => {
      const [route] = to.matched
      if (!route) {
        return
      }

      const instance = route.instances.default
      if (!instance) {
        return
      }

      instance.$root.$emit('routeChanged')
    })
  })

  const stator = createStore({
    state: () => ({
      test: 123
    }),
    getters: {
      userFullName: ({ user: { firstName, lastName } }) => `${firstName} ${lastName}`
    },
    modules: {
      user: {
        state () {
          return {
            firstName: 'John',
            lastName: 'Doe'
          }
        },
        actions: {
          update ({ state }, user) {
            Object.assign(state, user)
          }
        }
      }
    }
  })

  const app = new Vue({
    router,
    stator,
    mounted () {
      window.$vue = this
    },
    template: `
    <div id="app">
      <router-view />
    </div>`
  })

  return { app, router }
}
