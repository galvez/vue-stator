export const actions = {
  update ({ state }, user) {
    Object.assign(state, user)
  }
}
