import WBEdit from 'wikibase-edit'
import { WBK } from 'wikibase-sdk'

export default class WikibaseRepository {
  constructor (origin, opts = { abortController: new AbortController() }) {
    this.origin = origin
    this.abortController = opts.abortController

    this.read = new WBK({
      instance: origin
    })

    if (opts.oauth) {
      this.edit = new WBEdit({
        instance: origin,
        credentials: {
          oauth: opts.oauth
        }
      })
    }
  }

  async withCancellationContext (thunk) {
    this.abortController.signal.throwIfAborted()
    return thunk()
  }

  getContentLanguages () {
    return fetch(
        `${this.origin}/w/api.php?action=query&meta=wbcontentlanguages&format=json`,
        { signal: this.abortController.signal }
      )
      .then(r => r.json())
      .then(body => Object.keys(body.query.wbcontentlanguages))
  }

  createEntities (...entities) {
    if (!this.edit) {
      return Promise.reject(new Error('Cannot edit a read only instance.'))
    }
    return Promise.allSettled(entities.map(async entity => {
      return this.withCancellationContext(() => this.edit.entity.create(entity))
    }))
      .then((results) => {
        for (const result of results) {
          if (result.status === 'rejected') {
            throw new Error(result.reason)
          }
        }
        return results.map(v => v.value)
      })
  }

  getEntities (...identifiers) {
    return Promise.all(identifiers.map(async identifier => {
      const [entityId, revision] = identifier.split('@')
      const url = revision
        ? await this.withCancellationContext(() => this.read.getEntityRevision({
          id: entityId,
          revision
        }))
        : await this.withCancellationContext(() => this.read.getEntities({
          ids: [entityId]
        }))
      const { entities } = await fetch(
        url, { signal: this.abortController.signal }
      ).then(res => res.json())
      return entities[entityId]
    }))
  }
}
