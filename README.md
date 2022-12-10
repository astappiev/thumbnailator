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

| Option     | Description                                                                                                                                                                     | Value               | Default    |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|------------|
| width      | The target image width                                                                                                                                                          | pixels              | *required  |
| height     | The target image height                                                                                                                                                         | pixels              | *required  |
| keepAspect | If set to `true` will keep the same aspect ratio what the input image had                                                                                                       | boolean             | false      |
| thumbnail  | Resizes the image as quickly as possible, with more concern for speed than resulting image quality. <br/>Regardless, resulting image quality should be acceptable for many uses | boolean             | false      |
| quality    | For the JPEG and MPEG image formats, quality is 0 (the lowest image quality and highest compression) to 100 (the best quality but least effective compression)                  | number, 0-100       | 75, normal |
| density    | If the file format supports it, may be used to update the image resolution                                                                                                      | dots per inch (DPI) | 72         |
| background | The background color                                                                                                                                                            | color hash or rgba  |            |

## TODO:
- [ ] Smart crop
- [ ] Compress images, e.g. with https://github.com/Lymphatus/caesium-clt
