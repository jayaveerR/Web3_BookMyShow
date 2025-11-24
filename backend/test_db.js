import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Attempting to connect to MongoDB...');
const uri = process.env.MANGO_DB;
console.log('URI Length:', uri ? uri.length : 'undefined');
if (uri) {
    console.log('URI starts with:', uri.substring(0, 15));
}

mongoose.connect(uri)
    .then(() => {
        console.log('MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });
