import type { AWS } from '@serverless/typescript';
import { apiUrl } from './src/vars';

import getProductsById from '@functions/getProductsById';
import getProductsList from '@functions/getProductsList';
import createProduct from '@functions/createProduct';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem'
            ],
            Resource: [
              'arn:aws:dynamodb:${aws:region}:*:table/${self:provider.environment.PRODUCTS_TABLE}',
              'arn:aws:dynamodb:${aws:region}:*:table/${self:provider.environment.STOCKS_TABLE}',
            ]
          }
        ]
      }
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE: 'products',
      STOCKS_TABLE: 'stocks'
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: process.env.PRODUCTS_TABLE ?? 'products',
          AttributeDefinitions:[
            { AttributeName: 'id', AttributeType: 'S' },
          ],
          KeySchema:[
            { AttributeName: 'id', KeyType: 'HASH' }
          ],
          BillingMode: 'PAY_PER_REQUEST'
        }
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: process.env.STOCKS_TABLE ?? 'stocks',
          AttributeDefinitions:[
            { AttributeName: 'product_id', AttributeType: 'S' }
          ],
          KeySchema:[
            { AttributeName: 'product_id', KeyType: 'HASH' }
          ],
          BillingMode: 'PAY_PER_REQUEST'
        }
      }
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      host: apiUrl,
      basePath: '/dev'
    }
  },
};

module.exports = serverlessConfiguration;
