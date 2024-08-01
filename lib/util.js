export const pickKeys = (obj, ...keys) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (keys.includes(key)) {
      acc[key] = value
    }
    return acc
  }, {})
}

export const pickLanguages = (obj, ...languages) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = isObject(value) ? pickKeys(value, ...languages) : value
    return acc
  }, {})
}

function isObject (x) {
  return Object.prototype.toString.call(x) === '[object Object]'
}
