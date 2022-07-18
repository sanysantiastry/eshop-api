require('dotenv').config();
const Hapi = require('@hapi/hapi');
const authentication = require('./api/authentication');
const Database = require('./conf/database');
const ClientError = require('./exceptions/ClientError');
const AuthenticationService = require('./services/mysql/AuthenticationService');
const AuthenticationValidator = require('./validator/authentication');

const init = async () => {
  const database = new Database();
  const authenticationService = new AuthenticationService(database);
  

    const server = Hapi.server({
      host: process.env.HOST,
      port: process.env.PORT,
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });
  

    server.route({
        method: 'GET',
        path: '/',
        handler: () => ({
          name: 'Sany Santiastry',
        }),
    });

    //products
    const products = require('./api/products');
    const ProductsService = require('./services/mysql/ProductsService');
    const ProductsValidator = require('./validator/products');
    const ClientError = require('./exceptions/ClientError');

    const init = async () => {
      const database = new Database();
      const authenticationService = new AuthenticationService(database);
      const productsService = new ProductsService(database);

      const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT,
        routes: {
          cors: {
            origin: ['*'],
          },
        },
      });

      server.route({
        method: 'GET',
        path: '/',
        handler: () => ({
          name: 'Sany Santiastry',
        }),
      });


    // extension
    server.ext('onPreResponse', (request, h) => {
      const {response} = request;
    
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
    
      console.log(response);
    
      return h.continue;
    });
    
  

    //defines internal plugins
    await server.register([
      {
        plugin: authentication,
        options: {
          service: authenticationService,
          validator: AuthenticationValidator,
        },
      }
    ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
    
  };
}
  init();