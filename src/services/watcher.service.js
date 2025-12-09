class Watcher {
  active = false;

  linkPatterns = [
    { type: 'subtitles', regex: /\.vtt$/i },
    { type: 'audio', regex: /a\d+\.m3u8$/i },
    { type: 'video', regex: /v\d+\.m3u8$/i },
    { type: 'combined', regex: /(manifest\.m3u8|\.mp4)$/i },
  ];

  msg = null;

  changeState(state) {
    this.active = state;
  }

  handleFormChange(val) {
    this.handleHeaderChange(val);
    this.handleSourceChange(val);
  }

  handleHeaderChange(val) {
    if (!this.active) return;
    const section = val.headers;
    section.forEach((item, idx) => {
      if (item.key !== null) {
        if (item.key.toLowerCase() === 'user-agent') {
          section[idx].value = navigator.userAgent;
        } else if (item.key.toLowerCase() === 'host') {
          const anyUrl = val?.sources.find((source) => source.url && source.url !== null);
          if (anyUrl?.url) section[idx].value = new URL(anyUrl.url).host;
        }
      }
    });
  }

  findType(urlString) {
    let url = null;
    try {
      url = new URL(urlString).pathname;
    } catch {
      url = urlString;
    }
    const filename = url.split('/').at(-1);
    if (!filename) return null;
    let tp = null;
    this.linkPatterns.forEach(({ type, regex }) => {
      if (regex.test(url)) tp = type;
      return tp;
    });
    return tp;
  }

  handleSourceChange(val) {
    if (!this.active) return;
    const section = val.sources;
    section.forEach((item, idx) => {
      if (item.url !== null) {
        const st = this.findType(item.url);
        section[idx].source_type = st;
      } else {
        section[idx].source_type = null;
      }
    });
  }
}

export default Watcher;
