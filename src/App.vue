<template>
  <div id="app">
    <SearchBox @search="search" />
    <div class="menu-wrapper">
      <ul class="menu">
        <MenuItem 
          v-for="(e, i) in filters"
          :key="i"
          :filter="e"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SearchBox from './components/SearchBox'
import MenuItem from './components/MenuItem'
import { TextSearch } from './utils';

export default {
  name: 'App',
  data: () => ({
    text: '',
    filters: []
  }),
  components: {
    SearchBox,
    MenuItem,
  },
  computed: {
    ...mapGetters({'all_filters': 'filters', 'markeds': 'markeds'}),
  },
  methods: {
    ...mapActions(['init_filters']),
    search(t) {
      this.text = t
      const ins = new TextSearch(this.all_filters)
      let founds = ins.search(t, ['tags', 'value', 'label'])
      this.filters = t !== '' ? founds : this.markeds || []
      // console.log(founds)
    }
  },
  mounted() {
    this.filters = this.markeds
    this.init_filters()
  },
  watch: {
    markeds() {
      this.filters = this.markeds
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

* {
  scrollbar-width: thin;
  scrollbar-color: transparent #909090;
}

*::-webkit-scrollbar {
  width: 10px;
  background-color: transparent;
}

*::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 99999px;
}

*::-webkit-scrollbar-thumb {
  background-color: #909090;
  border-radius: 99999px;
  margin: 4px 0;
}

*::-webkit-scrollbar-thumb:hover {
  background-color: #676767;
}

html,
body {
  height: 100%;
}

html {
  font-size: 62.5%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  line-height: 1.5;
  background-color: #efefef;

  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100vh; */
}

#app {
  width: min(98%, 400px);
  /* max-height: 90vh; */
  background-color: #fff;
  padding: 12px;
  box-shadow: 0px 0px 10px 4px rgba(210, 206, 206, 0.839);
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 20px;

  display: flex;
  flex-direction: column;
}

.menu-wrapper, .menu {
  border-radius: inherit;
  background-color: #cfcfcf;
}

.menu-wrapper {
  margin: 2px;
  border: 2px solid #cfcfcf;
  margin-top: 18px;
  overflow: hidden;
}

.menu {
  max-height: 72vh;
  overflow-y: auto;
  /* padding-right: 2px; */
}
</style>
