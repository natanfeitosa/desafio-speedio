import { isEmpty } from 'lodash'

import types from './mutations-types'
import { getFilters } from '../services'

import { delKeys } from '../utils'

export default {
  init_filters({ commit, state }) {
    if (isEmpty(state.filters_list)) {
      const _f = getFilters()
      commit(types.FILTERS_LIST, _f)
    }
  },
  add_filter({ commit, getters }, payload) {
    if (getters.markeds_count === 20) {
      console.log(getters.mardes)
      throw new Error('delete markeds before')
    }

    let _m = getters.markeds
    _m.push(delKeys(payload, ['score', 'checked']))

    commit(types.MARKED_FILTERS, _m)
  },
  remove_filter({ commit, getters }, payload) {
    let _m = getters.markeds

    console.log(payload)

    commit(
      types.MARKED_FILTERS,
      _m.filter((i) => !(i.value === payload.value)),
    )
  },
  handler_marked({ dispatch }, payload) {
    // console.log(payload)
    // let _c = payload.checked,
    //   _payload = cloneObj(payload)

    // _payload = delKeys(cloneObj(payload), ['checked', 'score'])

    // console.log({ _c, _payload })

    if (payload.checked) {
      dispatch('add_filter', payload)
    } else {
      dispatch('remove_filter', payload)
    }
  },
}
