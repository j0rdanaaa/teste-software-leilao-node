const { UserDAO } = require("../../src/userDAO");

describe("UserDAO (mock)", () => {
  test("deve adicionar usuário com sucesso", async () => {
    // mock do db
    const mockDb = {
      run: jest.fn((stmt, params, callback) => {
        callback.call({ changes: 1 }, null); // simula sucesso
      }),
    };

    const userDAO = new UserDAO(mockDb);

    const result = await userDAO.addUser({ id: 1, name: "João" });

    expect(mockDb.run).toHaveBeenCalled();
    expect(result).toEqual({ changes: 1 });
  });

  test("deve retornar usuário pelo ID", async () => {
    const mockDb = {
      get: jest.fn((stmt, params, callback) => {
        callback(null, { id: 1, name: "João" });
      }),
    };

    const userDAO = new UserDAO(mockDb);

    const result = await userDAO.getUserById(1);

    expect(mockDb.get).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, name: "João" });
  });

  test("deve lançar erro ao adicionar usuário nulo", () => {
    const mockDb = {};
    const userDAO = new UserDAO(mockDb);

    expect(() => userDAO.addUser(null)).toThrow("User must be provided");
  });

  test("deve rejeitar quando o banco falhar ao adicionar usuário", async () => {
    const mockDb = {
      run: jest.fn((stmt, params, callback) => {
        callback(new Error("Erro no banco"));
      }),
    };

    const userDAO = new UserDAO(mockDb);

    await expect(userDAO.addUser({ id: 1, name: "João" })).rejects.toThrow(
      "Erro no banco",
    );
  });

  test("deve rejeitar quando o banco falhar ao buscar usuário", async () => {
    const mockDb = {
      get: jest.fn((stmt, params, callback) => {
        callback(new Error("Erro ao buscar usuário"));
      }),
    };

    const userDAO = new UserDAO(mockDb);

    await expect(userDAO.getUserById(1)).rejects.toThrow(
      "Erro ao buscar usuário",
    );
  });
  
test('deve retornar null quando usuário não for encontrado', async () => {
    const mockDb = {
        get: jest.fn((stmt, params, callback) => {
            callback(null, undefined);
        })
    };

    const userDAO = new UserDAO(mockDb);

    const result = await userDAO.getUserById(999);

    expect(mockDb.get).toHaveBeenCalled();
    expect(result).toBeNull();
});
});
