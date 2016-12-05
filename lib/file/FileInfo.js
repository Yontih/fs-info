'use strict';

const path = require('path');
const mime = require('mime');

const debug = require('debug')('FileInfo');

const FSInfo = require('../FSInfo');
const DirectoryInfo = require('../directory/DirectoryInfo');

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
        this._nameWithoutExt = this._path.name;
        this._extension = this._path.ext;
        this._directoryInfo = new DirectoryInfo(this.directoryPath);

        if (this._stats.isDirectory()) {
            throw new Error(`${this.fullPath} is not a file`);
        }
    }

    _watch() {
        let filePath = this.fullPath;
        this.fs.watchFile(filePath, (curr, prev) => {
            debug('fs.watchFile event fires');
            super._load(filePath);

            if (this._watchCallback && typeof this._watchCallback === 'function') {
                this._watchCallback(curr, prev);
            }
        });
    }

    get nameWithoutExt() {
        return this._nameWithoutExt;
    }

    get contentType() {
        return this._contentType;
    }

    get extension() {
        return this._extension;
    }

    get directory() {
        return this._directoryInfo;
    }

    toJSON() {
        return Object.assign(super.toJSON(), {
            contentType: this.contentType,
            nameWithoutExt: this.nameWithoutExt,
            extension: this.extension
        });
    }
}

module.exports = FileInfo;