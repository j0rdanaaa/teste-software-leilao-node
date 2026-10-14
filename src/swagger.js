
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Leilões',
            version: '1.0.0',
            description: 'Documentação da API desenvolvida na Aula 9 de Back-End II'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            example: 'Alice'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/api.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
