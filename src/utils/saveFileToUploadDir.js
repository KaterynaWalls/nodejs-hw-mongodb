import fs from 'node:fs/promises';
import path from 'node:path';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/path.js';


export const saveFileToUploadDir = async (file) => {

  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename)
  );
  
  return `/uploads/${file.filename}`;
  };