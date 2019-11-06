import * as namespace from '~/namespace'

describe('namespace', () => {
  test('validateNamespace returns array for string', () => {
    expect(namespace.validateNamespace('test')).toEqual(['test'])
  })

  test('validateNamespace returns input for array', () => {
    const input = ['test']
    expect(namespace.validateNamespace(input)).not.toBe(input)
    expect(namespace.validateNamespace(input)).toEqual(input)
  })

  test('validateNamespace returns empty array for other', () => {
    expect(namespace.validateNamespace({})).toEqual([])
  })

  test('validateNamespace filters empty chunks', () => {
    expect(namespace.validateNamespace('test/ /name//space/')).toEqual([
      'test',
      ' ',
      'name',
      'space'
    ])
  })

  test('getPropertyByNamespace returns property (depth: 1)', () => {
    const property = namespace.getPropertyByNamespace({ key: true }, 'key')
    expect(property).toBe(true)
  })

  test('getPropertyByNamespace returns property (depth: 2)', () => {
    const property = namespace.getPropertyByNamespace({
      name: {
        key: true
      }
    }, 'name/key')

    expect(property).toBe(true)
  })

  test('getPropertyByNamespace ignores non-existing chunks (do we rly want this?)', () => {
    const property = namespace.getPropertyByNamespace({
      name: {
        key: true
      }
    }, 'name/bestaat niet/key')

    expect(property).toBe(true)
  })

  test('setPropertyByNamespace sets property (depth: 1)', () => {
    const object = {
      key: false
    }

    namespace.setPropertyByNamespace(object, 'key', true)
    expect(namespace.getPropertyByNamespace(object, 'key')).toBe(true)
  })

  test('setPropertyByNamespace sets property (depth: 2)', () => {
    const object = {
      name: {
        key: false
      }
    }

    namespace.setPropertyByNamespace(object, 'name/key', true)
    expect(namespace.getPropertyByNamespace(object, 'name/key')).toBe(true)
  })

  test('getModuleByNamespace returns module', () => {
    const store = {
      $state: {
        user: {
          profile: {
            id: 1
          }
        }
      },
      $getters: {
        user: {}
      },
      $actions: {
        user: {
          profile: {
            update () {}
          }
        }
      }
    }

    const module = namespace.getModuleByNamespace(store, 'user/profile')

    expect(module).toMatchObject({
      state: {
        id: 1
      },
      getters: {},
      actions: {
        update: expect.any(Function)
      }
    })
  })
})
