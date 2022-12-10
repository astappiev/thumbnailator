/**
 * @typedef {Object} ProcessorOptions
 * @prop {number} width The target image width, in pixels
 * @prop {number} height The target image height, in pixels
 * @prop {string} [crop] If set to {@code true} the result image will be of exact size given, cropped to center
 * @prop {boolean} [keepAspect] If set to {@code true} will keep the same aspect ratio what the input image had
 * @prop {boolean} [thumbnail] Resizes the image as quickly as possible, with more concern for speed than resulting
 *  image quality. Regardless, resulting image quality should be acceptable for many uses.
 * @prop {number} [quality] For the JPEG and MPEG image formats, quality is 0 (the lowest image quality and highest
 *  compression) to 100 (the best quality but least effective compression). The default quality is 75
 * @prop {number} [density] If the file format supports it, may be used to update the image resolution.
 *  The default resolution is 72 dots per inch (DPI), which is equivalent to one point per pixel
 * @prop {string} [background] The background color
 */

/**
 * The abstract processor, in case you need to support more mime types.
 */
export default class AbstractProcessor {

    /**
     * @param {string} input
     * @param {string} output
     * @param {ProcessorOptions} options
     * @returns {Promise<void>}
     */
    async _root(input, output, options) {
        throw TypeError('Not injected properly, use `addProcessor()` function!');
    }

    /**
     * @param {string} input
     * @param {string} output
     * @param {ProcessorOptions} options
     * @returns {Promise<void>}
     */
    async process(input, output, options) {
        throw TypeError('Not implemented!');
    }

    /**
     * @returns {string[]}
     */
    getSupportedMimeTypes() {
        return [];
    }
}
