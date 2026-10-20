const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Message = require('./models/Message');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kisanbazar';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing records...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Message.deleteMany(),
    ]);

    console.log('🌱 Seeding Categories...');
    const categories = await Category.insertMany([
      {
        name: 'Vegetables',
        slug: 'vegetables',
        description: 'Fresh farm vegetables harvested directly from local fields',
        icon: 'Carrot',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
      },
      {
        name: 'Fruits',
        slug: 'fruits',
        description: 'Naturally ripened, sweet, juicy seasonal fruits',
        icon: 'Apple',
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=600',
      },
      {
        name: 'Grains & Cereals',
        slug: 'grains-cereals',
        description: 'Premium quality wheat, rice, millets, and maize directly from growers',
        icon: 'Wheat',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
      },
      {
        name: 'Pulses & Lentils',
        slug: 'pulses-lentils',
        description: 'Nutrient-rich, unpolished dals, chickpeas, and beans',
        icon: 'Bean',
        image: 'https://images.unsplash.com/photo-1585849834908-3481231155e8?auto=format&fit=crop&q=80&w=600',
      },
      {
        name: 'Dairy & Honey',
        slug: 'dairy-honey',
        description: 'Pure A2 farm milk, ghee, and unadulterated forest honey',
        icon: 'Milk',
        image: 'https://images.unsplash.com/photo-1589927986086-3d10fb595e8b?auto=format&fit=crop&q=80&w=600',
      },
      {
        name: 'Spices & Herbs',
        slug: 'spices-herbs',
        description: 'Aromatic whole spices and naturally sun-dried herbs',
        icon: 'Flame',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600',
      },
    ]);

    console.log('👤 Seeding Users...');
    // Create Farmer 1
    const farmer1 = await User.create({
      name: 'Ramesh Patel',
      email: 'ramesh@farmer.com',
      password: 'Password123!',
      role: 'farmer',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      farmerProfile: {
        farmName: 'Patel Organic Bio Farms',
        bio: '3rd generation farmer cultivating 100% pesticide-free vegetables and seasonal crops with natural vermicompost.',
        address: 'Village Dindori, Near Gangapur Canal',
        city: 'Nashik',
        state: 'Maharashtra',
        pincode: '422001',
        farmSizeAcres: 12,
        isOrganicCertified: true,
        isVerified: true,
        rating: 4.9,
        totalReviews: 48,
      },
    });

    // Create Farmer 2
    const farmer2 = await User.create({
      name: 'Gurpreet Singh',
      email: 'gurpreet@farmer.com',
      password: 'Password123!',
      role: 'farmer',
      phone: '+91 98123 45678',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      farmerProfile: {
        farmName: 'Singh Golden Fields',
        bio: 'Specialist in heritage basmati rice, organic wheat, and mustard with solar-powered irrigation.',
        address: 'GT Road, Khanna Area',
        city: 'Ludhiana',
        state: 'Punjab',
        pincode: '141401',
        farmSizeAcres: 25,
        isOrganicCertified: true,
        isVerified: true,
        rating: 4.8,
        totalReviews: 32,
      },
    });

    // Create Consumer 1
    const consumer1 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@consumer.com',
      password: 'Password123!',
      role: 'consumer',
      phone: '+91 94567 89012',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      consumerProfile: {
        deliveryAddress: 'Flat 402, Green Vista Apartments, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
      },
    });

    // Create Consumer 2
    const consumer2 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@consumer.com',
      password: 'Password123!',
      role: 'consumer',
      phone: '+91 91234 56789',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
      consumerProfile: {
        deliveryAddress: 'House 14, Pocket B, Mayur Vihar Phase 2',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110091',
      },
    });

    // Create Admin
    const admin = await User.create({
      name: 'Admin Team Terminator',
      email: 'admin@kisanbazar.com',
      password: 'Password123!',
      role: 'admin',
      phone: '+91 99999 00000',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    });

    console.log('🌾 Seeding Products...');
    const products = await Product.insertMany([
      {
        farmer: farmer1._id,
        name: 'Sun-Ripened Vine Tomatoes',
        category: categories[0]._id,
        categoryName: 'Vegetables',
        description: 'Juicy, farm-fresh red tomatoes picked early morning. Perfectly suited for rich gravies and fresh salads.',
        price: 35,
        unit: 'kg',
        quantityAvailable: 350,
        minimumOrderQuantity: 5,
        harvestDate: new Date(),
        isOrganic: true,
        primaryImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600',
        location: { city: 'Nashik', state: 'Maharashtra', pincode: '422001' },
        rating: 4.9,
        views: 120,
      },
      {
        farmer: farmer1._id,
        name: 'Hydroponic English Spinach (Palak)',
        category: categories[0]._id,
        categoryName: 'Vegetables',
        description: 'Crisp, dark green spinach grown with nutrient-rich water. Completely chemical-free and washed with ozone.',
        price: 45,
        unit: 'kg',
        quantityAvailable: 120,
        minimumOrderQuantity: 2,
        harvestDate: new Date(),
        isOrganic: true,
        primaryImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=600',
        location: { city: 'Nashik', state: 'Maharashtra', pincode: '422001' },
        rating: 4.8,
        views: 94,
      },
      {
        farmer: farmer2._id,
        name: 'Traditional Royal Basmati Rice (Aged 2 Years)',
        category: categories[2]._id,
        categoryName: 'Grains & Cereals',
        description: 'Extra long grain aromatic Basmati rice cultivated using snow-melt waters. Aged naturally to perfection.',
        price: 130,
        unit: 'kg',
        quantityAvailable: 800,
        minimumOrderQuantity: 10,
        harvestDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
        isOrganic: true,
        primaryImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
        location: { city: 'Ludhiana', state: 'Punjab', pincode: '141401' },
        rating: 5.0,
        views: 310,
      },
      {
        farmer: farmer2._id,
        name: 'Golden Sharbati Whole Wheat',
        category: categories[2]._id,
        categoryName: 'Grains & Cereals',
        description: 'Heavy golden grains rich in fiber and protein. Makes soft, fluffy rotis with superior aroma.',
        price: 42,
        unit: 'kg',
        quantityAvailable: 1500,
        minimumOrderQuantity: 20,
        harvestDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        isOrganic: true,
        primaryImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
        location: { city: 'Ludhiana', state: 'Punjab', pincode: '141401' },
        rating: 4.7,
        views: 180,
      },
      {
        farmer: farmer1._id,
        name: 'Organic Sweet Alphonso Mangoes (Ratnagiri Grade)',
        category: categories[1]._id,
        categoryName: 'Fruits',
        description: 'Naturally carbide-free ripened King of Mangoes. Rich golden pulp with unmatched tropical aroma.',
        price: 750,
        unit: 'dozen',
        quantityAvailable: 80,
        minimumOrderQuantity: 2,
        harvestDate: new Date(),
        isOrganic: true,
        primaryImage: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600',
        location: { city: 'Nashik', state: 'Maharashtra', pincode: '422001' },
        rating: 5.0,
        views: 450,
      },
      {
        farmer: farmer2._id,
        name: 'Raw Unprocessed Mustard Honey',
        category: categories[4]._id,
        categoryName: 'Dairy & Honey',
        description: 'Cold-extracted single-origin honey from blooming yellow mustard fields of Punjab. High pollen count.',
        price: 320,
        unit: 'kg',
        quantityAvailable: 95,
        minimumOrderQuantity: 1,
        harvestDate: new Date(),
        isOrganic: true,
        primaryImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600',
        location: { city: 'Ludhiana', state: 'Punjab', pincode: '141401' },
        rating: 4.9,
        views: 210,
      },
    ]);

    console.log('📦 Seeding Orders...');
    await Order.create({
      consumer: consumer1._id,
      farmer: farmer1._id,
      product: products[0]._id,
      productName: products[0].name,
      quantity: 10,
      unit: 'kg',
      unitPrice: 35,
      totalPrice: 350,
      status: 'accepted',
      deliveryAddress: {
        fullName: 'Priya Sharma',
        phone: '+91 94567 89012',
        street: 'Flat 402, Green Vista Apartments, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
      },
      notes: 'Please pack in eco-friendly jute bags if available.',
      farmerNotes: 'Freshly harvested harvest scheduled for dispatch tomorrow.',
    });

    await Order.create({
      consumer: consumer2._id,
      farmer: farmer2._id,
      product: products[2]._id,
      productName: products[2].name,
      quantity: 25,
      unit: 'kg',
      unitPrice: 130,
      totalPrice: 3250,
      status: 'pending',
      deliveryAddress: {
        fullName: 'Rahul Verma',
        phone: '+91 91234 56789',
        street: 'House 14, Pocket B, Mayur Vihar Phase 2',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110091',
      },
      notes: 'Need grain dispatch confirmation before Friday.',
    });

    console.log('💬 Seeding Messages...');
    await Message.create({
      sender: consumer1._id,
      receiver: farmer1._id,
      product: products[0]._id,
      content: 'Hello Ramesh ji! Are the tomatoes harvested today? Looking to order 15 kgs for our family function.',
      isRead: true,
    });

    await Message.create({
      sender: farmer1._id,
      receiver: consumer1._id,
      product: products[0]._id,
      content: 'Namaste Priya ji! Yes, we harvest fresh every morning at 6 AM. The quality is prime. You can place the order directly.',
      isRead: true,
    });

    console.log('✨ Database Seeded Successfully!');
    console.log('==============================================');
    console.log('Default Credentials:');
    console.log('Farmer:   ramesh@farmer.com      | Password123!');
    console.log('Farmer 2: gurpreet@farmer.com    | Password123!');
    console.log('Consumer: priya@consumer.com     | Password123!');
    console.log('Consumer: rahul@consumer.com     | Password123!');
    console.log('Admin:    admin@kisanbazar.com   | Password123!');
    console.log('==============================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
