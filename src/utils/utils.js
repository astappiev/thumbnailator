import os from "os";
import path from "path";
import child_process from "child_process";

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

export function randGuid() {
    return Math.random().toString(36).substring(2, 15);
}

export function tempPath(suffix = randGuid()) {
    return path.resolve(os.tmpdir(), suffix);
}
