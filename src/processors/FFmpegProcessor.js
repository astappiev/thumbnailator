import {exec} from "../utils/utils.js";
import AbstractProcessor from "./AbstractProcessor.js";

export default class FFmpegProcessor extends AbstractProcessor {

    async process(input, output, options) {
        const ffmpegArgs = ['-y', '-i', input, '-vf', 'thumbnail', '-frames:v', '1', output];

        if (options.width > 0 && options.height > 0) {
            if (options.ignoreAspect) {
                // Width and height emphatically given, original aspect ratio ignored.
                ffmpegArgs.splice(4, 1, `thumbnail,scale=w=${options.width}:h=${options.height}`);
            } else if (options.thumbnail) {
                // 	Minimum values of width and height given, aspect ratio preserved.
                ffmpegArgs.splice(4, 1, `thumbnail,scale=w=${options.width}:h=${options.height}:force_original_aspect_ratio=increase`);
            } else {
                // Maximum values of height and width given, aspect ratio preserved.
                ffmpegArgs.splice(4, 1, `thumbnail,scale=w=${options.width}:h=${options.height}:force_original_aspect_ratio=decrease`);
            }

            if (options.crop) {
                // Cropping to the center of the image, so the result will be exactly of required size
                ffmpegArgs[4] += `,crop=${options.width}:${options.height}`;
            }
        } else if (options.height > 0) {
            // Height given, width automagically selected to preserve aspect ratio.
            ffmpegArgs.splice(4, 1, `thumbnail,scale=-1:${options.height}`);
        } else if (options.width > 0) {
            // Width given, height automagically selected to preserve aspect ratio.
            ffmpegArgs.splice(4, 1, `thumbnail,scale=${options.width}:-1`);
        }

        return exec('ffmpeg', ffmpegArgs);
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
