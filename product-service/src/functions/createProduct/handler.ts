import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import productsService from '../../services/products-service';

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log(`Lambda function 'createProduct' has been called`);
    const product = JSON.parse(event.body);

    if (!product.description || !product.title || !product.price || !product.count) {
      return formatJSONResponse({
        statusCode: 400,
        response: {
          message: 'Bad Request. Check your product data'
        }
      }); 
    }

    const createdProduct = await productsService.createProduct(product);

    return formatJSONResponse({
      statusCode: 200,
      response: {
        data: createdProduct
      }
    });
  } catch(e) {
    return formatJSONResponse({
      statusCode: 500,
      response: {
        message: 'Internal server error'
      }
    });
  }
}
