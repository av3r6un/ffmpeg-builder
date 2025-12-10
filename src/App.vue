<template>
  <article class="app">
    <div class="app_logo">
      <img :src="`${path}favicon-128.png`" alt="logo" class="base_image"
        title="ffmpeg-builder"/>
    </div>
    <Settings :watcher="watcher" @changed="settingChange"/>
    <div class="app_body">
      <div class="app_section">
        <div class="app_section-title"><h3 class="base_title">Название</h3></div>
        <div class="app_section-body">
          <div class="app_section-row">
            <Input type="text" placeholder="Metatitle" v-model:value="form.metatitle" />
            <Input type="text" placeholder="Название файла" v-model:value="form.filename" />
          </div>
        </div>
      </div>
      <div class="app_section">
        <div class="app_section-title">
          <h3 class="base_title">Заголовки</h3>
          <div class="section_counter">{{ headersCounted }}</div>
        </div>
        <div class="app_section-slider" @click="showHeaderSection = !showHeaderSection">
          <FAI icon="fa-solid fa-chevron-down" :class="{shown: showHeaderSection}"/>
        </div>
        <div class="app_section-body" v-show="showHeaderSection">
          <div class="app_section-row" v-for="(h, idx) in form.headers" :key="idx">
            <Input placeholder="Заголовок" v-model:value="h.key" type="text" />
            <Input placeholder="Значение" v-model:value="h.value" type="text" />
            <div class="app_section-row__add" @click="addNewHeader" v-if="idx == 0">
              <FAI icon="fa-solid fa-plus"/>
            </div>
            <div class="app_section-row__add" @click="removeAddedHeader(idx)" v-else>
              <FAI icon="fa-solid fa-minus"/>
            </div>
          </div>
        </div>
      </div>
      <div class="app_section">
        <div class="app_section-title">
          <h3 class="base_title">Источники</h3>
          <div class="section_counter">{{ sourcesCounted }}</div>
        </div>
        <div class="app_section-slider" @click="showSourcesSection = !showSourcesSection">
          <FAI icon="fa-solid fa-chevron-down" :class="{ shown: showSourcesSection}" />
        </div>
        <div class="app_section-body" v-show="showSourcesSection">
          <div class="app_section-row" v-for="(s, idx) in form.sources" :key="idx">
            <Input type="text" placeholder="Ссылка" v-model:value="s.url" />
            <Selection :options="sourceTypes" nested v-model:selected="s.source_type"
              placeholder="Выберите источник"/>
            <Selection :options="languages.all" nested v-model:selected="s.language"
              placeholder="Выберите язык" rType="object"/>
            <Checkbox :checked="s.apply_headers" @change:value="(n) => toggleApplyHeaders(idx, n)"
              label="Заголовки" small />
            <div class="app_section-row__add" @click="addNewSource"  v-if="idx == 0">
              <FAI icon="fa-solid fa-plus" />
            </div>
            <div class="app_section-row__add" @click="removeAddedSource(idx)" v-else>
              <FAI icon="fa-solid fa-minus" />
            </div>
          </div>
        </div>
      </div>
      <div class="app_section">
        <div class="app_section-title"><h3 class="base_title">Кодеки</h3></div>
        <div class="app_section-body">
          <div class="app_section-row" v-for="(c, idx) in form.codecs" :key="idx">
            <Selection :options="codecsTypes" placeholder="Выберите тип" nested
              v-model:selected="c.type"/>
            <Selection :options="filteredCodecs(c?.type)" placeholder="Выберите кодек"
              v-model:selected="c.value"/>
            <div class="app_section-row__add" @click="addNewCodec"  v-if="idx == 0">
              <FAI icon="fa-solid fa-plus" />
            </div>
            <div class="app_section-row__add" @click="removeAddedCodec(idx)" v-else>
              <FAI icon="fa-solid fa-minus" />
            </div>
          </div>
        </div>
      </div>
      <div class="app_section">
        <div class="app_section-title">
          <h3 class="base_title">Аргументы</h3>
        </div>
        <div class="app_section-body">
          <div class="app_section-row" v-for="(a, idx) in form.global_args" :key="idx">
            <Selection :options="sortedArgs" placeholder="Выберите аргумент" nested
              v-model:selected="a.arg" rType="object" />
            <Input type="text" placeholder="Значение" v-model:value="a.value"
              v-if="a.arg?.type === 'arged'" />
            <div class="app_section-row__add" @click="addNewArg"  v-if="idx == 0">
              <FAI icon="fa-solid fa-plus" />
            </div>
            <div class="app_section-row__add" @click="removeAddedArg(idx)" v-else>
              <FAI icon="fa-solid fa-minus" />
            </div>
          </div>
        </div>
      </div>
      <div class="app_section" v-show="command">
        <div class="app_section-title">
          <h3 class="base_title">Команда</h3>
          <div class="section_counter clickable" @click="toClipboard(command)">
            <FAI icon="fa-regular fa-copy" />
          </div>
        </div>
        <div class="app_section-slider" @click="showFullCommand = !showFullCommand">
          <FAI icon="fa-solid fa-chevron-down" :class="{shown: showFullCommand}"/>
        </div>
        <div class="app_section-body command" v-show="showFullCommand">
          <p class="command">{{ command }}</p>
        </div>
      </div>
      <div class="app_section">
        <button type="button" class="btn btn_submit"
          @click=showCommand>Показать команду</button>
      </div>
    </div>
  </article>
