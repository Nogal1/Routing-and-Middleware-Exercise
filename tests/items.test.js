const request = require('supertest');
const app = require('../index');
const fs = require('fs');
const path = require('path');
const http = require('http');

const testFilePath = path.join(__dirname, '../items.json');
let server;

// Utility function to reset the items.json file before each test
const resetItemsFile = () => {
    fs.writeFileSync(testFilePath, JSON.stringify([], null, 2));
};

beforeAll((done) => {
    resetItemsFile();
    server = http.createServer(app);
    server.listen(3000, done);
});

afterAll((done) => {
    resetItemsFile();
    server.close(done);
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
        expect(res.body).toEqual({
            added: { name: 'popsicle', price: 1.99 }
        });

        const getRes = await request(app).get('/items');
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body).toEqual([{ name: 'popsicle', price: 1.99 }]);
    });

    test('POST /items - Should return 400 if price is not a valid number', async () => {
        const res = await request(app).post('/items').send({ name: 'popsicle', price: 'invalid' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Price must be a valid number" });
    });

    test('GET /items/:name - Should return the correct item', async () => {
        await request(app).post('/items').send({ name: 'popsicle', price: 1.99 });

        const res = await request(app).get('/items/popsicle');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ name: 'popsicle', price: 1.99 });
    });

    test('GET /items/:name - Should return 404 for non-existing item', async () => {
        const res = await request(app).get('/items/nonexistent');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "Item not found" });
    });

    test('PATCH /items/:name - Should update the item', async () => {
        await request(app).post('/items').send({ name: 'popsicle', price: 1.99 });

        const res = await request(app).patch('/items/popsicle').send({ price: 2.99 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            updated: { name: 'popsicle', price: 2.99 }
        });

        const getRes = await request(app).get('/items/popsicle');
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body).toEqual({ name: 'popsicle', price: 2.99 });
    });

    test('PATCH /items/:name - Should return 400 if new price is not a valid number', async () => {
        await request(app).post('/items').send({ name: 'popsicle', price: 1.99 });

        const res = await request(app).patch('/items/popsicle').send({ price: 'invalid' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Price must be a valid number" });
    });

    test('PATCH /items/:name - Should return 404 for non-existing item', async () => {
        const res = await request(app).patch('/items/nonexistent').send({ price: 2.99 });
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "Item not found" });
    });

    test('DELETE /items/:name - Should delete the item', async () => {
        // Add an item first
        await request(app).post('/items').send({ name: 'popsicle', price: 1.99 });

        // Delete the item
        const res = await request(app).delete('/items/popsicle');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Deleted" });

        // Check that the item has been deleted
        const getRes = await request(app).get('/items');
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body).toEqual([]); // Expect the list to be empty
    });


    test('DELETE /items/:name - Should return 404 for non-existing item', async () => {
        const res = await request(app).delete('/items/nonexistent');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "Item not found" });
    });

});
