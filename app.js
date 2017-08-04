var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _ = require('underscore');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/imooc',{ useMongoClient: true});


app.set('views','./views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);

console.log('imooc started on port ' + port);

//index page
app.get('/', function(req,res){
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err);
    }
    res.render('index',{
      title: 'imooc 首页',
      movies: movies
    })
  })
})

app.get('/movie/:id', function(req,res){
  var id = req.params.id;
  Movie.findById(id, function(err, movie){
    res.render('detail',{
      title: 'imooc ' + movie.title,
      movie: movie
    })
  })
})

app.get('/admin/movie', function(req,res){
  res.render('admin',{
    title: 'imooc 后台录入页',
    movie: {
      title: '',
      flash: ''
    }
  })
})

app.get('/admin/update/:id',function(req,res){
  var id = req.params.id;
  console.log(id);
  if(id){
    Movie.findById(id, function(err, movie){
      console.log(movie);
      res.render('admin',{
        title: 'imooc 后台更新页',
        movie: movie
      });
    });
  }
})


app.post('/admin/movie/new', function(req,res){
  var id = req.body['movie[_id]'];
  var movieObj = req.body;
  var _movie;

  if(id !== 'undefined'){
    Movie.findById(id, function(err, movie) {
      if(err) {
        console.log(err);
      }
      _movie = _.extend(movie, movieObj);
      _movie.save(function(err, movie){
        if(err){
          console.log(err);
        }
        res.redirect('/movie/' + movie._id);
      });
    });
  } else {
    _movie = new Movie({
      title: movieObj['movie[title]'],
      flash: movieObj['movie[flash]']
    });
    _movie.save(function(err, movie){
      if(err){
        console.log(err);
      }
      res.redirect('/movie/' + movie._id);
    });
  }
})

app.get('/admin/list', function(req,res){
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err);
    }
    res.render('list',{
      title: 'imooc 类表页',
      movies: movies
    })
  })
})
app.delete('/admin/list', function(req, res) {
    var id = req.query.id
    console.log(id);
    if(id) {
        Movie.remove({_id: id}, function(err, movie) {
            if(err) {
                console.log(err)
            }
            else {
                res.json({success: 1})
            }
        })
    }
})
