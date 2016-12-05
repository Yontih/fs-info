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
        super._load(dirPath);

        if (!this._stats.isDirectory()) {
            throw new Error(`${this.fullPath} is not a directory`);
        }
    }

    _watch() {
        let dirPath = this.fullPath;
        this.fs.watch(dirPath, (eventType, fileName) => {
            debug('fs.watch event fired');
            super._load(dirPath);
            if (this._watchCallback && typeof this._watchCallback === 'function') {
                this._watchCallback(eventType, fileName);
            }
        });
    }

    getFiles(recursive, pattern) {
        return Directory.getFilesSync(this.fullPath, recursive, pattern)
    }

    getDirectories(recursive) {
        return Directory.getDirectoriesSync(this.fullPath, recursive);
    }

}
module.exports = DirectoryInfo;