import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'A simple API for user management',
        },
        servers: [
            {
                url: 'http://localhost:7800',
            },
        ],
    },
    apis: ['./router/user.js'] 
};

const userSwaggerSpecs = swaggerJsdoc(options);

export default userSwaggerSpecs; 