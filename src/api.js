
const express = require('express');
const db = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express();

app.use(express.json());
// Documentação interativa da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota inicial para verificar se a API funciona
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Leilões funcionando!'
    });
});

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna todos os usuários cadastrados no banco de dados.
 *     tags:
 *       - Usuários
 *     responses:
 *       '200':
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         description: Erro interno ao consultar usuários
 */

// GET - Lista todos os usuários cadastrados
app.get('/users', (req, res) => {
    db.all('SELECT id, name FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                erro: 'Erro ao consultar usuários'
            });
        }

        res.json(rows);
    });
});


/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     description: Retorna os dados de um usuário específico.
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       '200':
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: ID inválido
 *       '404':
 *         description: Usuário não encontrado
 *       '500':
 *         description: Erro interno do servidor
 */

// GET - Busca um usuário pelo ID
app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            erro: 'ID inválido'
        });
    }

    db.get(
        'SELECT id, name FROM users WHERE id = ?',
        [id],
        (err, user) => {
            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao buscar usuário'
                });
            }

            if (!user) {
                return res.status(404).json({
                    erro: 'Usuário não encontrado'
                });
            }

            res.json(user);
        }
    );
});

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Cadastra um novo usuário
 *     description: Adiciona um usuário ao banco de dados.
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Dados inválidos
 *       '409':
 *         description: ID já cadastrado
 *       '500':
 *         description: Erro interno do servidor
 */


 // POST - Cadastra um novo usuário
app.post('/users', (req, res) => {
    const { id, name } = req.body;

    if (!Number.isInteger(id) || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            erro: 'Informe um ID inteiro e um nome válido'
        });
    }

    db.run(
        'INSERT INTO users (id, name) VALUES (?, ?)',
        [id, name.trim()],
        function (err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(409).json({
                        erro: 'ID de usuário já cadastrado'
                    });
                }

                return res.status(500).json({
                    erro: 'Erro ao cadastrar usuário'
                });
            }

            res.status(201).json({
                id,
                name: name.trim()
            });
        }
    );
});

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     description: Atualiza o nome de um usuário cadastrado.
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário que será atualizado
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alice Silva
 *     responses:
 *       '200':
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: ID ou nome inválido
 *       '404':
 *         description: Usuário não encontrado
 *       '500':
 *         description: Erro interno do servidor
 */


 // PUT - Atualiza um usuário pelo ID
app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: 'ID inválido'
        });
    }

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            erro: 'Informe um nome válido'
        });
    }

    db.run(
        'UPDATE users SET name = ? WHERE id = ?',
        [name.trim(), id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao atualizar usuário'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro: 'Usuário não encontrado'
                });
            }

            res.json({
                id,
                name: name.trim()
            });
        }
    );
});

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Exclui um usuário
 *     description: Remove um usuário cadastrado pelo ID.
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário que será excluído
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       '200':
 *         description: Usuário excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Usuário excluído com sucesso
 *       '400':
 *         description: ID inválido
 *       '404':
 *         description: Usuário não encontrado
 *       '500':
 *         description: Erro interno do servidor
 */


 // DELETE - Exclui um usuário pelo ID
app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: 'ID inválido'
        });
    }

    db.run(
        'DELETE FROM users WHERE id = ?',
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao excluir usuário'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro: 'Usuário não encontrado'
                });
            }

            res.json({
                mensagem: 'Usuário excluído com sucesso'
            });
        }
    );
});


// Inicia o servidor
if (require.main === module) {
    app.listen(3000, () => {
        console.log('API rodando em http://localhost:3000');
    });
}

module.exports = app;
