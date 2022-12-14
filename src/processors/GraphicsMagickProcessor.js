import {exec} from "../utils/utils.js";
import AbstractProcessor from "./AbstractProcessor.js";

/**
 * A useful documentation for the options of ImageMagick (should also work for GraphicsMagick)
 * https://imagemagick.org/script/command-line-options.php#resize
 */
export default class GraphicsMagickProcessor extends AbstractProcessor {

    async process(input, output, options) {
        const convertArgs = ['convert', `${input}[0]`, output];

        if (options.width > 0 && options.height > 0) {
            if (options.keepAspect) {
                // Maximum values of height and width given, aspect ratio preserved.
                convertArgs.splice(2, 0, '-resize', `${options.width}x${options.height}`);
            } else if (options.thumbnail) {
                // 	Minimum values of width and height given, aspect ratio preserved.
                convertArgs.splice(2, 0, '-thumbnail', `${options.width}x${options.height}^`);
            } else {
                // Width and height emphatically given, original aspect ratio ignored.
                convertArgs.splice(2, 0, '-resize', `${options.width}x${options.height}!`);
            }

            if (options.crop) {
                // Cropping to the center of the image, so the result will be exactly of required size
                convertArgs.splice(4, 0, '-gravity', 'center', '-extent', `${options.width}x${options.height}`);
            }
        } else if (options.height > 0) {
            // Height given, width automagically selected to preserve aspect ratio.
            convertArgs.splice(2, 0, '-resize', 'x' + options.height);
        } else if (options.width > 0) {
            // Width given, height automagically selected to preserve aspect ratio.
            convertArgs.splice(2, 0, '-resize', String(options.width));
        }

        if (options.quality) {
            convertArgs.splice(2, 0, '-quality', String(options.quality));
        }
        if (options.density) {
            convertArgs.splice(2, 0, '-density', String(options.density));
        }
        if (options.background) {
            convertArgs.splice(2, 0, '-background', options.background);
            convertArgs.splice(2, 0, '-flatten');
        }

        return await exec('gm', convertArgs);
    }

    getSupportedMimeTypes() {
        return [
            "application/pdf",
            "application/x-ufraw",
            "image/vnd.rn-realpix",
            "image/bmp",
            "image/vnd.wap.wbmp",
            "image/x-ms-bmp",
            "image/x-MS-bmp",
            "image/cgm",
            "image/fax-g3",
            "image/gif",
            "image/ief",
            "image/jpeg",
            "image/webp",
            "image/vnd.microsoft.icon",
            "image/jp2",
            "image/x-dds",
            "image/x-xcursor",
            "image/x-pict",
            "image/x-adobe-dng",
            "image/x-canon-crw",
            "image/x-canon-cr2",
            "image/x-fuji-raf",
            "image/x-kodak-dcr",
            "image/x-kodak-k25",
            "image/x-kodak-kdc",
            "image/x-minolta-mrw",
            "image/x-nikon-nef",
            "image/x-olympus-orf",
            "image/x-panasonic-raw",
            "image/x-pentax-pef",
            "image/x-sigma-x3f",
            "image/x-sony-srf",
            "image/x-sony-sr2",
            "image/x-sony-arw",
            "image/png",
            "image/rle",
            "image/svg+xml",
            "image/svg+xml-compressed",
            "image/tif",
            "image/tiff",
            "image/vnd.dwg",
            "image/vnd.dxf",
            "image/x-3ds",
            "image/x-applix-graphics",
            "image/x-bzeps",
            "image/x-cmu-raster",
            "image/x-compressed-xcf",
            "image/x-dib",
            "image/vnd.djvu",
            "image/dpx",
            "image/x-eps",
            "image/x-fits",
            "image/x-fpx",
            "image/x-gzeps",
            "image/x-ico",
            "image/x-icon",
            "image/x-icns",
            "image/x-iff",
            "image/x-ilbm",
            "image/x-jng",
            "image/x-lwo",
            "image/x-lws",
            "image/x-macpaint",
            "image/x-msod",
            "image/x-niff",
            "image/x-pcx",
            "image/x-photo-cd",
            "image/x-portable-anymap",
            "image/x-portable-bitmap",
            "image/x-portable-graymap",
            "image/x-portable-pixmap",
            "image/x-psd",
            "image/x-rgb",
            "image/x-sgi",
            "image/x-sun-raster",
            "image/x-targa",
            "image/x-tga",
            "image/x-win-bitmap",
            "image/emf",
            "image/x-emf",
            "image/wmf",
            "image/x-wmf",
            "image/x-xbitmap",
            "image/x-xcf",
            "image/x-xfig",
            "image/x-xpixmap",
            "image/x-xwindowdump",
        ];
    }
}
