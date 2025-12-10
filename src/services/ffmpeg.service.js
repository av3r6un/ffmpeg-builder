class FFmpegService {
  msg = null;

  userAgent = navigator.userAgent;

  buildHeaders(headers = [], url = null, wrap = false) {
    let string = '';
    headers.forEach((h) => {
      if (h.key !== null && h.value !== null) {
        string += `${h.key}: ${h.value}\`r\`n`;
      }
    });
    string += `User-Agent: ${this.userAgent}\`r\`n`;
    let headerString = `-headers "${string}"`;
    if (url) string += `Host: ${new URL(url).host}\`r\`n`;
    if (wrap) headerString = `-headers \\"${string}\\"`;
    return headerString;
  }

  buildArgs(args = []) {
    const simpleArgs = [];
    if (args.length < 1 && Object.keys(args)[0] === 0) return '';
    args.forEach((a) => {
      if (a?.arg && a?.arg.arg !== null) {
        const val = a?.value ? ` ${a.value}` : '';
        simpleArgs.push(`-${a?.arg?.arg}${val}`);
      }
    });
    this.msg = '';
    return simpleArgs.join(' ');
  }

  buildSources(headers, sources, wrap) {
    const inputs = [];
    if (!Object.values(sources).some((s) => s?.url)) return '';
    sources.forEach((s) => {
      let headerString = '';
      if (s.apply_headers) {
        headerString = `${this.buildHeaders(headers, s.url, wrap)} `;
      }
      inputs.push(`${headerString}-i ${s.url}`);
    });
    return inputs.length > 1 ? inputs.join(' ') : '';
  }

  buildCodecs(args = []) {
    if (args.length < 1 && (Object.values(args)[0] === null || Object.keys(args)[0] === 0)) return '';
    const codecs = [];
    args.forEach((c) => {
      if (c.value) codecs.push(`-c:${c.type.charAt(0)} ${c.value}`);
    });
    this.msg = '';
    return codecs.length > 1 ? codecs.join(' ') : '';
  }

  buildMeta(title, sources, wrap) {
    const meta = [];
    const wrapped = wrap ? `\\"${title}\\"` : `"${title}"`;
    if (title) meta.push(`-metadata title=${wrapped}`);
    sources.forEach((s) => {
      Object.entries(s.language).forEach(([k, v]) => {
        if (k !== 'none') {
          if (s.source_type !== 'combined') {
            meta.push(`-metadata:s:${s.source_type.charAt(0)}:0 language=${k}`);
            meta.push(`-metadata:s:${s.source_type.charAt(0)}:0 title=${v}`);
          } else {
            meta.push(`-metadata:s:a:0 language=${k}`);
            meta.push(`-metadata:s:a:0 title=${v}`);
          }
        }
      });
    });
    this.msg = '';
    return meta.length > 1 ? meta.join(' ') : '';
  }

  buildMaps(args) {
    const maps = [];
    if (!Object.values(args).some((s) => s?.url)) return '';
    args.forEach((s, idx) => {
      if (s.source_type === 'combined') {
        maps.push(`-map ${idx}:v`);
        maps.push(`-map ${idx}:a`);
      } else {
        maps.push(`-map ${idx}:${s.source_type.charAt(0)}`);
      }
    });
    this.msg = '';
    return maps.length > 1 ? maps.join(' ') : '';
  }

  build(args) {
    let finalString = 'ffmpeg';
    const wrap = args?.shell === 'cmd';
    const sources = this.buildSources(args.headers, args.sources, wrap);
    const globalArgs = this.buildArgs(args.global_args);
    const codecs = this.buildCodecs(args.codecs);
    const meta = this.buildMeta(args.metatitle, args.sources);
    const maps = this.buildMaps(args.sources);

    finalString += ` ${globalArgs}`;
    finalString += ` ${sources}`;
    finalString += ` ${maps}`;
    finalString += ` ${codecs}`;
    finalString += ` ${meta}`;
    finalString += ` ${args.filename || ''}`;

    console.log(finalString.trim());

    return wrap ? `powershell -Command "${finalString}"` : finalString;
  }
}

export default FFmpegService;
