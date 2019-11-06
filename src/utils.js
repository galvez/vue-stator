
export function ensureArray (variable) {
  if (Array.isArray(variable)) {
    return variable
  }

  return [variable]
}

export function callIfFunction (variable, ...args) {
  if (typeof variable === 'function') {
    return variable(...args)
  }

  return variable
}
