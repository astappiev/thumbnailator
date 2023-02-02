import path from "path";
import fs from "fs";
import crypto from "crypto";
import assert from "assert";

export function getSample(fileName) {
    return path.resolve('test', 'samples', fileName);
}

export function getThumbnail(fileName) {
    return path.resolve('test', 'thumbnails', fileName);
}

export function getOut(fileName) {
    return path.resolve('test', 'out', fileName);
}

export async function assertChecksum(actualPath, expectedPath) {
    const actual = await checksum(actualPath);
    const expected = await checksum(expectedPath);
    assert.equal(actual, expected, `Checksums do not match for ${path.basename(expectedPath)}`);
}

/**
 * @returns {[string,string][]}
 */
export function iterateSamples() {
    return Array.from(fs.readdirSync(getSample('')).map(sampleFile => {
        const basename = sampleFile.substring(0, sampleFile.lastIndexOf('.'));
        const thumbnailFile = basename.replace('sample_', 'thumbnail_') + '.jpg';
        return [basename, getSample(sampleFile), getThumbnail(thumbnailFile)];
    }));
}

export function checksum(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha1');
        const stream = fs.createReadStream(filePath);
        stream.on('error', err => reject(err));
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}