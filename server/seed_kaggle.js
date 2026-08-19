import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import { User } from './models/User.js';
import { Vendor } from './models/Vendor.js';
import { MenuItem } from './models/MenuItem.js';
import { Order } from './models/Order.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendigo';

const DISH_TEMPLATES = {
  'vada-pav': [
    { name: 'Classic Bombay Vada Pav', price: 20, isVeg: true, description: 'Spiced potato dumpling dipped in gram flour batter, deep fried and served in a pav with spicy garlic chutney.' },
    { name: 'Cheese Burst Schezwan Vada Pav', price: 45, isVeg: true, description: 'Our signature vada pav stuffed with mozzarella cheese and tangy Schezwan sauce.' },
    { name: 'Kolhapuri Kat Misal Pav', price: 80, isVeg: true, description: 'Spicy moth bean curry topped with farsan, onions, lemon, and served with buttery pav.' },
    { name: 'Crispy Kanda Bhajji (Plate)', price: 40, isVeg: true, description: 'Golden, crispy double-fried onion fritters served with hot green chutney.' }
  ],
  'dosa': [
    { name: 'Butter Mysore Masala Dosa', price: 100, isVeg: true, description: 'Thin rice crepe spread with spicy red lentil chutney, stuffed with mashed potato masala and butter.' },
    { name: 'Cheese Burst Jinni Dosa', price: 130, isVeg: true, description: 'Crispy dosa sliced and rolled with sweet and spicy sauces, veggies, and loaded with cheese.' },
    { name: 'Schezwan Cheese Spring Dosa', price: 120, isVeg: true, description: 'Indo-Chinese style crepe rolled with spring vegetables, noodles, and melted cheese.' },
    { name: 'Steamed Podi Idli (2 Pcs)', price: 50, isVeg: true, description: 'Soft fluffy idlis tossed in gunpowder mix and pure cow ghee.' }
  ],
  'chaat': [
    { name: 'Special Dahi Batata Puri', price: 70, isVeg: true, description: 'Crisp puris stuffed with potato, sweet yogurt, tangy tamarind chutney, and fine sev.' },
    { name: 'Classic Sev Puri (6 Pcs)', price: 50, isVeg: true, description: 'Flat puris topped with potatoes, onions, three signature chutneys, mango powder, and sev.' },
    { name: 'Chilled Spicy Pani Puri (6 Pcs)', price: 40, isVeg: true, description: 'Crispy hollow puris served with a stuffing of spiced ragda and ice-chilled mint-coriander water.' },
    { name: 'Sukha Bhel Puri', price: 45, isVeg: true, description: 'Light puffed rice mixed with peanuts, onions, coriander, papdi, and tangy dry masala.' }
  ],
  'sandwich': [
    { name: 'Bombay Veg Club Grill Sandwich', price: 110, isVeg: true, description: 'Triple decker sandwich with layers of potato, cucumber, tomato, beetroot, green chutney, and cheese.' },
    { name: 'Cheese Chilli Garlic Toast', price: 80, isVeg: true, description: 'Slices of bread topped with green chillies, garlic paste, and loaded with toasted cheddar cheese.' },
    { name: 'Chocolate Cheese Grilled Sandwich', price: 90, isVeg: true, description: 'Decadent sandwich stuffed with dark chocolate chips and sweet grated cheese.' },
    { name: 'Classic Veg Toast Sandwich', price: 60, isVeg: true, description: 'Perfectly hand-toasted street sandwich filled with boiled potatoes, cucumber, and mint spread.' }
  ],
  'frankie': [
    { name: 'Spicy Paneer Tikka Frankie', price: 90, isVeg: true, description: 'Warm wrap stuffed with spicy marinated paneer cubes, vinegar onions, and green chilli paste.' },
    { name: 'Schezwan Veg Noodles Frankie', price: 70, isVeg: true, description: 'Loaded street frankie containing stir-fried Schezwan Hakka noodles and mixed veg cutlet.' },
    { name: 'Double Egg Cheese Frankie', price: 100, isVeg: false, description: 'Tawa-paratha coated with double eggs and rolled with raw onions, cheese, and spicy masala.' },
    { name: 'Chicken Tikka Masala Roll', price: 120, isVeg: false, description: 'Rumali roti stuffed with char-grilled boneless chicken tikka, mint chutney, and raw salad.' }
  ],
  'pav-bhaji': [
    { name: 'Special Amul Butter Pav Bhaji', price: 120, isVeg: true, description: 'Thick spicy vegetable mash cooked on a huge flat tawa, served with two heavily buttered pavs.' },
    { name: 'Cheese Loaded Pav Bhaji', price: 140, isVeg: true, description: 'Our signature buttery pav bhaji covered under a thick layer of grated Amul cheese.' },
    { name: 'Amritsari Chole Bhature (Plate)', price: 110, isVeg: true, description: 'Spicy chickpeas cooked in authentic Punjabi gravy, served with two large fluffy deep-fried bhaturas.' },
    { name: 'Extra Butter Pav (Pair)', price: 20, isVeg: true, description: 'A pair of soft baker pavs toasted on tawa with extra Amul butter.' }
  ],
  'desserts': [
    { name: 'Shahi Rabri Malai Kulfi', price: 70, isVeg: true, description: 'Creamy matka kulfi topped with thick sweet rabri, rose syrup, and dry fruits.' },
    { name: 'Kala Khatta Special Baraf Gola', price: 50, isVeg: true, description: 'Crushed ice sphere drenched in sweet and sour tangy black-currant Kala Khatta syrup.' },
    { name: 'Royal Rose Falooda Milkshake', price: 90, isVeg: true, description: 'Chilled dessert drink with sweet basil seeds, vermicelli noodles, rose syrup, milk, and vanilla ice cream.' }
  ],
  'beverages': [
    { name: 'Cutting Masala Chai (Glass)', price: 12, isVeg: true, description: 'Brewed black tea leaves boiled with milk, crushed ginger, cardamom, and lemongrass.' },
    { name: 'Freshly Pressed Mosambi Juice', price: 60, isVeg: true, description: 'Cold-pressed sweet lime juice served fresh with a dash of black salt and chat masala.' },
    { name: 'Chilled Watermelon Mint Juice', price: 50, isVeg: true, description: 'Thick pulp watermelon juice blended with fresh mint leaves and ice cubes.' }
  ]
};

