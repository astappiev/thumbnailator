import {exec} from "../utils/utils.js";
import AbstractProcessor from "./AbstractProcessor.js";

/**
 * @param {string} input
 * @param {string} output
 * @param {ProcessorOptions} options
 * @returns {string[]}
 */
export function createArguments(input, output, options = {}) {
    const args = ['-y', '-i', input, '-vf', 'thumbnail', '-frames:v', '1', output];

    if (options.width > 0 && options.height > 0) {
        if (options.ignoreAspect) {
            // Width and height emphatically given, original aspect ratio ignored.
            args[4] = `thumbnail,scale=w=${options.width}:h=${options.height}`;
        } else if (options.oversize) {
            // 	Minimum values of width and height given, aspect ratio preserved.
            args[4] = `thumbnail,scale=w=${options.width}:h=${options.height}:force_original_aspect_ratio=increase`;
        } else {
            // Maximum values of height and width given, aspect ratio preserved.
            args[4] = `thumbnail,scale=w=${options.width}:h=${options.height}:force_original_aspect_ratio=decrease`;
        }

        if (options.crop) {
            // Cropping to the center of the image, so the result will be exactly of required size
            args[4] += `,crop=${options.width}:${options.height}`;
        }
    } else if (options.height > 0) {
        // Height given, width automagically selected to preserve aspect ratio.
        args[4] = `thumbnail,scale=-1:${options.height}`;
    } else if (options.width > 0) {
        // Width given, height automagically selected to preserve aspect ratio.
        args[4] = `thumbnail,scale=${options.width}:-1`;
    }

    return args;
}

export default class FFmpegProcessor extends AbstractProcessor {

    async process(input, output, options) {
        return exec('ffmpeg', createArguments(input, output, options));
    }

    getSupportedMimeTypes() {
        return [
            "application/x-videolan",
            "video/3gpp",
            "video/annodex",
            "video/dl",
            "video/dv",
            "video/fli",
            "video/gl",
            "video/mpeg",
            "video/mp2t",
            "video/mp4",
            "video/quicktime",
            "video/mp4v-es",
            "video/ogg",
            "video/parityfec",
            "video/pointer",
            "video/webm",
            "video/vnd.fvt",
            "video/vnd.motorola.video",
            "video/vnd.motorola.videop",
            "video/vnd.mpegurl",
            "video/vnd.mts",
            "video/vnd.nokia.interleaved-multimedia",
            "video/vnd.vivo",
            "video/x-flv",
            "video/x-la-asf",
            "video/x-mng",
            "video/x-ms-asf",
            "video/x-ms-wm",
            "video/x-ms-wmv",
            "video/x-ms-wmx",
            "video/x-ms-wvx",
            "video/x-msvideo",
            "video/x-sgi-movie",
            "video/x-matroska",
            "video/x-theora+ogg",
            "video/x-m4v",
        ];
    }
}
