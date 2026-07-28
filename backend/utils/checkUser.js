import connectDB from '../config/db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

connectDB();

setTimeout(async () => {
  const user = await User.findOne({ email: 'admin@medicore.com' }).select('+password');

  if (!user) {
    console.log('❌ User not found');
    process.exit();
  }

  const testPassword = 'Admin@123';
  const isMatch = await bcrypt.compare(testPassword, user.password);

  console.log('Stored hash:', user.password);
  console.log('Testing password:', testPassword);
  console.log('Match result:', isMatch ? '✅ MATCHES' : '❌ DOES NOT MATCH');

  process.exit();
}, 1000);