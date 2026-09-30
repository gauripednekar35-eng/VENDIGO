import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

dotenv.config();

// Import models
import { User } from './models/User.js';
import { Vendor } from './models/Vendor.js';
import { MenuItem } from './models/MenuItem.js';
import { Order } from './models/Order.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'vendigo_super_secret_jwt_key_2026';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendigo';

// Connect to MongoDB
console.log('🔌 Connecting to MongoDB...');
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 2500,
  bufferCommands: false
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.log('ℹ️ Running in hybrid/offline mode (MongoDB unreachable, fallback active)'));

app.use(cors());
app.use(express.json());

// In-memory fallback users for offline / server fallback mode
const fallbackUsers = [
  {
    id: 'user_cust_1',
    name: 'Customer Demo',
    email: 'customer@vendigo.com',
    password: bcrypt.hashSync('customer123', 10),
    role: 'customer',
    phone: '+91 98200 11223',
    address: 'Dahisar West, Mumbai'
  },
  {
    id: 'user_vend_1',
    name: 'Santosh Shinde',
    email: 'dahisar.vadapav@vendigo.com',
    password: bcrypt.hashSync('vendor123', 10),
    role: 'vendor',
    phone: '+91 98201 11223',
    address: 'Dahisar West, Mumbai',
    vendorId: 'v_dahisar_1'
  },
  {
    id: 'user_admin_1',
    name: 'Admin User',
    email: 'admin@vendigo.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    phone: '+91 99999 99999',
    address: 'Mumbai Head Office'
  }
];

// Helper Middleware for Auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Token Required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });
    req.user = user;
    next();
  });
};

// ------------------------------------
// Health check
// ------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    dbConnected: mongoose.connection.readyState === 1,
    message: 'VENDIGO Hyperlocal API Server is active and operational.' 
  });
});

// ------------------------------------
// Auth Routes
// ------------------------------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;
  const cleanEmail = (email || '').toLowerCase().trim();

  // Try DB first if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) return res.status(400).json({ message: 'Email already registered.' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || 'customer123', salt);

      const newUser = new User({
        name: name || 'User',
        email: cleanEmail,
        password: hashedPassword,
        role: role || 'customer',
        phone: phone || '+91 98000 00000',
        address: address || 'Mumbai, India'
      });

      const savedUser = await newUser.save();
      const token = jwt.sign(
        { id: savedUser._id, role: savedUser.role, email: savedUser.email }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      return res.status(201).json({ 
        message: 'Registration successful', 
        token, 
        user: {
          id: savedUser._id.toString(),
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          phone: savedUser.phone,
          address: savedUser.address
        } 
      });
    } catch (error) {
      console.warn('DB register error, falling back to memory:', error.message);
    }
  }

  // Fallback in-memory registration
  const existingFb = fallbackUsers.find(u => u.email === cleanEmail);
  if (existingFb) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  const newFbUser = {
    id: 'user_' + Date.now(),
    name: name || cleanEmail.split('@')[0] || 'User',
    email: cleanEmail,
    password: bcrypt.hashSync(password || 'customer123', 10),
    role: role || 'customer',
    phone: phone || '+91 98000 00000',
    address: address || 'Mumbai, India'
  };
  fallbackUsers.push(newFbUser);

  const token = jwt.sign(
    { id: newFbUser.id, role: newFbUser.role, email: newFbUser.email }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    message: 'Registration successful (Instant Mode)',
    token,
    user: {
      id: newFbUser.id,
      name: newFbUser.name,
      email: newFbUser.email,
      role: newFbUser.role,
      phone: newFbUser.phone,
      address: newFbUser.address
    }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  const cleanEmail = (email || '').toLowerCase().trim();

  // Try DB first if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        if (password) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
          }
        }

        const token = jwt.sign(
          { id: user._id, role: user.role, email: user.email }, 
          JWT_SECRET, 
          { expiresIn: '7d' }
        );

        return res.json({ 
          message: 'Logged in successfully', 
          token, 
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            vendorId: user.vendorId
          } 
        });
      }
    } catch (error) {
      console.warn('DB login error, falling back to memory:', error.message);
    }
  }

  // Fallback in-memory / dynamic login
  let fbUser = fallbackUsers.find(u => u.email === cleanEmail);
  if (fbUser) {
    if (password && fbUser.password) {
      const isMatch = bcrypt.compareSync(password, fbUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
    }
  } else {
    // Dynamic instant user creation for seamless demo login
    fbUser = {
      id: 'demo_' + Date.now(),
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'User',
      email: cleanEmail,
      role: role || 'customer',
      phone: '+91 98000 00000',
      address: 'Mumbai, India'
    };
    fallbackUsers.push(fbUser);
  }

  const token = jwt.sign(
    { id: fbUser.id, role: fbUser.role, email: fbUser.email }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );

  return res.json({ 
    message: 'Logged in successfully', 
    token, 
    user: {
      id: fbUser.id,
      name: fbUser.name,
      email: fbUser.email,
      role: fbUser.role || role || 'customer',
      phone: fbUser.phone,
      address: fbUser.address,
      vendorId: fbUser.vendorId
    } 
  });
});

