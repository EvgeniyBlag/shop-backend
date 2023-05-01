import AWS from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


export const importProductsFile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const s3 = new AWS.S3({ region: process.env.REGION ?? 'us-east-1' });

    if (!event.queryStringParameters?.name) {
      return formatJSONResponse({
        statusCode: 400,
        response: {
          message: 'Bad Request'
        }
      }); 
    }

    const folderPath = `uploaded/${event.queryStringParameters.name}`;

    const urlParams = {
      Bucket: process.env.BUCKET || 'shop-backend-import',
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
      throw new Error();
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
