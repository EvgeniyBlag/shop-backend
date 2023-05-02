import type { AWS } from '@serverless/typescript';
import { apiUrl } from './src/vars';

import getProductsById from '@functions/getProductsById';
import getProductsList from '@functions/getProductsList';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

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
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] }
          },
          {
            Effect: 'Allow',
            Action: 'sns:*',
            Resource: {
              Ref: 'CreateProductTopic'
            }
          }
        ]
      }
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE: 'products',
      STOCKS_TABLE: 'stocks',
      TABLE_THROUGHPUT: '1',
      SQS_CSV_NAME: 'catalog-items-queue',
      SNS_TOPIC_NAME: 'sns-topic',
      SNS_ARN: {
        Ref: 'CreateProductTopic'
      }
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: '${self:provider.environment.SQS_CSV_NAME}'
        }
      },
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: '${self:provider.environment.SNS_TOPIC_NAME}'
        }
      },
      SNSTopicSubscriptionCasio: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'evgeniy.blagodarov@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'CreateProductTopic'
          },
          FilterPolicyScope: 'MessageBody',
          FilterPolicy: {
            title: [
              'Casio',
              'Roland'
            ],
          },
        }
      },
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
          ProvisionedThroughput: {
            ReadCapacityUnits: '${self:provider.environment.TABLE_THROUGHPUT}',
            WriteCapacityUnits: '${self:provider.environment.TABLE_THROUGHPUT}'
          }
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
          ProvisionedThroughput: {
            ReadCapacityUnits: '${self:provider.environment.TABLE_THROUGHPUT}',
            WriteCapacityUnits: '${self:provider.environment.TABLE_THROUGHPUT}'
          }
        }
      }
    },
    Outputs: {
      sqsUrl: {
        Value: {
          Ref: 'CatalogItemsQueue'
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
  }
};

module.exports = serverlessConfiguration;
