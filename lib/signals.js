export const trap = (...signals) => {
  return Promise.race(signals.map((s) => {
    return new Promise((resolve, reject) => {
      process.on(s, () => resolve(s))
    })
  }))
}
