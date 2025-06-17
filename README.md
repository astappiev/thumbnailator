# Thumbnailator - A file preview generator

Thumbnailator generates image previews (JPG, PNG, or WebP) for approximately 450 different document formats with a minimal codebase.

## Installation

**Thumbnailator** relies on several external programs. You need to install these dependencies using your system's package manager.

For example, on a Debian-based system:
```bash
sudo apt install libreoffice ffmpeg graphicsmagick
```

Then, install Thumbnailator using npm:
```bash
npm install thumbnailator
```

## Usage

```javascript
import thumbnailator from 'thumbnailator';

await thumbnailator('file.docx', 'preview.jpg', {thumbnail: true});
```

You can customize the preview generation with various options.

## Options

| Option         | Description                                                                                                                      | Value                       | Default       |
|----------------|----------------------------------------------------------------------------------------------------------------------------------|-----------------------------|---------------|
| `width`        | The target image width.                                                                                                          | Number (in pixels)          | -             |
| `height`       | The target image height.                                                                                                         | Number (in pixels)          | -             |
| `scale`        | The target image scale factor in percentage. This option is mutually exclusive with `width` and `height`.                        | Number                      | -             |
| `crop`         | If set to `true`, the resulting image will be cropped to the exact dimensions specified, focusing on the center.                 | Boolean                     | `false`       |
| `ignoreAspect` | If set to `true`, the original image's aspect ratio will be disregarded.                                                         | Boolean                     | `false`       |
| `oversize`     | If set to `true`, the specified `width` and `height` will be treated as minimum values, preserving the aspect ratio.             | Boolean                     | `false`       |
| `shrink`       | If set to `true`, the image will be shrunk if it is larger than the target dimensions.                                           | Boolean                     | `false`       |
| `enlarge`      | If set to `true`, the image will be enlarged if it is smaller than the target dimensions.                                        | Boolean                     | `false`       |
| `thumbnail`    | Fast resize, prioritizing speed over image quality. <br/>The resulting image quality should still be acceptable for common uses. | Boolean                     | `false`       |
| `quality`      | Applies to JPEG and MPEG image formats only. <br/>0 = low quality/high compression, 100 = high quality/low compression.          | Number (0-100)              | `75`          |
| `density`      | If supported by the file format, this option can be used to update the image resolution.                                         | Number (DPI)                | `72`          |
| `background`   | The background color for the generated image.                                                                                    | String (color hash or RGBA) | `transparent` |

## Supported Document Formats

Thumbnailator supports a wide range of document formats by leveraging external tools like LibreOffice, FFmpeg, and GraphicsMagick.
The exact list of supported formats depends on the capabilities of these underlying programs installed on your system.
Generally, you can expect support for:

* **PDF Documents:** `.pdf` (via GraphicsMagick)
* **Office Documents:** `.docx`, `.xlsx`, `.pptx`, `.odt`, `.ods`, `.odp`, etc. (via LibreOffice)
* **Images:** `.jpg`, `.png`, `.gif`, `.bmp`, `.tiff`, `.webp`, etc. (via GraphicsMagick)
* **Videos:** `.mp4`, `.avi`, `.mov`, `.mkv`, etc. (previews generated from frames via FFmpeg)
* **Audio:** `.mp3`, `.ogg` (audio waveforms or cover images via FFmpeg)

For a comprehensive list, please refer to the documentation of the respective tools and the source code.

## TODO:
- [ ] Smart crop
- [ ] Compress images, e.g. with https://github.com/Lymphatus/caesium-clt
