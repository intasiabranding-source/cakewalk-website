import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and increase JSON payload limits for large site state transfers
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// Database Initialization (Creates table if it doesn't exist, migrates local db.json)
const initDb = async () => {
  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      // Create table
      await sql`
        CREATE TABLE IF NOT EXISTS cms_store (
          id VARCHAR(50) PRIMARY KEY,
          data JSONB NOT NULL
        )
      `;
      // Check if default entry exists
      const rows = await sql`SELECT id FROM cms_store WHERE id = 'default'`;
      if (rows.length === 0) {
        console.log("Neon database empty. Migrating local db.json data to Neon...");
        const localData = readLocalDB();
        await sql`INSERT INTO cms_store (id, data) VALUES ('default', ${localData})`;
        console.log("Migration to Neon complete!");
      } else {
        console.log("Neon database contains data. Ready.");
      }
    } catch (err) {
      console.error("Error initializing Neon PostgreSQL database:", err);
    }
  } else {
    console.log("No DATABASE_URL found. Running in local file database mode.");
  }
};

// Run schema initialization
initDb();

// Helper to read DB (supports Neon DB with local fallback)
const readDB = async () => {
  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      const rows = await sql`SELECT data FROM cms_store WHERE id = 'default'`;
      if (rows.length > 0) {
        return rows[0].data;
      } else {
        // Table exists but is empty, populate and return local data
        const localData = readLocalDB();
        await sql`INSERT INTO cms_store (id, data) VALUES ('default', ${localData})`;
        return localData;
      }
    } catch (err) {
      console.error("Error reading from Neon DB:", err);
    }
  }
  return readLocalDB();
};

// Helper to write DB (supports Neon DB with local fallback)
const writeDB = async (data) => {
  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      await sql`
        INSERT INTO cms_store (id, data) 
        VALUES ('default', ${data})
        ON CONFLICT (id) 
        DO UPDATE SET data = ${data}
      `;
      return true;
    } catch (err) {
      console.error("Error writing to Neon DB:", err);
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
