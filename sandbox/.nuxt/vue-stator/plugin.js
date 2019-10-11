import Vue from 'vue'

import {
  createStore,
  registerGetters,
  registerActions
} from '../../../index'

const globalActions = {}
const globalGetters = {}

import state from '~/store/state'

import * as _stator_getters from '~/store/getters'
Object.assign(globalGetters, _stator_getters)

import * as _stator_user_actions from '~/store/user.js'

const actions = {}
const getters = {}

Object.assign(actions, { user: _stator_user_actions })

export default async function (ctx, inject) {
  const hydrate = (initialState) => {
    return process.client
      ? Vue.observable(window.__NUXT__.$state)
      : Vue.observable(initialState)
  }

  await createStore({ ctx, state, hydrate })
  inject('state', ctx.$state)

  if (ctx.ssrContext) {
    ctx.ssrContext.nuxt.$state = ctx.$state
  }

  ctx.$actions = registerActions(ctx, { ...globalActions, ...actions })
  if (ctx.$actions) {
    inject('actions', ctx.$actions)
  }

  ctx.$getters = registerGetters(ctx, { ...globalGetters, ...getters })
  if (ctx.$getters) {
    inject('getters', ctx.$getters)
  }
}
