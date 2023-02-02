import {exec} from "../utils/utils.js";
import AbstractProcessor from "./AbstractProcessor.js";

/**
 * @param {ProcessorOptions} options
 * @returns {string}
 */
export function createImageGeometry(options) {
    if (options.scale) {
        return `${options.scale}%`;
    }

    let geometry = '';
    if (options.width > 0) {
        geometry += options.width;
    }
    geometry += 'x';
    if (options.height > 0) {
        geometry += options.height;
    }

    if (options.width > 0 && options.height > 0) {
        if (options.ignoreAspect) {
            geometry += '!';
        } else if (options.oversize) {
            geometry += '^';
        }
    }

    if (options.shrink) {
        geometry += '>';
    } else if (options.enlarge) {
        geometry += '<';
    }

    return geometry;
}

/**
 * @param {string} input
 * @param {string} output
 * @param {ProcessorOptions} options
 * @returns {string[]}
 */
export function createArguments(input, output, options) {
    const args = ['convert'];

    if (options.density) {
        args.push('-density', String(options.density));
    }

    args.push(input + '[0]');

    if (options.quality) {
        args.push('-quality', String(options.quality));
    }

    if (options.background) {
        args.push('-background', options.background);
        args.push('-flatten');
    }

    if (options.width > 0 || options.height > 0 || options.scale > 0) {
        if (options.crop) {
            // Cropping to the center of the image, so the result will be exactly of required size
            args.push('-resize', createImageGeometry({...options, oversize: true}));
            args.push('-gravity', 'center', '-extent', createImageGeometry(options));
        } else if (options.thumbnail) {
            args.push('-thumbnail', createImageGeometry(options));
        } else {
            args.push('-resize', createImageGeometry(options));
        }
    }

    args.push(output);
    return args;
}

/**
 * A useful documentation for the options of ImageMagick (should also work for GraphicsMagick)
 * https://imagemagick.org/script/command-line-options.php#resize
 */
export default class GraphicsMagickProcessor extends AbstractProcessor {

    async process(input, output, options) {
        return await exec('gm', createArguments(input, output, options));
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
