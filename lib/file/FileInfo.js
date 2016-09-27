'use strict';

const path = require('path');
const mime = require('mime');

const FSInfo = require('../FSInfo');

class FileInfo extends FSInfo {
    /**
     * @param filePath: file full path
     */
    constructor(filePath) {
        super(filePath);
    }

    _load(filePath) {
        super._load(filePath);

        this._contentType = mime.lookup(filePath);
        this._directoryName = this._path.dir;
        this._nameWithoutExt = this._path.name;

        if (this._stats.isDirectory()) {
            throw new Error(`${this.fullPath} is not a file`);
        }
    }

    get nameWithoutExt() {
        return this._nameWithoutExt;
    }

    get contentType() {
        return this._contentType;
    }

    get directoryName() {
        return this._directoryName;
    }
}

module.exports = FileInfo;