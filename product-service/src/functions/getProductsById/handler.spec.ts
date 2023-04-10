import { describe, expect } from '@jest/globals';
import { getProductsById } from './handler';
import { products } from '../../mocks/products';

describe('getProductsById function', () => {
    it('should return product from list', async () => {
      const event = {
        pathParameters: {
          productId: 'YDP184'
        }
      };

      const response = await getProductsById(event as any);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(JSON.stringify({ product: products[6] }));
    });

    it('should return 404', async () => {
        const event = {
          pathParameters: {
            productId: 'YDP185'
          }
        };

        const response = await getProductsById(event as any);
    
        expect(response.statusCode).toBe(404);
    });
});