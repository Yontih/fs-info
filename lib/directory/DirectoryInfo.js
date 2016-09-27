'use strict';

const Directory = require('./Directory');
const FSInfo = require('../FSInfo');

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
}
module.exports = DirectoryInfo;