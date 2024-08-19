const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'items.json');

function readItems() {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function writeItems(items) {
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
}


module.exports = { readItems, writeItems };
