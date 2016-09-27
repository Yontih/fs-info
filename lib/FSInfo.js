'use strict';

const fs = require('fs');
const path = require('path');
const bytes = require('bytes');
const rimraf = require('rimraf');

const Info = require('./Info');

class FSInfo {
    constructor(filePath) {
        this.fullPath = path.normalize(filePath);

        this._load(filePath);
    }

    _load(filePath) {
        this._clean();
        this._path = path.parse(filePath);
        this._exists = fs.existsSync(filePath);

        this._root = this._path.root;
        this._name = this._path.base;
        this._extension = this._path.ext;

        if (this._exists) {
            this._stats = fs.statSync(filePath);
            this._sizeInByes = this._stats.size;
            this._size = bytes(this._stats.size);
        }
    }

    _clean() {
        this._path = null;
        this._exists = null;
        this._root = null;
        this._name = null;
        this._extension = null;
        this._stats = null;
        this._sizeInByes = null;
        this._size = null;
    }


    get exists() {
        return this._exists;
    }

    get size() {
        return this._size;
    }

    get sizeInBytes() {
        return this._sizeInByes;
    }

    get extension() {
        return this._extension;
    }

    get root() {
        return this._root;
    }

    get name() {
        return this._name;
    }

    deleteSync() {
        if (this.exists) {
            Info.deleteSync(this.fullPath);
            this._load(this.fullPath);
        }
    }

    create() {
        if (this.exists) {
            throw new Error(`${this.fullPath} is already exists`);
        }

        fs.writeFileSync(this.fullPath, '');
        this._load(this.fullPath);
    }
}

module.exports = FSInfo;