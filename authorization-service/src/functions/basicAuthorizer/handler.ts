import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent
} from 'aws-lambda';

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  const { authorizationToken, methodArn } = event;

  const userCredentials = decodeAuthToken(authorizationToken);

  const storedPassword = process.env[userCredentials.name];
  if (storedPassword && storedPassword === userCredentials.password) {
    return generatePolicy(authorizationToken, methodArn, 'Allow');
  }

  return generatePolicy(authorizationToken, methodArn, 'Deny');
}

const generatePolicy = (principalId, resource, effect): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        }
      ]
    },
  };
}

const decodeAuthToken = (authToken) => {
  const [ prefix, data ] = authToken.split(' ');
  const [ name, password ] = Buffer.from(data, 'base64').toString('utf-8').split(':');

  return {
    name,
    password
  }
}