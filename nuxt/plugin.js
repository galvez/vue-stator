import Vue from 'vue'
import {
  plugin as VueStator,
  createStore
} from 'vue-stator' ///dist/vue-stator.esm.js'

Vue.use(VueStator)

<% if (options.hasState) { %>import state from '~/<%= options.baseDir %>/state'<% } %>
<% if (options.hasGlobalActions) { %>import * as actions from '~/<%= options.baseDir %>/actions'<% } %>
<% if (options.hasGlobalGetters) { %>import * as getters from '~/<%= options.baseDir %>/getters'<% } %>
<%
const modules = {}
for (const statorModule of options.statorModules) {
  const { namespace, state, getters, actions } = statorModule
  if (!(state || getters || actions)) {
    continue
  }

  modules[namespace] = {}

  if (state) {
    const importName = `${namespace}State`
    modules[namespace].state = importName

%>import * as <%= importName %> from '~/<%= options.baseDir %>/<%= state %>'<%
  }

  if (actions) {
    const importName = `${namespace}Actions`
    modules[namespace].actions = importName

%>import * as <%= importName %> from '~/<%= options.baseDir %>/<%= actions %>'<%
  }

  if (getters) {
    const importName = `${namespace}Getters`
    modules[namespace].getters = importName

%>import * as <%= importName %> from '~/<%= options.baseDir %>/<%= getters %>'<%
  }
} %>

<% if (!options.hasState) { %>const state = () => ({})<% } %>
<% if (!options.hasGlobalActions) { %>const actions = {}<% } %>
<% if (!options.hasGlobalGetters) { %>const getters = {}<% } %>

const modules = {
  <%= Object.entries(modules).map(([moduleName, module]) =>
  `${moduleName}: {
    ${Object.entries(module).map(([key, value]) => `${key}: ${value}`).join('\n    ')}
  }`).join(',  ') %>
}

export default async function NuxtStatorPlugin (ctx, inject) {
  const hydrate = (initialState) => {
    return process.client
      ? <%= options.isSPA ? 'initialState' : 'window.__NUXT__.$state' %>
      : initialState
  }

  const initialState = await state(ctx)

  const stator = createStore({
    state: () => initialState,
    hydrate,
    getters,
    actions,
    modules
  })

  ctx.app.stator = stator

  ctx.$state = stator.$state
  ctx.$getters = stator.$getters
  ctx.$actions = stator.$actions

  if (ctx.ssrContext) {
    ctx.ssrContext.nuxt.$state = ctx.$state
  }
}
