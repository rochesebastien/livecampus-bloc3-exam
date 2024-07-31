const request = require('supertest');
const app = require('./server');

describe('API Tests', () => {
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

    describe('POST /api/users/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({ name: 'Doe', prenom: 'John', email: 'john@example.com', password: 'password', role: 'user' });

            expect(response.statusCode).toBe(200);
        });

        it('should not register a user with missing fields', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({ name: 'Doe', email: 'john@example.com', password: 'password' });

            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST /api/users/login', () => {
        it('should sign in a user', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({ email: 'john@example.com', password: 'password' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should not sign in with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({ email: 'john@example.com', password: 'wrongpassword' });

            expect(response.statusCode).toBe(400);
        });
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

    describe('POST /api/emprunts', () => {
        it('should create a new emprunt', async () => {
            const response = await request(app)
                .post('/api/emprunts')
                .set('Cookie', `token=${token}`)
                .send({ userId: 1, bookId: 1 });

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('id_utilisateur', 1);
        });

        it('should not create an emprunt without token', async () => {
            const response = await request(app)
                .post('/api/emprunts')
                .send({ userId: 1, bookId: 1 });

            expect(response.statusCode).toBe(401);
        });
    });

    describe('GET /api/emprunts/:user_id', () => {
        it('should get emprunt history for a user', async () => {
            const response = await request(app)
                .get('/api/emprunts/1')
                .set('Cookie', `token=${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('PUT /api/emprunts/return/:empruntId', () => {
        it('should return a book', async () => {
            const response = await request(app)
                .put('/api/emprunts/return/1')
                .set('Cookie', `token=${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id_emprunt', 1);
        });
    });
});