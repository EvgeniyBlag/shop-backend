import { products } from '../mocks/products';
import { Product } from '../types/api-types';
import { IProductsService } from '../interfaces';

class ProductsService implements IProductsService {
    public getProductsList = async (): Promise<Product[]> => products;
    public getProductsById = async (productId: string): Promise<Product> => products.find(({ id }) => id === productId);
}

export default new ProductsService;