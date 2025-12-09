<template>
  <article class="settings">
    <div class="settings_title">
      <h3 class="base_title">Настройки</h3>
    </div>
    <div class="settings_body">
      <div class="settings_row">
        <Checkbox label="Автоподстановка" :checked="$store.getters.autocomplete"
          @change:value="(n) => settingChange('changeAC', n)" />
      </div>
    </div>
  </article>
</template>
<script>
import Checkbox from './CheckBox.vue';

export default {
  name: 'Settings',
  components: { Checkbox },
  props: {
    watcher: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    watcherState: {
      get() { return this.watcher.active; },
      set(val) { this.watcher.changeState(val); },
    },
  },
  methods: {
    settingChange(setting, state) {
      this.$store.commit(setting, state);
      this.watcherState = state;
    },
  },
  mounted() {
    this.watcherState = this.$store.getters.autocomplete;
  },
};
</script>
<style lang="scss" scoped>

</style>
