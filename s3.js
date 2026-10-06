import { S3 } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

export const s3Client = new S3({
  endpoint: process.env.S3_URL,
  region: process.env.S3_REGION || "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  requestChecksumCalculation: "whenRequired",
  responseChecksumValidation: "whenRequired",
});
