export const listen = (...signals) => {
  return Promise.race(signals.map((s) => {
    return new Promise((resolve, reject) => {
      process.on(s, () => {
        reject(new Error(`Received ${s}, program will exit before finishing.`))
      })
    })
  }))
}
