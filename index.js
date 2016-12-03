'use strict';

const FSInfo = require('./lib/FSInfo');

class lib {

    /**
     * @param itemFullPath: item to detect full path
     */
    static detect(itemFullPath) {
        return FSInfo.detect(itemFullPath);
    }

    static get Directory() {
        return require('./lib/directory/Directory');
    }

    static get DirectoryInfo() {
        return require('./lib/directory/DirectoryInfo');
    }

    static get File() {
        return require('./lib/file/File');
    }

    static get FileInfo() {
        return require('./lib/file/FileInfo');
    }

}

module.exports = lib;