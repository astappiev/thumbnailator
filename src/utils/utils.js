import path from "path";
import fs from "fs/promises";
import os from "os";
import child_process from "child_process";

/**
 * Default time limit for a single external command, in milliseconds.
 */
export const DEFAULT_TIMEOUT = 120 * 1000;

/**
 * Kills a command with its sub-processes (e.g. `soffice.bin` started by `libreoffice`), as they would keep its output
 * open, so it would never finish. They are killed first, as they can't be found by the parent once it is gone.
 * The command is stopped meanwhile, so it doesn't exit successfully when its sub-processes are killed.
 * @param {import("child_process").ChildProcess} child
 */
function kill(child) {
    child.kill('SIGSTOP');
    child_process.execFile('pkill', ['-KILL', '-P', String(child.pid)], () => child.kill('SIGKILL'));
}

/**
 * @param {string} cmd the command to execute
 * @param {string[]} args the arguments to the command
 * @param {number} [timeout] kill the command after this many milliseconds, `0` disables the limit
 * @returns {Promise<string>} the output of the command
 * @throws {Error} if the command fails, with the properties of `execFile` errors (`cmd`, `code`, `signal`, `killed`,
 *  `stdout` and `stderr`)
 */
export function exec(cmd, args, timeout = DEFAULT_TIMEOUT) {
    return new Promise((resolve, reject) => {
        const child = child_process.execFile(cmd, args, (error, stdout, stderr) => {
            clearTimeout(timer);
            if (!error) {
                return resolve(stdout);
            }
            Object.assign(error, {stdout, stderr});
            if (error.killed) {
                error.message = `${cmd} was killed after exceeding the timeout of ${timeout} ms\n` + error.message;
            }
            console.error('Command execution error:', error.message);
            reject(error);
        });
        const timer = timeout > 0 && setTimeout(() => kill(child), timeout);
    });
}

/**
 * @param {string} fileName
 * @param {string} newExtension
 * @param {string} [parentPath]
 * @returns {string}
 */
export function replaceExt(fileName, newExtension, parentPath = '') {
    // For a file without extension, the whole basename is kept (as LibreOffice does for its output)
    return path.join(parentPath, path.parse(fileName).name + '.' + newExtension);
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
