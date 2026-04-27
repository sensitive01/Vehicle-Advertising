const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://techsensitivecoin_db_user:Ek4YnJdTcZQDl2vz@cluster0.y5knwlm.mongodb.net/vehicleadvertising';

async function checkData() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    
    const AdvertiserProfile = mongoose.model('AdvertiserProfile', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      brandName: String
    }));
    
    const User = mongoose.model('User', new mongoose.Schema({
      fullName: String,
      email: String
    }));
    
    const profiles = await AdvertiserProfile.find().lean();
    console.log('Total Profiles:', profiles.length);
    
    for (const p of profiles) {
      console.log(`Profile: ${p.brandName} | userId: ${p.userId} | type: ${typeof p.userId}`);
      const user = await User.findById(p.userId);
      console.log(`  Linked User found: ${!!user}`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
