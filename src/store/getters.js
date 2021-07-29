export default {
  markeds(state) {
    return state.marked_filters
  },
  markeds_count(_, getters) {
    return getters.markeds.length
  },
  filters(state) {
    return state.filters_list
  },
}
