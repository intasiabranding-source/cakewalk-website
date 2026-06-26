import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { put } from '@vercel/blob';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load .env environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Setup MongoDB client if MONGODB_URI is configured
let mongoClient = null;
let mongoDb = null;

const getMongoDb = async () => {
  if (mongoDb) return mongoDb;
  if (!process.env.MONGODB_URI) return null;
  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    // Parse DB name from URI or default to "cakewalk"
    mongoDb = mongoClient.db();
    console.log("Connected successfully to MongoDB.");
    return mongoDb;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    return null;
  }
};

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploads folder as static assets
app.use('/uploads', express.static(uploadsDir));

// DB File Path
const dbPath = path.join(__dirname, 'db.json');

// Helper to read DB locally
const readLocalDB = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      return {};
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading local database:", err);
    return {};
  }
};

// Helper to write DB locally
const writeLocalDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error writing to local database:", err);
    return false;
  }
};

// Database Initialization (Migrates local db.json to MongoDB if empty)
const initDb = async () => {
  const db = await getMongoDb();
  if (db) {
    try {
      const collection = db.collection('cms_store');
      const doc = await collection.findOne({ id: 'default' });
      if (!doc) {
        console.log("MongoDB is empty. Migrating local db.json data to MongoDB...");
        const localData = readLocalDB();
        await collection.updateOne(
          { id: 'default' },
          { $set: { data: localData } },
          { upsert: true }
        );
        console.log("Migration to MongoDB complete!");
      } else {
        console.log("MongoDB contains data. Ready.");
      }
    } catch (err) {
      console.error("Error initializing MongoDB collection:", err);
    }
  } else {
    console.log("No MONGODB_URI found. Running in local file database mode.");
  }
};

// Run database initialization
initDb();

// Helper to read DB (supports MongoDB with local fallback)
const readDB = async () => {
  const db = await getMongoDb();
  if (db) {
    try {
      const collection = db.collection('cms_store');
      const doc = await collection.findOne({ id: 'default' });
      if (doc && doc.data) {
        return doc.data;
      } else {
        // Populates and returns local data if database configuration is empty
        const localData = readLocalDB();
        await collection.updateOne(
          { id: 'default' },
          { $set: { data: localData } },
          { upsert: true }
        );
        return localData;
      }
    } catch (err) {
      console.error("Error reading from MongoDB:", err);
    }
  }
  return readLocalDB();
};

// Helper to write DB (supports MongoDB with local fallback)
const writeDB = async (data) => {
  const db = await getMongoDb();
  if (db) {
    try {
      const collection = db.collection('cms_store');
      await collection.updateOne(
        { id: 'default' },
        { $set: { data: data } },
        { upsert: true }
      );
      return true;
    } catch (err) {
      console.error("Error writing to MongoDB:", err);
      return false;
    }
  }
  return writeLocalDB(data);
};

// Configure Multer for File Uploads (Images and Videos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// API Routes

// 1. Get site content
app.get('/api/content', async (req, res) => {
  const db = await readDB();
  res.json(db);
});

// 2. Save site content
app.post('/api/content', async (req, res) => {
  const newContent = req.body;
  const db = await readDB();
  
  // Merge and update site content (retaining fields like orders and adminPassword if not sent)
  const updatedDb = {
    ...db,
    ...newContent,
    // Preserve password and orders if not present in payload
    adminPassword: newContent.adminPassword !== undefined ? newContent.adminPassword : db.adminPassword,
    orders: newContent.orders !== undefined ? newContent.orders : db.orders
  };
  
  if (await writeDB(updatedDb)) {
    res.json({ success: true, message: "Site content saved successfully." });
  } else {
    res.status(500).json({ success: false, message: "Failed to write site content to database." });
  }
});

// 3. Upload file (Image/Video) - supports Vercel Blob with local fallback
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file was uploaded." });
  }

  // If Vercel Blob token is set, upload to Vercel Blob CDN
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const blob = await put(req.file.filename, fileBuffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
      // Delete temporary local file
      fs.unlinkSync(req.file.path);
      return res.json({ success: true, url: blob.url });
    } catch (err) {
      console.error("Vercel Blob upload failed, falling back to local file path:", err);
    }
  }

  // Fallback to local server serving url
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// 4. Get order log
app.get('/api/orders', async (req, res) => {
  const db = await readDB();
  res.json(db.orders || []);
});

// 5. Submit new order
app.post('/api/orders', async (req, res) => {
  const newOrder = req.body;
  const db = await readDB();
  
  const orders = db.orders || [];
  orders.push({
    ...newOrder,
    id: newOrder.id || `order-${Date.now()}`,
    createdAt: newOrder.createdAt || new Date().toISOString()
  });
  
  db.orders = orders;
  
  if (await writeDB(db)) {
    res.json({ success: true, message: "Order logged successfully.", order: newOrder });
  } else {
    res.status(500).json({ success: false, message: "Failed to save order in database." });
  }
});

// 6. Delete or clear order history
app.delete('/api/orders', async (req, res) => {
  const db = await readDB();
  db.orders = [];
  if (await writeDB(db)) {
    res.json({ success: true, message: "Order logs cleared successfully." });
  } else {
    res.status(500).json({ success: false, message: "Failed to clear order logs." });
  }
});

// 7. Auth Admin login
app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body;
  const db = await readDB();
  const actualPassword = db.adminPassword || "cakewalkbyIndhu@1";
  
  if (password === actualPassword) {
    res.json({ success: true, message: "Authentication successful." });
  } else {
    res.status(401).json({ success: false, message: "Invalid administrator password." });
  }
});

// Serve static client assets from Vite build output folder in production
const distDir = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Start Server
if (process.env.NODE_ENV !== 'production' || process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
