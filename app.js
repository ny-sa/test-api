const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://nysa:12345@cluster0-cz3ei.mongodb.net/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) res.send(foundArticles);
      else res.send(err);
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save(err => {
      if (!err) res.send('Successfully added a new article.');
      else res.send(err);
    });
  })
  .delete((req, res) => {
    Article.deleteMany(err => {
      if (!err) res.send('Successfully deleted all articles.')
      else res.send(err);
    })
  })

app.route('/articles/:articleTitle')
  .get((req, res) => {
    Article.findOne({title:req.params.articleTitle}, (err, foundArticle) => {
      if (!err) res.send(foundArticle);
      else res.send(err);
    });
  })
  .put((req, res) => {
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      (err) => {
        if (!err) res.send('Successfully updated article');
        else res.send(err);
      }
    )
  })
  .patch((req, res) => {
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      (err) => {
        if (!err) res.send('Successfully updated article');
        else res.send(err);
      }
    )
  })
  .delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}, (err) => {
      if (!err) res.send('Successfully deleted article')
      else res.send(err);
    });
  });

app.listen(process.env.PORT || 2020, function() {
  console.log("Server started on port 2020");
});
