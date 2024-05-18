const request = require('supertest');
const mongoose = require('mongoose');
const Product = require('../../../model/products');
const User = require('../../../model/users');
let server


describe('/api/products', () => {
    beforeEach(() => { server = require('../../../index') });
    afterEach(async () => {
        server.close(),
        await Product.deleteMany({})
        await User.deleteMany({})

    });

    describe('GET /', () => {
        it('should return all products', async () => {
            const user = await User.collection.insertOne({ fullName: 'user1', email: 'test1@test1.com', password: '123456',phoneNumber: '+234567890123', isAdmin: true});
            await Product.collection.insertMany([
                { name: 'product1', price: 100, description: 'product1 description', category: 'category1', image: 'image1', seller: user._id},
                { name: 'product2', price: 100, description: 'product2 description', category: 'category2', image: 'image2', seller: user._id }
            ]);

            const res = await request(server).get('/api/product');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(p => p.name === 'product1')).toBeTruthy();
            expect(res.body.some(p => p.name === 'product2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a product if valid id is passed', async () => {
            const user = await User.collection.insertOne({ fullName: 'user1', email: 'test1@test1.com', password: '123456', phoneNumber: '+234567890123', isAdmin: true });
            const product = new Product({ name: 'product1', price: 100, description: 'product1 description', category: 'category1', image: 'image1', seller: user._id });
            await product.save();
            const res = await request(server).get('/api/product/' + product._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', product.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/product/1');
            expect(res.status).toBe(404);
        });

        it('should return 404 if no product with the given id exists', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/product/' + id);
            expect(res.status).toBe(404);
        });

        
    });
});
