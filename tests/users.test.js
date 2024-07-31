const request = require('supertest');
const app = require('../server');

describe('Users API Tests', () => {
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

    describe('GET /api/users', () => {
        it('should get all users', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Cookie', `token=${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should get a user by id', async () => {
            const response = await request(app)
                .get('/api/users/1')
                .set('Cookie', `token=${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id');
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update a user', async () => {
            const response = await request(app)
                .put('/api/users/1')
                .set('Cookie', `token=${token}`)
                .send({ name: 'Updated Name', prenom: 'Updated Prenom', email: 'updated@example.com', role: 'user' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Utilisateur mis à jour');
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete a user', async () => {
            const response = await request(app)
                .delete('/api/users/1')
                .set('Cookie', `token=${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Utilisateur supprimé');
        });
    });
});