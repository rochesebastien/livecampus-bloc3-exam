const request = require('supertest');
const app = require('../server');

describe('Emprunts API Tests', () => {
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