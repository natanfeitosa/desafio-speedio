<template>
  <li class="menu-item">
    <label class="checkbox">
      <input
        type="checkbox"
        :value="filter.value"
        :checked="checked"
        @change="changed"
      />
      <span class="checkmark"></span>
    </label>
    <span class="title">
      <p>{{ filter.label }}</p>
      <p class="-o50">{{ filter.subline }}</p>
    </span>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { arrayIncludeObject, cloneObj } from '../utils'

export default {
  name: 'MenuItem',
  data: () => ({
    checked: false,
  }),
  computed: {
    ...mapGetters(['markeds']),
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        value: {
          type: String,
          default: '',
        },
        label: {
          type: String,
          default: '',
        },
        subline: {
          type: String,
          default: '',
        },
      }),
    }
  },
  methods: {
    ...mapActions(['handler_marked']),
    changed() {
      this.checked = !this.checked
      this.handler_marked({...cloneObj(this.filter) ,'checked': this.checked})
    },
    update() {
      this.checked = arrayIncludeObject(this.markeds, this.filter)
    },
  },
  created() {
    this.update()
  },
  updated() {
    this.update()
  },
  // watch: {
  //   filter(filter) {
  //     this.checked = arrayIncludeObject(this.markeds, filter)
  //   }
  // }
};
</script>

<style>
.menu-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 1.62em;
  margin: 1px;
  padding: 8px 14px;
  /* border-radius: inherit; */
  background-color: #fff;
}

.menu-item:hover {
  cursor: pointer;
  background-color: rgba(256,256,256,.8);
}

.menu-item:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.menu-item:last-child {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.menu-item:not(:first-child) {
  border-top: 2px solid rgba(0, 0, 0, 0.14);
}

.menu-item:not(:last-child) {
  border-bottom: 2px solid rgba(0, 0, 0, 0.14);
}

.checkbox {
  height: 20px;
  width: 20px;

  display: block;
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
  display: none;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #ccc;
  transition: 0.32s all;
  border-radius: 6px;
}

.checkmark::after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox:hover input ~ .checkmark {
  background-color: #b0b0b0;
}

.checkbox input:checked ~ .checkmark {
  background-color: #2196F3;
}

.checkbox input:checked ~ .checkmark::after {
  display: block;
}

.checkbox .checkmark::after {
  left: calc(50% - 5px);
  top: calc(50% - 9px);
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 4px 4px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.menu-item .title {
  font-weight: 600;
  padding: 2px 6px;

  flex: 1;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  /* justify-content: space-between; */
}

.menu-item .title * {
  margin: 0 8px 0 4px;
}

.menu-item .title .-o50 {
  font-size: 0.92em;
  opacity: 0.5;
}
</style>
