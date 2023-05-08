import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        authorizer: {
          name: 'basicAuthorizer',
          type: `token`,
          resultTtlInSeconds: 0,
          arn: 'arn:aws:lambda:${self:provider.region}:031679763700:function:authorization-service-dev-basicAuthorizer',
          identitySource: 'method.request.header.Authorization',
        }
      }
    }
  ]
};
