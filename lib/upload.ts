import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME;
const REGION = process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-1";
const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY || "",
    }
});


export const uploadFile = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let fileName = `${new Date().getTime()}__${encodeURIComponent(file.name)}`;
    fileName = fileName.replace(/[^a-zA-Z0-9-.]/g, '');
    const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type
    });
    await s3Client.send(command);
    const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`;
    return url;
};