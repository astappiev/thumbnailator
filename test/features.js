import assert from "assert";
import fs from "fs/promises";
import path from "path";
import thumbnailator from "../src/thumbnailator.js";
import {createTmpDir, exec} from "../src/utils/utils.js";
import {getSample} from "./helpers.js";

/**
 * @returns {Promise<{width: number, height: number}>}
 */
async function identify(filePath) {
    const [width, height] = (await exec('gm', ['identify', '-format', '%w %h', filePath])).trim().split(' ');
    return {width: Number(width), height: Number(height)};
}

describe('Test thumbnailator features', function () {
    this.timeout(60 * 1000);

    it('should use the cover image of an audio file', async () => {
        await using dir = await createTmpDir();
        const output = path.join(dir.path, 'output.jpg');
        await thumbnailator(getSample('sample_MP3_with-cover.mp3'), output, {width: 100});
        assert.equal((await identify(output)).width, 100);
    });

    it('should kill a command and its sub-processes exceeding the timeout', async () => {
        await using dir = await createTmpDir();
        const marker = path.join(dir.path, 'marker');

        // The sub-process creates the marker later, like the `libreoffice` wrapper starts `soffice.bin`
        await assert.rejects(exec('sh', ['-c', `(sleep 1; touch '${marker}') & wait`], 200),
            {killed: true, message: /exceeding the timeout of 200 ms/});
        // Checks the marker instead of the process id, as a killed process stays a zombie until its parent reaps it
        await new Promise(resolve => setTimeout(resolve, 1500));
        await assert.rejects(fs.access(marker), {code: 'ENOENT'});
    });

    it('should report the output of a failing command', async () => {
        const script = 'echo output; echo error >&2; exit 3';

        await assert.rejects(exec('sh', ['-c', script]), {
            message: `Command failed: sh -c ${script}\nerror\n`,
            cmd: `sh -c ${script}`,
            code: 3,
            killed: false,
            stdout: 'output\n',
            stderr: 'error\n',
        });
    });
});
