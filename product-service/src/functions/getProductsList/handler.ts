import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyResult } from 'aws-lambda';
import productsService from '../../services/products-service';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  try {
    const products = await productsService.getProductsList();

    if (products) {
      return formatJSONResponse({
        statusCode: 200,
        response: {
          data: products
        }
      });
    } else {
      return formatJSONResponse({
        statusCode: 404,
        response: {
          message: 'Products not found'
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
