
const fs = require('fs');
const path = require('path');

class DataStore {
    constructor(filePath) {
        this.filePath = path.join(__dirname, filePath);
    }

    read() {
        const data = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(data);
    }

    write(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    }

    addItem(item) {
        const items = this.read();
        items.push(item);
        this.write(items);
    }

    getItemByName(name) {
        const items = this.read();
        return items.find(item => item.name === name);
    }

    updateItem(name, updatedItem) {
        const items = this.read();
        const itemIndex = items.findIndex(item => item.name === name);
        if (itemIndex === -1) return null;
        items[itemIndex] = { ...items[itemIndex], ...updatedItem };
        this.write(items);
        return items[itemIndex];
    }

    deleteItem(name) {
        let items = this.read(); // Read current items from file
        const initialLength = items.length;
        items = items.filter(item => item.name !== name); // Remove the item with the matching name
        if (items.length === initialLength) {
            return false; // No item was removed
        }
        this.write(items); // Write the updated list back to the file
        return true;
    }
}

module.exports = DataStore;