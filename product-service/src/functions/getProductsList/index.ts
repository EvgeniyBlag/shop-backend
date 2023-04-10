import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        responseData: {
          200: {
              description: 'List of products'
          },
          404: {
              description: 'Not Found',
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    }
  ]
};
