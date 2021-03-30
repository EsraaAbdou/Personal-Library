/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const apiRoutes = require('../routes/api');
const Book = apiRoutes.Book;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .post("/api/books")
        .type('form')
        .send({
            "title": "book title",
        })
        .end(function (err, res) {
          const response = res.body;
          assert.equal(res.status, 200);
          assert.isObject(response, 'response should be an object');
          assert.property(response, "_id", 'response should have an _id property');
          assert.property(response, "title", 'response should have a title property');
          assert.property(response, "comments", 'response should have a comments property');
          assert.strictEqual(response.title, "book title", 'response title should be (book title)');
          assert.strictEqual(response.comments.length, 0, 'response comments array should be empty');
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .post("/api/books")
        .type('form')
        .send({
            "title": "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field title");
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      const books = [
        new Book({"title": "first book", "comments": []}),
        new Book({"title": "second book", "comments": []}),
        new Book({"title": "third book", "comments": []}),
      ];
      test('Test GET /api/books',  function(done){
        Book.remove({}, (err, data) => {});
        Book.create(books, (err, save) => {});
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          const response = res.body;
          assert.equal(res.status, 200);
          assert.isArray(response, 'response should be an array');
          assert.equal(response.length, 3, 'response array should have 3 entries');
          assert.property(response[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(response[0], 'title', 'Books in array should contain title');
          assert.property(response[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/this_is_a_not_valid_id_for_test')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        const book = new Book({"title": "first book", "comments": []});
        book.save((err, data) => {
          if(data) {
            chai.request(server)
            .get(`/api/books/${data._id}`)
            .end(function(err, res){
              const response = res.body;
              assert.equal(res.status, 200);
              assert.isObject(response, 'response should be an object');
              assert.property(response, 'comments', 'Books in array should contain comments array');
              assert.property(response, 'title', 'Books in array should contain title');
              assert.property(response, '_id', 'Books in array should contain _id');
              assert.strictEqual(response.title, 'first book', 'title property should equal (first book)');
              assert.isArray(response.comments, '_id', 'comments property should be an array');
              assert.equal(response.comments.length, 0, 'comments array should be empty');
              done();
            });
          }
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const book = new Book({"title": "first book", "comments": []});
        book.save((err, data) => {
          if(data) {
            chai.request(server)
            .post(`/api/books/${data._id}`)
            .send({"comment": "test comment"})
            .end(function(err, res){
              const response = res.body;
              assert.equal(res.status, 200);
              assert.isObject(response, 'response should be an object');
              assert.property(response, 'comments', 'Books in array should contain comments array');
              assert.equal(response.comments[0], "test comment", 'comments array should contain an entry (test comment)');
              done();
            });
          }
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        const book = new Book({"title": "first book", "comments": []});
        book.save((err, data) => {
          if(data) {
            chai.request(server)
            .post(`/api/books/${data._id}`)
            .send({"comment": ""})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field comment", 'expected: missing required field comment');
              done();
            });
          }
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/this_is_an_unvalid_id_for_test')
        .send({"comment": "some comment"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists", 'expected: no book exists');
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        //done();
      });

    });

  });

});
