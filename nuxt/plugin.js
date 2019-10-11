import {
  createStore,
  registerGetters,
  registerActions
} from 'vue-stator'

<% for (const namespace of options.actions) { %>
<% } %>

<% for (const namespace of options.getters) { %>
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

  ctx.$getters = registerGetters(ctx, { ...globalGetters, ...getters })
  inject('getters', ctx.$getters)

  ctx.$actions = registerActions(ctx, { ...globalActions, ...actions })
  inject('actions', ctx.$actions)
}
