'use strict';

const Directory = require('./Directory');
const FSInfo = require('../FSInfo');

const debug = require('debug')('DirectoryInfo');

class DirectoryInfo extends FSInfo {
    /**
     * @param dirPath: directory full path
     */
    constructor(dirPath) {
        super(dirPath);
    }

    _load(dirPath) {
        this._fsWatcher = null;
        super._load(dirPath);

        if (!this._stats.isDirectory()) {
            throw new Error(`${this.fullPath} is not a directory`);
        }
    }

    watch(cb) {
        let dirPath = this.fullPath;
        this._fsWatcher = this.fs.watch(dirPath, (eventType, fileName) => {
            debug('fs.watch event fired');
            super._load(dirPath);
            if (cb && typeof cb === 'function') {
                cb(eventType, fileName);
            }
        });
    }

    unwatch() {
        if (this._fsWatcher) {
            this._fsWatcher.close();
        }
    }

    getFiles(recursive, pattern) {
        return Directory.getFilesSync(this.fullPath, recursive, pattern)
    }

    getDirectories(recursive) {
        return Directory.getDirectoriesSync(this.fullPath, recursive);
    }

}

module.exports = DirectoryInfo;