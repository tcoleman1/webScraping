const axios = require('axios');
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const db = require("../models");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

module.exports = function (app) {
  // home page
  app.get('/', function (req, res) {
    db.Article.find({saved: false}, function(err, data){
      res.render('home', { home: true, article : data });
    })
  });

  // saved pages
  app.get('/saved', function (req, res) {
    db.Article.find({saved: true}, function(err, data){
      res.render('saved', { home: false, article : data });
    })
  });

  // save article to database by changed saved field to true
  app.put("/api/headlines/:id", function(req, res){
    var saved = req.body.saved == 'true'
    if(saved){
      db.Article.updateOne({_id: req.body._id},{$set: {saved:true}}, function(err, result){
      if (err) {
        console.log(err)
      } else {
        return res.send(true)
      }
    });
    }
  });

  // delete article from database
  app.delete("/api/headlines/:id", function(req, res){
    console.log('reqbody:' + JSON.stringify(req.params.id))
    db.Article.deleteOne({_id: req.params.id}, function(err, result){
      if (err) {
        console.log(err)
      } else {
        return res.send(true)
      }
    });
  });


  app.get("/api/fetch", function(req, res){

  axios.get("https://theundefeated.com/hbcu/").then(function(response) {

  const $ = cheerio.load(response.data);

    $("article").each(function(i, element) {

      var result = {};
      result.headline = $(element).find("h2").text().trim();
      result.url = 'https://theundefeated.com/hbcu/' + $(element).find("a").attr("href");
      result.summary = $(element).find("p").text().trim();

      if (result.headline !== '' && result.summary !== ''){
			db.Article.findOne({headline: result.headline}, function(err, data) {
        if(err){
          console.log(err)
        } else {
          if (data === null) {
					db.Article.create(result)
           .then(function(dbArticle) {
             console.log(dbArticle)
          })
          .catch(function(err) {
         
          console.log(err)
          });
				}
        console.log(data)
        }
			});
      }

      });
    res.send("Scrape completed!");
  });
  });

  app.get("/api/notes/:id", function(req, res){
   
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle){
      console.log(dbArticle.note)
      res.json(dbArticle.note)
    })
    .catch(function(err){
      res.json(err)
    })
  });
/// adding notes to the article
    app.post("/api/notes", function(req, res){
    console.log(req.body)
    db.Note.create({ noteText: req.body.noteText })
    .then(function(dbNote){
      console.log('dbNote:' + dbNote)
      return db.Article.findOneAndUpdate({ _id:req.body._headlineId}, 
      { $push: {note: dbNote._id} }, 
      {new: true})
    })
    .then(function(dbArticle){
      console.log('dbArticle:'+dbArticle)
      res.json(dbArticle)
    })
    .catch(function(err){
      res.json(err);
    })
  });

  // deleting notes from an article
  app.delete("/api/notes/:id", function(req, res){
    console.log('reqbody:' + JSON.stringify(req.params.id))
    db.Note.deleteOne({_id: req.params.id}, function(err, result){
      if (err) {
        console.log(err)
      } else {
        return res.send(true)
      }
    });
  });

  // clear all articles from database
  app.get("/api/clear", function(req, res){
    console.log(req.body)
    db.Article.deleteMany({}, function(err, result){
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        res.send(true)
      }
    })
  });
}