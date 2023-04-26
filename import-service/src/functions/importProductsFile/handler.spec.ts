import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { importProductsFile } from './handler';

describe('importProductsFile function', () => {
    it('should return presigned URL', async () => {
      AWSMock.setSDKInstance(AWS);

      AWSMock.mock('S3', 'getSignedUrl', (_, _params, callback) => {
        console.log('S3', 'getSignedUrl', 'mock called');
        callback(null, 'test-signed-url');
      })
      
      const event = {
        queryStringParameters: {
          name: 'test.csv'
        }
      };

      const res = await importProductsFile(event as any);
      expect(res.body).toEqual(JSON.stringify({ url: 'test-signed-url' }));
    });

    it('should return internal server error', async () => {
      AWSMock.setSDKInstance(AWS);

      AWSMock.remock('S3', 'getSignedUrl', (_, _params, callback) => {
        console.log('S3', 'getSignedUrl', 'mock called');
        callback(null, undefined);
      })
      
      const event = {
        queryStringParameters: {
          name: 'test.csv'
        }
      };

      const res = await importProductsFile(event as any);
      expect(res.body).toEqual(JSON.stringify({ message: 'Internal server error' }));
    });

    it('should return internal server error', async () => {
      AWSMock.setSDKInstance(AWS);

      AWSMock.remock('S3', 'getSignedUrl', (_, _params, callback) => {
        console.log('S3', 'getSignedUrl', 'mock called');
        callback(null, undefined);
      })
      
      const event = {
        queryStringParameters: {
        }
      };

      const res = await importProductsFile(event as any);
      expect(res.body).toEqual(JSON.stringify({ message: 'Bad Request' }));
    });
});