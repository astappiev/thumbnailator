import {exec} from "../utils/utils.js";
import AbstractProcessor from "./AbstractProcessor.js";

export default class FFmpegProcessor extends AbstractProcessor {

    async process(generate, input, output, options) {
        const ffmpegArgs = ['-y', '-i', input, '-vf', 'thumbnail', '-frames:v', '1', output];

        if (options.width > 0 && options.height > 0) {
            ffmpegArgs.splice(4, 1, `thumbnail,scale=${options.width}:${options.height}`);
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
