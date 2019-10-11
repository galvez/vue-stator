import Vue from 'vue'

import {
  createStore,
  registerGetters,
  registerActions
} from 'vue-stator'

const globalActions = {}
const globalGetters = {}

import state from '~/<%= options.baseDir %>/state'
  
<% if (options.hasGlobalActions) { %>
import * as _stator_actions from '~/<%= options.baseDir %>/actions'
Object.assign(globalActions, _stator_actions)
<% } %>

<% if (options.hasGlobalGetters) { %>
import * as _stator_getters from '~/<%= options.baseDir %>/getters'
Object.assign(globalGetters, _stator_getters)
<% } %>

<% for (const sModule of options.statorModules) { %>
<% if (sModule.actions) { %>
import * as _stator_<%= sModule.namespace %>_actions from '~/<%= options.baseDir %>/<%= sModule.actions %>'
<% } %>
<% if (sModule.getters) { %>
import * as _stator_<%= sModule.namespace %>_getters from '~/<%= options.baseDir %>/<%= sModule.getters %>'
<% } %>
<% } %>

const actions = {}
const getters = {}

<% for (const sModule of options.statorModules) { %>
<% if (sModule.actions) { %>
Object.assign(actions, { <%= sModule.namespace %>: _stator_<%= sModule.namespace %>_actions })
<% } %>
<% if (sModule.getters) { %>
Object.assign(getters, { <%= sModule.namespace %>: _stator_<%= sModule.namespace %>_getters })
<% } %>
<% } %>
  
export default async function (ctx, inject) {
  const hydrate = (initialState) => {
    return process.client
<% if (options.isSPA) { %>? Vue.observable(initialState)
<% } else { %>? Vue.observable(window.__NUXT__.$state)
<% } %>: initialState
  }

  const initialState = await state(ctx)
  createStore({ ctx, hydrate, state: () => initialState })
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
