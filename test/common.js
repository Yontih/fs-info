'use strict';

const fse = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');

const TEST_FILE_PATH = path.normalize('temp/test_file.json');
const TEST_DIR_PATH = path.normalize('temp/test_dir');
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
    TEST_DIR_PATH,
    create: (cb) => {
        try {
            fse.ensureFileSync(TEST_FILE_PATH);
            fse.ensureDirSync(TEST_DIR_PATH);
            fse.writeJsonSync(TEST_FILE_PATH, TEST_FILE_CONTENT);
            console.log('test file created');
        } catch (err) {
        } finally {
            cb();
        }
    },
    clean: (cb) => {
        rimraf(TEST_DIRECTORY_NAME, (err) => {
            if (!err) {
                console.log('test file deleted');
            }

            cb();
        });
    }
};