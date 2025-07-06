import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupFolder = `backup-${timestamp}`;
const archivePath = `${backupFolder}.tar.gz`;
const MAX_BACKUPS = 3;

async function dumpMongoDB() {
  return new Promise((resolve, reject) => {
    const cmd = `mongodump --uri="${process.env.MONGODB_URL}" --out=${backupFolder}`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(stderr);
      resolve();
    });
  });
}

async function compressBackup() {
  return new Promise((resolve, reject) => {
    const cmd = `tar -zcvf ${archivePath} ${backupFolder}`;
    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function uploadToR2() {
  const client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_MASTERCLASS_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_MASTERCLASS_ACCESS_KEY,
      secretAccessKey: process.env.R2_MASTERCLASS_SECRET_KEY,
    },
  });

  const stream = fs.createReadStream(archivePath);
  const command = new PutObjectCommand({
    Bucket: process.env.R2_MASTERCLASS_BUCKET,
    Key: path.basename(archivePath),
    Body: stream,
  });

  await client.send(command);
  return client;
}

async function deleteOldBackups(client) {
  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.R2_MASTERCLASS_BUCKET,
    Prefix: "backup-",
  });

  const response = await client.send(listCommand);
  const allBackups = response.Contents
    ?.filter(obj => obj.Key.endsWith(".tar.gz"))
    .sort((a, b) => new Date(a.LastModified) - new Date(b.LastModified)) || [];

  const toDelete = allBackups.length - MAX_BACKUPS;

  for (let i = 0; i < toDelete; i++) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.R2_MASTERCLASS_BUCKET,
      Key: allBackups[i].Key,
    });
    await client.send(deleteCommand);
  }
}

function cleanUp() {
  fs.rmSync(backupFolder, { recursive: true, force: true });
  fs.unlinkSync(archivePath);
}

(async () => {
  try {
    await dumpMongoDB();
    await compressBackup();
    const client = await uploadToR2();
    await deleteOldBackups(client);
  } catch (err) {
    console.error("Backup failed:", err);
  } finally {
    cleanUp();
  }
})();