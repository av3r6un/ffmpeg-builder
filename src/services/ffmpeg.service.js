class FFmpegService {
  msg = null;

  buildHeaders(headers = []) {
    let string = '';
    headers.forEach((h) => {
      if (h.key !== null && h.value !== null) {
        string += (`${h.key}: ${h.value}\`r\`n`);
      }
    });
    this.msg = '';
    return headers.length > 1 ? ` -headers "${string}"` : '';
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

  buildSources(args = []) {
    if (args.length < 1 && (Object.values(args)[0] === null || Object.keys(args)[0] === 0)) return '';
    const sources = [];
    args.forEach((s) => {
      if (s.url) sources.push(`-i ${s.url}`);
    });
    this.msg = '';
    return sources;
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

  buildMeta(title, sources) {
    const meta = [];
    if (title) meta.push(`-metadata title=\\"${title}\\"`);
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
    if (args.length < 1 && (Object.values(args)[0] === null || Object.keys(args)[0] === 0)) return '';
    const maps = [];
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
    console.log(args);
    const headers = this.buildHeaders(args.headers);
    const sources = this.buildSources(args.sources);
    const globalArgs = this.buildArgs(args.global_args);
    const codecs = this.buildCodecs(args.codecs);
    const meta = this.buildMeta(args.metatitle, args.sources);
    const maps = this.buildMaps(args.sources);
    console.log(headers, globalArgs, sources, codecs, meta);

    finalString += ` ${globalArgs}`;
    finalString += sources.map((s) => `${headers} ${s}`).join('');
    finalString += ` ${maps}`;
    finalString += ` ${codecs}`;
    finalString += ` ${meta}`;
    finalString += ` ${args.filename}`;

    console.log(finalString);

    return `powershell -Command "${finalString}"`;
  }
}

export default FFmpegService;
