'use strict';
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
const bookSchema  =  new mongoose.Schema({
  title:  {type:String, required: true},
  comments: [String]
}, {versionKey: false});
let Book =  mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, data) =>{
        if(data) {
          res.json(data.map(item => {
            return {"_id": item._id, "title": item.title, "commentcount": item.comments.length }
          }));
        }
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(title) {
        const book = new Book({title: title});
        book.save((err, data) => {
          if(data) {
            res.json(data);
          }
        });
      } else {
        res.send("missing required field title");
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
