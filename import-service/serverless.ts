import type { AWS } from '@serverless/typescript';

import importFileParser from '@functions/importFileParser';
import importProductsFile from '@functions/importProductsFile';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET: 'shop-backend-import',
      SQS_CSV_URL: '${cf:product-service-${self:provider.stage}.sqsUrl}',
      SQS_CSV_NAME: 'catalog-items-queue',
      REGION: 'us-east-1'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:ListBucket',
            Resource: 'arn:aws:s3:::${self:provider.environment.BUCKET}',
          },
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: 'arn:aws:s3:::${self:provider.environment.BUCKET}/*',
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: 'arn:aws:sqs:${self:provider.region}:031679763700:${self:provider.environment.SQS_CSV_NAME}'
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: { importFileParser, importProductsFile },
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
  },
};

module.exports = serverlessConfiguration;
