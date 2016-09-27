'use strict';

const fse = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');

const TEST_FILE_PATH = 'temp/test_file.json';
let pathObj = path.parse(TEST_FILE_PATH);

const TEST_FILE_NAME = pathObj.base;
const TEST_FILE_EXTENSION = pathObj.ext;
const TEST_DIRECTORY_NAME = pathObj.dir;
const TEST_FILE_CONTENT = require('./test_content.json');

module.exports = {
    TEST_FILE_PATH,
    TEST_FILE_NAME,
    TEST_FILE_EXTENSION,
    TEST_DIRECTORY_NAME,
    TEST_FILE_CONTENT,
    create: (cb) => {
        fse.ensureFile(TEST_FILE_PATH, (err) => {
            if (!err) {
                console.log('test file created');
                fse.writeJson(TEST_FILE_PATH, TEST_FILE_CONTENT, (err) => {
                    cb();
                });
            }
        });
    },
    delete: (cb) => {
        rimraf(TEST_DIRECTORY_NAME, (err) => {
            if (!err) {
                console.log('test file deleted');
            }

            cb();
        });
    }
};