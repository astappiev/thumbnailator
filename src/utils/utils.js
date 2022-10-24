import path from "path";
import child_process from "child_process";
import tmp from "tmp";

/**
 * @param {string} cmd the command to execute
 * @param {string[]} args the arguments to the command
 * @returns {Promise<string>} the output of the command
 */
export function exec(cmd, args) {
    return new Promise((resolve, reject) => {
        child_process.execFile(cmd, args, (error, stdout) => {
            if (error) {
                console.error('Command execution error:', error);
                return reject(error)
            }
            resolve(stdout)
        });
    });
}

/**
 * @param {string} fileName
 * @param {string} newExtension
 * @param {string} [parentPath]
 * @returns {string}
 */
export function replaceExt(fileName, newExtension, parentPath) {
    const inputBasename = path.basename(fileName);
    const inputWithoutExt = inputBasename.substring(0, inputBasename.lastIndexOf('.'));
    if (parentPath) {
        return path.join(parentPath, inputWithoutExt + '.' + newExtension);
    }
    return inputWithoutExt + '.' + newExtension;
}

/**
 * Gets a temporary file name.
 *
 * @param {?object} [options]
 * @returns {string} the newly generated unique name to use
 */
export function tmpName(options) {
    return tmp.tmpNameSync(options);
}

/**
 * Creates a temporary directory.
 *
 * @param {?object} [options]
 * @returns {Promise<object>} the path to newly crated directory and cleanup callback
 */
export async function tmpDir(options) {
    return new Promise((resolve, reject) =>
        tmp.dir(options, (err, path, cleanup) =>
            err ? reject(err) : resolve({path, cleanup})));
}

/**
 * @callback tmpDirCallback
 * @async
 * @param {string} path a path to the created temp directory
 * @param {function} tmpFile a function to create a temporal sub-file
 */

/**
 * @param {tmpDirCallback} fn
 * @param {object} [options]
 * @returns {Promise<?>}
 */
export async function withTmpDir(fn, options) {
    const {path, cleanup} = await tmpDir(Object.assign({unsafeCleanup: true}, options));
    try {
        const tmpFile = (fileExt) => tmpName({tmpdir: path, template: 'tmp-XXXXXX.' + fileExt})
        return await fn(path, tmpFile);
    } finally {
        await cleanup();
    }
}
