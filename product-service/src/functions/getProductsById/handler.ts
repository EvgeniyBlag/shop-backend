import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import productsService from '../../services/products-service';

export const getProductsById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const product = await productsService.getProductsById(event.pathParameters?.productId ?? '');

    if (product) {
      return formatJSONResponse({
        statusCode: 200,
        response: {
          product
        }
      });
    } else {
      return formatJSONResponse({
        statusCode: 404,
        response: {
          message: 'Product not found'
        }
      }); 
    }
  } catch(e) {
    return formatJSONResponse({
      statusCode: 500,
      response: {
        message: 'Internal server error'
      }
    });
  }
};
