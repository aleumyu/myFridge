const express = require('express');
const db = require("../model/helper");
const router = express.Router();

function sendResponseBody(boolean, text) {
  let responseBody = {
    success: boolean,
    message: text
  };
  return responseBody;

}

// GET all items
router.get('/api/v1/items', (req, res, next) => { //api/v1/items?is_fridge===1) then query params
  db('SELECT * FROM items ORDER BY date ASC;')
    .then(results => {
      if (results.error) { // where .error and .data come from? JS? Express?
        res.status(404).send(results.error);
      }
      console.log('results: ' + JSON.stringify(results.data));
      res.status(200).send(results.data);
    })  // why we don-t throw Error?? actually it does not work
});

// GET an item by Id
router.get('/api/v1/items/:id', async (req, res, next) => {
  try {
    const itemById = await db(`SELECT * FROM items WHERE id = ${req.params.id};`); 
    if (!itemById.data[0]) {
      return res.status(404).send(sendResponseBody(false, `there is no item matched with id ${req.params.id}`));
    }
    res.status(200).send(itemById.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST a new item
router.post('/api/v1/items', async (req, res, next) => {
  if (!req.body.name || !req.body.fridge || !req.body.date || !req.body.category) {
    res.status(400).send(sendResponseBody(false, 'Some info is missing'));
  } else {
    try { 
      const addItem = await db(`INSERT INTO items (name, fridge, date, quantity, category) VALUES ('${req.body.name}', ${req.body.fridge}, '${req.body.date}', '${req.body.quantity}', '${req.body.category}'); SELECT LAST_INSERT_ID();`);
      res.status(200).send(sendResponseBody(true, `Successfully POST ${addItem}`));
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

// DELETE an item
router.delete('/api/v1/items/:id', async (req, res, next) => {
  try {
    const deleteItem = await db(`DELETE FROM items WHERE id = ${req.params.id};`);
    if (!deleteItem.data[0]) {
      return res.status(404).send(sendResponseBody(false, `there is no item matched with id ${req.params.id}`));
    }
    res.status(200).send(sendResponseBody(true, 'Successfully DELETE'))  
  } catch (error) {
      res.status(500).send(error);
  }
});

// UPDATE the quantity and/or the location of an item
router.put('/api/v1/items/:id', async (req, res, next) => {
  try {
    if (req.body.fridge) {
      await db(`UPDATE items SET fridge = ${req.body.fridge} WHERE id = ${req.params.id};`)    
    }
    if (req.body.quantity) {
      await db(`UPDATE items SET quantity = ${req.body.quantity} WHERE id = ${req.params.id};`)
    }
    res.status(200).send(sendResponseBody(true, 'Successfully UPDATE')) 
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
