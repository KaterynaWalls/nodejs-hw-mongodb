import { setupServer } from "./server.js";
import { initMongoDB } from "./db/initMongoDB.js";
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/path.js';
const bootstrap = async ()=> {
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    await initMongoDB();
    setupServer();
};

bootstrap();