var express = require('express');
var router = express.Router();
var spotify = require('../websockets/spotify')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('detail/detail', { title: 'Jingle vs Jangle' });
});

router.get('/suggest-song', function(req, res, next) {
  res.render('detail/suggestSong', { title: 'Suggest a Song | Jingle vs Jangle' });
});

router.get('/song-search', function(req, res, next) {
  spotify.searchSong('test')
  .then((data) => {
    res.json(data)
  })
  .catch((err) => {
    res.json({error: "error"})
  })
})

module.exports = router;
