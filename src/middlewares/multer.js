import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/path.js';


// import { createDirIfNotExists } from '../utils/createDirIfNotExists.js';

// await createDirIfNotExists(TEMP_UPLOAD_DIR);


console.log("🛠 TEMP_UPLOAD_DIR:", TEMP_UPLOAD_DIR);
const storage = multer.diskStorage({
    destination: function  (req, file, cb) {
      console.log("📂 Multer зберігає файл у:", TEMP_UPLOAD_DIR);
      cb(null, TEMP_UPLOAD_DIR);
    },
    filename: function (req, file, cb)  {
      console.log("📸 Multer отримав файл:", file.originalname); 
      const uniqueSuffix = Date.now();
      cb(null, `${uniqueSuffix}_${file.originalname}`);
    },
  });

  


  export const upload = multer({ storage });