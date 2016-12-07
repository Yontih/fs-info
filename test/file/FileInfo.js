'use strict';

const path = require('path');

const chai = require('chai');

const common = require('../common');
const FileInfo = require('../../lib/file/FileInfo');

chai.should();

describe('FileInfo', () => {
    before((done) => {
        common.create(done);
    });

    after((done) => {
        common.clean(done);
    });

    it('should create instance successfully', (done) => {
        let info = new FileInfo(common.TEST_FILE_PATH);
        let pathObj = path.parse(common.TEST_FILE_PATH);

        info.exists.should.equal(true);
        info.contentType.should.equal('application/json');
        info.directoryPath.should.equal(common.TEST_DIRECTORY_NAME);
        info.sizeInBytes.should.equal(7102);
        info.nameWithoutExt.should.equal(pathObj.name);
        info.extension.should.equal('.json');

        done();
    });

    it('should create json object', (done) => {
        let info = new FileInfo(common.TEST_FILE_PATH);
        let obj = info.toJSON();

        Object.keys(obj).length.should.equal(10);
        obj.should.have.property.fullPath;
        obj.should.have.property.name;
        obj.should.have.property.size;
        obj.should.have.property.sizeInBytes;
        obj.should.have.property.root;
        obj.should.have.property.exists;
        obj.should.have.property.extension;
        obj.should.have.property.contentType;
        obj.should.have.property.nameWithoutExt;
        obj.should.have.property.directoryPath;

        done();
    });

});