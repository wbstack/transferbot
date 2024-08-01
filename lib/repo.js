import WBEdit from 'wikibase-edit'
import { WBK } from 'wikibase-sdk'

export default class WikibaseRepository {
  constructor (origin, opts = {}) {
    this.origin = origin

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

  getContentLanguages () {
    return fetch(`${this.origin}/w/api.php?action=query&meta=wbcontentlanguages&format=json`)
      .then(r => r.json())
      .then(body => Object.keys(body.query.wbcontentlanguages))
  }

  async createEntities (...entities) {
    if (!this.edit) {
      throw new Error('Cannot edit a read only instance.')
    }
    return Promise.all(entities.map(async entity => {
      return this.edit.entity.create(entity)
    }))
  }

  getEntities (...identifiers) {
    return Promise.all(identifiers.map(async identifier => {
      const [entityId, revision] = identifier.split('@')
      const url = revision
        ? await this.read.getEntityRevision({
          id: entityId,
          revision
        })
        : await this.read.getEntities({
          ids: [entityId]
        })
      const { entities } = await fetch(url).then(res => res.json())
      return entities[entityId]
    }))
  }
}
