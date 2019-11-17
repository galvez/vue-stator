/**
 * @jest-environment jsdom
 */
import { mount, createLocalVue } from '@vue/test-utils'
import * as helpers from '~/helpers'
import plugin from '~/plugin'

describe('reactivity', () => {
  test('mixin works', () => {
    const localVue = createLocalVue()
    localVue.use(plugin, {
      mixin: true,
      state () {
        return {
          key: 0,
          my: {
            module: {
              nonAliasedKey: 1,
              theModuleKey: 2
            }
          }
        }
      },
      getters: {
        rootGetter: () => 3
      },
      actions: {
        myAction: () => 4
      },
      modules: {
        my: {
          modules: {
            module: {
              getters: {
                myGetter: () => 5
              }
            }
          }
        }
      }
    })

    const Component = {
      statorMap: {
        state: {
          key: false,
          my: {
            module: {
              nonAliasedKey: true,
              aliasedKey: 'theModuleKey'
            }
          }
        },
        getters: [
          'rootGetter',
          'my/module/myGetter'
        ],
        actions: ['myAction']
      },
      template: '<p>{{ test }}</p>',
      computed: helpers.mapState('test')
    }

    const wrapper = mount(Component, { localVue })

    expect(wrapper.vm.key).toBeUndefined()
    expect(wrapper.vm.nonAliasedKey).toBe(1)
    expect(wrapper.vm.theModuleKey).toBeUndefined()
    expect(wrapper.vm.aliasedKey).toBe(2)
    expect(wrapper.vm.rootGetter).toBe(3)
    expect(wrapper.vm['my/module/myGetter']).toBe(5)
    expect(wrapper.vm.myAction()).toBe(4)
  })

  test('mixin works', () => {
    const localVue = createLocalVue()

    localVue.use(plugin, {
      mixin: true,
      state () {
        return {
          my: {
            key: 0,
            module: {
              nonAliasedKey: 1,
              theModuleKey: 2
            }
          }
        }
      },
      modules: {
        my: {
          modules: {
            module: {
              getters: {
                myGetter: () => 5
              }
            }
          }
        }
      }
    })

    const Component = {
      statorMap: {
        omitNamespace: false,
        state: {
          my: {
            key: true,
            module: [
              'nonAliasedKey',
              'theModuleKey'
            ]
          }
        },
        getters: ''
      },
      template: '<p>{{ test }}</p>',
      computed: helpers.mapState('test')
    }

    const wrapper = mount(Component, { localVue })

    expect(wrapper.vm.key).toBeUndefined()
    expect(wrapper.vm['my/key']).toBe(0)
    expect(wrapper.vm.nonAliasedKey).toBeUndefined()
    expect(wrapper.vm['my/module/nonAliasedKey']).toBe(1)
    expect(wrapper.vm['my/module/theModuleKey']).toBe(2)
  })
})
