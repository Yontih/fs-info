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
        info.directoryName.should.equal(common.TEST_DIRECTORY_NAME);
        info.sizeInBytes.should.equal(7102);
        info.nameWithoutExt.should.equal(pathObj.name);

        done();
    });

});