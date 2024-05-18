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

    describe('POST /', () => {
        let token;
        let name;
        let price;
        let description;
        let category;
        let image;

        const exec = async () => {
            return await request(server)
                .post('/api/product')
                .set('x-auth-token', token)
                .send({ name, price, description, category, image });
        }

        beforeEach( async() => {
            const user = new User({ fullName: 'usertest', email: 'test1@test1.com', password: '123456', phoneNumber: '+234567890123', isAdmin: true });
            await user.save();
            token = user.generateAuthToken();
            name = 'product1';
            price = 100;
            description = 'product1 description';
            category = 'category1';
            image = 'image1';
        });

        afterEach(async () => {
            server.close(),
                await Product.deleteMany({})
            await User.deleteMany({})
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if product name is more than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the product if it is valid', async () => {
            await exec();
            const product = Product.find({ name: 'product1' });
            expect(product).not.toBeNull();
        });

        it('should return the product if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('name', 'product1');
        });
    });

    describe('PUT /:id', () => {
        let token;
        let newName;
        let newPrice;
        let newDescription;
        let newCategory;
        let newImage;
        let product;
        let user;
        let id;

        beforeEach(async () => {
            user = new User({ fullName: 'usertest', email: 'test1@test1.com', password: '123456', phoneNumber: '+234567890123', isAdmin: true });
            await user.save();
            product = new Product({ name: 'product1', price: 100, description: 'product1 description', category: 'category1', seller: user._id });
            await product.save();
            token = user.generateAuthToken();
            newName = 'productnewname';
            newPrice = 101;
            newDescription = 'product1 new description';
            newDescription = 'categorynewname';
            id = product._id;
        });

        afterEach(async () => {
            server.close(),
            await Product.deleteMany({})
            await User.deleteMany({})
        });

        const exec = async () => {
            return await request(server)
                .put('/api/product/' + id)
                .set('x-auth-token', token)
                .send({ name: newName, price: newPrice, description: newDescription, category: newCategory, image: newImage });
        }

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if product name is more than 50 characters', async () => {
            newName = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 404 if invalid id is passed', async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 404 if no product with the given id exists', async () => {
            id = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });
    });

});
