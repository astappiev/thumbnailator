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

        processorsMap.set(mimeType, processor);
    }
}

/**
 * @returns {string[]} the mime types, which have a processor
 */
export function getSupportedMimeTypes() {
    return Array.from(processorsMap.keys());
}

/**
 * @param {string} mimeType
 * @returns {boolean} whether a preview can be created for the given mime type
 */
export function isSupported(mimeType) {
    return processorsMap.has(normalizeMimeType(mimeType));
}

/**
 * Strips the parameters, e.g. when taken from a Content-Type header: "text/plain; charset=utf-8"
 *
 * @param {string} [mimeType]
 * @returns {string|undefined}
 */
function normalizeMimeType(mimeType) {
    return mimeType?.split(';')[0].trim().toLowerCase();
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

    if (!['jpg', 'png', 'webp'].includes(extOutput)) {
        throw TypeError('Output file type is not supported, use: jpg, png or webp');
    }

    // The given mime type takes priority, the file extension is the fallback
    const extMimeType = mime.getType(extInput);
    const givenMimeType = normalizeMimeType(options.mimeType);
    const mimeType = [givenMimeType, extMimeType].find(type => type && processorsMap.has(type));
    if (mimeType) {
        return processorsMap.get(mimeType).process(input, output, {...options, mimeType}, render);
    }

    throw TypeError(`The input file type is not supported: ${givenMimeType || extMimeType}`);
}

/**
 * Creates a preview of an intermediate file (e.g. a PDF converted from a document), using the processor of its type.
 *
 * @callback Render
 * @param {string} input
 * @param {string} output
 * @param {ProcessorOptions} options
 * @returns {Promise<void>}
 *
 * @type {Render}
 */
const render = (input, output, options) => process(input, output, {...options, mimeType: undefined});

export default process;
