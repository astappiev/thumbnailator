import thumbnailator from "../src/thumbnailator.js";
import {assertChecksum, getOut, iterateSamples} from "./helpers.js";

describe('Test thumbnailator on sample files', function () {
    this.timeout(10000);

    const options = {
        width: 400,
        height: 320,
        quality: 90,
        density: 300,
        background: '#fff',
        thumbnail: true,
        crop: true,
    };

    iterateSamples().forEach(([base, sampleFile, thumbnailFile]) => {
        it(`should generate thumbnail for ${base}`, async () => {
            const outPath = getOut(base.replace('sample_', 'thumbnail_') + '.jpg');

            await thumbnailator(sampleFile, outPath, options);
            await assertChecksum(outPath, thumbnailFile);
        });
    });
});
