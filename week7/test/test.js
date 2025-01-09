const { expect } = require("chai");
const request = require("request");

const baseUrl = 'http://localhost:3000/api';
const content = {
    heading: 'Test Heading',
    description: 'Test Description',
    picture: 'http://localhost:3000/images/test-2.jpg'
};

describe('test GET content api', function() {
    it('returns statusCode of 200', function(done) {
        request(`${baseUrl}/getContent`, function(error, response, body) {
            try {
                expect(response.statusCode).to.equal(200);
                const responseObj = JSON.parse(body);
                expect(responseObj).to.be.an('array');
                done();
            } catch (error) {
                done(error);
            }
        });
    });
});

describe('test POST content api', function() {
    it('adds content to DB', function(done) {
        request.post({
            url: `${baseUrl}/addContent`,
            json: content
        }, function(error, response, body) {
            try {
                expect(response.statusCode).to.equal(201);
                expect(body.data).to.have.property('_id');
                expect(body.message).to.equal('Content added successfully!');
                done();
            } catch (error) {
                done(error);
            }
        });
    });

    it('validates required fields', function(done) {
        request.post({
            url: `${baseUrl}/addContent`,
            json: {}
        }, function(error, response, body) {
            try {
                expect(response.statusCode).to.equal(400);  
                expect(body).to.have.property('error');
                expect(body.error).to.equal('All fields are required (heading, description, picture)');
                done();
            } catch (error) {
                done(error);
            }
        });
    });
});

describe('test DELETE content api', function() {
    let contentId;

    before(function(done) {
        request.post({
            url: `${baseUrl}/addContent`,
            json: content
        }, function(error, response, body) {
            contentId = body.data._id;
            done();
        });
    });

    it('deletes content successfully', function(done) {
        request.delete(`${baseUrl}/deleteContent/${contentId}`, function(error, response, body) {
            try {
                const responseObj = JSON.parse(body);
                expect(response.statusCode).to.equal(200);  // Success status
                expect(responseObj).to.have.property('message');
                expect(responseObj.message).to.equal('Content deleted successfully!');
                done();
            } catch (error) {
                done(error);
            }
        });
    });

    it('handles invalid content ID', function(done) {
        request.delete(`${baseUrl}/deleteContent/invalidId`, function(error, response, body) {
            try {
                const responseObj = JSON.parse(body);
                expect(response.statusCode).to.equal(400);  // Bad request status
                expect(responseObj).to.have.property('error');
                expect(responseObj.error).to.equal('Invalid ID format');
                done();
            } catch (error) {
                done(error);
            }
        });
    });
});