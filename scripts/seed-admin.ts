import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

async function seedAdmin() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        const db = mongoose.connection.db!;
        const users = db.collection('users');

        const ADMIN_EMAIL = 'admin@gmail.com';
        const ADMIN_PASSWORD = 'admin123';

        // Remove old admin accounts
        await users.deleteMany({ role: 'admin' });
        console.log('🗑️  Cleared old admin accounts');

        const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
        await users.insertOne({
            name: 'Admin',
            email: ADMIN_EMAIL,
            password: hashed,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log('✅ Admin account created!');

        console.log('\n🔑 Thông tin đăng nhập admin:');
        console.log(`   Email/Username : ${ADMIN_EMAIL}`);
        console.log(`   Password       : ${ADMIN_PASSWORD}`);
        console.log('\n👉 Truy cập: http://localhost:3000/login → sau đó vào /admin');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

seedAdmin();
