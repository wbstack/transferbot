import { exec } from 'node:child_process'

export const execCmd = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      process.stdout.write(stdout)
      process.stderr.write(stderr)
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}
