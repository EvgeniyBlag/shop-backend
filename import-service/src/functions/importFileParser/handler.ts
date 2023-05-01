import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';

const s3 = new S3Client({ region: process.env.REGION ?? 'us-east-1' });
const sqs = new SQSClient({ region: process.env.REGION ?? 'us-east-1' });

export const importFileParser = async (event: S3Event): Promise<void> => {
  console.log(`Lambda function 'importFileParser' has been called`);

  const s3Records = event.Records;

  for (let record of s3Records) {
    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;
    
    try {
      const response = await s3.send(new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey
      }));

      (response.Body as any).pipe(csv())
        .on('data', async (data) => {
          await sqs.send(new SendMessageCommand({
            QueueUrl: process.env.SQS_CSV_URL,
            MessageBody: JSON.stringify(data),
          }))
        })
        .on('end', async () => {
          await s3.send(new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: `${bucketName}/${objectKey}`,
            Key: objectKey.replace('uploaded', 'parsed')
          }));
          
          await s3.send(new DeleteObjectCommand({
              Bucket: bucketName,
              Key: objectKey
          }))
        });
    } catch (err) {
      console.error(err);
    }
  }
};
