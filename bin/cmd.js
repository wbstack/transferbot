#!/usr/bin/env node

import WikibaseRepo from './../lib/repo.js'
import { pickLanguages, pickKeys } from './../lib/util.js'

;(async () => {
  const [source, target, ...entities] = process.argv.slice(2)
  const sourceRepo = new WikibaseRepo(source)
  const targetRepo = new WikibaseRepo(target, {
    oauth: {
      consumer_key: process.env.TARGET_WIKI_OAUTH_CONSUMER_TOKEN,
      consumer_secret: process.env.TARGET_WIKI_OAUTH_CONSUMER_SECRET,
      token: process.env.TARGET_WIKI_OAUTH_ACCESS_TOKEN,
      token_secret: process.env.TARGET_WIKI_OAUTH_ACCESS_SECRET
    }
  })

  const contentLanguages = await targetRepo.getContentLanguages()

  let data = await sourceRepo.getEntities(...entities)
  data = data
    .map(e => pickKeys(e, 'type', 'labels', 'descriptions', 'aliases', 'datatype'))
    .map(e => pickLanguages(e, ...contentLanguages))

  await targetRepo.createEntities(...data)
  return `Sucessfully transferred ${entities.length} entities from ${source} to ${target}.`
})()
  .then((result) => {
    if (result) {
      console.log(result)
    }
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
