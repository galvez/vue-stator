/**
 * @jest-environment jsdom
 */
import { mount, createLocalVue } from '@vue/test-utils'
import { waitTick } from 'test-utils'
import * as helpers from '~/helpers'
import * as store from '~/store'
import plugin from '~/plugin'

describe('reactivity', () => {
  test('subscribe', async () => {
    const config = {
      state: {
        test: false
      }
    }

    const stator = store.createStore(config)

    const spy = jest.fn()
    stator.subscribe('test', spy)
    stator.$state.test = true

    await waitTick()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('mapState direct', () => {
    const localVue = createLocalVue()
    localVue.use(plugin, {
      state: {
        test: false
      }
    })

    const Component = {
      template: '<p>{{ test }}</p>',
      computed: helpers.mapState('test')
    }

    const wrapper = mount(Component, { localVue })
    expect(wrapper.vm.test).toBe(false)

    wrapper.vm.test = true

    expect(wrapper.vm.test).toBe(true)
    expect(wrapper.vm.$state.test).toBe(true)
  })

  test('mapState alias', () => {
    const localVue = createLocalVue()
    localVue.use(plugin, {
      state: {
        test: false
      }
    })

    const Component = {
      template: '<p>{{ alias }}</p>',
      computed: helpers.mapState({ alias: 'test' })
    }

    const wrapper = mount(Component, { localVue })
    expect(wrapper.vm.alias).toBe(false)

    wrapper.vm.alias = true

    expect(wrapper.vm.alias).toBe(true)
    expect(wrapper.vm.$state.test).toBe(true)
  })

  test('mapState module direct', () => {
    const localVue = createLocalVue()
    localVue.use(plugin, {
      modules: {
        my: {
          state: {
            test: false
          }
        }
      }
    })

    const Component = {
      template: '<p>{{ [\'my/test\'] }}</p>',
      computed: helpers.mapState(['my/test'])
    }

    const wrapper = mount(Component, { localVue })
    expect(wrapper.vm['my/test']).toBe(false)

    wrapper.vm['my/test'] = true

    expect(wrapper.vm['my/test']).toBe(true)
    expect(wrapper.vm.$state.my.test).toBe(true)
  })

  test('mapState module alias', () => {
    const localVue = createLocalVue()
    localVue.use(plugin, {
      modules: {
        my: {
          state: {
            test: false
          }
        }
      }
    })

    const Component = {
      template: '<p>{{ alias }}</p>',
      computed: {
        ...helpers.mapState({ alias: 'my/test' })
      },
      methods: {
        change () {
          this.alias = true
        }
      }
    }

    const wrapper = mount(Component, { localVue })
    expect(wrapper.vm.alias).toBe(false)

    wrapper.vm.change()

    expect(wrapper.vm.alias).toBe(true)
    expect(wrapper.vm.$state.my.test).toBe(true)
  })
})
