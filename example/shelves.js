const db = require('./db')

const TableC = db.bookshelf.Model.extend({
  tableName: 'table_c',
  notFoundHandler: function() {
    throw new Error('TableC not found')
  }
})

const TableB = db.bookshelf.Model.extend({
  tableName: 'table_b',
})

const TableA = db.bookshelf.Model.extend({
  tableName: 'table_a',
  tableBs: function() {
    return this.hasMany(TableB)
  }
})

module.exports = {
  TableA,
  TableB,
  TableC
}
