import {exec, replaceExt, createTmpDir} from "../utils/utils.js";
import AbstractProcessor from "./AbstractProcessor.js";

export default class FFmpegAudioProcessor extends AbstractProcessor {

    async process(input, output, options, render) {
        try {
            await using cacheDir = await createTmpDir();
            const tempCover = replaceExt(input, 'jpg', cacheDir.path);
            await exec('ffmpeg', [
                '-i', input,
                '-an',
                '-c:v', 'copy',
                tempCover,
            ], options.timeout);
            await render(tempCover, output, options);
        } catch (error) {
            // A timeout is not a missing cover, the waveform would only exceed the time limit again
            if (error.killed) {
                throw error;
            }
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

        return exec('ffmpeg', ffmpegArgs, options.timeout);
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
