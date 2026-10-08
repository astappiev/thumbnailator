#!/usr/bin/env node
import {parseArgs} from "util";
import thumbnailator from "./thumbnailator.js";

const USAGE = `Usage: thumbnailator [options] <input> <output>

Generates a preview of <input> and writes it to <output> (jpg, png or webp).

Options:
  -w, --width <px>          target image width
  -h, --height <px>         target image height
  -s, --scale <percent>     target image scale (mutually exclusive with width and height)
  -q, --quality <0-100>     JPEG/MPEG quality (default: 75)
  -d, --density <dpi>       image resolution, if the format supports it (default: 72)
  -b, --background <color>  background color (default: transparent)
  -p, --page <n>            page (or frame) of a multi-page document, starting at 0 (default: 0)
  -m, --mime-type <type>    mime type of <input>, used instead of its file extension
  -t, --timeout <ms>        time limit of each external command, 0 disables it (default: 120000)
      --crop                crop to the exact size given, centered
      --ignore-aspect       ignore the aspect ratio of the original image
      --oversize            treat width and height as minimum values
      --shrink              only shrink images larger than the target size
      --enlarge             only enlarge images smaller than the target size
      --thumbnail           fast resize, favoring speed over quality
      --help                show this help`;

const NUMBER_OPTIONS = ['width', 'height', 'scale', 'quality', 'density', 'page', 'timeout'];

/**
 * @param {string[]} args the command line arguments
 * @returns {{input: string, output: string, options: ProcessorOptions}|null} null if help was requested
 */
function parseCliArgs(args) {
    const {values, positionals} = parseArgs({
        args,
        allowPositionals: true,
        options: {
            width: {type: 'string', short: 'w'},
            height: {type: 'string', short: 'h'},
            scale: {type: 'string', short: 's'},
            quality: {type: 'string', short: 'q'},
            density: {type: 'string', short: 'd'},
            background: {type: 'string', short: 'b'},
            page: {type: 'string', short: 'p'},
            'mime-type': {type: 'string', short: 'm'},
            timeout: {type: 'string', short: 't'},
            crop: {type: 'boolean'},
            'ignore-aspect': {type: 'boolean'},
            oversize: {type: 'boolean'},
            shrink: {type: 'boolean'},
            enlarge: {type: 'boolean'},
            thumbnail: {type: 'boolean'},
            help: {type: 'boolean'},
        },
    });

    if (values.help) {
        return null;
    }
    if (positionals.length !== 2) {
        throw TypeError('Expected exactly two arguments: <input> <output>');
    }

    const {'ignore-aspect': ignoreAspect, 'mime-type': mimeType, help, ...options} = values;
    if (ignoreAspect) {
        options.ignoreAspect = true;
    }
    if (mimeType) {
        options.mimeType = mimeType;
    }
    for (const name of NUMBER_OPTIONS) {
        if (options[name] !== undefined) {
            const value = Number(options[name]);
            if (!Number.isFinite(value)) {
                throw TypeError(`Option --${name} must be a number, got: ${options[name]}`);
            }
            options[name] = value;
        }
    }

    const [input, output] = positionals;
    return {input, output, options};
}

/**
 * @returns {Promise<number>} the exit code
 */
async function main() {
    let parsed;
    try {
        parsed = parseCliArgs(process.argv.slice(2));
    } catch (error) {
        console.error(`thumbnailator: ${error.message}\n\n${USAGE}`);
        return 2;
    }

    if (!parsed) {
        console.log(USAGE);
        return 0;
    }

    try {
        await thumbnailator(parsed.input, parsed.output, parsed.options);
        return 0;
    } catch (error) {
        console.error(`thumbnailator: ${error.message}`);
        return 1;
    }
}

process.exitCode = await main();
