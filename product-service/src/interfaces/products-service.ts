import { Product } from '../types/api-types';

export interface IProductsService {
    getProductsList(): Promise<Product[]>;
    getProductsById(id: string): Promise<Product>;
}