import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const CLIENT_DIST_DIR = path.join(__dirname, 'public'); // Production build

// Ensure uploads directory exists
fs.ensureDirSync(UPLOADS_DIR);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(CLIENT_DIST_DIR)); // Serve frontend static files

// API Info Route
app.get('/api', (req, res) => {
    res.json({
        service: 'WherePhoto API',
        version: '1.0.0',
        endpoints: {
            upload_files: { method: 'POST', url: '/api/upload', type: 'multipart/form-data' },
            upload_urls: { method: 'POST', url: '/api/upload-url', type: 'application/json' },
            list_images: { method: 'GET', url: '/api/images' }
        },
        documentation: 'See API_DOC.md'
    });
});

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${uuidv4()}${ext}`);
    }
});

const upload = multer({ storage });

// API: Upload Files (Batch)
app.post('/api/upload', upload.array('files'), (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        const files = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            url: `${protocol}://${host}/uploads/${file.filename}`
        }));
        res.json({ success: true, data: files });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'File upload failed' });
    }
});

// API: Upload by URL (Batch)
app.post('/api/upload-url', async (req, res) => {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const results = [];

    for (const url of urls) {
        try {
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream'
            });

            // Extract extension or default to .jpg
            let ext = path.extname(url.split('?')[0]);
            if (!ext || ext.length > 5) ext = '.jpg'; // Fallback

            const filename = `${Date.now()}-${uuidv4()}${ext}`;
            const filePath = path.join(UPLOADS_DIR, filename);

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            const protocol = req.protocol;
            const host = req.get('host');

            results.push({
                url: url,
                success: true,
                savedUrl: `${protocol}://${host}/uploads/${filename}`
            });
        } catch (error) {
            console.error(`Failed to download ${url}:`, error.message);
            results.push({
                url: url,
                success: false,
                error: error.message
            });
        }
    }

    res.json({ success: true, results });
});

// API: Get All Images
app.get('/api/images', async (req, res) => {
    try {
        const files = await fs.readdir(UPLOADS_DIR);
        const imageFiles = [];
        const protocol = req.protocol;
        const host = req.get('host');

        for (const file of files) {
            const stat = await fs.stat(path.join(UPLOADS_DIR, file));
            if (stat.isFile()) {
                imageFiles.push({
                    filename: file,
                    url: `${protocol}://${host}/uploads/${file}`,
                    mtime: stat.mtime,
                    size: stat.size
                });
            }
        }

        // Sort by time (newest first)
        imageFiles.sort((a, b) => b.mtime - a.mtime);

        res.json({ success: true, data: imageFiles });
    } catch (error) {
        console.error('List images error:', error);
        res.status(500).json({ success: false, message: 'Failed to list images' });
    }
});

// Handle SPA routing - Send index.html for any other requests
app.get('(.*)', (req, res) => {
    res.sendFile(path.join(CLIENT_DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
