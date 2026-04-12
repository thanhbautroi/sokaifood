import { config } from 'dotenv';
config({ path: '.env.local' });
import mongoose from 'mongoose';
import dbConnect from '../src/lib/mongodb';

const sampleProducts = [
  {
    name: "Bánh Tráng Trộn Đặc Biệt",
    slug: "banh-trang-tron-dac-biet",
    description: "Bánh tráng trộn với hải sản tươi ngon, rau củ organic và sốt đặc biệt pha chế từ các loại gia vị truyền thống.",
    price: 45000,
    originalPrice: 55000,
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
    ],
    collectionType: "do-cay",
    featured: true,
    inStock: true,
  },
  {
    name: "Ớt Sa Tế Cay",
    slug: "ot-sa-te-cay",
    description: "Ớt sa tế cay truyền thống với hương vị đậm đà, được làm từ ớt tươi, tỏi, gừng và các loại gia vị đặc trưng.",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500",
      "https://images.unsplash.com/photo-1551782450-17144efb5723?w=500"
    ],
    collectionType: "do-cay",
    featured: false,
    inStock: true,
  },
  {
    name: "Trái Cây Sấy Dừa",
    slug: "trai-cay-say-dua",
    description: "Dừa sấy khô tự nhiên, giữ nguyên hương vị ngọt ngào và dinh dưỡng của dừa tươi.",
    price: 28000,
    originalPrice: 32000,
    images: [
      "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=500"
    ],
    collectionType: "trai-cay-say",
    featured: true,
    inStock: true,
  },
  {
    name: "Hạt Điều Rang Muối",
    slug: "hat-dieu-rang-muoi",
    description: "Hạt điều được rang vàng giòn với muối biển tự nhiên, giàu protein và khoáng chất.",
    price: 95000,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500"
    ],
    collectionType: "cac-loai-hat",
    featured: true,
    inStock: true,
  },
  {
    name: "Nước Dừa Tươi",
    slug: "nuoc-dua-tuoi",
    description: "Nước dừa tươi nguyên chất, giàu điện giải và vitamin, được đóng chai ngay sau khi lấy từ quả.",
    price: 25000,
    images: [
      "https://images.unsplash.com/photo-1546177598-7a4c3e9c8e4a?w=500"
    ],
    collectionType: "do-uong",
    featured: false,
    inStock: true,
  },
  {
    name: "Bánh Tráng Cuốn Thịt Heo",
    slug: "banh-trang-cuon-thit-heo",
    description: "Bánh tráng cuốn với thịt heo nướng thơm ngon, rau sống tươi mát và nước mắm chua ngọt.",
    price: 52000,
    images: [
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500"
    ],
    collectionType: "do-cay",
    featured: false,
    inStock: true,
  },
  {
    name: "Mít Sấy Dẻo",
    slug: "mit-say-deo",
    description: "Mít được sấy khô theo phương pháp truyền thống, giữ độ dẻo ngọt tự nhiên.",
    price: 42000,
    originalPrice: 48000,
    images: [
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500"
    ],
    collectionType: "trai-cay-say",
    featured: true,
    inStock: true,
  },
  {
    name: "Hạt Macca Rang Ngọt",
    slug: "hat-macca-rang-ngot",
    description: "Hạt macca Úc chất lượng cao, rang vừa tới với đường phèn, hương vị độc đáo.",
    price: 185000,
    images: [
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500"
    ],
    collectionType: "cac-loai-hat",
    featured: true,
    inStock: true,
  }
];

async function seedProducts() {
  try {
    await dbConnect();
    console.log('✅ Connected to MongoDB successfully!');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('MongoDB connection failed: db is undefined');
    }

    const productsCollection = db.collection('products');

    // Clear existing products
    await productsCollection.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const result = await productsCollection.insertMany(sampleProducts);
    console.log(`✅ Inserted ${result.insertedCount} products successfully!`);

    // Show summary
    console.log('\n📊 Database summary:');
    const collections = await db.collections();
    for (const collection of collections) {
      const count = await collection.countDocuments();
      console.log(`  - ${collection.collectionName}: ${count} documents`);
    }

    console.log('\n🎉 Products seeded successfully!');
    console.log('👉 You can now visit http://localhost:3001 to see the products');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seedProducts();