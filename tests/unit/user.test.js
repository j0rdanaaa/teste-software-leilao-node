
jest.mock('../../src/db', () => ({}));

jest.mock('../../src/userDAO', () => ({
    UserDAO: jest.fn().mockImplementation(() => ({
        addUser: jest.fn().mockResolvedValue({ id: 1, name: 'Maria' }),
        getUserById: jest.fn().mockResolvedValue({ id: 1, name: 'Maria' })
    }))
}));

const { addUser, getUserById } = require('../../src/user');

describe('User', () => {
    test('deve adicionar um usuário', async () => {
        const user = { id: 1, name: 'Maria' };

        const result = await addUser(user);

        expect(result).toEqual({ id: 1, name: 'Maria' });
    });

    test('deve buscar um usuário pelo ID', async () => {
        const result = await getUserById(1);

        expect(result).toEqual({ id: 1, name: 'Maria' });
    });
});
