import connectDB from '../config/db.js'; // .env load karega
import User from '../models/User.js';
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
connectDB();

const seedAdmin = async () => {
  try {
    const exists = await User.findOne({ email: 'admin@medicore.com' });
    if (exists) {
      console.log('⚠️  Admin already exists');
      process.exit();
    }

    await User.create({
      name: 'Super Admin',
      email: 'admin@medicore.com',
      password: 'Admin@123',
      role: 'admin',
    });

    console.log('✅ Admin created: admin@medicore.com / Admin@123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// connectDB async hai, thoda wait karke seed chalate hain
setTimeout(seedAdmin, 1000);