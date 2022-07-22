var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile('index.html', {
    root: path.join(__dirname, '../views')
  });
});

router.post('/', function (req, res) {
  console.log(req.body);
  res.send('test')
});

module.exports = router;
