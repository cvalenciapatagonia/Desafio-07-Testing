const request = require('supertest');
const server = require('../index');

const generateUniqueId = () => {
    return Math.floor(Math.random() * 1000) + 1;
};

describe('COFFEE CRUD', () => {
    it('CÓDIGO DE ESTADO 200, EL CUERPO ES UN ARREGLO CON AL MENOS 1 OBJETO.', async () => {
        const response = await request(server).get('/cafes').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('CÓDIGO DE ESTADO 404 DESPUÉS DE ELIMINAR UN ID INEXISTENTE', async () => {
        const response = await request(server).get('/cafes').send();
        const idToDelete = generateUniqueId();
        const { statusCode } = await request(server).delete(`/cafes/${idToDelete}`);
        expect(statusCode).toBe(404);
    });

    it('CÓDIGO DE ESTADO 201 AL AGREGAR UN NUEVO CAFÉ', async () => {
        const response = await request(server).get('/cafes').send();
        const newID = generateUniqueId();
        const { statusCode } = await request(server).post('/cafes').send({
            id: newID,
            nombre: 'Your new Brand coffee-name!'
        });
        expect(statusCode).toBe(201);
    });

    it('CÓDIGO DE ESTADO 400 DESPUÉS DE INTENTAR ACTUALIZAR UN CAFÉ CON UN ID DIFERENTE/INEXISTENTE.', async () => {
        const response = await request(server).get('/cafes').send();
        const newID = generateUniqueId();
        const firstCoffee = response.body[0];
        const { statusCode } = await request(server).put(`/cafes/${newID}`).send(firstCoffee);
        expect(statusCode).toBe(400);
    });

    it('CÓDIGO DE ESTADO 404 AL OBTENER UN CAFÉ CON ID INEXISTENTE', async () => {
        const id = generateUniqueId();
        const { statusCode } = await request(server).get(`/cafes/${id}`).send();
        expect(statusCode).toBe(404);
    });

    it('CÓDIGO DE ESTADO 400 AL ACTUALIZAR UN CAFÉ CON UN ID DIFERENTE EN EL PAYLOAD', async () => {
        const response = await request(server).get('/cafes').send();
        const newID = generateUniqueId();
        const { statusCode } = await request(server).put(`/cafes/${newID}`).send({ id: newID + 1 });
        expect(statusCode).toBe(400);
    });

    it('CÓDIGO DE ESTADO 404 AL INTENTAR ELIMINAR UN CAFÉ CON ID INEXISTENTE', async () => {
        const id = generateUniqueId();
        const { statusCode } = await request(server).delete(`/cafes/${id}`).send();
        expect(statusCode).toBe(404);
    });
});
