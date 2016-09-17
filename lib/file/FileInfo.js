'use strict';

const fs = require('fs');
const path = require('path');

const FSInfo = require('../FSInfo');

class FileInfo extends  FSInfo{
    /**
     * @param filePath:
     */
    constructor(filePath) {
        super(filePath);
    }
}

module.exports = FileInfo;