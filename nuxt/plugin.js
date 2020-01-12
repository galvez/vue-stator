import Vue from 'vue'
import {
  <% if (options.mixin) { %>mixin as VueStatorMixin,<% } %>
  plugin as VueStator,
  createStore as createStator
} from 'vue-stator'

Vue.use(VueStator)
<% if (options.mixin) { %>Vue.mixin(VueStatorMixin)<% } %>

export default function NuxtStatorPlugin (context) {
  const stator = createStore()

  // vue-stator already gets injected into Vue by the plugin above
  context.app.stator = stator
  context.$stator = stator

  context.$state = stator.$state
  context.$getters = stator.$getters
  context.$actions = stator.$actions

  if (context.ssrContext) {
    context.ssrContext.nuxt.$state = context.$state
  }

  <% if (typeof options.inject === 'function') { %>
  (<%= serializeFunction(options.inject) %>)(stator, context, Vue)
  <% } else if (Array.isArray(options.inject)) { %>
  // To avoid a race condition / plugin loading order issue we need to
  // use a Promise here, if we pass a callback to nextTick the callback
  // is triggered before other plugins have ran
  Vue.nextTick().then(() => {
    <% options.inject.forEach(property => {
      if (property[0] !== '$') {
        property = `$${property}`
      }
    %>
    if (context.<%= property %>) {
      stator.<%= property %> = context.<%= property %>
    }
    <% }) %>
  })
  <% } %>
}

<%
storeModules = statorModules

/*****************************************************************/
/* below is directly copied from nuxt/vue-app/templates/store.js */
/*            changes/additions are commented                    */
/*****************************************************************/

const willResolveStoreModules = storeModules.some(s => s.src.indexOf('index.') !== 0)
if (willResolveStoreModules) { %>
const VUEX_PROPERTIES = ['state', 'getters', 'actions']
<% } %>
let store = {
  // vue-stator feature
  hydrate: (initialState) => {
    return process.client
      ? <%= nuxtOptions.mode === 'spa' ? 'initialState' : 'window.__NUXT__.$state' %>
      : initialState
  }
  // end vue-stator feature
}

void (function updateModules () {
  <% storeModules.some(s => {
    if(s.src.indexOf('index.') === 0) { %>
  store = normalizeRoot(require('<%= relativeToBuild(srcDir, dir.stator, s.src) %>'), '<%= dir.stator %>/<%= s.src %>')
  <% return true }}) %>

  // If store is an exported method = classic mode (deprecated)
  <% if (isDev) { %>
  if (typeof store === 'function') {
    <%= isTest ? '// eslint-disable-next-line no-console' : '' %>
    return console.warn('Classic mode for store/ is deprecated and will be removed in Nuxt 3.')
  }<% } %>

  // Enforce store modules
  store.modules = store.modules || {}

  <% storeModules.forEach(s => {
    if(s.src.indexOf('index.') !== 0) { %>
  resolveStoreModules(require('<%= relativeToBuild(srcDir, dir.stator, s.src) %>'), '<%= s.src %>')<% }}) %>

  // If the environment supports hot reloading...
  // TODO: fix hmr
  <% if (false && isDev) { %>
  if (process.client && module.hot) {
    // Whenever any Vuex module is updated...
    module.hot.accept([<% storeModules.forEach(s => { %>
      '<%= relativeToBuild(srcDir, dir.stator, s.src) %>',<% }) %>
    ], () => {
      // Update `root.modules` with the latest definitions.
      updateModules()
      // Trigger a hot update in the store.
      window.<%= globals.nuxt %>.$store.hotUpdate(store)
    })
  }<% } %>
})()

// createStore
export const createStore = store instanceof Function ? store : () => {
  return createStator(Object.assign({
    strict: (process.env.NODE_ENV !== 'production')
  }, store))
}

function normalizeRoot (moduleData, filePath) {
  moduleData = moduleData.default || moduleData

  if (moduleData.commit) {
    throw new Error(`[nuxt] ${filePath} should export a method that returns a Vuex instance.`)
  }

  if (typeof moduleData !== 'function') {
    // Avoid TypeError: setting a property that has only a getter when overwriting top level keys
    moduleData = Object.assign({}, moduleData)
  }
  return normalizeModule(moduleData, filePath)
}

function normalizeModule (moduleData, filePath) {
  if (moduleData.state && typeof moduleData.state !== 'function') {
    <%= isTest ? '// eslint-disable-next-line no-console' : '' %>
    console.warn(`'state' should be a method that returns an object in ${filePath}`)

    const state = Object.assign({}, moduleData.state)
    // Avoid TypeError: setting a property that has only a getter when overwriting top level keys
    moduleData = Object.assign({}, moduleData, { state: () => state })
  }
  return moduleData
}

<% if (willResolveStoreModules) { %>
function resolveStoreModules (moduleData, filename) {
  moduleData = moduleData.default || moduleData
  // Remove store src + extension (./foo/index.js -> foo/index)
  const namespace = filename.replace(/\.(<%= extensions %>)$/, '')
  const namespaces = namespace.split('/')
  let moduleName = namespaces[namespaces.length - 1]
  const filePath = `<%= dir.stator %>/${filename}`

  moduleData = moduleName === 'state'
    ? normalizeState(moduleData, filePath)
    : normalizeModule(moduleData, filePath)

  // If src is a known Vuex property
  if (VUEX_PROPERTIES.includes(moduleName)) {
    const property = moduleName
    const storeModule = getStoreModule(store, namespaces, { isProperty: true })

    // Replace state since it's a function
    mergeProperty(storeModule, moduleData, property)
    return
  }

  // If file is foo/index.js, it should be saved as foo
  const isIndexModule = (moduleName === 'index')
  if (isIndexModule) {
    namespaces.pop()
    moduleName = namespaces[namespaces.length - 1]
  }

  const storeModule = getStoreModule(store, namespaces)

  for (const property of VUEX_PROPERTIES) {
    mergeProperty(storeModule, moduleData[property], property)
  }

  // special vue-stator feature, default a module export actions
  if (!VUEX_PROPERTIES.some(prop => storeModule[prop])) {
    mergeProperty(storeModule, moduleData, 'actions')
  }
  // end special vue-stator feature

  if (moduleData.namespaced === false) {
    delete storeModule.namespaced
  }
}

function normalizeState (moduleData, filePath) {
  if (typeof moduleData !== 'function') {
    <%= isTest ? '// eslint-disable-next-line no-console' : '' %>
    console.warn(`${filePath} should export a method that returns an object`)
    const state = Object.assign({}, moduleData)
    return () => state
  }
  return normalizeModule(moduleData, filePath)
}

function getStoreModule (storeModule, namespaces, { isProperty = false } = {}) {
  // If ./mutations.js
  if (!namespaces.length || (isProperty && namespaces.length === 1)) {
    return storeModule
  }

  const namespace = namespaces.shift()

  storeModule.modules[namespace] = storeModule.modules[namespace] || {}
  storeModule.modules[namespace].namespaced = true
  storeModule.modules[namespace].modules = storeModule.modules[namespace].modules || (namespaces.length ? {} : null)

  return getStoreModule(storeModule.modules[namespace], namespaces, { isProperty })
}

function mergeProperty (storeModule, moduleData, property) {
  if (!moduleData) {
    return
  }

  if (property === 'state') {
    storeModule.state = moduleData || storeModule.state
  } else {
    storeModule[property] = Object.assign({}, storeModule[property], moduleData)
  }
}
<% } %>
