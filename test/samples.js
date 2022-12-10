import fs from "fs";
import path from "path";
import assert from "assert";
import crypto from "crypto";
import thumbnailator from "../src/thumbnailator.js";

describe('Test thumbnailator on sample files', function () {
    this.timeout(10000);

    const samplesDir = path.resolve('test', 'samples');
    const thumbnailDir = path.resolve('test', 'thumbnails');
    const samples = fs.readdirSync(samplesDir);

    const options = {
        width: 400,
        height: 320,
        quality: 90,
        background: '#fff',
        thumbnail: true,
        crop: true,
    };

    Array.from(samples).filter(name => !name.includes('thumbnail')).forEach(sampleFileName => {
        it(`should generate thumbnail for ${sampleFileName}`, async () => {
            const inPath = path.resolve(samplesDir, sampleFileName);
            const outFileName = `${sampleFileName.replace(/\.[^/.]+$/, '')}-thumbnail.jpg`;
            const outPath = path.resolve(thumbnailDir, outFileName);

            await thumbnailator(inPath, outPath, options);
            const expected = await checksum(path.resolve(samplesDir, outFileName))
            const actual = await checksum(outPath)
            assert.equal(actual, expected);
        });
    });
});

function checksum(path) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha1');
        const stream = fs.createReadStream(path);
        stream.on('error', err => reject(err));
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}
