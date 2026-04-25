const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const UserSchema = new mongoose.Schema({
  email: String,
  userId: String
}, { strict: false });

const User = mongoose.model('User', UserSchema);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vehicleAdDB';

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const users = await User.find({ $or: [{ userId: { $exists: false } }, { userId: null }, { userId: "" }] });
    console.log(`Found ${users.length} users to update`);

    // Get current max
    const allUsersWithId = await User.find({ userId: /^VA\d+$/ });
    let currentMax = 0;
    if (allUsersWithId.length > 0) {
      const numbers = allUsersWithId.map(u => parseInt(u.userId.replace('VA', '')));
      currentMax = Math.max(...numbers);
    }

    for (const user of users) {
      currentMax++;
      const paddedNumber = currentMax.toString().padStart(6, '0');
      const newId = `VA${paddedNumber}`;
      await User.updateOne({ _id: user._id }, { $set: { userId: newId } });
      console.log(`Updated ${user.email} -> ${newId}`);
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
