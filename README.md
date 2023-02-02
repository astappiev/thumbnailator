# Thumbnailator - A file preview generator

Will generate a file preview (jpg, png or webp) of about 450 different document formats, with minimum codebase.

## Installation

**Thumbnailator** depends on multiple programs which it uses to operate.

First, you have to install them using your system package manager, e.g.:

```bash
sudo apt install libreoffice ffmpeg graphicsmagick
```

To install thumbnailator using npm:

```
npm install thumbnailator
```

## Usage

```javascript
import thumbnailator from 'thumbnailator';

await thumbnailator('file.docx', 'preview.jpg', {thumbnail: true});
```

You can set more options for the preview generation. All available options are:

| Option       | Description                                                                                                                                                                 | Value                       | Default     |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|-------------|
| width        | The target image width                                                                                                                                                      | number (in pixels)          | -           |
| height       | The target image height                                                                                                                                                     | number (in pixels)          | -           |
| scale        | The target image scale factor in percentage (mutually exclusive with width and height)                                                                                      | number (in pixels)          | -           |
| crop         | If set to `true` the result image will be of exact size given, cropped to center                                                                                            | boolean                     | false       |
| ignoreAspect | If set to `true` will ignore the aspect ratio of original image                                                                                                             | boolean                     | false       |
| oversize     | If set to `true` will use width and height given as minimum values (with aspect ratio preserved)                                                                            | boolean                     | false       |
| shrink       | If set to `true` will shrink the image if it is larger than the target size                                                                                                 | boolean                     | false       |
| enlarge      | If set to `true` enlarge the image if it is smaller than the target size                                                                                                    | boolean                     | false       |
| thumbnail    | Resizes the image as quickly as possible, with more concern for speed rather the image quality. <br/>Regardless, resulting image quality should be acceptable for many uses | boolean                     | false       |
| quality      | For the JPEG and MPEG image formats only. <br/>Where 0 is the lowest image quality and highest compression and 100 is the best quality but least effective compression      | number (0-100)              | 75, normal  |
| density      | If the file format supports it, may be used to update the image resolution                                                                                                  | number (DPI)                | 72          |
| background   | The background color                                                                                                                                                        | string (color hash or rgba) | transparent |

## Document Formats

## TODO:
- [ ] Smart crop
- [ ] Compress images, e.g. with https://github.com/Lymphatus/caesium-clt
