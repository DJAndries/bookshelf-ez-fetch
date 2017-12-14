
const processSubfields = (subfields) => {
  const subfieldsObj = {}
  if (Array.isArray(subfields)) {
    for (const subfield of subfields) {
      subfieldsObj[subfield] = true
    }
  } else {
    Object.assign(subfieldsObj, subfields)
  }
  const entries = Object.entries(subfieldsObj)
  const result = {}
  for (const subfieldEntry of entries) {
    if (subfieldEntry[1] === true) {
      result[subfieldEntry[0]] = (qb) => qb
    } else {
      result[subfieldEntry[0]] = (qb) => qb.column(subfieldEntry[1])
    }
  }
  return result
}

const processFilters = (filters) => {
  const entries = Object.entries(filters || {})
  const mainWhereParam = {}
  const result = [mainWhereParam]
  for (const entry of entries) {
    const isSpecialFilter = entry[0].indexOf('-') > -1
    if (isSpecialFilter) {
      const filterSplit = entry[0].split('-')
      const whereParam = [filterSplit[0], null, entry[1]]
      switch (filterSplit[1]) {
        case 'min':
          whereParam[1] = '>='
          break
        case 'max':
          whereParam[1] = '<='
          break
        case 'before':
          whereParam[1] = '<'
          break
        case 'after':
          whereParam[1] = '>'
          break
      }
      if (whereParam[1]) {
        result.push(whereParam)
      }
    } else {
      mainWhereParam[entry[0]] = entry[1]
    }
  }
  return result
}

const fetch = (instance, filters, columns, subfields, all, noNotFoundHandling, config, stat) => {
  const processedFilters = processFilters(filters)
  const processedSubfields = processSubfields(subfields)
  let q = instance.where(processedFilters[0])

  for (const filter of processedFilters.slice(1)) {
    q = q.where(...filter)
  }

  if (all) {
    return q.fetchAll({columns, withRelated: processedSubfields})
  } else {
    return q.fetch({columns, withRelated: processedSubfields}).then((result) => {
      if (!result && !noNotFoundHandling) {
        const model = stat ? instance.forge() : instance
        if (model.notFoundHandler) {
          model.notFoundHandler()
        } else if (config.defaultNotFoundHandler) {
          config.defaultNotFoundHandler()
        }
      }
      return result
    })
  }
}

const extend = (bookshelf, config) => {
  const proto = bookshelf.Model.prototype
  bookshelf.Model = bookshelf.Model.extend({
    ezFetch: function(filters, subfields, columns, noNotFoundHandling) {
      return fetch(this, filters, columns, subfields, false, noNotFoundHandling, config)
    },
    ezFetchAll: function(filters, subfields, columns) {
      return fetch(this, filters, columns, subfields, true, false, config)
    },
  }, {
    ezFetchAll: function(filters, subfields, columns) {
      return fetch(this, filters, columns, subfields, true, false, config, true)
    },
    ezFetch: function(filters, subfields, columns, noNotFoundHandling) {
      return fetch(this, filters, columns, subfields, false, noNotFoundHandling, config, true)
    }
  })
}

const plugin = (config = {}) => (bookshelf) => {
  config = Object.assign({relations: true}, config)
  extend(bookshelf, config)
}

module.exports = plugin
