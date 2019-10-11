import {
  createStore,
  registerGetters,
  registerActions
} from 'vue-stator'

const globalActions = {}
const globalGetters = {}

<% if (options.hasGlobalActions) { %>
import * as _stator_actions from '~/<%= options.baseDir %>/actions'
Object.assign(globalActions, _stator_actions)
<% } %>

<% if (options.hasGlobalGetters) { %>
  import * as _stator_getters from '~/<%= options.baseDir %>/getters'
  Object.assign(globalGetters, _stator_getters)
<% } %>
  
<% for (const sModule of options.statorModules) { %>
import * as _stator_<%= sModule.namespace %>_actions from '~/<%= options.baseDir %>/<%= sModule.actions %>'
import * as _stator_<%= sModule.namespace %>_getters from '~/<%= options.baseDir %>/<%= sModule.getters %>'
<% } %>

const actions = {}
const getters = {}

<% for (const sModule of options.statorModules) { %>
Object.assign(actions, _stator_<%= sModule.namespace %>_actions)
Object.assign(getters, _stator_<%= sModule.namespace %>_getters)
<% } %>
  
export default async function (ctx, inject) {
  const hydrate = (initialState) => {
    return process.client 
      ? Vue.observable(window.__NUXT__.$state)
      : Vue.observable(initialState)
  }

  createStore({ ctx, hydrate })

  if (ctx.ssrContext) {
    ctx.ssrContext.nuxt.$state = ctx.$state
  }

  ctx.$actions = registerActions(ctx, { ...globalActions, ...actions })
  inject('actions', ctx.$actions)

  ctx.$getters = registerGetters(ctx, { ...globalGetters, ...getters })
  inject('getters', ctx.$getters)
}
