'use strict';

const chai = require('chai');

const fs = require('fs');
const temp = require('temp');

const common = require('./common');
const FSInfo = require('../lib/FSInfo');

const FileInfo = require('../index').FileInfo;
const DirectoryInfo = require('../index').DirectoryInfo;

chai.should();

function testDelete(info) {
    info.exists.should.equal(true);
    fs.existsSync(info.fullPath).should.equal(true);
    info.deleteSync();
    info.exists.should.equal(false);
    fs.existsSync(info.fullPath).should.equal(false);
}

function testCreate(info) {
    try {
        info.exists.should.equal(false);
        fs.existsSync(info.fullPath).should.equal(false);
        info.create();
        info.exists.should.equal(true);
        fs.existsSync(info.fullPath).should.equal(true);
    } finally {
        info.deleteSync();
    }
}

describe('FSInfo', () => {

    before((done) => {
        common.create(done);
    });

    after((done) => {
        common.clean(done);
    });

    it('should throw already exists error', (done) => {
        let filePath;
        temp.open('.bin', (err, file) => {
            filePath = file.path;
            let info = new FSInfo(filePath);
            try {
                info.create();
            } catch (err) {
                err.message.should.equal(`${filePath} is already exists`);
            } finally {
                temp.cleanupSync();
            }

            done();
        });
    });

    it('should create json object', (done) => {
        let info = new FSInfo(common.TEST_FILE_PATH);
        let obj = info.toJSON();

        Object.keys(obj).length.should.equal(7);
        obj.should.have.property.fullPath;
        obj.should.have.property.name;
        obj.should.have.property.size;
        obj.should.have.property.sizeInBytes;
        obj.should.have.property.root;
        obj.should.have.property.exists;

        done();
    });

    it('should detect the item type and create new instance', (done) => {

        let fsFileItem =  FSInfo.detect(common.TEST_FILE_PATH);
        let fsDirItem = FSInfo.detect(common.TEST_DIR_PATH);

        fsFileItem.should.be.FileInfo;
        fsDirItem.should.be.DirectoryInfo;

        done();
    });

    describe('file', () => {

        it('should exists', (done) => {
            let info = new FSInfo(common.TEST_FILE_PATH);

            info.exists.should.equal(true);
            info.name.should.equal(common.TEST_FILE_NAME);
            info.fullPath.should.equal(common.TEST_FILE_PATH);

            done();
        });

        it('should not exists', (done) => {
            let info = new FSInfo('not_exists.file');

            info.exists.should.equal(false);
            info.name.should.equal('not_exists.file');

            done();
        });

        it('should deleteSync file', (done) => {
            temp.open('.txt', (err, file) => {
                let info = new FSInfo(file.path);
                testDelete(info, file.path);
                done();
            });
        });

        it('should create new file', (done) => {
            let newFilePath = 'temp.txt';
            let info = new FSInfo(newFilePath);
            testCreate(info, newFilePath);
            done();
        });
    });

    describe('directory', () => {
        it('should create new directory', (done) => {
            let newDirPath = 'temp_dir';
            let info = new FSInfo(newDirPath);
            testCreate(info, newDirPath);
            done();
        });

        it('should deleteSync directory', (done) => {
            temp.mkdir('temp_dir', (err, dirPath) => {
                let info = new FSInfo(dirPath);
                testDelete(info);
                done();
            });
        });
    });


});