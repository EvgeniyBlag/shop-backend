import { SQSEvent } from 'aws-lambda';
import productsService from '../../services/products-service';
import AWS from 'aws-sdk';

export const catalogBatchProcess = async (event: SQSEvent): Promise<void> => {
  const sns = new AWS.SNS({ region: process.env.REGION ?? 'us-east-1' });
  const sqsRecords = event.Records;
  
  for (let record of sqsRecords) {
    const product = JSON.parse(record.body);

    try {
      const createdProduct = await productsService.createProduct(product);

      await sns.publish({
          Subject: 'Check new products',
          Message: JSON.stringify(createdProduct),
          TopicArn: process.env.SNS_ARN,
      }).promise();
    } catch(e) {
      console.error(e);
    }
  }
}
