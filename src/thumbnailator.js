import fsPromises from "fs/promises";
import path from "path";
import mime from "mime";

import FFmpegProcessor from "./processors/FFmpegProcessor.js";
import FFmpegAudioProcessor from "./processors/FFmpegAudioProcessor.js";
import GraphicsMagickProcessor from "./processors/GraphicsMagickProcessor.js";
import LibreOfficeProcessor from "./processors/LibreOfficeProcessor.js";

const processors = [
    new GraphicsMagickProcessor(),
    new FFmpegProcessor(),
    new FFmpegAudioProcessor(),
    new LibreOfficeProcessor(),
];

/** @type {Map<String, AbstractProcessor>} */
const processorsMap = new Map();
for (const processor of processors) {
    addProcessor(processor);
}

/**
 * @param {AbstractProcessor} processor
 */
export function addProcessor(processor) {
    const supportedMimeTypes = processor.getSupportedMimeTypes();

    if (!Array.isArray(supportedMimeTypes) || supportedMimeTypes.length <= 0) {
        throw TypeError('A processor have to support at least one mimeType!');
    }

    for (const mimeType of supportedMimeTypes) {
        if (processorsMap.has(mimeType)) {
            console.log('A processor is already defined for the mimeType: ' + mimeType);
        }

        processor._root = process;
        processorsMap.set(mimeType, processor);
    }
}

/**
 * @param {string} input
 * @param {string} output
 * @param {ProcessorOptions} options
 * @returns {Promise<void>}
 */
async function process(input, output, options = {}) {
    const stats = await fsPromises.lstat(input);
    if (!stats.isFile()) {
        throw TypeError('The input is not a valid file path.')
    }

    // Check for supported output format
    const extInput = path.extname(input).toLowerCase().replace('.', '');
    const extOutput = path.extname(output).toLowerCase().replace('.', '');

    if (!['gif', 'jpg', 'png'].includes(extOutput)) {
        throw TypeError('Output file type is not supported, use: png, gif or jpg');
    }

    const mineType = mime.getType(extInput);
    const processor = processorsMap.get(mineType);
    if (processor) {
        return processor.process(input, output, options);
    }

    throw TypeError(`The input file type is not supported: ${mineType}`);
}

export default process;
