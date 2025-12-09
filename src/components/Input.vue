<template>
  <div class="input">
    <div class="input_left">
      <input
        :type="type"
        class="base_input input_wide"
        :class="classes"
        :readonly="readonly"
        :id="id"
        v-model="localValue"
        :placeholder="placeholder"
      >
      <label :for="id">{{ placeholder }}</label>
    </div>
    <div class="actions" v-show="shouldShow">
      <div class="clear" @click="clearInput">
        <FAI icon="fa-solid fa-xmark" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Input',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Введите текст',
    },
    type: {
      type: String,
      required: true,
    },
    classes: {
      type: String,
      required: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default() {
        return `input-${Math.random().toString(36).substr(2, 9)}`;
      },
    },
  },
  emits: ['update:value'],
  computed: {
    localValue: {
      get() { return this.value; },
      set(val) { this.$emit('update:value', val); },
    },
    shouldShow() {
      return this.value !== '' && this.value !== null;
    },
  },
  methods: {
    clearInput() {
      this.$emit('update:value', null);
    },
  },
};
</script>
<style lang="scss">
.input{
  overflow: hidden;
  position: relative;
  height: 50px;
  width: 100%;
  user-select: none;
  min-width: 100px;
  box-sizing: border-box;
  padding: 5px 10px;
  padding-right: 0;
  border-radius: 12px;
  background: none;
  border: 1px solid rgba($color: $white, $alpha: .4);
  display: flex;
  &_left{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  label{
    position: absolute;
    left: 10px;
    top: calc(50% - 12px);
    font-size: 16px;
    transition: all .4s ease;
    color: rgba($color: $white, $alpha: .5);
  }
  input{
    height: 30px;
    margin-top: 5px;
    font-size: 16px;
    &:focus{
      outline: none;
      ~ label {
        top: 4px;
        font-size: 11px;
        color: rgba($color: $white, $alpha: .8);
      }
    }
    &:not(:placeholder-shown) {
      ~ label{
        top: 4px;
        font-size: 11px;
        color: rgba($color: $white, $alpha: .8);
      }
    }
    &::placeholder{
      visibility: hidden;
    }
  }
  .actions{
    min-width: 50px;
    border-left: 1px solid rgba($color: $white, $alpha: .4);
    display: flex;
    align-items: center;
    justify-content: center;
    .clear{
      border-radius: 50%;
      border: 1px solid rgba($color: $white, $alpha: .4);
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
}
</style>
