import Masterclass from "../models/masterclass.model.js";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";

dotenv.config();


const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

export const createMasterclass = async (req, res) => {
  try {
    // Step 1: Create masterclass without isActive and without image first
    const { title, description,  price } = req.body;

    const masterclass = new Masterclass({
      title,
      description,

      price,

    });

    await masterclass.save();

    // Step 2: Upload heroImage if file exists
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const ext = path.extname(req.file.originalname); // e.g., '.jpg'
      const key = `masterclass-hero-images/${masterclass._id}${ext}`;


      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: req.file.mimetype,
      });

      await s3.send(command);

      masterclass.heroImage = `${process.env.R2_PUBLIC_URL}/${key}`;
      await masterclass.save();
    }

    res.status(201).json({
      success: true,
      message: "Masterclass created successfully",
      data: masterclass,
    });
  } catch (err) {
    console.error("Create Masterclass Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteMasterclass = async (req, res) => {
  try {
    const { id } = req.params;

    const masterclass = await Masterclass.findById(id);
    if (!masterclass) {
      return res.status(404).json({
        success: false,
        message: "Masterclass not found",
      });
    }

    // Step 1: Delete image from Cloudflare R2 if it exists
    if (masterclass.heroImage) {
      const imageUrl = masterclass.heroImage;
      const key = imageUrl.split(`/${process.env.R2_BUCKET}/`)[1]; // extract key from URL

      if (key) {
        const command = new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: key,
        });

        await s3.send(command);
      }
    }

    // Step 2: Delete the masterclass from the database
    await Masterclass.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Masterclass deleted successfully",
    });
  } catch (err) {
    console.error("Delete Masterclass Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateMasterclass = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description,  price } = req.body;

    const masterclass = await Masterclass.findById(id);
    if (!masterclass) {
      return res.status(404).json({
        success: false,
        message: "Masterclass not found",
      });
    }

    // If there's a new image, delete the old one first
    if (req.file) {
      if (masterclass.heroImage) {
        const oldKey = masterclass.heroImage.split(`/${process.env.R2_BUCKET}/`)[1];
        if (oldKey) {
          const deleteCmd = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: oldKey,
          });
          await s3.send(deleteCmd);
        }
      }

      // Upload the new image
      const ext = path.extname(req.file.originalname);
      const newKey = `masterclass-hero-images/${masterclass._id}${ext}`;


      const uploadCmd = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: newKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3.send(uploadCmd);
      masterclass.heroImage = `${process.env.R2_PUBLIC_URL}/${newKey}`;

    }

    // Update text fields
    masterclass.title = title || masterclass.title;
    masterclass.description = description || masterclass.description;

    masterclass.price = price || masterclass.price;

    await masterclass.save();

    res.status(200).json({
      success: true,
      message: "Masterclass updated successfully",
      data: masterclass,
    });
  } catch (err) {
    console.error("Update Masterclass Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllMasterclasses = async (req, res) => {
  try {
    const masterclasses = await Masterclass.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({
      success: true,
      data: masterclasses,
    });
  } catch (err) {
    console.error("Get All Masterclasses Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch masterclasses",
    });
  }
};
