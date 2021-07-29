import axios from 'axios'
import { fs, keysInObject, delKeys, scrapObj, flat } from './utils'

const db = require('./db.json')

/* eslint-disable no-unused-vars */
// constante para marcar partes da tipagem do JSON
const filtersType = {
  filters: [
    {
      id: 1,
      filters: [
        {
          id: 2,
          filterOptions: [
            {
              subline: '',
              label: '',
              value: '',
              type: '',
              queryField: '',
              tags: '',
            },
          ],
        },
      ],
    },
  ],
}

// const url = 'https://filters.dev.speedio.com.br/api/v3/filters.json'

const url = ''

export function getFilters() {
  // const res = await axios.get(url)
  let res = { data: filtersType }

  const _cache = {
    register: [],
    filters: [],
  }

  const wraper = (data, callback) => {
    const fstream = fs(data)

    fstream.on('line', (v) => {
      callback(v, fstream)
    })

    fstream.run()
  }

  wraper(db.filters, (/**@type { typeof filtersType.filters } */ v, f1) => {
    if (_cache.register.length === 1) {
      f1.exit()
    }

    v.map((o) => {
      if (!!keysInObject(o, { id: [1, 2] })) {
        _cache.register.push(o.id)

        _cache.filters.push(
          o.filters.map((i) => {
            const id = [1, 7, 21]

            return (
              !!keysInObject(i, { id }) &&
              scrapObj(i.filterOptions, ['label'], ['queryField', 'type'])
            )
          }),
        )
        // const f2 = fs(o['filters'])
        // f2.on('line')
      }
    })
  })
  return flat(_cache.filters)
}
