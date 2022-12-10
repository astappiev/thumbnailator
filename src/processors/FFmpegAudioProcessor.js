import {exec} from "../utils/utils.js";
import AbstractProcessor from "./AbstractProcessor.js";

export default class FFmpegAudioProcessor extends AbstractProcessor {

    async process(input, output, options) {
        let size = '640x320';
        if (options.width > 0 && options.height > 0) {
            size = `${options.width}x${options.height}`;
        }

        const ffmpegArgs = ['-y', '-i', input, '-f', 'lavfi',
            '-i', `color=c=white:s=${size}`,
            '-filter_complex', `[0:a]showwavespic=s=${size}:colors=black[fg];[1:v][fg]overlay=format=auto`,
            '-frames:v', '1', output];

        return exec('ffmpeg', ffmpegArgs);
    }

    getSupportedMimeTypes() {
        return [
            "audio/mpeg",
        ];
    }
}
