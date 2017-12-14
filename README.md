# bookshelf-ez-fetch
[![npm version](https://badge.fury.io/js/bookshelf-ez-fetch.svg)](https://badge.fury.io/js/bookshelf-ez-fetch)
#### Convenient fetching methods which allow for compact filtering, relation selection and error handling.

## Install
```
npm install --save bookshelf-ez-fetch
```

Add the plugin to bookshelf:

```
const ezFetch = require('bookshelf-ez-fetch')
bookshelf.plugin(ezFetch())
```

## Usage

#### Model.ezFetch(filters, subfields, columns, noNotFoundHandling)

#### Model.ezFetchAll(filters, subfields, columns)

**All parameters are optional.**

##### filters

An object containing attributes for filtering.
Special filter keys can also be used for different comparison operators:

###### column_name-after

Can be used instead of `.where('column_name', '>', value)`

###### column_name-before

Can be used instead of `.where('column_name', '<', value)`

###### column_name-min

Can be used instead of `.where('column_name', '>=', value)`

###### column_name-max

Can be used instead of `.where('column_name', '<=', value)`

##### subfields

Object or array containing relational models.

If it is an object, the value of an entry can be true to fetch all columns of the relation.
The value of the entry can also be an array, which specifies which columns to fetch.

##### columns

Array of columns to fetch from model

##### noNotFoundHandling

Set this to true to prevent calling any "not found" handlers defined in the model or plugin (see below).

## Example

```
ModelA.ezFetchAll({
    id-after: 5,
    name: 'Test'
  }, {
    cars: true,
    planes: ['id', 'model_a_id', 'name']
  },
  ['id', 'name'])
```

## Error handling aka "not found" handling

An optional "not found" handler can be added to the model, which is used to throw errors if  `.ezFetch()` cannot find data.

Example:

```
const ModelA = bookshelf.Model.extend({
  tableName: 'model_a',
  notFoundHandler: function() {
    throw new Error('ModelA not found')
  }
})
```

Optional fallback handler can also be specified in the plugin function parameter.

```
bookshelf.plugin(ezFetchPlugin({
  defaultNotFoundHandler: function() {
    throw new Error('Model not found')
  }
}))
```
