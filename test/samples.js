import fs from "fs";
import path from "path";
import thumbnailator from "../src/thumbnailator.js";

describe('Test thumbnailator on sample files', function () {
    this.timeout(10000);

    const samplesDir = path.resolve('test', 'samples');
    const thumbnailDir = path.resolve('test', 'thumbnails');
    const samples = fs.readdirSync(samplesDir);

    const options = {
        width: 280,
        height: 210,
        quality: 100,
        background: '#fff',
        thumbnail: true,
    };

    Array.from(samples).forEach(sampleFileName => {
        it(`should generate thumbnail for ${sampleFileName}`, (done) => {
            const inPath = path.resolve(samplesDir, sampleFileName);
            const outPath = path.resolve(thumbnailDir, `${sampleFileName.replace(/\.[^/.]+$/, '')}-thumbnail.jpg`);
            thumbnailator(inPath, outPath, options)
                .then(() => done())
                .catch(error => done(error));
        });
    });
});
