const ezFetchPlugin = require('../dist')

const knex = require('knex')({
  client: "sqlite3",
  connection: {
    filename: ':memory:'
  },
  useNullAsDefault: true,
})

const bookshelf = require('bookshelf')(knex);

bookshelf.plugin(ezFetchPlugin({
  defaultNotFoundHandler: function() {
    throw new Error('Model not found')
  }
}))

const init = async () => {
  await knex.schema.createTable('table_a', (table) => {
    table.increments()
    table.string('test1')
    table.string('test2')
  })
  await knex.schema.createTable('table_b', (table) => {
    table.increments()
    table.integer('table_a_id')
    table.string('test1')
    table.string('test2')
  })
  await knex.schema.createTable('table_c', (table) => {
    table.increments()
    table.string('name')
  })
  await knex('table_a').insert({test1: 'abc', test2: '123'})
  await knex('table_b').insert({table_a_id: 1, test1: '111', test2: '222'})
  for (let i = 0; i < 10; i++) {
    await knex('table_c').insert({name: 'Test ' + i})
  }
}

module.exports = {
  init,
  bookshelf
}
