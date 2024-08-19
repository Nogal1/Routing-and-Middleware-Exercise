const express = require('express');
const router = express.Router();
let items = require('../fakeDb');

// GET /items
router.get('/', (req, res) => {
    res.json(items);
});

// POST /items
router.post('/', (req, res) => {
    const { name, price } = req.body;
    const newItem = { name, price: parseFloat(price) };
    items.push(newItem);
    res.status(201).json({ added: newItem });
});

// GET /items/:name
router.get('/:name', (req, res) => {
    const foundItem = items.find(item => item.name === req.params.name);
    if (!foundItem) {
        return res.status(404).json({ error: "Item not found" });
    }
    res.json(foundItem);
});

// PATCH /items/:name
router.patch('/:name', (req, res) => {
    const foundItem = items.find(item => item.name === req.params.name);
    if (!foundItem) {
        return res.status(404).json({ error: "Item not found" });
    }
    foundItem.name = req.body.name || foundItem.name;
    foundItem.price = req.body.price !== undefined ? parseFloat(req.body.price) : foundItem.price;
    res.json({ updated: foundItem });
});

// DELETE /items/:name
router.delete('/:name', (req, res) => {
    const itemIndex = items.findIndex(item => item.name === req.params.name);
    if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
    }
    items.splice(itemIndex, 1);
    res.json({ message: "Deleted" });
});

module.exports = router;
