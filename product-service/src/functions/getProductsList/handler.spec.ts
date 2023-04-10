import { describe, expect } from '@jest/globals';
import { getProductsList } from './handler';
import { products } from '../../mocks/products';

describe('getProductsList function', () => {
    it('should return products list', async () => {
      const response = await getProductsList();
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(JSON.stringify({ data: products }));
    });
});