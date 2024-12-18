const { expect } = require("chai");
const request = require("request");

let url = 'http://localhost:3000/addContent';
let content = {
    heading: 'Test Heading',
    description: 'Test Description',
    picture: 'http://example.com/test.jpg'
};

describe('test GET content api', function() {
    it('returns statusCode of 200', function(done) {
        request('http://localhost:3000/getContent', function(error, response, body) {
            let responseObj = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(responseObj).to.be.an('array');
            done();
        });
    });
});

describe('test POST content api', function() {
    it('adds content to DB', function(done) {
        request.post({url: url, json: content}, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.have.property('heading').equal(content.heading);
            expect(body).to.have.property('description').equal(content.description);
            expect(body).to.have.property('picture').equal(content.picture);
            done();
        });
    });

    it('validates required fields', function(done) {
        request.post({url: url, json: {}}, function(error, response, body) {
            expect(response.statusCode).to.equal(400);
            expect(body).to.have.property('error');
            done();
        });
    });
});

describe('test DELETE content api', function() {
    let contentId;

    // First create a content to delete
    before(function(done) {
        request.post({url: url, json: content}, function(error, response, body) {
            contentId = body._id;
            done();
        });
    });

    it('deletes content successfully', function(done) {
        request.delete(`http://localhost:3000/deleteContent/${contentId}`, function(error, response, body) {
            let responseObj = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(responseObj).to.have.property('message').equal('Content deleted successfully');
            done();
        });
    });

    it('handles invalid content ID', function(done) {
        request.delete('http://localhost:3000/deleteContent/invalidId', function(error, response, body) {
            let responseObj = JSON.parse(body);
            expect(response.statusCode).to.equal(400);
            expect(responseObj).to.have.property('error');
            done();
        });
    });
});