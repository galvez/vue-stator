import * as utils from '~/utils'

describe('utils', () => {
  test('ensureArray returns same array', () => {
    const input = [1, 2, 3]
    expect(utils.ensureArray(input)).toBe(input)
  })

  test('ensureArray returns array from string', () => {
    expect(utils.ensureArray('test')).toEqual(['test'])
  })

  test('ensureArray returns array from object', () => {
    const input = { test: true }
    expect(utils.ensureArray(input)).toEqual(
      expect.arrayContaining([{ test: true }])
    )
  })

  test('callIfFunction calls the function', () => {
    const input = jest.fn().mockReturnValue(true)

    expect(utils.callIfFunction(input)).toBe(true)
    expect(input).toHaveBeenCalledTimes(1)
  })

  test('callIfFunction returns input', () => {
    const input = { test: true }

    expect(utils.callIfFunction(input)).toBe(input)
  })
})
