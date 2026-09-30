import path from "path";
import fs from "fs/promises";
import os from "os";
import child_process from "child_process";

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
 * Creates a temporary directory, which is removed with its contents when disposed.
 *
 * @example
 * await using tmpDir = await createTmpDir();
 * @returns {Promise<{path: string, remove: function(): Promise<void>}>} the disposable temporary directory
 */
export function createTmpDir() {
    return fs.mkdtempDisposable(path.join(os.tmpdir(), 'thumbnailator-'));
}
