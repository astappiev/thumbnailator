import assert from "assert";
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
});
