const express = require('express');
const db = require("../model/helper");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/api/v1/items', (req, res, next) => { //api/v1/items?is_fridge===1) then query params
  db('SELECT * FROM items ORDER BY date ASC;')
    .then(results => {
      if (results.error) { // where .error and .data come from? JS? Express?
        res.status(404).send(results.error);
      }
      console.log('results: ' + JSON.stringify(results.data));
      res.send(results.data);
    })  // why we don-t throw Error?? actually it does not work
});

module.exports = router;