</template>

<script>
import Input from './components/Input.vue';
import Selection from './components/Selection.vue';
import FFmpegService from './services/ffmpeg.service';
import Watcher from './services/watcher.service';
import Settings from './components/Settings.vue';
import Checkbox from './components/CheckBox.vue';

export default {
  name: 'App',
  components: {
    Input, Selection, Settings, Checkbox,
  },
  data() {
    return {
      fs: new FFmpegService(),
      watcher: new Watcher(),
      showHeaderSection: true,
      showSourcesSection: true,
      showFullCommand: false,
      sourceTypes: [
        { video: 'Видео' },
        { audio: 'Аудио' },
        { subtitles: 'Субтитры' },
        { combined: 'Видео + Аудио' },
      ],
      languages: {
        all: [
          { rus: 'Русский' },
          { eng: 'English' },
          { none: 'Отключен' },
        ],
      },
      codecs: {
        video: ['copy', 'libx264', 'libx265', 'hevc_nvenc'],
        audio: ['copy', 'aac', 'libmp3lame'],
        subtitles: ['copy', 'mov_text', 'srt'],
      },
      globalArgs: [
        { arg: 'hide_banner', text: '-hide_banner', type: 'noarg' },
        { arg: 'benchmark', text: '-benchmark', type: 'noarg' },
        { arg: 'benchmark_all', text: '-benchmark_all', type: 'noarg' },
        { arg: 'y', text: '-y', type: 'noarg' },
        { arg: 'n', text: '-n', type: 'noarg' },
        { arg: 'nostats', text: '-nostats', type: 'noarg' },
        { arg: 'stdin', text: '-stdin', type: 'noarg' },
        { arg: 'nostdin', text: '-nostdin', type: 'noarg' },
        { arg: 'loglevel', text: '-loglevel <level>', type: 'arged' },
        { arg: 'cpuflags', text: '-cpuflags <flags>', type: 'arged' },
        { arg: 'max_alloc', text: '-max_alloc <bytes>', type: 'arged' },
        { arg: 'dumpsub', text: '-dumpsub <file>', type: 'arged' },
        { arg: 'dump_attachement', text: '-dump_attachment <file>', type: 'arged' },
        { arg: 'threads', text: '-threads <count>', type: 'arged' },
        { arg: 'thread_queue_size', text: '-thread_queue_size <size>', type: 'arged' },
        { arg: 'pix_fmt', text: '-pix_fmt <format>', type: 'arged' },
        { arg: 'colorspace', text: '-colorspace <type>', type: 'arged' },
        { arg: 'color_range', text: '-color_range <range>', type: 'arged' },
        { arg: 'sws_flags', text: '-sws_flags <flags>', type: 'arged' },
        { arg: 'timelimit', text: '-timelimit <seconds>', type: 'arged' },
        { arg: 'progress', text: '-progress <url>', type: 'arged' },
        { arg: 'f', text: '-f <format>', type: 'arged' },
      ],
      form: {
        headers: [{
          key: null,
          value: null,
        }],
        sources: [{
          source_type: null,
          language: null,
          apply_headers: false,
          url: null,
        }],
        codecs: [{
          type: null,
          value: null,
        }],
        global_args: [{
          arg: null,
          value: null,
        }],
        metatitle: null,
        filename: null,
      },
      command: null,
    };
  },
  methods: {
    addNewHeader() {
      this.form.headers.push({ key: null, value: null });
    },
    removeAddedHeader(idx) {
      this.form.headers.splice(idx, 1);
    },
    addNewSource() {
      this.form.sources.push({
        source_type: null, language: null, url: null, apply_headers: false,
      });
    },
    removeAddedSource(idx) {
      this.form.sources.splice(idx, 1);
    },
    addNewCodec() {
      this.form.codecs.push({ type: null, value: null });
    },
    removeAddedCodec(idx) {
      this.form.codecs.splice(idx, 1);
    },
    addNewArg() {
      this.form.global_args.push({ type: null, value: null });
    },
    removeAddedArg(idx) {
      this.form.global_args.splice(idx, 1);
    },
    filteredCodecs(type) {
      return type !== null ? this.codecs[type] : new Set(Object.values(this.codecs).flat());
    },
    showCommand() {
      this.command = this.fs.build(this.form);
    },
    toClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
    },
    toggleApplyHeaders(idx, value) {
      this.form.sources[idx].apply_headers = value;
    },
    settingChange(name, value) {
      if (name === 'usePowershell') {
        this.form.shell = value ? 'powershell' : 'cmd';
      }
    },
  },
  computed: {
    sourcesCounted() {
      const n = this.form.sources.flatMap((s) => Object.values(s).some((v) => v != null)).length;
      return n > 1 ? n : '';
    },
    headersCounted() {
      const n = this.form.headers.flatMap((s) => Object.values(s).some((v) => v != null)).length;
      return n > 1 ? n : '';
    },
    sortedArgs() {
      return [...this.globalArgs].sort((a, b) => a.arg.localeCompare(b.arg));
    },
    codecsTypes() {
      return this.sourceTypes.filter((v) => Object.keys(v)[0] !== 'combined');
    },
    path() {
      return process.env.ASSET_PATH;
    },
  },
  watch: {
    form: {
      deep: true,
      handler(val) {
        this.watcher.handleFormChange(val);
      },
    },
  },
  mounted() {
    this.form.shell = this.$store.getters.usePowerShell ? 'powershell' : 'cmd';
  },
};
</script>

