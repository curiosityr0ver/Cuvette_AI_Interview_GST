import fs from 'fs-extra';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const source = join(__dirname, '../dist');
const destination = join(__dirname, '../../server/public');

fs.copy(source, destination, (err) => {
    if (err) {
        console.error('An error occurred while copying the folder.');
        return console.error(err);
    }
    console.log('Build files copied successfully!');
});
