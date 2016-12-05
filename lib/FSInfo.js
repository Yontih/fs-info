'use strict';

const fs = require('fs');
const path = require('path');
const bytes = require('bytes');
const rimraf = require('rimraf');

const debug = require('debug')('FSInfo');

const Info = require('./Info');

class FSInfo {
    constructor(fullPath) {
        this.fullPath = path.normalize(fullPath);

        debug('creating new instance %s', this.fullPath);

        this.fs = fs;
        this.path = path;
        this.bytes = bytes;
        this.rimraf = rimraf;

        this._load(fullPath);

        debug('new instance created %s', this.fullPath);
    }

    _load(fullPath) {
        this._clean();
        this._path = path.parse(fullPath);
        this._exists = fs.existsSync(fullPath);
        this._directoryPath = this._path.dir;

        this._root = this._path.root;
        this._name = this._path.base;

        if (this._exists) {
            this._stats = fs.statSync(fullPath);
            this._sizeInByes = this._stats.size;
            this._size = bytes(this._stats.size);
        }

        if (process.env.NODE_ENV !== 'testing') {
            this._watch();
        }
    }

    _clean() {
        this._path = null;
        this._exists = null;
        this._root = null;
        this._name = null;
        this._stats = null;
        this._sizeInByes = null;
        this._size = null;
        this._watchCallback = null;
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

    get root() {
        return this._root;
    }

    get name() {
        return this._name;
    }

    get directoryPath() {
        return this._directoryPath;
    }

    watch(cb) {
        this._watchCallback = cb;
    }

    unwatch() {
        this._watchCallback = null;
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

    toJSON() {
        return {
            name: this.name,
            root: this.root,
            sizeInBytes: this.sizeInBytes,
            size: this.size,
            exists: this.exists,
            directoryPath: this.directoryPath
        };
    }

    static detect(itemFullPath) {
        debug('detecting %s type', itemFullPath);

        const FileInfo = require('./file/FileInfo');
        const DirectoryInfo = require('./directory/DirectoryInfo');

        let stats = fs.statSync(itemFullPath);

        if (stats.isFile()) {
            return new FileInfo(itemFullPath);
        } else if (stats.isDirectory()) {
            return new DirectoryInfo(itemFullPath);
        }

        return null;
    }
}

module.exports = FSInfo;