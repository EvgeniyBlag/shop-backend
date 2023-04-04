import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        responseData: {
          200: {
            description: 'Product from products list'
          },
          404: {
            description: 'Not Found'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    }
  ]
};
