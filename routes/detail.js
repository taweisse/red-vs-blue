var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('detail/detail', { title: 'Jingle vs Jangle' });
});

router.get('/suggest-song', function(req, res, next) {
  res.render('detail/suggestSong', { title: 'Suggest a Song | Jingle vs Jangle' });
});

module.exports = router;
