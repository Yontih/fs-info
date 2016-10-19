'use strict';

const fs = require('fs');
const path = require('path');
const minimatch = require('minimatch');
const walk = require('fs-extra').walk;
const _ = require('lodash');

const Info = require('../Info');

function getFiles(dirPath, recursive, pattern, files) {
    files = files || [];
    let items = fs.readdirSync(dirPath);

    for (let item of items) {
        let fullPath = path.resolve(dirPath, item);
        let stats = getStats(fullPath);
        if (stats) {
            if (recursive && stats.isDirectory()) {
                getFiles(fullPath, true, pattern, files);
            } else {
                let base = path.basename(item);
                if (minimatch(base, pattern)) {
                    files.push(item);
                }
            }
        }
    }

    return files;
}

function getDirectories(dirPath, recursive, dirs) {
    dirs = dirs || [];
    let items = fs.readdirSync(dirPath);

    for (let item of items) {
        let fullPath = path.resolve(dirPath, item);
        let stats = getStats(fullPath);
        if (stats) {
            if (recursive && stats.isDirectory()) {
                dirs.push(item);
                getFiles(item, true, files);
            }
        }
    }

    return dirs;
}

function getStats(fullPath) {
    try {
        return fs.statSync(fullPath);
    } catch (err) {
        return undefined;
    }
}

class Directory extends Info {

    /**
     * @param dirPath: directory path
     * @param options.recursive: (Boolean) get files recursive or stay. default: false
     * @param options.pattern: (String) get specific files pattern. default: *.*
     * @param cb: callback
     */
    static getFiles(dirPath, options, cb) {
        let defaultOptions = {recursive: false, pattern: '*.*'};
        if (typeof options === 'function') {
            cb = options;
            options = defaultOptions;
        } else {
            options = Object.assign(defaultOptions, options);
        }
        let files = [];
        let recursive = options.recursive;
        let pattern = options.pattern;

        if (!recursive) {
            files = getFiles(dirPath, recursive, pattern);
            return cb(null, files);
        }

        walk(dirPath)
            .on('data', (item) => {
                if (!item.stats.isDirectory()) {
                    let base = path.basename(item);
                    if (minimatch(base, pattern)) {
                        files.push(item.path);
                    }
                }
            })
            .on('end', () => {
                if (cb) {
                    cb(null, files);
                }
            })
            .on('error', (err) => {
                cb(err);
            });
    }

    static getFilesSync(dirPath, recursive, pattern) {
        recursive = recursive || false;
        pattern = pattern || '*.*';

        return getFiles(dirPath, recursive, pattern);
    }

    static getDirectories(dirPath, cb) {
        let dirs = [];
        walk(dirPath)
            .on('data', (item) => {
                if (item.stats.isDirectory()) {
                    dirs.push(item.path);
                }
            })
            .on('end', () => {
                if (cb) {
                    cb(null, dirs);
                }
            })
            .on('error', (err) => {
                cb(err);
            });
    }

    static getDirectoriesSync(dirPath, recursive) {
        return getDirectories(dirPath, recursive);
    }

    static deleteContentSync(dirPath) {
        let files = Directory.getFilesSync(dirPath, false);
        let dirs = Directory.getDirectoriesSync(dirPath, false);

        let all = _.union(files, dirs);
        Info.deleteSync(all);
    }
}

module.exports = Directory;