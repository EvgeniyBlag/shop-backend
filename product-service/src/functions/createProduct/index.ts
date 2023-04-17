import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.createProduct`,
  events: [
    {
      http: {
        method: 'put',
        path: 'products',
        cors: true,
        responseData: {
          200: {
              description: 'Product created'
          },
          400: {
              description: 'Bad Request. Check your product data',
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    }
  ]
};
