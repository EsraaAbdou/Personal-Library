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
      Book.remove({}, (err, data) => {
        if(data){
          res.send("complete delete successful");
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(bookid, (err, data) => {
        if(data) res.json(data);
        else res.send("no book exists");
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(comment){
        Book.findByIdAndUpdate(bookid, {$push: {comments: comment}}, {new: true}, (err, data) => {
          if(data) res.json(data);
          else res.send("no book exists");
        });
      } else {
        res.send("missing required field comment");
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findByIdAndRemove(bookid, (err, data) => {
        if(data) res.send("delete successful");
        else res.send("no book exists");
      });
    });
  
};
