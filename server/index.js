import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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

// Helper to read DB
const readDB = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      return {};
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err);
    return {};
  }
};

// Helper to write DB
const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error writing to database:", err);
    return false;
  }
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
app.get('/api/content', (req, res) => {
  const db = readDB();
  res.json(db);
});

// 2. Save site content
app.post('/api/content', (req, res) => {
  const newContent = req.body;
  const db = readDB();
  
  // Merge and update site content (retaining fields like orders and adminPassword if not sent)
  const updatedDb = {
    ...db,
    ...newContent,
    // Preserve password and orders if not present in payload
    adminPassword: newContent.adminPassword !== undefined ? newContent.adminPassword : db.adminPassword,
    orders: newContent.orders !== undefined ? newContent.orders : db.orders
  };
  
  if (writeDB(updatedDb)) {
    res.json({ success: true, message: "Site content saved successfully." });
  } else {
    res.status(500).json({ success: false, message: "Failed to write site content to database." });
  }
});

// 3. Upload file (Image/Video)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file was uploaded." });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// 4. Get order log
app.get('/api/orders', (req, res) => {
  const db = readDB();
  res.json(db.orders || []);
});

// 5. Submit new order
app.post('/api/orders', (req, res) => {
  const newOrder = req.body;
  const db = readDB();
  
  const orders = db.orders || [];
  orders.push({
    ...newOrder,
    id: newOrder.id || `order-${Date.now()}`,
    createdAt: newOrder.createdAt || new Date().toISOString()
  });
  
  db.orders = orders;
  
  if (writeDB(db)) {
    res.json({ success: true, message: "Order logged successfully.", order: newOrder });
  } else {
    res.status(500).json({ success: false, message: "Failed to save order in database." });
  }
});

// 6. Delete or clear order history
app.delete('/api/orders', (req, res) => {
  const db = readDB();
  db.orders = [];
  if (writeDB(db)) {
    res.json({ success: true, message: "Order logs cleared successfully." });
  } else {
    res.status(500).json({ success: false, message: "Failed to clear order logs." });
  }
});

// 7. Auth Admin login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  const db = readDB();
  const actualPassword = db.adminPassword || "cakewalkbyIndhu@1";
  
  if (password === actualPassword) {
    res.json({ success: true, message: "Authentication successful." });
  } else {
    res.status(401).json({ success: false, message: "Invalid administrator password." });
  }
});

// Serve static client assets from Vite build output folder in production
const distDir = path.join(__dirname, '../dist');
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
