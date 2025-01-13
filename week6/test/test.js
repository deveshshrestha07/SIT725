const { expect } = require("chai");
const request = require("request");
const { connectToDatabase, getDb } = require('../dbconnection');
const { MongoClient } = require('mongodb');

// Base URL for the API being tested
const baseUrl = 'http://localhost:3000/api';

// Example content used for testing
const content = {
    heading: 'Test Heading',
    description: 'Test Description',
    picture: 'http://localhost:3000/images/test-2.jpg'
};

// MongoDB client setup
const client = new MongoClient("mongodb://localhost:27017");

describe('Advanced API Tests', function() {
    this.timeout(10000); // Set timeout to 10 seconds to allow for database operations

    // Ensure the database is cleaned up before starting the tests
    before(async function() {
        await connectToDatabase();
        const db = getDb();
        await db.collection('contents').deleteMany({});
    });

    // Cleanup the database after all tests are executed
    after(async function() {
        const db = getDb();
        await db.collection('contents').deleteMany({});
    });

    describe('Database Connection Tests', function() {
        it('connects to the database successfully', async function() {
            try {
                await connectToDatabase();
                const db = getDb();
                expect(db).to.not.be.null; // Check if the database is connected
                expect(db.databaseName).to.equal('contentDB'); // Verify the database name
            } catch (error) {
                throw new Error('Database connection failed: ' + error.message);
            }
        });

        it('ensures the database is accessible and collections are functional', async function() {
            try {
                const db = getDb();
                const collection = db.collection('contents');
                expect(collection).to.not.be.null; // Ensure collection exists

                // Test inserting, retrieving, and deleting a document
                await collection.insertOne({ test: 'connectionTest' });
                const insertedDoc = await collection.findOne({ test: 'connectionTest' });
                expect(insertedDoc).to.not.be.null;
                expect(insertedDoc.test).to.equal('connectionTest');
                await collection.deleteOne({ test: 'connectionTest' });
            } catch (error) {
                throw new Error('Database accessibility test failed: ' + error.message);
            }
        });

        it('fails gracefully when the database is not reachable', async function() {
            const invalidClient = new MongoClient("mongodb://invalidhost:27017");
            try {
                await Promise.race([
                    invalidClient.connect(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
                ]);
                throw new Error('Should not connect to an invalid database');
            } catch (error) {
                expect(error).to.exist; // Ensure an error is thrown
            } finally {
                await invalidClient.close().catch(() => {}); // Safely close the client
            }
        });
    });

    describe('Content Validation Tests', function() {
        beforeEach(async function() {
            const db = getDb();
            await db.collection('contents').deleteMany({}); // Reset collection before each test
        });

        it('rejects content with empty strings', function(done) {
            const invalidContent = {
                heading: '',
                description: '',
                picture: ''
            };
            
            request.post({
                url: `${baseUrl}/addContent`,
                json: invalidContent
            }, function(error, response, body) {
                try {
                    expect(response.statusCode).to.equal(400); // Check for bad request response
                    expect(body.error).to.equal('All fields are required (heading, description, picture)');
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });

        it('accepts content with whitespace (consider adding validation)', function(done) {
            const contentWithWhitespace = {
                heading: '   ',
                description: '   ',
                picture: '   '
            };
            
            request.post({
                url: `${baseUrl}/addContent`,
                json: contentWithWhitespace
            }, function(error, response, body) {
                try {
                    expect(response.statusCode).to.equal(201); // Expect successful creation
                    expect(body.data).to.have.property('_id'); // Validate response contains the new ID
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });

        it('handles extremely long content gracefully', function(done) {
            const longContent = {
                heading: 'A'.repeat(1000),
                description: 'B'.repeat(5000),
                picture: 'C'.repeat(1000)
            };
            
            request.post({
                url: `${baseUrl}/addContent`,
                json: longContent
            }, function(error, response, body) {
                try {
                    expect(response.statusCode).to.equal(201); // Expect content creation success
                    expect(body.data).to.have.property('_id');
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });

        it('rejects content with missing fields', function(done) {
            const incompleteContent = {
                heading: 'Test Heading',
                picture: 'http://localhost:3000/images/test-2.jpg' // Missing description field
            };
            
            request.post({
                url: `${baseUrl}/addContent`,
                json: incompleteContent
            }, function(error, response, body) {
                try {
                    expect(response.statusCode).to.equal(400); // Expect bad request error
                    expect(body.error).to.equal('All fields are required (heading, description, picture)');
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });

        it('accepts valid content and responds with created data', function(done) {
            const validContent = {
                heading: 'Valid Heading',
                description: 'Valid Description',
                picture: 'http://localhost:3000/images/valid.jpg'
            };
            
            request.post({
                url: `${baseUrl}/addContent`,
                json: validContent
            }, function(error, response, body) {
                try {
                    expect(response.statusCode).to.equal(201); // Expect successful creation
                    expect(body.data).to.have.property('_id');
                    expect(body.data.heading).to.equal('Valid Heading');
                    expect(body.data.description).to.equal('Valid Description');
                    expect(body.data.picture).to.equal('http://localhost:3000/images/valid.jpg');
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });
    });

    describe('GET Content Advanced Tests', function() {
        before(async function() {
            const db = getDb();
            await db.collection('contents').insertMany([
                { ...content, heading: 'First Post', createdAt: new Date('2024-01-01') },
                { ...content, heading: 'Second Post', createdAt: new Date('2024-01-02') },
                { ...content, heading: 'Third Post', createdAt: new Date('2024-01-03') }
            ]);
        });

        it('returns all contents in correct order', function(done) {
            request(`${baseUrl}/getContent`, function(error, response, body) {
                try {
                    const contents = JSON.parse(body);
                    expect(contents).to.be.an('array'); // Ensure response is an array
                    expect(contents.length).to.be.at.least(3); // Verify at least 3 entries
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });

        it('handles multiple rapid requests', function(done) {
            let completed = 0;
            const totalRequests = 5; // Simulate 5 rapid requests
            
            for (let i = 0; i < totalRequests; i++) {
                request(`${baseUrl}/getContent`, function(error, response) {
                    try {
                        expect(response.statusCode).to.equal(200); // Ensure all requests succeed
                        completed++;
                        if (completed === totalRequests) {
                            done();
                        }
                    } catch (error) {
                        done(error);
                    }
                });
            }
        });
    });

    describe('DELETE Content Advanced Tests', function() {
        let testContentIds = [];

        before(async function() {
            const db = getDb();
            const result = await db.collection('contents').insertMany([
                { ...content, heading: 'Delete Test 1' },
                { ...content, heading: 'Delete Test 2' },
                { ...content, heading: 'Delete Test 3' }
            ]);
            testContentIds = Object.values(result.insertedIds).map(id => id.toString()); // Extract inserted IDs
        });

        it('handles multiple sequential deletes', function(done) {
            let deleted = 0;
            
            testContentIds.forEach(id => {
                request.delete(`${baseUrl}/deleteContent/${id}`, function(error, response, body) {
                    try {
                        const responseObj = JSON.parse(body);
                        expect(response.statusCode).to.equal(200); // Expect successful deletion
                        expect(responseObj.message).to.equal('Content deleted successfully!');
                        deleted++;
                        if (deleted === testContentIds.length) {
                            done();
                        }
                    } catch (error) {
                        done(error);
                    }
                });
            });
        });

        it('fails gracefully when deleting already deleted content', function(done) {
            const deletedId = testContentIds[0]; // Use an already-deleted ID
            request.delete(`${baseUrl}/deleteContent/${deletedId}`, function(error, response, body) {
                try {
                    const responseObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(404); // Expect not found error
                    expect(responseObj.error).to.equal('Content not found');
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });

        it('handles invalid ObjectIds with 400', function(done) {
            const invalidId = '123456789'; // Use invalid MongoDB ObjectId
            request.delete(`${baseUrl}/deleteContent/${invalidId}`, function(error, response, body) {
                try {
                    const responseObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(400); // Expect bad request
                    expect(responseObj.error).to.contain('Invalid');
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });
    });

    describe('Content Sorting Tests', function() {
        before(async function() {
            const db = getDb();
            await db.collection('contents').deleteMany({}); // Clear existing content
            
            await db.collection('contents').insertMany([
                { 
                    heading: 'New Post', 
                    description: 'This is a new post',
                    picture: 'http://example.com/new.jpg',
                    createdAt: new Date('2024-01-03') 
                },
                { 
                    heading: 'Old Post', 
                    description: 'This is an old post',
                    picture: 'http://example.com/old.jpg',
                    createdAt: new Date('2024-01-02') 
                },
                { 
                    heading: 'Very Old Post', 
                    description: 'This is a very old post',
                    picture: 'http://example.com/veryold.jpg',
                    createdAt: new Date('2024-01-01') 
                }
            ]);
        });

        it('returns content sorted by creation date in descending order', function(done) {
            request(`${baseUrl}/getContent`, function(error, response, body) {
                try {
                    const contents = JSON.parse(body);
                    expect(contents).to.be.an('array'); // Check for array response
                    expect(contents.length).to.equal(3); // Verify 3 entries exist
                    for (let i = 0; i < contents.length - 1; i++) {
                        const currentDate = new Date(contents[i].createdAt).getTime();
                        const nextDate = new Date(contents[i + 1].createdAt).getTime();
                        expect(currentDate).to.be.at.least(nextDate); // Check descending order
                    }
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });

        it('confirms the sorted content\'s first and last entries', function(done) {
            request(`${baseUrl}/getContent`, function(error, response, body) {
                try {
                    const contents = JSON.parse(body);
                    expect(contents).to.be.an('array');
                    expect(contents.length).to.equal(3);

                    // Check if first and last entries match expectations
                    expect(contents[0].heading).to.equal('New Post');
                    expect(contents[2].heading).to.equal('Very Old Post');

                    done();
                } catch (error) {
                    done(error);
                }
            });
        });
    });
});
