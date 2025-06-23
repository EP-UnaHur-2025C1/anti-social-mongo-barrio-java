const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Barrio Java API',
            version: '1.0.0',
            description: 'PI del TP de Backend (Comisión 2)',
        },
        servers: [
            {
                url: 'http://localhost:3005',
                description: 'Servidor local',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;