<style lang="scss">
#app{
  max-width: 1440px;
  width: 95%;
  margin: 0 auto;
}
.app{
  padding-bottom: 60px;
  &_logo{
    padding: 20px 0 10px 0;
    max-width: 128px;
    margin: 0 auto;
  }
  &_title{
    text-align: center;
  }
  &_section{
    position: relative;
    &:last-child{
      margin-top: 15px;
    }
    &-body{
      &.command{
        border-radius: 24px;
        border: 1px solid rgba($color: $white, $alpha: .4);
        padding: 26px 20px;
        .command{
          white-space: pre-wrap;
          word-break: break-all;
          user-select: none;
          font-size: 14px;
        }
      }
    }
    &-title{
      display: flex;
      align-items: center;
      gap: 10px;
      .section_counter{
        color: rgba($color: $white, $alpha: .4);
        font-size: 18px;
      }
    }
    &-slider{
      position: absolute;
      height: 26px;
      right: 10px;
      top: 22px;
      cursor: pointer;
      .fa-chevron-down{
        transition: all .4s ease;
        &.shown{
          transform: rotateX(180deg);
        }
      }
    }
    &-row{
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      &__add{
        min-width: 50px;
        height: 50px;
        border: 1px solid rgba($color: $white, $alpha: .4);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
  }
}
</style>
