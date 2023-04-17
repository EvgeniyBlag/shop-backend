import { products } from './products';

export const stocks = products.map(product => ({
    product_id: product.id,
    count: 10
}));

export const requestItems = stocks.map((stock) => {
    return {
        PutRequest: {
            Item: {
                product_id: stock.product_id,
                count: stock.count
            }
        }
    }
});