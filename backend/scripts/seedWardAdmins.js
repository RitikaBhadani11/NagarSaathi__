const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User'); // adjust path if needed

dotenv.config(); // Loads .env

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wardwatch';

const seedWardAdmins = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected.');

    for (let i = 1; i <= 20; i++) {
      const email = `wardadmin${i}@nagarsaathi.com`;
      const plainPassword = `ward@${i}`;
      const wardNumber = `${i}`;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`⚠️ Already exists: ${email}`);
        continue;
      }

      const newUser = new User({
        name: `Ward Admin ${i}`,
        email,
        password: plainPassword, // password will be hashed by User model's pre-save
        ward: wardNumber,
        phone: `99999999${String(i).padStart(2, '0')}`,
        role: 'wardAdmin',
      });

      await newUser.save();
      console.log(`✅ Created: ${email} | Password: ${plainPassword}`);
    }

    console.log('✅ Seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedWardAdmins();
