#!/usr/bin/env node

import WikibaseRepo from './../lib/repo.js'
import { pickLanguages, pickKeys } from './../lib/util.js'
import { execCmd } from './../lib/exec.js'
import { listen } from './../lib/signals.js'

Promise.race([listen('SIGINT', 'SIGTERM', 'SIGQUIT'), (async () => {
  const args = process.argv.slice(2)
  if (args.length < 3) {
    throw new Error(
      `Expected at least 3 positional arguments to be given, but got ${args.length}, cannot continue.`
    )
  }
  const [source, target, ...entities] = args

  const oauth = {
    consumer_key: process.env.TARGET_WIKI_OAUTH_CONSUMER_TOKEN,
    consumer_secret: process.env.TARGET_WIKI_OAUTH_CONSUMER_SECRET,
    token: process.env.TARGET_WIKI_OAUTH_ACCESS_TOKEN,
    token_secret: process.env.TARGET_WIKI_OAUTH_ACCESS_SECRET
  }
  if (!Object.values(oauth).every(v => v)) {
    throw new Error(
      'Unable to find full set of OAuth credentials in environment variables, cannot continue.'
    )
  }

  const sourceRepo = new WikibaseRepo(source)
  const targetRepo = new WikibaseRepo(target, { oauth })

  const contentLanguages = await targetRepo.getContentLanguages()

  let data = await sourceRepo.getEntities(...entities)
  data = data
    .map(e => pickKeys(e, 'type', 'labels', 'descriptions', 'aliases', 'datatype'))
    .map(e => pickLanguages(e, ...contentLanguages))

  await targetRepo.createEntities(...data)

  console.log(`Sucessfully transferred ${entities.length} entities from ${source} to ${target}.`)
})()])
  .then((result) => {
    process.exitCode = 0
  })
  .catch((err) => {
    console.error('An error occurred executing the command:')
    console.error(err)
    process.exitCode = 1
  })
  .then(() => {
    if (process.env.CALLBACK_ON_SUCCESS && process.exitCode === 0) {
      return execCmd(process.env.CALLBACK_ON_SUCCESS)
    }
    if (process.env.CALLBACK_ON_FAILURE && process.exitCode !== 0) {
      return execCmd(process.env.CALLBACK_ON_FAILURE)
    }
  })
  .catch((err) => {
    console.error('An error occurred executing the given callbacks:')
    console.error(err)
  })
