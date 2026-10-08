import assert from "assert";
import fs from "fs/promises";
import path from "path";
import thumbnailator, {getSupportedMimeTypes, isSupported} from "../src/thumbnailator.js";
import {createTmpDir, exec} from "../src/utils/utils.js";
import {checksum, getSample} from "./helpers.js";

/**
 * @returns {Promise<{width: number, height: number}>}
 */
async function identify(filePath) {
    const [width, height] = (await exec('gm', ['identify', '-format', '%w %h', filePath])).trim().split(' ');
    return {width: Number(width), height: Number(height)};
}

describe('Test thumbnailator features', function () {
    this.timeout(60 * 1000);

    it('should list supported mime types', () => {
        assert.ok(getSupportedMimeTypes().includes('application/pdf'));
        assert.ok(isSupported('Image/PNG; charset=binary'));
        assert.ok(isSupported('application/vnd.ms-word.document.macroEnabled.12'));
        assert.ok(!isSupported('application/x-unknown'));
        assert.ok(!isSupported(undefined));
    });

    it('should render the requested page', async () => {
        await using dir = await createTmpDir();
        const first = path.join(dir.path, 'first.png');
        const second = path.join(dir.path, 'second.png');
        const input = getSample('sample_PDF_114kB.pdf');

        await thumbnailator(input, first, {width: 200});
        await thumbnailator(input, second, {width: 200, page: 1});
        assert.notEqual(await checksum(first), await checksum(second));
    });

    it('should use the given mime type for a file without extension', async () => {
        await using dir = await createTmpDir();
        const input = path.join(dir.path, 'download');
        const output = path.join(dir.path, 'output.jpg');
        await fs.copyFile(getSample('sample_PNG_500kB.png'), input);

        await assert.rejects(thumbnailator(input, output, {width: 100}), /not supported/);
        await thumbnailator(input, output, {width: 100, mimeType: 'image/png; charset=binary'});
        assert.equal((await identify(output)).width, 100);
    });

    it('should fall back to the file extension if the mime type is not supported', async () => {
        await using dir = await createTmpDir();
        const output = path.join(dir.path, 'output.jpg');
        await thumbnailator(getSample('sample_PNG_500kB.png'), output, {width: 100, mimeType: 'application/octet-stream'});
        assert.equal((await identify(output)).width, 100);
    });

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
