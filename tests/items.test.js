const request = require('supertest');
const app = require('../index');
const fs = require('fs');
const path = require('path');

const testFilePath = path.join(__dirname, '../items.json');

const resetItemsFile = () => {
    fs.writeFileSync(testFilePath, JSON.stringify([], null, 2));
};

beforeEach(() => {
    resetItemsFile();
});

afterEach(() => {
    resetItemsFile();
});

describe('Items API', () => {
    test('GET /items - Should return an empty list initially', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('POST /items - Should add a new item with a float price', async () => {
        const res = await request(app).post('/items').send({ name: 'popsicle', price: 1.99 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { name: 'popsicle', price: 1.99 } });
    });

    test('POST /items - Should add an item with a price of 0', async () => {
        const res = await request(app).post('/items').send({ name: 'free popsicle', price: 0 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { name: 'free popsicle', price: 0 } });
    });

    test('POST /items - Should add an item with a very high price', async () => {
        const res = await request(app).post('/items').send({ name: 'expensive popsicle', price: 999999.99 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { name: 'expensive popsicle', price: 999999.99 } });
    });

    test('PATCH /items/:name - Should update only the price of the item', async () => {
        await request(app).post('/items').send({ name: 'popsicle', price: 1.99 });
        const res = await request(app).patch('/items/popsicle').send({ price: 2.99 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: 'popsicle', price: 2.99 } });
    });
    test('GET /items/:name - Should return 404 for non-existent item', async () => {
        const res = await request(app).get('/items/nonexistent');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "Item not found" });
    });
    test('DELETE /items/:name - Should return 404 for non-existent item', async () => {
        const res = await request(app).delete('/items/nonexistent');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "Item not found" });
    });

});
