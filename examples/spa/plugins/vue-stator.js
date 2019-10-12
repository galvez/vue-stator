import Vue from 'vue'
import { plugin as VueStator } from 'vue-stator'
import state from '~/store/state'
import * as getters from '~/store/getters'
import * as user from '~/store/user'

Vue.use(VueStator, {
  state,
  getters,
  actions: { user }
})

// Note: the `vue-stator/nuxt` module supports SPA mode.
// Usage of Vue.use() here is purely didactic
