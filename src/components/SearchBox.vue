<template>
  <div class="search-box">
    <input @input="change" v-model="textForSearch" type="text" placeholder="Digite aqui..." />
    <button @click="change">
      <svg
        aria-hidden="true"
        focusable="false"
        data-icon="search"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  data: () => ({
    textForSearch: '',
  }),
  methods: {
    change() {
      this.$emit('search', this.textForSearch.trim())
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.search-box {
  /* background-color: red; */
  border: inherit;
  border-radius: inherit;
  box-shadow: inherit;
  height: 40px;
  padding: 6px;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

input,
button {
  height: 100%;
  /* border-radius: inherit; */
  outline: none;
  border: none;
  background: inherit;
}

input {
  flex: 100%;
  font-size: 1.6rem;
  font-weight: 500;
  padding: 0.12em;
  margin: 0 8px 0 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
}

button {
  padding: inherit;
  cursor: pointer;
}

button svg {
  /* width: 18px; */
  height: calc(120% + 2px);
  margin-top: -2px;
  transition: 320ms all ease-in-out;
}

button:hover svg {
  transform: scale(1.2);
}
</style>
