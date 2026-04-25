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

    const users = await User.find({ userId: /^VA\d+$/ });
    console.log(`Resetting ${users.length} users to random IDs`);

    for (const user of users) {
      let isUnique = false;
      let newId = '';
      
      while (!isUnique) {
        const randomNum = Math.floor(100000 + Math.random() * 900000); 
        newId = `VA${randomNum}`;
        const collision = await User.findOne({ userId: newId });
        if (!collision) isUnique = true;
      }

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
