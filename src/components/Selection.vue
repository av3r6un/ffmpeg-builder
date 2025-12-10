<template>
  <div class="selection" :class="{ opened : opened, selected: selected }" @click="toggle">
    <div class="selection_options" v-show="opened">
      <div class="selection_option" v-for="(o, idx) in options" :key="idx">
        <div class="option" @click="select(o)" v-if="nested">{{ detectNestedVal(o) }}</div>
        <div class="option" @click="select(o)" v-else>{{ o }}</div>
      </div>
    </div>
    <div class="selection_default selected" v-if="selected">{{ localText }}</div>
    <div class="selection_default">{{ placeholder }}</div>
  </div>
</template>
<script>
export default {
  name: 'Selection',
  model: {
    prop: 'selected',
    event: 'update',
  },
  props: {
    selected: {
      required: false,
    },
    options: {
      type: [Array, Object],
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Выберите опцию',
    },
    nested: {
      type: Boolean,
      default: false,
    },
    rType: {
      type: String,
      default: 'string',
    },
  },
  emits: ['update:selected'],
  data() {
    return {
      opened: false,
      localText: null,
    };
  },
  computed: {
    localSelected: {
      get() { return this.selected; },
      set(val) { this.$emit('update:selected', val); },
    },
  },
  methods: {
    select(v) {
      if (v instanceof Object) {
        const val = v?.text ? v.text : Object.values(v)[0];
        this.localText = val;
        const r = this.rType === 'string' ? Object.keys(v)[0] : v;
        this.$emit('update:selected', r);
      } else {
        this.localText = v;
        this.$emit('update:selected', v);
      }
    },
    detectNestedVal(v) {
      if (v instanceof Object) {
        if (v.text) {
          return v.text;
        }
      }
      return Object.values(v)[0];
    },
    toggle() {
      this.opened = !this.opened;
    },
    reset() {
      this.localSelected = null;
    },
  },
  mounted() {
    this.options?.forEach((o) => {
      Object.keys(o).forEach((k) => {
        if (k === 'none') this.select(o);
      });
    });
  },
  watch: {
    selected(newVal) {
      if (newVal) {
        this.options?.forEach((o) => {
          Object.entries(o).forEach(([k, v]) => {
            if (newVal === k) this.localText = v;
          });
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.selection{
  user-select: none;
  height: 50px;
  min-width: 220px;
  transition: all .4s ease;
  color: $white;
  width: 100%;
  cursor: pointer;
  z-index: 0;
  position: relative;
  border-radius: 12px;
  padding: 5px 10px;
  background: $black;
  border: 1px solid rgba($color: $white, $alpha: .4);
  &.selected{
    .selection_default{
      position: absolute;
      top: -8px;
      font-size: 11px;
      width: calc(100% - 20px);
      height: calc(100% - 10px);
      color: rgba($color: $white, $alpha: .5);
      &.selected{
        top: 8px;
        font-size: 16px !important;
        color: $white;
      }
    }
  }
  &:after{
    position: absolute;
    content: '▼';
    width: 16px;
    height: 16px;
    top: calc(50% - 11px);
    right: 12px;
    color: rgba($color: $white, $alpha: .4);
    font-size: 16px;
    transition: all .4s ease;
    z-index: 1;
  }
  &.opened{
    z-index: 10;
    &:after{
      transform: rotateX(180deg);
      top: calc(50% - 3px);
    }
  }
  &_options{
    position: absolute;
    width: 100%;
    top: calc(100% + 3px);
    left: 0;
    padding: 5px 0;
    background: $black;
    border-radius: 12px;
    border: 1px solid rgba($color: $white, $alpha: .4);
    max-height: 130px;
    overflow-y: auto;
    z-index: 1;
    clip-path: inset( 0px 0px 0px 0px round 12px);
    &::-webkit-scrollbar{
      -webkit-appearance: none;
      width: 4px;
      background: rgba($color: $white, $alpha: .4);
      &-thumb{
        background: rgba($color: $white, $alpha: .8);
      }
    }
    .option{
      width: 100%;
      text-align: center;
      padding: 0 5px;
      font-size: 16px;
      cursor: pointer;
      &:hover{
        background: rgba($color: $white, $alpha: .3);
      }
    }
  }
  &_default{
    z-index: 1;
    display: flex;
    align-items: center;
    font-size: 16px;
    top: 0px;
    height: 100%;
    color: rgba($color: $white, $alpha: .5);
    transition: all .4s ease;
  }
}
</style>
