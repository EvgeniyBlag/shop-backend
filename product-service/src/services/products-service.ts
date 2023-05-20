import * as uuid from 'uuid';
import { CreateProductRequestModel, Product } from '../types/api-types';
import { IProductsService } from '../interfaces';
// import dynamoDBClient from '../database/dynamodb/client';
import { products, stocks } from '../mocks/products';

class ProductsService implements IProductsService {
  public getProductsList = async (): Promise<(Product & { count: number; })[]> => {
    // const products = await dynamoDBClient.scan({
    //   TableName: process.env.PRODUCTS_TABLE
    // }).promise();

    // const stocks = await dynamoDBClient.scan({
    //   TableName: process.env.STOCKS_TABLE
    // }).promise();

    const productsWithStocks = products.Items.map((product: Product) => {
      return {
        ...product,
        count: stocks.Items.find((stock) => product.id === stock.product_id)?.count ?? 0
      }
    });

    return productsWithStocks;
  };

  public getProductsById = async (productId: string): Promise<Product & { count: number; } | null> => {
    // const product = (await dynamoDBClient.get({
    //   TableName: process.env.PRODUCTS_TABLE,
    //   Key: {
    //     id: productId
    //   },
    // })
    // .promise()).Item as Product;

    // const productStock = (await dynamoDBClient.get({
    //   TableName: process.env.STOCKS_TABLE,
    //   Key: {
    //     product_id: productId
    //   },
    // })
    // .promise()).Item;
    const product = products.Items[0];
    const productStock = stocks.Items[0];
    
    if (product && productStock) {
      return {
          ...product,
          count: productStock.count
      }
    }

    return null;
  }

  public createProduct = async (product: CreateProductRequestModel): Promise<Product & { count: number; }> => {
    const productItem = {
        id: uuid.v4(),
        description: product.description,
        title: product.title,
        price: +product.price
    };

    const stockItem = {
        product_id: productItem.id,
        count: +product.count
    }
    
    // await dynamoDBClient.transactWrite({
    //   TransactItems: [
    //     {
    //       Put: {
    //         TableName: process.env.PRODUCTS_TABLE,
    //         Item: productItem,
    //       },
    //     },
    //     {
    //       Put: {
    //         TableName: process.env.STOCKS_TABLE,
    //         Item: stockItem,
    //       },
    //     },
    //   ]
    // }).promise();

    return {
      ...productItem,
      count: stockItem.count
    }
  }
}

export default new ProductsService;