import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import csv from 'csv-parser';
import { S3Event } from 'aws-lambda';

const s3 = new S3Client({ region: 'us-east-1' });

export const importFileParser = async (event: S3Event): Promise<void> => {
  const s3Records = event.Records;

  for (let record of s3Records) {
    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;
    const products = [];
    
    try {
      const response = await s3.send(new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey
      }));

      (response.Body as any).pipe(csv())
        .on('data', (data) => products.push(data))
        .on('end', async () => {
          console.log(products);
    
          await s3.send(new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: `${bucketName}/${objectKey}`,
            Key: objectKey.replace('uploaded', 'parsed')
          }))
          .then(() => {
            s3.send(new DeleteObjectCommand({
              Bucket: bucketName,
              Key: objectKey
            }))
          });
        });
    } catch (err) {
      console.error(err);
    }
  }
};
