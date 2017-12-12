const db = require('./db')
const shelves = require('./shelves')

const go = async () => {
  await db.init()

  let aModel = await shelves.TableA.ezFetchAll()
  console.log(aModel.toJSON())

  aModel = await shelves.TableA.ezFetch()
  console.log(aModel.toJSON())

  aModel = await shelves.TableA.ezFetch(null, null, ['id', 'test1'])
  console.log(aModel.toJSON())

  aModel = await shelves.TableA.ezFetch(null, ['tableBs'])
  console.log(aModel.toJSON())

  aModel = await shelves.TableA.where({}).ezFetchAll(null, ['tableBs'])
  console.log(aModel.toJSON())

  aModel = await shelves.TableA.ezFetch(null, {
    tableBs: ['id', 'table_a_id', 'test1']
  }, ['id', 'test1'])
  console.log(aModel.toJSON())

  let cModel = await shelves.TableC.ezFetchAll({id: 2})
  console.log(cModel.toJSON())

  cModel = await shelves.TableC.ezFetch({id: 2})
  console.log(cModel.toJSON())

  cModel = await shelves.TableC.ezFetchAll({'id-after': 2})
  console.log(cModel.toJSON())

  cModel = await shelves.TableC.ezFetchAll({'id-max': 3})
  console.log(cModel.toJSON())

  try {
    cModel = await shelves.TableC.ezFetch({id: 50})
  } catch (e) {
    console.log('Caught not found error!')
    console.log(e.message)
  }

  try {
    aModel = await shelves.TableA.ezFetch({id: 50})
  } catch (e) {
    console.log('Caught not found error!')
    console.log(e.message)
  }
}

go().then(() => {
  process.exit()
}, (err) => {
  console.error(err)
  process.exit(-1)
})
