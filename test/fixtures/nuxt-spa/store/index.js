import * as user from './user'

export const state = () => ({
  test: 456,
  user: {
    firstName: 'John',
    lastName: 'Doe'
  }
})

export const getters = {
  userFullName (state) {
    return `${state.user.firstName} ${state.user.lastName}`
  }
}

export const modules = {
  user
}
