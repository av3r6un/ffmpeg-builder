# ffmpeg-builder

Ffmpeg-builder is a Vue.js-based web tool that helps you generate FFmpeg commands to convert multiple streams into a single video file. It supports multiple video/audio streams, subtitles, metadata, and RTSP streams accessible via HTTP headers.

## Features

- Convert multiple video and audio streams into a single output file.
- Support for subtitles (`.vtt`, `.srt`) and metadata embedding.
- Handle M3U8 streams requiring custom HTTP headers.
- Flexible FFmpeg command generation for advanced streaming workflows.
- Browser-friendly Vue.js interface for quick configuration.

## Installation

```bash
git clone https://github.com/av3r6un/ffmpeg-builder.git
cd ffmpeg-builder
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## Usage
1. Open the web interface (http://localhost:3000) in your browser.
2. Add your video/audio streams or M3U8 links.
3. Configure subtitles, metadata, and output format.
4. The app generates the corresponding FFmpeg command automatically.
5. Copy and run the FFmpeg command in your terminal to process the streams.


## License
This project is licensed under the MIT License. See [LICENSE](https://raw.githubusercontent.com/av3r6un/ffmpeg-builder/refs/heads/master/LICENSE) for details.


## Contributing
Contributions are welcome! Feel free to submit issues or pull requests to improve the project.
