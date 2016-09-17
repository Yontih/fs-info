'use strict';

const fs = require('fs');
const path = require('path');
const bytes = require('bytes');

class FSInfo {
    constructor(filePath) {
        this.filePath = path.normalize(filePath);

        this._load(filePath);
    }

    _load(filePath) {
        let pathObject =  path.parse(filePath);
        this.exists = fs.existsSync(filePath);
        this.stat = null;

        this.root = pathObject.root;
        this.name = pathObject.name;
        this.extension = pathObject.ext;

        if (this.exists) {
            let stat = fs.statSync(filePath);
            this.stat = stat;
            this.sizeInByes = stat.size;
            this.size = bytes(stat.size);
        }
    }
}

module.exports = FSInfo;