// ------------------------------------
// Vendor Routes
// ------------------------------------
app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find({ isApproved: true });
    // Map _id to id for frontend compatibility
    const formatted = vendors.map(v => ({
      id: v._id.toString(),
      name: v.name,
      ownerName: v.ownerName,
      phone: v.phone,
      email: v.email,
      rating: v.rating,
      reviewCount: v.reviewCount,
      distance: v.distance,
      prepTime: v.prepTime,
      address: v.address,
      coordinates: v.coordinates,
      category: v.category,
      isOpen: v.isOpen,
      isApproved: v.isApproved,
      priceForTwo: v.priceForTwo,
      locationId: v.locationId,
      locality: v.locality,
      banner: v.banner,
      logo: v.logo,
      description: v.description,
      tags: v.tags
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vendors' });
  }
});

app.get('/api/vendors/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor stall not found' });
    
    res.json({
      id: vendor._id.toString(),
      name: vendor.name,
      ownerName: vendor.ownerName,
      phone: vendor.phone,
      email: vendor.email,
      rating: vendor.rating,
      reviewCount: vendor.reviewCount,
      distance: vendor.distance,
      prepTime: vendor.prepTime,
      address: vendor.address,
      coordinates: vendor.coordinates,
      category: vendor.category,
      isOpen: vendor.isOpen,
      isApproved: vendor.isApproved,
      priceForTwo: vendor.priceForTwo,
      banner: vendor.banner,
      logo: vendor.logo,
      description: vendor.description,
      tags: vendor.tags
    });
  } catch (error) {
    res.status(404).json({ message: 'Vendor stall not found' });
  }
});

app.patch('/api/vendors/:id/toggle-open', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    
    vendor.isOpen = !vendor.isOpen;
    await vendor.save();
    
    res.json({ 
      message: 'Stall status updated', 
      isOpen: vendor.isOpen, 
      vendor: {
        id: vendor._id.toString(),
        isOpen: vendor.isOpen,
        name: vendor.name
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle vendor status' });
  }
});

app.post('/api/vendors', async (req, res) => {
  try {
    const newVendor = new Vendor({
      ...req.body,
      isApproved: false // Requires admin approval
    });
    const saved = await newVendor.save();
    res.status(201).json({
      id: saved._id.toString(),
      ...req.body,
      isApproved: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create vendor' });
  }
});

// ------------------------------------
// Menu Routes
// ------------------------------------
app.get('/api/vendors/:vendorId/menu', async (req, res) => {
  try {
    const items = await MenuItem.find({ vendorId: req.params.vendorId });
    const formatted = items.map(m => ({
      id: m._id.toString(),
      vendorId: m.vendorId,
      name: m.name,
      price: m.price,
      category: m.category,
      isVeg: m.isVeg,
      isAvailable: m.isAvailable,
      image: m.image,
      description: m.description
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    const newItem = new MenuItem({
      ...req.body,
      isAvailable: true
    });
    const saved = await newItem.save();
    res.status(201).json({
      id: saved._id.toString(),
      vendorId: saved.vendorId,
      name: saved.name,
      price: saved.price,
      category: saved.category,
      isVeg: saved.isVeg,
      isAvailable: saved.isAvailable,
      image: saved.image,
      description: saved.description
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add menu item' });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Menu item not found' });
    
    res.json({
      id: updated._id.toString(),
      vendorId: updated.vendorId,
      name: updated.name,
      price: updated.price,
      category: updated.category,
      isVeg: updated.isVeg,
      isAvailable: updated.isAvailable,
      image: updated.image,
      description: updated.description
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update menu item' });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
});

// ------------------------------------
// Order Routes
// ------------------------------------
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order({
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      ...req.body,
      paymentMethod: 'Cash on Delivery (COD)',
      orderStatus: 'Pending'
    });
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { customerEmail, vendorId } = req.query;
    const query = {};
    if (customerEmail) query.customerEmail = new RegExp(`^${customerEmail}$`, 'i');
    if (vendorId) query.vendorId = vendorId;

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      { $set: { orderStatus: status } },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// ------------------------------------
// Admin Routes
// ------------------------------------
app.get('/api/admin/pending-vendors', async (req, res) => {
  try {
    const pending = await Vendor.find({ isApproved: false });
    const formatted = pending.map(v => ({
      id: v._id.toString(),
      name: v.name,
      ownerName: v.ownerName,
      phone: v.phone,
      email: v.email,
      address: v.address,
      category: v.category
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending vendors' });
  }
});

app.patch('/api/admin/approve-vendor/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { $set: { isApproved: true } },
      { new: true }
    );
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    
    // Find the corresponding user and link vendorId
    await User.findOneAndUpdate(
      { email: vendor.email.toLowerCase(), role: 'vendor' },
      { $set: { vendorId: vendor._id.toString() } }
    );

    res.json({ message: 'Vendor approved', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve vendor' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    const formatted = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      address: u.address,
      vendorId: u.vendorId
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Serve React Frontend static files in production
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, '../client/dist');

app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 VENDIGO Server active on port ${PORT}`);
});
