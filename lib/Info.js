'use strict';

const rimraf = require('rimraf');
const _ = require('lodash');

class Info {

    /**
     * Support many
     * @param fullPath: path or array of paths
     */
    static deleteSync(fullPath) {
        if (!_.isArray(fullPath)) {
            fullPath = [fullPath];
        }

        for (let p of fullPath) {
            rimraf.sync(p);
        }
    }

    /**
     * @param fullPath: path of the file or directory
     * @param cb
     */
    static delete(fullPath, cb) {
        rimraf(fullPath, cb);
    }

}

module.exports = Info;