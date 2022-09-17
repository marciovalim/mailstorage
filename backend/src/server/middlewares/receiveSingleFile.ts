import multer from 'multer';

import { Environment } from '../../core/Environment';

const upload = multer({ dest: Environment.vars.TEMP_FOLDER });
export const receiveSingleFile = upload.single('file');
