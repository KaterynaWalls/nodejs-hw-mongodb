import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';

console.log("🔑 Cloudinary Config:", {
  cloud_name: getEnvVar('CLOUDINARY_NAME'),
  api_key: getEnvVar('CLOUDINARY_API_KEY'),
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

cloudinary.v2.config({
  secure: true,
cloud_name: getEnvVar('CLOUDINARY_NAME'),
api_key: getEnvVar('CLOUDINARY_API_KEY'),
api_secret: getEnvVar('CLOUDINARY_API_SECRET'),

});

export const saveFileToCloudinary = async (file) => {
  console.log("📤 Uploading to Cloudinary:", file.path);
  const response = await cloudinary.v2.uploader.upload(file.path);
  console.log("✅ Cloudinary upload response:", response);
  
  await fs.unlink(file.path);
  console.log("🗑 Local file deleted:", file.path);
  return response.secure_url;
};