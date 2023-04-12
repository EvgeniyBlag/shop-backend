import dynamoDBClient from '../client';
import { productsRequestItems, stocksRequestItems } from './mock-request-items';

const populateTable = (tableName: string, requestItems: any) => {
    dynamoDBClient.batchWrite({
        RequestItems: {
            [tableName]: requestItems
        }
    }, (err, data) => {
        if (err) {
          console.log('Database BatchWrite Error', err);
        } else {
          console.log('Success. Records have been saved. ', data);
        }
      })
}

const populateTables = () => {
    populateTable('products', productsRequestItems);
    populateTable('stocks', stocksRequestItems);
}

populateTables();