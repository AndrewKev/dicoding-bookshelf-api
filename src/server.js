const Hapi = require('@hapi/hapi');
const uuidv4 = require('crypto');
const { handleGet,
  handleGetById,
  handlePost,
  handlePut,
  handleDelete, } = require('./handler');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/books',
    handler: handleGet,
  });

  server.route({
    method: 'GET',
    path: '/books/{id}',
    handler: handleGetById,
  });

  server.route({
    method: 'POST',
    path: '/books',
    handler: handlePost,
  });

  server.route({
    method: 'PUT',
    path: '/books/{id}',
    handler: handlePut,
  });

  server.route({
    method: 'DELETE',
    path: '/books/{id}',
    handler: handleDelete,
  });

  await server.start();
  console.log('Server berjalan di %s', server.info.uri);
};

init();