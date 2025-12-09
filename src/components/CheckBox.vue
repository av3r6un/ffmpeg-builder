<template>
  <div class="checkbox" @click="toggle" :class="{ labeled: label }">
    <div class="checkbox_checkbox"
      :class="{ checked: localCheck }">
      <input type="checkbox" class="checkbox_check inv_input"
        :checked="localCheck">
      <div class="checkbox_check"></div>
    </div>
    <label :for="id" class="checkbox_label" v-if="label">{{ label }}</label>
  </div>
</template>
<script>
export default {
  name: 'Checkbox',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      default() {
        return `input-${Math.random().toString(36).substr(2, 9)}`;
      },
    },
  },
  emits: ['change:value'],
  methods: {
    toggle() {
      this.localCheck = !this.localCheck;
    },
  },
  computed: {
    localCheck: {
      get() { return this.checked; },
      set(value) { this.$emit('change:value', value); },
    },
  },
};
</script>
<style lang="scss" scoped>
.checkbox{
  display: flex;
  align-items: center;
  gap: 8px;
  &_label{
    font-size: 16px;
    font-weight: normal;
    color: $white;
  }
  &_checkbox{
    height: 30px;
    width: 60px;
    border-radius: 50px;
    border: 1px solid rgba($color: $white, $alpha: .4);
    position: relative;
    cursor: pointer;
    transition: all .4s ease;
    &.checked{
      background: green;
      border-color: green;
      .checkbox_check{
        left: calc(100% - 29px);
      }
    }
  }
  &_check{
    position: absolute;
    left: 1px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    top: calc(50% - 14px);
    background: $white;
    border: .5px solid $white;
    transition: all .4s ease;
  }
}
</style>
