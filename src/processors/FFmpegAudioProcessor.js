import {exec, replaceExt, withTmpDir} from "../utils/utils.js";
import AbstractProcessor from "./AbstractProcessor.js";

export default class FFmpegAudioProcessor extends AbstractProcessor {

    async process(input, output, options) {
        try {
            await withTmpDir(async (cacheDir) => {
                const tempCover = replaceExt(input, 'jpg', cacheDir);
                await exec('ffmpeg', [
                    '-i', input,
                    '-an',
                    '-c:v', 'copy',
                    tempCover,
                ]);
                await this._root(tempCover, output, options);
            });

            return exec('ffmpeg', options);
        } catch (error) {
            return this.createWaveform(input, output, options);
        }
    }

    async createWaveform(input, output, options) {
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
            "audio/ogg",
            "audio/mpeg",
            "audio/mpeg3",
            "audio/x-mpeg-3",
        ];
    }
}
