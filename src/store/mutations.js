import types from './mutations-types'

export default {
  [types.MARKED_FILTERS](state, payload) {
    state.marked_filters = payload
  },
  [types.FILTERS_LIST](state, payload) {
    state.filters_list = payload
  },
}
