import Vue from 'vue'

import {
  createStore,
  registerGetters,
  registerActions
} from 'vue-stator'

import state from '~/<%= options.baseDir %>/state'
<% if (options.hasGlobalActions) { %>import * as globalActions from '~/<%= options.baseDir %>/actions'<% } %>
<% if (options.hasGlobalGetters) { %>import * as globalGetters from '~/<%= options.baseDir %>/getters'<% } %>
<%
const statorActionsModules = {}
const statorGettersModules = {}
for (const statorModule of options.statorModules) {
  if (statorModule.actions) {
    const importName = `statorActions_${statorModule.namespace}`
    statorActionsModules[statorModule.namespace] = importName

%>import * as <%= importName %> from '~/<%= options.baseDir %>/<%= statorModule.actions %>'<%
  }

  if (statorModule.getters) {
    const importName = `statorGetters_${statorModule.namespace}`
    statorGettersModules[statorModule.namespace] = importName

%>import * as <%= importName %> from '~/<%= options.baseDir %>/<%= statorModule.getters %>'<%
  }
} %>

<% if (!options.hasGlobalActions) { %>const globalActions = {}<% } %>
<% if (!options.hasGlobalGetters) { %>const globalGetters = {}<% } %>

const actions = { <%= Object.entries(statorActionsModules).map(([k, v]) => `${k}: ${v}`).join(', ') %> }
const getters = { <%= Object.entries(statorGettersModules).map(([k, v]) => `${k}: ${v}`).join(', ') %> }

export default async function NuxtStatorPlugin (ctx, inject) {
  const hydrate = (initialState) => {
    return process.client
      ? Vue.observable(<%= options.isSPA ? 'initialState' : 'window.__NUXT__.$state' %>)
      : initialState
  }

  const initialState = await state(ctx)

  createStore({
    ctx,
    hydrate,
    state: () => initialState
  })

  ctx.$actions = registerActions(ctx, { ...globalActions, ...actions })
  ctx.$getters = registerGetters(ctx, { ...globalGetters, ...getters })

  inject('state', ctx.$state)
  inject('actions', ctx.$actions)
  inject('getters', ctx.$getters)

  if (ctx.ssrContext) {
    ctx.ssrContext.nuxt.$state = ctx.$state
  }
}
