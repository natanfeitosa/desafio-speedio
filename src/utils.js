import _ from 'lodash'

/**
 * @description função que achata array, pegando subarrays e transformando em um array só com o array pai
 *
 * @param { Array } arr
 * @return { Array }
 */
export const flat = (arr) =>
  arr.reduce(
    (acc, val) => (_.isArray(val) ? acc.concat(flat(val)) : acc.concat(val)),
    [],
  )

/**
 * @description Testa dois objetos, se são iguais.
 *
 * @param { Object } obj1
 * @param { Object } obj2
 */
export const compareObjects = (obj1, obj2) => {
  const o1 = Object.keys(obj1).length,
    o2 = Object.keys(obj2).length

  if (o1 === o2) {
    return _.isEqual(obj1, obj2)
  }

  const mM = o1 > o2 ? [obj2, obj1] : [obj1, obj2]

  /**@type { Array } */
  const _k = keysInObject(mM[1], Object.keys(mM[0]))

  const l = _k.filter((i) => mM[1][i] === mM[0][i]).length

  return l === Object.keys(mM[0]).length
}

/**
 * @description Função que testa se determinado objeto está em um array de objetos.
 *
 * @param { Object[] } arr
 * @param { Object } obj
 */
export const arrayIncludeObject = (arr, obj) =>
  arr.filter((o) => compareObjects(o, obj)).length > 0

/**
 *
 * @param { Object | Array } o
 * @param { Object | Array | String } k
 * @return { String[] | String }
 */
export const keysInObject = (o, k) =>
  _.isArray(o)
    ? o.map((obj) => keysInObject(obj, k))
    : _.isArray(k)
    ? k.filter((key) => _.isObject(o) && !!keysInObject(o, key))
    : _.isObject(k)
    ? Object.keys(k).filter(
        (b) =>
          o[b] &&
          (_.isArray(k[b])
            ? _.includes(k[b], o[b])
            : compareObjects(k[b], o[b])),
      )
    : o.hasOwnProperty(k) && k

// console.log(keysInObject([{ a: 1, b: 2, c: 3, d: 4 }], ['a']))

/**
 * @description Função que faz deep clone de array/objeto
 *
 * @param { Object | Array } original
 */
export const cloneObj = (original) => _.cloneDeep(original)

/**
 * @param { Object } obj
 * @param { String[] } keys
 */
export const delKeys = (obj, keys) => {
  keys.forEach((k) => {
    delete obj[k]
  })

  return obj
}

/**
 * @description função que faz scrap em array de objetos retornando
 *   apenas os que tiverem keys key/value key/values definidos no
 *   segundo paramtro, e/ou excuindo keys definidas no terceiro
 *
 * @param { Object[] } objs
 * @param { Object.<string, string> | Object.<string, string[]> | Array } obj
 * @param { String[] } del_keys
 */
export const scrapObj = (objs, obj, del_keys = []) => {
  return (_.isArray(objs) ? objs : [objs]).filter((a) => {
    !_.isEmpty(del_keys) && delKeys(a, keysInObject(a, del_keys))

    return !!obj && !_.isEmpty(keysInObject(a, obj))
  })
}

// console.log(...scrapObj({a:1,b:2,c:3}, {a: 1}, ['c']))

/**
 * @type GeneratorFunction
 * @param { Array } file_handler
 * @param { Number } block_size
 * @default block_size=100
 */
export function* read_large_file(file_handler = [], block_size = 100) {
  let block = []
  for (let line of file_handler) {
    block.push(line)
    if (block.length === block_size) {
      yield block
      block = []
    }
  }

  if (block) yield block
}

export const fs = (file) => {
  /**
   * @private
   */
  const events = { line: [], start: [], end: [] }

  /**
   * @private
   */
  let running = true

  /**
   *
   * @public
   * @param { String } event
   * @param { Function } callback
   */
  const on = (event, callback) => {
    if (!Object.keys(events).includes(event)) {
      throw new ErrorEvent('event type not supported')
    }

    events[event].push(callback)
  }

  const exit = () => {
    running = false
  }

  const run = () => {
    events.start.forEach((i) => i())

    const _handler = read_large_file(file)
    let line = _handler.next()

    while (!line.done && running) {
      const _i = line.value
      events.line.map((fn) => fn(_i))
      line = _handler.next()
    }

    events.end.map((i) => i())
  }

  return { on, run, exit }
}

export class TextSearch {
  constructor(t) {
    this.t = t
  }

  normalize(text) {
    return _.deburr(text)
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim()
  }

  tokenize(text) {
    return (
      this.normalize(_.escapeRegExp(text)).match(
        new RegExp('[\\p{L}\\d]+', 'gium'),
      ) || []
    )
  }

  toSeachable(k) {
    const mem = _.memoize((
      /**@type {Array}*/ els,
      /**@type {String[]} */ skeys,
    ) => {
      const arraySintaxe = /\[(.*)]/

      return els
        .map((el) =>
          skeys
            .map((sk) => {
              const _arraySintaxe = _.get(arraySintaxe.exec(sk), '1')

              const val = _.get(el, sk.replace(arraySintaxe, ''))

              if (
                !_arraySintaxe &&
                (val === null || val === undefined || typeof val === 'function')
              ) {
                return ''
              }

              if (_arraySintaxe) {
                return val.map((x) => _.get(x, _arraySintaxe))
              }

              if (_.isArray(val) || _.isObject(val)) {
                return JSON.stringify(val)
              }

              return val + ' '
            })
            .reduce((a, b) => a + b, ''),
        )
        .map((x) => this.normalize(x))
    })

    return mem(this.t, k)
  }

  getScore(matches, searchWords, text) {
    if (!matches) {
      return 0
    }
    //     escapeStringRegExp.matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
    // function escapeStringRegExp(str) {
    //     return str.replace(escapeStringRegExp.matchOperatorsRe, '\\$&');
    // }

    const ss = text.replace(new RegExp('[^\\p{L}\\d]+', 'gium'), '')

    const remaing = searchWords
      .sort((a, b) => b.length - a.length)
      .reduce(
        (remainingText, searchWord) =>
          remainingText.replace(new RegExp(searchWord, 'gm'), ''),
        ss,
      )
    return _.round(1 - remaing.length / ss.length, 4)
  }

  search(text, keys, max = 20) {
    let textWords = this.tokenize(text)
    let searchable = this.toSeachable(keys)

    /* console.log(textWords) */

    let founds = searchable
      .map((v, i) => {
        if (
          !!this.normalize(v).match(new RegExp(this.normalize(text), 'uimg'))
        ) {
          const matches =
            textWords.filter((word) => v.indexOf(word) > -1).length ===
            textWords.length

          const score = this.getScore(matches, textWords, v)
          return Object.assign(this.t[i], { score })
        }
      })
      .filter((i) => !(_.isUndefined(i) && _.isEmpty(i)))

    founds.length = founds.length > max ? max : founds.length

    return founds || []
  }
}