async function seedData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully.');

    // Clear existing collections
    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log('🧹 Collections cleared.');

    // 1. Seed Users (Admin, Default Customer, Default Vendor)
    console.log('👥 Seeding default users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const customerPassword = await bcrypt.hash('customer123', salt);
    const vendorPassword = await bcrypt.hash('vendor123', salt);

    const users = [
      {
        name: 'Admin Durvesh',
        email: 'admin@vendigo.com',
        password: adminPassword,
        role: 'admin',
        phone: '+91 99999 88888',
        address: 'Mumbai, India'
      },
      {
        name: 'Rahul Verma',
        email: 'customer@vendigo.com',
        password: customerPassword,
        role: 'customer',
        phone: '+91 98111 22233',
        address: 'Room 302, Green Hostel, Borivali, Mumbai'
      }
    ];

    const seededUsers = await User.insertMany(users);
    console.log(`👥 Seeding users complete. Created: ${seededUsers.length} users.`);

    // 2. Load and Parse Kaggle CSV
    console.log('📂 Parsing Kaggle CSV...');
    const csvPath = path.join(__dirname, 'mumbai_street_food_kaggle.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');

    // Split rows and filter out empty entries
    const rows = csvData.split('\n').map(row => row.trim()).filter(row => row.length > 0);
    const headers = rows[0].split(',');

    console.log(`📊 Total rows found: ${rows.length - 1}`);

    const vendorsToInsert = [];
    const menuItemsToInsert = [];

    // Loop through CSV rows (skip header)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      // Hand-rolled CSV parser to handle quotes if any, or simple splits
      // Since our CSV doesn't use escaped commas, simple split is safe.
      const cols = row.split(',');
      if (cols.length < 14) continue;

      const stallName = cols[0];
      const ownerName = cols[1];
      const phone = cols[2];
      const email = cols[3];
      const rating = parseFloat(cols[4]) || 4.5;
      const reviewCount = parseInt(cols[5]) || 50;
      const distance = cols[6] + ' km';
      const prepTime = cols[7];
      const locality = cols[8];
      const address = cols[9];
      const lat = parseFloat(cols[10]);
      const lng = parseFloat(cols[11]);
      const category = cols[12];
      const priceForTwo = cols[13];
      const description = cols[14];
      
      // Parse tags (split by semicolon or comma)
      const tags = cols.slice(15).join(',').split(',').map(t => t.trim()).filter(t => t.length > 0);

      // Unique vendor ID (custom layout)
      const vendorId = 'v_seeded_' + i;

      // Assign realistic stock images based on category
      let banner = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80';
      if (category === 'dosa') banner = 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80';
      if (category === 'sandwich') banner = 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80';
      if (category === 'frankie') banner = 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80';
      if (category === 'pav-bhaji') banner = 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80';
      if (category === 'desserts') banner = 'https://images.unsplash.com/photo-1579954115545-aad55763426b?auto=format&fit=crop&w=800&q=80';
      if (category === 'beverages') banner = 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80';

      const logo = 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=200&q=80';

      const vendorDoc = {
        name: stallName,
        ownerName,
        phone,
        email,
        rating,
        reviewCount,
        distance,
        prepTime,
        address,
        coordinates: [lat, lng],
        category,
        isOpen: true,
        isApproved: true,
        priceForTwo,
        banner,
        logo,
        description,
        tags
      };

      // Create model so we get standard MongoDB _id
      const vendorModel = new Vendor(vendorDoc);
      // Keep reference to _id or custom vendorId for matching menu items
      const savedVendor = await vendorModel.save();

      // Create a vendor user account for each seeded vendor so they can login!
      const vendorEmail = email.toLowerCase();
      const vendorUser = {
        name: ownerName,
        email: vendorEmail,
        password: vendorPassword,
        role: 'vendor',
        phone,
        address,
        vendorId: savedVendor._id.toString()
      };
      await User.create(vendorUser);

      // Create menu items for this vendor based on category
      const dishes = DISH_TEMPLATES[category] || DISH_TEMPLATES['vada-pav'];
      dishes.forEach((dish, idx) => {
        menuItemsToInsert.push({
          vendorId: savedVendor._id.toString(), // tie to MongoDB Vendor ObjectId as string
          name: dish.name,
          price: dish.price,
          category: category.toUpperCase().replace('-', ' ') + ' SPECIALS',
          isVeg: dish.isVeg,
          isAvailable: true,
          image: banner, // Use category image
          description: dish.description
        });
      });
    }

    console.log('🏪 Inserting Menu Items in MongoDB...');
    await MenuItem.insertMany(menuItemsToInsert);

    console.log('✅ Seeding MongoDB complete.');
    console.log(`👉 Seeded ${await Vendor.countDocuments()} Vendors`);
    console.log(`👉 Seeded ${await MenuItem.countDocuments()} Menu Items`);
    console.log(`👉 Seeded ${await User.countDocuments()} Users (including unique vendor accounts for each stall)`);

    mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seedData();
