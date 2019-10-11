import Vue from 'vue'
import VueStator from 'vue-stator'
import state from '~/store/state'
import * as getters from '~/store/getters'
import * as userActions from '~/store/user'

Vue.use(VueStator, {
  state,
  getters,
  actions: { ...userActions }
})
