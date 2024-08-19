const express = require('express');
const router = express.Router();
const DataStore = require('../DataStore');

const store = new DataStore('items.json');

// GET /items - Get all items
router.get('/', (req, res) => {
    const items = store.read();
    res.json(items);
});

// POST /items - Add new item
router.post('/', (req, res) => {
    const { name, price } = req.body;
    const parsedPrice = parseFloat(price);

    // Validate that price is a number
    if (isNaN(parsedPrice)) {
        return res.status(400).json({ error: "Price must be a valid number" });
    }

    const newItem = { name, price: parsedPrice };
    store.addItem(newItem);
    res.status(201).json({ added: newItem });
});

// GET /items/:name - Get single item
router.get('/:name', (req, res) => {
    const foundItem = store.getItemByName(req.params.name);
    if (!foundItem) {
        return res.status(404).json({ error: "Item not found" });
    }
    res.json(foundItem);
});

// PATCH /items/:name - Update item
router.patch('/:name', (req, res) => {
    const { name, price } = req.body;
    const parsedPrice = price !== undefined ? parseFloat(price) : undefined;

    // Validate that price is a number if provided
    if (price !== undefined && isNaN(parsedPrice)) {
        return res.status(400).json({ error: "Price must be a valid number" });
    }

    const updatedItem = store.updateItem(req.params.name, {
        name: name !== undefined ? name : req.params.name,  // Preserve name if not updated
        price: parsedPrice || undefined
    });

    if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
    }
    res.json({ updated: updatedItem });
});


// DELETE /items/:name - Delete item
router.delete('/:name', (req, res) => {
    const success = store.deleteItem(req.params.name);
    if (!success) {
        return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Deleted" });
});

module.exports = router;
