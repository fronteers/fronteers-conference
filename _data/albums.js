import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { s3Client } from "../s3.js";

config();

export default async function () {
  const albumMetadata = JSON.parse(
    fs.readFileSync(path.join(import.meta.dirname, "albums.meta.json"), "utf8")
  );

  const params = {
    Bucket: process.env.S3_BUCKET,
    Delimiter: "/",
  };

  try {
    const listAll = await s3Client.listObjectsV2(params);
    const availableAlbums = (listAll.CommonPrefixes || []).map((prefix) => {
      return {
        folderName: prefix.Prefix.slice(0, -1), // Remove trailing slash
        path: prefix.Prefix,
      };
    });

    // Fetch images for each album and merge with metadata
    const albums = await Promise.all(
      availableAlbums.map(async (album) => {
        const albumParams = {
          Bucket: process.env.S3_BUCKET,
          Prefix: album.path,
        };

        const albumContents = await s3Client.listObjectsV2(albumParams);

        const images = albumContents.Contents.filter(
          (item) => item.Key.endsWith(".jpg") || item.Key.endsWith(".jpeg")
        ).map((item) => ({
          key: item.Key,
          url: `${process.env.S3_URL}/${params.Bucket}/${item.Key}`,
        }));

        // Find matching metadata
        const metadata = albumMetadata.albums.find(
          (meta) => meta.folderName === album.folderName
        ) || { __remove: true };

        return {
          ...album,
          ...metadata,
          images,
        };
      })
    );

    return albums
      .filter((album) => !album.__remove)
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error("Error fetching albums from storage:", error);
    return [];
  }
}
