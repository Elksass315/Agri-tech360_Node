const Blog = require('../../../model/blogs');
const mongoose = require('mongoose');


describe('bloge.like', () => {
    it('should increment likes by 1', async () => {
        const blog = new Blog({
            title: 'test',
            content: 'test content',
            writer: { userid: new mongoose.Types.ObjectId().toHexString() },
            category: ['test'],
            images: ['test.jpg']
        });
        
        blog.like(new mongoose.Types.ObjectId().toHexString());
        expect(blog.likes).toBe(1);
    });

    it('should not increment likes if user already liked the blog', async () => {
        const userId = new mongoose.Types.ObjectId().toHexString();
        const blog = new Blog({
            title: 'test',
            content: 'test content',
            writer: { userid: new mongoose.Types.ObjectId().toHexString() },
            category: ['test'],
            images: ['test.jpg']
        });
        blog.like(userId);
        blog.like(userId);
        expect(blog.likes).toBe(1);
    });
    
    it('should decrement likes by 1', async () => {
        const userId = new mongoose.Types.ObjectId().toHexString();
        const blog = new Blog({
            title: 'test',
            content: 'test content',
            writer: { userid: new mongoose.Types.ObjectId().toHexString() },
            category: ['test'],
            images: ['test.jpg']
        });
        blog.like(userId);
        blog.unlike(userId);
        expect(blog.likes).toBe(0);
    });

    it('should not decrement likes if user has not liked the blog', async () => {
        const userId = new mongoose.Types.ObjectId().toHexString();
        const blog = new Blog({
            title: 'test',
            content: 'test content',
            writer: { userid: new mongoose.Types.ObjectId().toHexString() },
            category: ['test'],
            images: ['test.jpg']
        });
        blog.unlike(userId);
        expect(blog.likes).toBe(0);
    });
});
