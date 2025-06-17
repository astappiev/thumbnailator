import fs from 'fs';
import path from 'path';
import thumbnailator from "../src/thumbnailator.js";
import {assertChecksum, getOut, iterateSamples} from "./helpers.js";

describe('Test thumbnailator on sample files', function () {
    this.timeout(60 * 1000);

    const options = {
        width: 400,
        height: 320,
        quality: 90,
        density: 300,
        background: '#fff',
        thumbnail: true,
        crop: true,
    };

    const outDir = path.resolve('test', 'out');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    iterateSamples().forEach(([base, sampleFile, thumbnailFile]) => {
        it(`should generate thumbnail for ${base}`, async () => {
            const outPath = getOut(base.replace('sample_', 'thumbnail_') + '.jpg');

            await thumbnailator(sampleFile, outPath, options);
            await assertChecksum(outPath, thumbnailFile);
        });
    });
});
