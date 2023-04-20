import AWS from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const s3 = new AWS.S3({ region: 'us-east-1' });

export const importProductsFile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const folderPath = `uploaded/${event.queryStringParameters.name}`;

    const urlParams = {
      Bucket: process.env.BUCKET,
      Key: folderPath,
      Expires: 100,
      ContentType: 'text/csv' 
    }

    const signedUrl = await s3.getSignedUrlPromise('putObject', urlParams);
  
    if (signedUrl) {
      return formatJSONResponse({
        statusCode: 200,
        response: {
          url: signedUrl
        }
      });
    } else {
      return formatJSONResponse({
        statusCode: 400,
        response: {
          message: 'Bad Request'
        }
      }); 
    }

  } catch (err) {
    return formatJSONResponse({
      statusCode: 500,
      response: {
        message: 'Internal server error'
      }
    });
  }
};
