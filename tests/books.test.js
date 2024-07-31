const request = require('supertest');
const app = require('../server');

describe('Books API Tests', () => {
    let token;

    beforeAll(async () => {
        // Register an admin user to get a token
        await request(app)
            .post('/api/users/register')
            .send({ name: 'Admin', prenom: 'User', email: 'admin@example.com', password: 'password', role: 'admin' });

        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'admin@example.com', password: 'password' });

        token = res.body.token;
    });

    describe('GET /api/books', () => {
        it('should get all books', async () => {
            const response = await request(app)
                .get('/api/books')
                .set('Cookie', `token=${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('POST /api/books', () => {
        it('should add a new book', async () => {
            const response = await request(app)
                .post('/api/books')
                .set('Cookie', `token=${token}`)
                .send({ title: 'New Book', author: 'Author', date_publication: '2023-01-01', isbn: '1234567890', description: 'Description', status: 'disponible', cover: 'cover.jpg' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Livre ajouté');
        });

        it('should not add a book without token', async () => {
            const response = await request(app)
                .post('/api/books')
                .send({ title: 'New Book', author: 'Author', date_publication: '2023-01-01', isbn: '1234567890', description: 'Description', status: 'disponible', cover: 'cover.jpg' });

            expect(response.statusCode).toBe(401);
        });
    });

    describe('GET /api/books/:id', () => {
        it('should get a book by id', async () => {
            const response = await request(app)
                .get('/api/books/1')
                .set('Cookie', `token=${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id');
        });
    });

    describe('PUT /api/books/:id', () => {
        it('should update a book', async () => {
            const response = await request(app)
                .put('/api/books/1')
                .set('Cookie', `token=${token}`)
                .send({ title: 'Updated Book', author: 'Updated Author', date_publication: '2023-01-01', isbn: '1234567890', description: 'Updated Description', status: 'disponible', cover: 'updated_cover.jpg' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Livre mis à jour');
        });
    });

    describe('DELETE /api/books/:id', () => {
        it('should delete a book', async () => {
            const response = await request(app)
                .delete('/api/books/1')
                .set('Cookie', `token=${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Livre supprimé');
        });
    });
});